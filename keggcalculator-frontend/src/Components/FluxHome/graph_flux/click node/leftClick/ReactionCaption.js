import React from "react";
import {useDispatch, useSelector} from "react-redux";
import "./ReactionCaption.css"

const ReactionCaption = () => {
    const state = useSelector(state => state.mpaProteins)
    const dispatch = useDispatch()
    const min = state.minQuantUserReaction3
    const max = state.maxQuantUserReaction3
    const mid = state.midQuantUserReaction3
    const numOfDigits = 1
    return (
        <div className={"captionContainerReaction"}>
            <div className={"minReaction"}><input style={{width: "4vw"}} type={"number"}
                                                  onChange={(e) => dispatch({
                                                      type: "SETMINQUANTUSERREACTION3",
                                                      payload: e.target.value
                                                  })} value={state.minQuantUserReaction3}/></div>
            <div className={"min2Reaction"}>{+(+min + (+mid - +min) / 2).toFixed(numOfDigits)}</div>
            <div className={"midReaction"}><input style={{width: "4vw"}} type={"number"}
                                                  onChange={(e) => dispatch({
                                                      type: "SETMIDQUANTUSERREACTION3",
                                                      payload: e.target.value
                                                  })} value={state.midQuantUserReaction3}/></div>
            <div className={"max2Reaction"}>{+(+mid + (+max - +mid) / 2).toFixed(numOfDigits)}</div>
            <div className={"maxReaction"}><input style={{width: "4vw"}} type={"number"}
                                                  onChange={(e) => dispatch({
                                                      type: "SETMAXQUANTUSERREACTION3",
                                                      payload: e.target.value
                                                  })} value={state.maxQuantUserReaction3}/></div>
            <div className={"userCaptionReaction"}/>
        </div>
    )
}

export default ReactionCaption