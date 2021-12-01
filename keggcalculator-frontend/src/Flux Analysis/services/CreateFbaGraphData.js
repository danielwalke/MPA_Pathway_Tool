import clonedeep from "lodash/cloneDeep";
import {changeLinkOrientation} from "../../Creator/graph/double click node/ChangeLinkOrientation";

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

    const newLinks = []

    for (const link of graphData.data.links) {

        // ignore reverse links
        if (link.isReversibleLink ) {continue}

        const sourceNodeId = getKeggId(link.source)
        const targetNodeId = getKeggId(link.target)

        const fluxObj = fluxData.find(flux => Object.keys(flux)[0] === sourceNodeId || Object.keys(flux)[0] === targetNodeId)
        const fbaFlux = fluxObj ? Object.values(fluxObj)[0].fbaSolution : null

        const anyNodeReversible = graphData.data.nodes.filter(
            node => node.id === link.source || node.id === link.target).some(node => node.reversible)

        console.log("link: ")
        console.log(link)
        console.log("adjacent nodes: ")
        console.log(graphData.data.nodes.filter(
            node => node.id === link.source || node.id === link.target))
        console.log(fbaFlux)
        console.log(anyNodeReversible)

        if (anyNodeReversible && fbaFlux < 0) {
        // flux < 0 -> reverse link
            newLinks.push({
                source: link.target,
                target: link.source,
                opacity: link.opacity,
                strokeWidth: 5,
                color: getStyleFromFlux(fbaFlux).hexColor,
                isReversibleLink: true
            })

            newLinks.push({
                source: link.source,
                target: link.target,
                opacity: "0",
                strokeWidth: 5,
                color: getStyleFromFlux(fbaFlux).hexColor,
                isReversibleLink: false
            })
            continue
        } else if (anyNodeReversible && fbaFlux > 0) {
            newLinks.push({
                source: link.target,
                target: link.source,
                opacity: "0",
                strokeWidth: 5,
                color: getStyleFromFlux(fbaFlux).hexColor,
                isReversibleLink: true
            })

            newLinks.push({
                source: link.source,
                target: link.target,
                opacity: link.opacity,
                strokeWidth: 5,
                color: getStyleFromFlux(fbaFlux).hexColor,
                isReversibleLink: false
            })
            continue
        }

        // flux is > 0 -> forward link
        newLinks.push({
            source: link.source,
            target: link.target,
            opacity: link.opacity,
            strokeWidth: 5,
            color: getStyleFromFlux(fbaFlux).hexColor,
            isReversibleLink: link.isReversibleLink
        })

    }

    const fluxGraphData = {
        data: {
            nodes: graphData.data.nodes,
            links: newLinks
        }
    }

    return fluxGraphData
}

export function resetFluxData(fluxState, dispatch, generalState) {

    if (fluxState.selectedNode.id) {
        const data = changeLinkOrientation(fluxState.selectedNode, fluxState, generalState)

        dispatch({type: "SET_FBA_RESULTS", payload: []})
        dispatch({type: "SET_FLUX_GRAPH", payload: data})
    }
}
