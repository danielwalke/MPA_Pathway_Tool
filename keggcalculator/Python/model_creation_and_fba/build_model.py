import pprint
import re
import cobra

from autopacmen_modules.create_combined_kcat_database import create_combined_kcat_database
from autopacmen_modules.create_smoment_model_reaction_wise import create_smoment_model_reaction_wise
from autopacmen_modules.get_reactions_kcat_mapping import get_reactions_kcat_mapping
from autopacmen_modules.parse_brenda_json_for_model import parse_brenda_json_for_model
from autopacmen_modules.parse_sabio_rk_for_model import parse_sabio_rk_for_model
from model_creation_and_fba import data_manipulation
from model_creation_and_fba import constants


def traverserse_gene_rule(relation, children, gene_rule, parents):
    genes = []

    for child in children:

        if child['id'] in parents:
            if child['relation'] == 'OR':
                new_relation = ' or '
            elif child['relation'] == 'AND':
                new_relation = ' and '
            new_children = [new_child for new_child in gene_rule if new_child['parent'] == child['id']]
            genes.append(traverserse_gene_rule(new_relation, new_children, gene_rule, parents))
        else:
            genes.append(child['gene'])

    gene_rule_string_part = relation.join(genes)

    if not len(genes) == 1:
        gene_rule_string_part = '( ' + gene_rule_string_part + ' )'

    return gene_rule_string_part


def generate_gene_rule_string(gene_rule):

    if len(gene_rule) == 0:
        return ''

    highest_parent = [parent for parent in gene_rule if parent['parent'] == 0][0]

    if 'relation' in highest_parent:
        children_of_highest_parent = [child for child in gene_rule if child['parent'] == 1]
        relation = ' or ' if highest_parent['relation'] == 'OR' else ' and '
        gene_rule_string = traverserse_gene_rule(
            relation, children_of_highest_parent, gene_rule, [child['parent'] for child in gene_rule])
    else:
        gene_rule_string = highest_parent['gene']

    return gene_rule_string


def build_model(model_dict: dict):
    """returns a cobra model for flux analysis

    Keyword arguments:
    model_name -- name of the model
    model_json -- json string containing reactions and metabolites Arrays
    """

    kegg_metabolite_pattern = re.compile("^C[0-9]{5}")
    kegg_reaction_pattern = re.compile("^R[0-9]{5}")

    metabolites_array = model_dict['metabolites']
    reactions_array = model_dict['reactions']

    # pprint.pprint(metabolites_array)
    # pprint.pprint(reactions_array)

    # initialize model
    model = cobra.Model("model_name")

    metabolites_dict = {}

    # generate metabolites
    for metabolite in metabolites_array:
        # stores each metabolite object in a dict
        cobra_metabolite = cobra.Metabolite(
            id=metabolite['metaboliteId'],
            name=metabolite['metaboliteName'],
            compartment=metabolite['compartment'],
        )
        if 'biggId' in metabolite and metabolite['biggId'] != '':
            cobra_metabolite.annotation['bigg.metabolite'] = metabolite['biggId']
        if kegg_metabolite_pattern.match(metabolite['metaboliteId']):
            cobra_metabolite.annotation['kegg.compound'] = metabolite['metaboliteId'].split("_")[0]

        metabolites_dict[metabolite['metaboliteId']] = cobra_metabolite

    # generate reactions
    for reaction_el in reactions_array:

        metabolites = reaction_el['metabolites']

        # initialize dict for addition of metabolites to reaction
        reaction_metabolites = {}

        for metabolite_el in metabolites:
            # extract metabolite ids and stoichiometry
            metabolite_id = metabolite_el['metaboliteId']
            stoichiometry = metabolite_el['stoichiometry']

            # extract corresponding obj for metabolite key and add it to reaction_metabolites dict
            metabolite_object = metabolites_dict[metabolite_id]
            reaction_metabolites[metabolite_object] = stoichiometry

        if reaction_el['exchangeReaction']:
            if len(reaction_metabolites) != 1:
                raise Exception('An Exchange Reaction either has 0 or more than one Metabolites assigned to it!')

            # adds exchange reaction
            exchange_reaction = model.add_boundary(
                list(reaction_metabolites)[0],
                type="exchange",
                reaction_id=reaction_el['reactionId'],
                lb=reaction_el['lowerBound'],
                ub=reaction_el['upperBound']
            )

            exchange_reaction.annotation['ec-code'] = reaction_el['ecNumbers']
            exchange_reaction.annotation['kegg.orthology'] = reaction_el['keggOrthologies']

        else:
            reaction = cobra.Reaction(reaction_el['reactionId'])
            reaction.name = reaction_el['reactionName']
            reaction.lower_bound = reaction_el['lowerBound']
            reaction.upper_bound = reaction_el['upperBound']

            if kegg_reaction_pattern.match(reaction_el['reactionId']):
                reaction.annotation['kegg.reaction'] = reaction_el['reactionId']
            if 'biggId' in reaction_el and reaction_el['biggId'] != '':
                reaction.annotation['bigg.reaction'] = reaction_el['biggId']

            reaction.annotation['ec-code'] = reaction_el['ecNumbers']
            reaction.annotation['kegg.orthology'] = reaction_el['keggOrthologies']

            # add metabolites to reaction
            reaction.add_metabolites(reaction_metabolites)
            print(generate_gene_rule_string(reaction_el['geneRule']))
            reaction.gene_reaction_rule = generate_gene_rule_string(reaction_el['geneRule'])
            model.add_reactions([reaction])

        # set objective coefficient for reaction
        getattr(model.reactions, reaction_el['reactionId']).objective_coefficient = reaction_el['objectiveCoefficient']

    for gene in model.genes:
        gene_obj = [gene_obj for gene_obj in model_dict['geneProducts'] if gene_obj['id'] == gene.id]
        if len(gene_obj) == 1:
            gene.annotation['uniprot'] = gene_obj[0]['uniprotAccession']

    return model


