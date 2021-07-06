from cobra.flux_analysis import flux_variability_analysis

def optimize(model):
    """performs fba and fva and returns an Array of dictionaries, containing the results

    Keyword arguments:
    model -- valid cobra-model
    """
    fba_solution = model.optimize()
    fva_solution = flux_variability_analysis(model)

    results_Array = []
    for reaction in model.reactions:
        results_Array.append({
            reaction.id: {
                'fbaSolution': fba_solution[reaction.id],
                'minFlux': fva_solution.loc[reaction.id, 'minimum'],
                'maxFlux': fva_solution.loc[reaction.id, 'maximum']
            }
        })

    return results_Array
