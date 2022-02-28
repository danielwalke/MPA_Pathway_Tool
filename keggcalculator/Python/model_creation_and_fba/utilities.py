import copy
import csv
import pprint
import re
import statistics
import cobra
import pandas
from matplotlib import pyplot as plt

from autopacmen_modules.helper_general import json_write


def write_error_log(job_dir: str, exception_dict: dict):
    json_write(job_dir, exception_dict)


def get_fva_statistics(model):
    """adopted from autopacmen

    :param model:
    :return:
    """
    fva_dict = {}
    minimums = []
    maximums = []
    variabilities = []

    for reaction in model.reactions:
        if reaction.id == "ER_pool_TG_":
            continue
        elif "armr" in reaction.id:
            continue
        elif "ENZYME_DELIVERY" in reaction.id:
            continue

        # Minimum
        with model:
            # knocks out all split reverse reactions
            if "_GPRSPLIT_" in reaction.id and reaction.id.endswith("_forward"):
                orig_id = reaction.id.split("_GPRSPLIT_")[0]
                pattern = re.compile(orig_id + "_GPRSPLIT_\d+")
                for reac in model.reactions:
                    if pattern.match(reac.id) and reac.id.endswith("_reverse"):
                        model.reactions.get_by_id(reac.id).knock_out()
            # knocks out all split forward reactions
            elif "_GPRSPLIT_" in reaction.id and reaction.id.endswith("_reverse"):
                orig_id = reaction.id.split("_GPRSPLIT_")[0]
                pattern = re.compile(orig_id + "_GPRSPLIT_\d+")
                for reac in model.reactions:
                    if pattern.match(reac.id) and reac.id.endswith("_forward"):
                        model.reactions.get_by_id(reac.id).knock_out()
            # if reactions were not split up:
            elif reaction.id.endswith("reverse"):
                forward_reaction_name = reaction.id.replace(
                    "reverse", "forward")
                model.reactions.get_by_id(forward_reaction_name).knock_out()
            elif reaction.id.endswith("forward"):
                reverse_reaction_name = reaction.id.replace(
                    "forward", "reverse")
                model.reactions.get_by_id(reverse_reaction_name).knock_out()

            model.objective = model.problem.Objective(
                -1 * model.reactions.get_by_id(reaction.id).flux_expression)
            minimization_solution = model.optimize()
            minimum = minimization_solution.fluxes[reaction.id]

        # Maximum
        with model:
            if "_GPRSPLIT_" in reaction.id and reaction.id.endswith("_forward"):
                orig_id = reaction.id.split("_GPRSPLIT_")[0]
                pattern = re.compile(orig_id + "_GPRSPLIT_\d+")
                for reac in model.reactions:
                    if pattern.match(reac.id) and reac.id.endswith("_reverse"):
                        model.reactions.get_by_id(reac.id).knock_out()
            elif "_GPRSPLIT_" in reaction.id and reaction.id.endswith("_reverse"):
                orig_id = reaction.id.split("_GPRSPLIT_")[0]
                pattern = re.compile(orig_id + "_GPRSPLIT_\d+")
                for reac in model.reactions:
                    if pattern.match(reac.id) and reac.id.endswith("_forward"):
                        model.reactions.get_by_id(reac.id).knock_out()
            elif reaction.id.endswith("reverse"):
                forward_reaction_name = reaction.id.replace(
                    "reverse", "forward")
                model.reactions.get_by_id(forward_reaction_name).knock_out()
            elif reaction.id.endswith("forward"):
                reverse_reaction_name = reaction.id.replace(
                    "forward", "reverse")
                model.reactions.get_by_id(reverse_reaction_name).knock_out()

            model.objective = model.problem.Objective(
                1 * model.reactions.get_by_id(reaction.id).flux_expression)

            maximization_solution = model.optimize()
            maximum = maximization_solution.fluxes[reaction.id]

        variability = abs(maximum - minimum)
        variabilities.append(variability)
        minimums.append(minimum)
        maximums.append(maximum)

        fva_dict[reaction.id] = {}
        fva_dict[reaction.id]["minimum"] = minimum
        fva_dict[reaction.id]["maximum"] = maximum
        fva_dict[reaction.id]["variability"] = variability

    mean_minimum = statistics.mean(minimums)
    mean_maximum = statistics.mean(maximums)
    num_zeroes = len([x for x in variabilities if x < 10e-10])

    variabilites_above_zero = [x for x in variabilities if x > 10e-10]

    if len(variabilites_above_zero) > 0:
        mean_variability = statistics.mean(variabilites_above_zero)
        median_variability = statistics.median(variabilites_above_zero)
    else:
        mean_variability = 0
        median_variability = 0

    fva_dict["MEAN"] = {}
    fva_dict["MEAN"]["minimum"] = mean_minimum
    fva_dict["MEAN"]["maximum"] = mean_maximum
    fva_dict["MEAN"]["variability"] = mean_variability
    fva_dict["MEAN"]["variability_median"] = median_variability
    fva_dict["MEAN"]["num_zeroes"] = num_zeroes

    return fva_dict, variabilities


