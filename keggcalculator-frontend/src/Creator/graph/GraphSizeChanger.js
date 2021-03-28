import React from "react";

const GraphSizeChanger = (props) => {
    const {dispatch} = props
    return(
        <div>
            <button className={"button"}
                    onClick={() => dispatch({type: "ADDSVGHEIGHT", payload: window.innerHeight * 0.1})}>Add svg
                height</button>
            <button className={"button"}
                    onClick={() => dispatch({type: "REDUCESVGHEIGHT", payload: window.innerHeight * 0.1})}>Reduce
                svg height</button>
            <br/>
        </div>
    )
}

export default GraphSizeChanger