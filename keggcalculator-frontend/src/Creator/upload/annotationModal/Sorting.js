function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });

    const sortedArray = stabilizedThis.map((el) => el[0])

    return sortedArray;
}

export function filterArray(array, input) {
    if (input) {
        let result = []
        let indices = []
        const inputLowerCase = input.toLowerCase()

        array.forEach(
            item => {
                if (item.sbmlId.toLowerCase().includes(inputLowerCase) && !indices.includes(item.index)) {
                    result.push(item)
                    indices.push(item.index)
                }
                if (item.sbmlName.toLowerCase().includes(inputLowerCase) && !indices.includes(item.index)) {
                    result.push(item)
                    indices.push(item.index)
                }
            }
        )

        return result

    } else {
        return array
    }
}