def build_smoment_model(original_model: cobra.Model, upload_path: str, job_id: str, data: dict):
    smoment_model = None

    pprint.pprint(data)

    if len(data['proteinData']) != 0 and data_manipulation.check_molecular_masses(data['proteinData']):
        create_model_specific_db(original_model, constants.get_network_path(upload_path, job_id))
        get_reactions_kcat_mapping(upload_path, job_id, original_model, "Escherichia coli", "mean")
        excluded_reactions = []

        prot_pool_params = \
            {key: data[key] for key in ['totalProteinContent', 'unmeasuredProteinFraction', 'avgSaturationLevel']}

        smoment_model = create_smoment_model_reaction_wise(
            original_model,
            data['proteinData'],
            prot_pool_params,
            constants.get_job_dir_path(upload_path, job_id),
            excluded_reactions,
            "median"
        )

        smoment_model.name = "sMomentModel"
        smoment_model.id = "sMomentModel"
        cobra.io.write_sbml_model(smoment_model, constants.get_job_dir_path(upload_path, job_id) + '/sMomentModel.xml')

    return smoment_model


def create_model_specific_db(original_model: cobra.Model, network_path: str):
    get_kcat_from_sabio_rk = False

    model_specific_brenda_json_path = network_path + constants.MODEL_BRENDA_DB_PATH
    parse_brenda_json_for_model(original_model, constants.BRENDA_JSON_PATH, model_specific_brenda_json_path)

    if get_kcat_from_sabio_rk:
        model_specific_sabio_rk_json_path = network_path + constants.MODEL_SABIO_RK_DB_PATH
        parse_sabio_rk_for_model(original_model, model_specific_sabio_rk_json_path, constants.BIGG_METABOLITE_PATH)
    else:
        model_specific_sabio_rk_json_path = ''

    model_specific_combined_db_path = network_path + constants.COMBINED_MODEL_DB_PATH
    create_combined_kcat_database(
        model_specific_sabio_rk_json_path, model_specific_brenda_json_path, model_specific_combined_db_path)


def print_model_properties(model):
    print("Reactions")
    print("---------")
    for x in model.reactions:
        print("%s : %s" % (x.id, x.reaction))

    print("")
    print("Metabolites")
    print("-----------")
    for x in model.metabolites:
        print('%9s : %s' % (x.id, x.formula))

    print("")
    print("Genes")
    print("-----")
    for x in model.genes:
        associated_ids = (i.id for i in x.reactions)
        print("%s is associated with reactions: %s" %
              (x.id, "{" + ", ".join(associated_ids) + "}"))
