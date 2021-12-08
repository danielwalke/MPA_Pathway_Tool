
export function makeParameterObjList(parametersMap) {

    const parameterObjArray = []

    for (const [key, value] of parametersMap) {
        parameterObjArray.push(
            {
                '@': {
                    value: key,
                    id: value,
                    constant: true
                }
            }
        )
    }

    return {
        '#': {
            'parameter': parameterObjArray
        }
    }

}
