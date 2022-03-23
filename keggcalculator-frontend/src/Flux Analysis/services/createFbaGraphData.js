import {changeLinkOrientation, createLink} from "../../Creator/graph/double click node/ChangeLinkOrientation";

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
        const fluxCoeff = Math.abs(flux) < 20 ? Math.abs(flux)/20 * 0.8 :
            Math.abs(flux)/1000 * 0.2 + 0.8
        color.r = Math.round((highFlux.r-lowFlux.r) * fluxCoeff) + lowFlux.r
        color.g = 40
        color.b = Math.round((highFlux.b-lowFlux.b) * fluxCoeff) + lowFlux.b
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

    const newLinks = []

    for (const link of graphData.data.links) {

        // ignore reverse links
        if (link.isReversibleLink ) {continue}

        const sourceNodeId = getKeggId(link.source)
        const targetNodeId = getKeggId(link.target)

        const fluxObj = fluxData.get(sourceNodeId) ?
            fluxData.get(sourceNodeId) : fluxData.get(targetNodeId)
        const fbaFlux = fluxObj ? fluxObj.fbaSolution : null

        const anyNodeReversible = graphData.data.nodes.filter(
            node => node.id === link.source || node.id === link.target).some(node => node.reversible)

        const adjacentLink = graphData.data.links.filter(
            graphLink => (graphLink.source === link.target || graphLink.target === link.source) && graphLink.opacity !== "0")

        // for links connected to reversible nodes, check which link needs to be displlayed according to fba flux
        if (anyNodeReversible && fbaFlux < 0) {
            // reverse link
            newLinks.push(createLink(
                link.target,
                link.source,
                adjacentLink.opacity,
                5,
                getStyleFromFlux(fbaFlux).hexColor,
                true))
            // fwd link
            newLinks.push(createLink(
                link.source,
                link.target,
                "0",
                5,
                getStyleFromFlux(fbaFlux).hexColor,
                false))
            continue

        } else if ((anyNodeReversible && fbaFlux > 0) || (anyNodeReversible && fbaFlux === 0)) {
            // reverse link
            newLinks.push(createLink(
                link.target,
                link.source,
                "0",
                5,
                getStyleFromFlux(fbaFlux).hexColor,
                true))

            newLinks.push(createLink(
                link.source,
                link.target,
                adjacentLink.opacity,
                5,
                getStyleFromFlux(fbaFlux).hexColor,
                false))
            continue
        }

        // non reversible links
        newLinks.push(createLink(
            link.source,
            link.target,
            link.opacity,
            5,
            getStyleFromFlux(fbaFlux).hexColor,
            link.isReversibleLink))
    }

    const fluxGraphData = {
        data: {
            nodes: [...graphData.data.nodes],
            links: newLinks
        }
    }

    return fluxGraphData
}

export function resetFluxData(fluxState, dispatch, generalState) {

    console.log(fluxState.selectedNode)

    if (fluxState.selectedNode.id) {
        const data = changeLinkOrientation(fluxState.selectedNode, fluxState, generalState)

        console.log("reset")
        dispatch({type: "SET_FBA_RESULTS", payload: []})
        dispatch({type: "SET_FLUX_GRAPH", payload: data})
    }
}
