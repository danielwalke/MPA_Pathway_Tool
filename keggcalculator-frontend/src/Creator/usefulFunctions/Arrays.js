export const getLastItemOfList = (list) => list[list.length - 1]

export function deleteObjectFromArray(array, prop, propValue) {
    let deleteIndex = array.findIndex(object => object[prop] === propValue)
    if (deleteIndex !== -1) {
        array.splice(deleteIndex, 1);
    }
}

export function findLowestUnusedIndex(array, prop, startFrom) {
    let lowestUnusedIndex = startFrom
    while (array.some(object => object[prop] === lowestUnusedIndex)) {
        lowestUnusedIndex ++
    }
    return lowestUnusedIndex
}