def print_bounds(model: cobra.Model):
    for reaction in model.reactions:
        reac_obj = getattr(model.reactions, reaction.id)
        print(reac_obj)
        print(reac_obj.bounds)
    # pprint(model_smoment.reactions.EX_glc__D_e.bounds)


def split_all_reversibles(model: cobra.Model) -> cobra.Model:
    model_reaction_ids = [x.id for x in model.reactions]
    for reaction_id in model_reaction_ids:
        reaction = model.reactions.get_by_id(reaction_id)

        if reaction.lower_bound >= 0 or reaction.upper_bound <= 0:
            continue

        forward_reaction = copy.deepcopy(reaction)
        forward_reaction.upper_bound = reaction.upper_bound
        forward_reaction.lower_bound = 0
        forward_reaction.id += "_forward"
        model.add_reactions([forward_reaction])

        reverse_reaction = copy.deepcopy(reaction)
        reverse_reaction.id += "_reverse"
        reverse_reaction.upper_bound = -reaction.lower_bound
        reverse_reaction.lower_bound = 0
        reverse_reaction_metabolites_copy = copy.deepcopy(
            reverse_reaction.metabolites)
        for key in list(reverse_reaction_metabolites_copy.keys()):
            reverse_reaction_metabolites_copy[key] *= -2
        reverse_reaction.add_metabolites(reverse_reaction_metabolites_copy)
        model.add_reactions([reverse_reaction])

        model.remove_reactions([reaction])
    return model


def combine_seperated_reactions(fva_result_dict: dict, fba_solutions: pandas.Series, original_reaction_names: list):
    summed_fwd_fluxes_dict = {}
    summed_rev_fluxes_dict = {}
    summed_irrev_fluxes_dict = {}

    # pprint.pprint(original_reaction_names)

    for model_reaction in list(fva_result_dict.keys()):

        model_reaction_without_additions = model_reaction.replace("_forward", "").replace("_reverse", "")
        model_reaction_without_additions = model_reaction_without_additions.split("_GPRSPLIT")[0]
        model_reaction_without_additions = model_reaction_without_additions.split("_TG")[0]

        # print(model_reaction_without_additions)

        for orig_reaction in original_reaction_names:
            if orig_reaction == model_reaction_without_additions:

                if model_reaction.endswith("_forward"):

                    forward_reaction_name = orig_reaction + "_forward"

                    if forward_reaction_name not in summed_fwd_fluxes_dict.keys():
                        summed_fwd_fluxes_dict[forward_reaction_name] = {"fbaSolution": 0, "minFlux": 0, "maxFlux": 0}

                    summed_fwd_fluxes_dict[forward_reaction_name]["fbaSolution"] += \
                        fba_solutions.loc[model_reaction]
                    summed_fwd_fluxes_dict[forward_reaction_name]["minFlux"] += \
                        fva_result_dict[model_reaction]["minimum"]
                    summed_fwd_fluxes_dict[forward_reaction_name]["maxFlux"] += \
                        fva_result_dict[model_reaction]["maximum"]

                elif model_reaction.endswith("_reverse"):
                    reverse_reaction_name = orig_reaction + "_reverse"

                    if reverse_reaction_name not in summed_rev_fluxes_dict.keys():
                        summed_rev_fluxes_dict[reverse_reaction_name] = {"fbaSolution": 0, "minFlux": 0, "maxFlux": 0}

                    summed_rev_fluxes_dict[reverse_reaction_name]["fbaSolution"] += \
                        fba_solutions.loc[model_reaction]
                    summed_rev_fluxes_dict[reverse_reaction_name]["minFlux"] += \
                        fva_result_dict[model_reaction]["minimum"]
                    summed_rev_fluxes_dict[reverse_reaction_name]["maxFlux"] += \
                        fva_result_dict[model_reaction]["maximum"]

                else:
                    if orig_reaction not in summed_irrev_fluxes_dict.keys():
                        summed_irrev_fluxes_dict[orig_reaction] = {"fbaSolution": 0, "minFlux": 0, "maxFlux": 0}

                    summed_irrev_fluxes_dict[orig_reaction]["fbaSolution"] += \
                        fba_solutions.loc[model_reaction]
                    summed_irrev_fluxes_dict[orig_reaction]["minFlux"] += \
                        fva_result_dict[model_reaction]["minimum"]
                    summed_irrev_fluxes_dict[orig_reaction]["maxFlux"] += \
                        fva_result_dict[model_reaction]["maximum"]

    # merge added reactions dicts of irreversible reactions
    added_reactions_dict_irrev = {
        **summed_irrev_fluxes_dict, **summed_fwd_fluxes_dict, **summed_rev_fluxes_dict}

    return added_reactions_dict_irrev


