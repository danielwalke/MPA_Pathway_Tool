import pprint

import cobra
import pandas
from cobra.flux_analysis import flux_variability_analysis
import json

from model_creation_and_fba import utilities
from model_creation_and_fba.exceptions import ExceptionWithCode


def optimize(model: cobra.Model, orig_model_reaction_names: [], do_pfba: bool):
    """performs fba and fva and returns an Array of dictionaries, containing the results

    Keyword arguments:
    model -- valid cobra-model
    """

    if not model:
        return {}

    model = utilities.split_all_reversibles(model)

    if not do_pfba:
        fba_solution = model.optimize()
    else:
        fba_solution = cobra.flux_analysis.pfba(model)

    try:
        fva_dict, variabilities = utilities.get_fva_statistics(model)
        fva_dict.pop('MEAN')
    except Exception as e:
        raise ExceptionWithCode(4, "Couldn't get FVA results.")

    added_reactions_dict_irrev = \
        utilities.combine_seperated_reactions(fva_dict, fba_solution.fluxes, orig_model_reaction_names)

    # combine reversible reactions
    all_combined_reacions_dict = utilities.combine_reversible_reactions(added_reactions_dict_irrev)

    return all_combined_reacions_dict
