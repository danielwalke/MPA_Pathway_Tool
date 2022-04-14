import pprint

import cobra
import pandas
from cobra.flux_analysis import flux_variability_analysis
import json

from model_creation_and_fba import utilities
from model_creation_and_fba.exceptions import ExceptionWithCode


def find_model_objectives(model: cobra.Model):
    objective_ids = {}

    for reaction in model.reactions:
        if reaction.objective_coefficient != 0.0:
            objective_ids[reaction.id] = reaction.objective_coefficient

    return objective_ids


def optimize(model: cobra.Model, orig_model_reaction_names: [], do_pfba: bool, split_reversibles: bool):
    """performs fba and fva and returns an Array of dictionaries, containing the results

    Keyword arguments:
    model -- valid cobra-model
    """

    # cobra_config = cobra.Configuration()
    # cobra_config.solver = "glpk"

    # model.solver = 'glpk'

    if not model:
        return {}, {}

    model.solver.configuration.tolerances.feasibility = 1e-09
    objective_reaction_ids = find_model_objectives(model)

    if split_reversibles:
        model = utilities.split_all_reversibles(model)

    for split_reaction in model.reactions:
        direction = ''
        if '_forward' in split_reaction.id:
            direction = '_forward'
        elif '_reverse' in split_reaction.id:
            direction = '_reverse'

        orig_id = split_reaction.id.split('_forward')[0].split('_reverse')[0].split('_TG_')[0].split('_GPRSPLIT_')[0]
        # print(orig_id)

        if orig_id in objective_reaction_ids.keys():
            if direction == '_forward' or direction == '':
                split_reaction.objective_coefficient = objective_reaction_ids[orig_id]
            elif direction == '_reverse':
                split_reaction.objective_coefficient = -objective_reaction_ids[orig_id]

    try:
        if not do_pfba:
            fba_solution = model.optimize()
        else:
            fba_solution = cobra.flux_analysis.pfba(model)
    except Exception as e:
        raise ExceptionWithCode(3, "FBA couldn't be performed.")

    try:
        fva_dict, variabilities = utilities.get_fva_statistics(model)
        fva_dict.pop('MEAN')
    except Exception as e:
        raise ExceptionWithCode(4, "Couldn't get FVA results.")

    try:
        added_reactions_dict_irrev, split_reactions_dict = \
            utilities.combine_seperated_reactions(fva_dict, fba_solution.fluxes, orig_model_reaction_names)

        # combine reversible reactions
        all_combined_reacions_dict = utilities.combine_reversible_reactions(added_reactions_dict_irrev)
    except Exception as e:
        raise ExceptionWithCode(5, "Couldn't assemble results.")

    return all_combined_reacions_dict, split_reactions_dict
