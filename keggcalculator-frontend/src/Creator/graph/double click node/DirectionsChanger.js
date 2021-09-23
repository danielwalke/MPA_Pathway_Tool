import clonedeep from "lodash/cloneDeep"

export const handleSubmitDirection = (state, dispatch, generalState) => {

    const linkClone = clonedeep(state.data.links)
    const linkReactionIsSource = linkClone.filter(link => {
        const linkSourceId = link.source
        return (linkSourceId === state.doubleClickNode)
    })
    const linkSources = linkReactionIsSource.map(link => clone(link.target))
    const reaction = state.data.nodes.filter(node => node.id === state.doubleClickNode)[0]
    const linkReactionIsTarget = linkClone.filter(link => {
        const linkTargetId = link.target
        return linkTargetId === state.doubleClickNode
    })
    const linkTargets = linkReactionIsTarget.map(link => clone(link.source))
    linkReactionIsSource.map((link, index) => {
        link.source = clone(linkSources[index])
        link.target = clone(reaction.id)
        return link
    })
    linkReactionIsTarget.map((link, index) => {
        link.source = clone(reaction.id)
        link.target = clone(linkTargets[index])
        return link
    })
    const otherLinks = state.data.links.filter(link => {
        const linkSourceId = link.source
        const linkTargetId = link.target
        return (linkSourceId !== state.doubleClickNode && linkTargetId !== state.doubleClickNode)
    })
    linkReactionIsSource.map(link => otherLinks.push(link)) //might set data
    linkReactionIsTarget.map(link => otherLinks.push(link)) //might set data
    const data = {nodes: state.data.nodes, links: otherLinks}
    generalState.reactionsInSelectArray.map(reaction => {
        if (reaction.reactionName === state.doubleClickNode) {
            reaction.isForwardReaction = !reaction.isForwardReaction
        }
        return null;
    })
    dispatch({type: "SETDATA", payload: clonedeep(data)})
}

export const clone = (object) => {
    return JSON.parse(JSON.stringify(object))
}
