import clonedeep from "lodash/cloneDeep";

export function getKeggId(nodeId) {
    const splitArray = nodeId.split(" ")
    return splitArray[splitArray.length-1]
}

function getStyleFromFlux(flux) {
    const maxWidth = 8.0
    const width = Math.abs(flux)/1000 * maxWidth

    const lowFlux = {r: 40, g: 90, b:255}
    const highFlux = {r: 255, g: 82, b:40}
    const color = {r: 211, g: 211, b: 211}
    if (Math.abs(flux) > 1e-3) {
        color.r = Math.round((highFlux.r-lowFlux.r) * Math.abs(flux)/1000) + lowFlux.r
        color.g = 40
        color.b = Math.round((highFlux.b-lowFlux.b) * Math.abs(flux)/1000) + lowFlux.b
    }
    const hexColor = RGBToHex(color.r, color.g, color.b).toUpperCase()

    // console.log("("+color.r+","+color.g+","+color.b+")")

    return {width, hexColor}
}

export function RGBToHex(r,g,b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length === 1)
        r = "0" + r;
    if (g.length === 1)
        g = "0" + g;
    if (b.length === 1)
        b = "0" + b;

    return "#" + r + g + b;
}

export function createFbaGraphDummyData(graphData, fluxData) {

    const fluxGraphData = {
        data: {
            nodes: [...graphData.data.nodes],
            links: [...graphData.data.links]
        }
    }

    fluxGraphData.data.links.forEach(link => {
        const sourceNode = getKeggId(link.source)
        const targetNode = getKeggId(link.target)
        let reaction

        reaction = fluxData.find(reaction => reaction.reactionId === sourceNode)
        if (!reaction) {
            reaction = fluxData.find(reaction => reaction.reactionId === targetNode)
        }

        link.strokeWidth = getStyleFromFlux(reaction.fbaFlux).width
        link.strokeWidth = 5
        link.color = getStyleFromFlux(reaction.fbaFlux).hexColor

    })

    return fluxGraphData
}

export function createFbaGraphData(graphData, fluxData) {

    const fluxGraphData = {
        data: {
            nodes: [...graphData.data.nodes],
            links: [...graphData.data.links]
        }
    }

    fluxGraphData.data.links.forEach(link => {
        const sourceNode = getKeggId(link.source)
        const targetNode = getKeggId(link.target)

        let reaction

        for (const reactionFlux of fluxData) {
            const reactionId = Object.keys(reactionFlux)[0]

            try {
                if(reactionId === sourceNode || reactionId === targetNode) {
                    reaction = reactionFlux[reactionId]
                    break;
                } else {
                    reaction.fbaSolution = null
                    throw "Can't find reaction from graph in fba data!"
                }
            } catch (e) {
                console.error(e)
            }
        }

        // link.strokeWidth = getStyleFromFlux(reaction.fbaSolution).width
        link.strokeWidth = 5
        link.color = getStyleFromFlux(reaction.fbaSolution).hexColor

    })

    return fluxGraphData
}

export function resetFluxData(reactionsInSelectArray, fluxdata, dispatch) {

    const newFluxdata = clonedeep(fluxdata)
    newFluxdata.links.forEach(link => {
        link.strokeWidth = undefined
        link.color = undefined
    })

    dispatch({type: "SET_FBA_RESULTS", payload: []})
    dispatch({type: "SET_FLUX_GRAPH", payload: newFluxdata})
}
