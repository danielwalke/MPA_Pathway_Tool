function getObjectiveXmlObj(objective) {

    return {
        'fbc:fluxObjective': {
            '@': {
                'fbc:reaction': 'test',
                'fbc:coefficient': 'test'
            }
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
                    '#': {
                        'fbc:listOfFluxObjectives': {
                            '#': listOfObjectives.map(objective => getObjectiveXmlObj(objective))
                        }
                    }
                }
        }
    }
    return listOfObjectivesObj
}
