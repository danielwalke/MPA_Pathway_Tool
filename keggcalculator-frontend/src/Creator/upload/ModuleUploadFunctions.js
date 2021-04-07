export const handleGraphUpload = (rows, dispatch, state) => {
    const nodes = []
    const links = []
    const addedReactions = []
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const columns = rows[rowIndex].split(";")
        const compoundX = columns[11]
        const compoundY = columns[12]
        const compoundName = columns[5].replaceAll("\t", ";")
        const typeOfCompound = columns[6]
        const reactionName = columns[1].replaceAll("\t", ";")
        const reactionX = columns[9]
        const reactionY = columns[10]
        const reactionAbbr = columns[13]
        const compoundAbbr = columns[14]
        const keyComp = columns[15]
        const opacity = keyComp === "true" ? 1 : 0.4
        if(compoundName.length===0){
            if(!addedReactions.includes(reactionName)){
                const reactionNode = {
                    id: reactionName,
                    x: +reactionX,
                    y: +reactionY,
                    color: "black",
                    symbolType: "square",
                    opacity: 1
                }
                nodes.push(reactionNode)
            }
            addedReactions.push(reactionName)
            state.abbreviationsObject[`${reactionName}`] = reactionAbbr
        }else{
            const compoundNode = {
                id: compoundName,
                x: +compoundX,
                y: +compoundY,
                color: "darkgreen",
                symbolType: "circle",
                opacity: opacity
            }
            if(!addedReactions.includes(reactionName)){
                const reactionNode = {
                    id: reactionName,
                    x: +reactionX,
                    y: +reactionY,
                    color: "black",
                    symbolType: "diamond",
                    opacity: 1
                }
                nodes.push(reactionNode)
            }
            addedReactions.push(reactionName)
            state.abbreviationsObject[`${reactionName}`] = reactionAbbr
            state.abbreviationsObject[`${compoundName}`] = compoundAbbr
            let link = {}
            if (typeOfCompound === "substrate") {
                link = {source: compoundName, target: reactionName, opacity: opacity}
            } else {
                link = {source: reactionName, target: compoundName, opacity: opacity}
            }
            links.push(link)
            nodes.push(compoundNode)
        }
        dispatch({type: "SETABBREVIATIONOBJECT", payload: state.abbreviationsObject})


    }
    return ({nodes, links})
}

export const handleReactionListUpload = (rows) => {
    const reactionList = []
    let substrateMap = {}
    let productMap = {}
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const columns = rows[rowIndex].split(";")
        const reactionName = columns[1].replaceAll("\t", ";")
        const reactionId = reactionName.substring(reactionName.length - 6, reactionName.length)
        let koNumberList = []
        let ecNumberList = []
        let taxonomyList = []
        const koNumbersString = columns[2]
        if (koNumbersString.length > 0) {
            if (koNumbersString.includes(",")) {
                const koNumbers = koNumbersString.split(",")
                koNumberList = koNumbers.map(koNumber => koNumber)
            } else {
                koNumberList = [koNumbersString]
            }
        }
        const ecNumbersString = columns[3]
        if (ecNumbersString.length > 0) {
            if (ecNumbersString.includes(",")) {
                const ecNumbers = ecNumbersString.split(",")
                ecNumberList = ecNumbers.map(ecNumber => ecNumber)
            } else {
                ecNumberList = [ecNumbersString]
            }
        }
        const taxonomiesString = columns[8]
        const taxa = {}
        if (taxonomiesString.includes("&&")) { //if more than one taxonomy added -> split them
            const taxonomies = taxonomiesString.split("&&")
            for (const taxonomy of taxonomies) {
                const taxonomyEntries = taxonomy.split(":")
                const taxonomicRank = taxonomyEntries[0]
                const taxon = taxonomyEntries[1]
                taxa[`${taxon}`] = taxonomicRank
                // if (taxonomy.includes(",")) { //if taxonomy entries contains more than one entry (superkingdom, kingdom,etc... split them and store the last item in an array)
                //     const taxonomyEntries = taxonomy.split(",")
                //     taxonomyList.push(taxonomyEntries[taxonomyEntries.length - 1])
                // } else { //only one entry -> store only this entry (corresponds to last entry)
                //     taxonomyList.push(taxonomy)
                // }
            }
        } else {
            const taxonomyEntries = taxonomiesString.split(":")
            const taxonomicRank = taxonomyEntries[0]
            const taxon = taxonomyEntries[1]
            taxa[`${taxon}`] = taxonomicRank
            // if (taxonomiesString.includes(",")) { //only one taxonomy with more entries (superkingdom,kingdom etc)-> split and store last entry
            //     const taxonomyEntries = taxonomiesString.split(",")
            //     taxonomyList.push(taxonomyEntries[taxonomyEntries.length - 1])
            // } else {
            //     taxonomyList.push(taxonomiesString) //only on taxonomy with one entry
            // }
        }

        const compoundName = columns[5].replaceAll("\t", ";")
        const compoundId = compoundName.substring(compoundName.length - 6, compoundName.length)
        const typeOfCompound = columns[6]
        if (typeOfCompound === "substrate") {
            substrateMap[`${compoundId}`] = columns[4]
        } else {
            productMap[`${compoundId}`] = columns[4]
        }
        const reaction = {
            reactionId: reactionId,
            reactionName: reactionName,
            koNumbersString: koNumberList,
            ecNumbersString: ecNumberList,
            stochiometrySubstratesString: substrateMap,
            stochiometryProductsString: productMap,
            // taxonomies: taxonomyList,
            taxa: taxa,
            isForwardReaction: true
        }
        const nextColumns = rowIndex < rows.length - 1 ? rows[rowIndex + 1].split(";") : [rowIndex + 1]
        if (+columns[0] !== +nextColumns[0]) {
            reactionList.push(reaction)
            substrateMap = {}
            productMap = {}
        }

    }
    return reactionList
}