export const getMax = (arr) =>{
    let max = 0;
    if(typeof arr === "object" && arr.length>0){
        arr.map(item =>{
            max = +item > +max ? +item : max
            return null
        })
    }
    return max
}

export const getMin = (arr) =>{
    let min = 0;
    if(typeof arr === "object" && arr.length>0){
        arr.map(item =>{
            min = +item < +min ? +item : min
            return null
        })
    }
    return min
}