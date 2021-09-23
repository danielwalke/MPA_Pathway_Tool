import json
import cobra


def build_model(temp_model_path: str):
    """returns a cobra model for flux analysis

    Keyword arguments:
    model_name -- name of the model
    model_json -- json string containing reactions and metabolites Arrays
    """

    temp_file = open(temp_model_path, "r")
    model_string = temp_file.read()
    temp_file.close()

    model_dict = json.loads(model_string)
    metabolites_array = model_dict['metabolites']
    reactions_array = model_dict['reactions']

    # initialize model
    model = cobra.Model("model_name")

    metabolites_dict = {}

    # generate metabolites
    for metabolite in metabolites_array:
        # stores each metabolite object in a dict
        metabolites_dict[metabolite['metaboliteId']] = cobra.Metabolite(
                id=metabolite['metaboliteId'],
                name=metabolite['metaboliteName'],
                compartment=metabolite['compartment']
            )

    # generate reactions
    for reaction_el in reactions_array:

        metabolite_keys = reaction_el['metabolites'].keys()

        # initialize dict for addition of metabolites to reaction
        reaction_metabolites = {}

        for metabolite_el in metabolite_keys:
            # extract metabolite ids and stoichiometry
            metabolite_id = reaction_el['metabolites'][metabolite_el]['metaboliteId']
            stoichiometry = reaction_el['metabolites'][metabolite_el]['stoichiometry']

            # extract corresponding obj for metabolite key and add it to reaction_metabolites dict
            metabolite_object = metabolites_dict[metabolite_id]
            reaction_metabolites[metabolite_object] = stoichiometry

        if reaction_el['exchangeReaction']:
            if len(reaction_metabolites) != 1:
                print('Exchange Reaction either has 0 or more than one Metabolites assigned to it!')

            # adds exchange reaction
            model.add_boundary(
                list(reaction_metabolites)[0],
                type="exchange",
                reaction_id=reaction_el['reactionId'],
                lb=reaction_el['lowerBound'],
                ub=reaction_el['upperBound']
            )


        else:
            reaction = cobra.Reaction(reaction_el['reactionId'])
            reaction.name = reaction_el['reactionName']
            reaction.lower_bound = reaction_el['lowerBound']
            reaction.upper_bound = reaction_el['upperBound']

            # add metabolites to reaction
            reaction.add_metabolites(reaction_metabolites)
            model.add_reactions([reaction])

        # set objective coefficient for reaction
        getattr(model.reactions, reaction_el['reactionId']).objective_coefficient = reaction_el['objectiveCoefficient']

    return model

