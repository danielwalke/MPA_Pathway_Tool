from cobra.flux_analysis import flux_variability_analysis
import json


def optimize(model):
    """performs fba and fva and returns an Array of dictionaries, containing the results

    Keyword arguments:
    model -- valid cobra-model
    """
    fba_solution = model.optimize()
    fva_solution = flux_variability_analysis(model)

    results_array = []

    for reaction in model.reactions:
        output_row = {
            reaction.id: {
                'fbaSolution': fba_solution[reaction.id],
                'minFlux': fva_solution.loc[reaction.id, 'minimum'],
                'maxFlux': fva_solution.loc[reaction.id, 'maximum']
            }
        }

        # row = json.dumps(output_row)
        results_array.append(output_row)

    # results_string_array = "[" + ",".join(results_array) + "]"

    return results_array
