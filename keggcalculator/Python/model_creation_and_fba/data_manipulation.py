import json
import cobra
from autopacmen_modules.helper_general import gene_rule_as_list


def extract_data(temp_model_path: str):
    with open(temp_model_path, "r") as temp_file:
        data_string = temp_file.read()

    data_dict = json.loads(data_string)

    return data_dict


def parse_result_object_to_json(non_smoment_fba_results: dict, smoment_fba_results: dict):
    return json.dumps({
        'original': [{key: non_smoment_fba_results[key]} for key in non_smoment_fba_results.keys()],
        'sMOMENT': [{key: smoment_fba_results[key]} for key in smoment_fba_results.keys()]
    })


def write_to_temp_file(result_str: str, result_desination: str):
    temp_results = open(result_desination, "w")
    temp_results.write(result_str)
    temp_results.close()


def check_molecular_masses(protein_data: list):
    for protein in protein_data:
        if hasattr(protein, 'molecularMass'):
            if type(protein['molecularMass']) == 'float':
                continue
            elif type(protein['molecularMass']) == 'int':
                protein['molecularMass'] = float(protein['molecularMass'])
            else:
                return False

    return True


def assign_proteins_to_mpa_reactions(model: cobra.Model, protein_data: dict[str: []]):
    reaction_protein_mapping = {}
    reaction_protein_stoichiometry_mapping = {}

    for protein in protein_data:
        for reaction in model.reactions:
            reaction_identifiers = reaction.annotation['ec-code'] + reaction.annotation['kegg.orthology']
            for protein_identifier in protein['koAndEc']:
                if protein_identifier in reaction_identifiers:
                    if reaction.id not in reaction_protein_mapping.keys():
                        reaction_protein_mapping[reaction.id] = []
                        reaction_protein_stoichiometry_mapping[reaction.id] = {}
                    if protein['name'] in reaction_protein_mapping[reaction.id]:
                        continue

                    reaction_protein_mapping[reaction.id].append(protein['name'])
                    reaction_protein_stoichiometry_mapping[reaction.id] = {protein['name']: {protein['name']: 1}}
                    continue

    return reaction_protein_mapping, reaction_protein_stoichiometry_mapping


def build_autopacmen_gene_rules(model: cobra.Model):
    reaction_id_gene_rules_mapping = {}
    reaction_id_gene_rules_protein_stoichiometry_mapping = {}
    single_stoichiometry = 1

    for reaction in model.reactions:
        if reaction.gene_reaction_rule == '':
            continue

        reaction_id_gene_rules_mapping[reaction.id] = []
        reaction_id_gene_rules_protein_stoichiometry_mapping[reaction.id] = {}
        gene_rule_list = gene_rule_as_list(reaction.gene_reaction_rule)

        for entry in gene_rule_list:
            gene_rule_or_part = str(entry[0]) if len(entry) == 1 else str(entry)
            if "[" in gene_rule_or_part:
                gene_rule_or_part = tuple(eval(gene_rule_or_part))
            reaction_id_gene_rules_mapping[reaction.id].append(gene_rule_or_part)
            if gene_rule_or_part not in reaction_id_gene_rules_protein_stoichiometry_mapping[reaction.id].keys():
                reaction_id_gene_rules_protein_stoichiometry_mapping[reaction.id][gene_rule_or_part] = {}

            if type(gene_rule_or_part) is tuple:
                for gene in gene_rule_or_part:
                    reaction_id_gene_rules_protein_stoichiometry_mapping[reaction.id][gene_rule_or_part][gene] =\
                        float(single_stoichiometry)
            else:
                reaction_id_gene_rules_protein_stoichiometry_mapping[reaction.id][gene_rule_or_part][gene_rule_or_part] = \
                    float(single_stoichiometry)

    return reaction_id_gene_rules_mapping, reaction_id_gene_rules_protein_stoichiometry_mapping

