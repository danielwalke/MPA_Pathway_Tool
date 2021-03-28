import ClipLoader from "react-spinners/ClipLoader";
import React from "react";
import {useSelector} from "react-redux";

const Loading = () =>{
    const state = useSelector(state => state.general)
   return(<div>
       <ClipLoader css={{marginTop: "20vh", left: "40vw", flex: 1, position: 'absolute', zIndex: "3"}}
                   size={"40vh"}
                   loading={state.loading}/>
   </div> )
}

export default Loading