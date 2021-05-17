export const getCompName = (compMap) => {
    const compList = []
    for (let comp of compMap.keys()) {
        compList.push(comp)
    }
    return (compList)
}