def combine_reversible_reactions(merged_reactions_dict: dict):

    combined_reactions_dict = {}

    for reaction in list(merged_reactions_dict.keys()):
        fva_min = merged_reactions_dict[reaction]["minFlux"]
        fva_max = merged_reactions_dict[reaction]["maxFlux"]
        fba = merged_reactions_dict[reaction]["fbaSolution"]

        # first assign forward reaction data
        if reaction.endswith("_forward") or not reaction.endswith("_reverse"):
            original_reaction_name = reaction.replace("_forward", "")

            combined_reactions_dict[original_reaction_name] = {
                "minFlux": fva_min,
                "maxFlux": fva_max,
                "fbaSolution": fba,
            }
            continue
        elif reaction.endswith("_reverse"):
            original_reaction_name = reaction.replace("_reverse", "")

            combined_reactions_dict[original_reaction_name]["fbaSolution"] = \
                combined_reactions_dict[original_reaction_name]["fbaSolution"]-fba

            if combined_reactions_dict[original_reaction_name]["maxFlux"] < 1e-10 and fva_max > 0:
                # if forward reaction is blocked set upper flux to -min flux of reverse fva and lower flux to -max flux
                # of reverse fva
                combined_reactions_dict[original_reaction_name]["maxFlux"] = -fva_min
                combined_reactions_dict[original_reaction_name]["minFlux"] = -fva_max
            elif fva_max < 1e-10 and combined_reactions_dict[original_reaction_name]["minFlux"] > 0:
                # keep fva min of forward reaction if max of reverse equals zero = no flux in reverse direction possible
                None
            else:
                # fva_min < 1e-10 and combined_reactions_dict[original_reaction_name]["FVA_min"] < 1e-10:
                # set minimum to -max of reverse reaction flux
                combined_reactions_dict[original_reaction_name]["minFlux"] = -fva_max

    return combined_reactions_dict


def create_cumulative_variability_plot(variability_list: list, model: str):

    fig, ax = plt.subplots(figsize=(8, 4))

    # print(variability_list)

    variabilities = [x for x in variability_list]
    n_bins = 250

    n, bins, patches = ax.hist(variabilities, n_bins, density=True, histtype='step',
                               cumulative=True, label=f'scenario variabilty (n={len(variabilities)} for {model})')

    # Add titles
    ax.grid(True)
    ax.legend(loc='lower center')
    ax.set_xlabel('Variability (mmol/(gDW*h))')
    ax.set_ylabel('Cumulative distribution')
    plt.xlim([0, 1000])
    fig1 = plt.gcf()
    plt.show()
    # fig1.savefig(
    #     "C:\\Users\\Emanu\\OneDrive\\Masterarbeit\\Programme\\Autopacmen\\simulations\\cumulative_variability.svg",
    #     format="svg")
