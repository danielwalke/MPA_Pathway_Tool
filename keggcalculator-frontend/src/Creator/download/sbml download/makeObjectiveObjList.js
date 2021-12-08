function getObjectiveXmlObj(objective) {

    return {
        '@': {
            'fbc:reaction': objective.reactionId,
            'fbc:coefficient': objective.objectiveCoefficient
        }
    }
}

export function makeObjectiveObjList(listOfObjectives) {

    const listOfObjectivesObj = {
        '@': {'fbc:activeObjective': 'obj'},
        '#': {
            'fbc:objective':
                {
                    '@': {
                        'fbc:id': "obj",
                        'fbc:type': "maximize"
                    },
                    'fbc:listOfFluxObjectives': {
                        '#': {
                            'fbc:fluxObjective': listOfObjectives.map(objective => getObjectiveXmlObj(objective))
                        }
                    }
                }
            }
        }

    return listOfObjectivesObj
}
