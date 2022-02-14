export const getMax = (arr) => {
    let max = 0;
    if (typeof arr === "object" && arr.length > 0) {
        arr.map(item => {
            max = +item > +max ? +item : max
            return null
        })
    }
    return max
}

export const getMaxProp = (arr, prop) => {
    let max = 0;
    if (typeof arr === "object" && arr.length > 0) {
        arr.map(item => {
            max = +item[prop] > +max ? +item[prop] : max
            return null
        })
    }
    return max
}

export const getMaxIndex = (arr) => {
    let max = 0
    let maxIndex
    if (typeof arr === "object" && arr.length > 0) {
        arr.forEach((item, index) => {
            if (+item > +max) {
                max = +item
                maxIndex = index
            }
        })
    }
    return maxIndex
}

export const getMin = (arr) => {
    let min = 0;
    if (typeof arr === "object" && arr.length > 0) {
        arr.map(item => {
            min = +item < +min ? +item : min
            return null
        })
    }
    return min
}

export const getMinProp = (arr, prop) => {
    let min = 0;
    if (typeof arr === "object" && arr.length > 0) {
        arr.forEach(item => {
            if (item !== null) {
                min = +item[prop] < +min ? +item[prop] : min
            }
        })
    }
    return min
}
