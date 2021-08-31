import {useDispatch, useSelector} from "react-redux";
import React from "react";
import "./UserCaptionThree.css"
import ReactTooltip from "react-tooltip";

const UserCaptionThree = () => {
    const proteinState = useSelector(state => state.mpaProteins)
    const min = proteinState.minQuantUser3
    const max = proteinState.maxQuantUser3
    const mid = proteinState.midQuantUser3
    const dispatch= useDispatch()
    const numOfDigits = 5
    return (
        <div className={"captionContainer3"}>
            <div className={"num"} style={{display: "grid", gridTemplateColumns:" repeat(5, 20%)", width:"94vw"}}>
                <div style={{justifySelf:"start"}}><input data-tip={"lower limit"} style={{width: "4vw"}} type={"number"}
                                               onChange={(e) => dispatch({
                                                   type: "SETMINQUANTUSER3",
                                                   payload: e.target.value
                                               })} value={proteinState.minQuantUser3}/></div>
                <div style={{justifySelf:"start"}}>{+(+min+(+mid - +min) / 2).toFixed(numOfDigits)}</div>
                <div ><input style={{width: "4vw"}} type={"number"}
                             data-tip={"first upper limit of the colored heatmap"}
                                               onChange={(e) => dispatch({
                                                   type: "SETMIDQUANTUSER3",
                                                   payload: e.target.value
                                               })} value={proteinState.midQuantUser3}/>
              </div>
                <div style={{justifySelf:"end"}}>{+(+mid + (+max - +mid) / 2).toFixed(numOfDigits)}</div>
                <div style={{justifySelf:"end"}}><input data-tip={"second upper limit of the colored heatmap"} style={{width: "4vw"}} type={"number"}
                                               onChange={(e) => dispatch({
                                                   type: "SETMAXQUANTUSER3",
                                                   payload: e.target.value
                                               })} value={proteinState.maxQuantUser3}/>
                    </div>
                <ReactTooltip place="top" type="dark" effect="float"/>
            </div>

            <div className={"heatmap"} style={{width:"94vw"}}>
                <div className={"userCaption3"}/>
            </div>

        </div>
    )
}

export default UserCaptionThree
