import React, {useEffect, useRef, useState} from "react";
import {useDispatch} from "react-redux";
import "../../Creator/ModalStyles/Modals.css"
import GraphModalBody from "./GraphModalBody";

function useOutsideAlerter(ref) {
    const dispatch = useDispatch()

    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            if (ref.current &&
                !ref.current.contains(event.target)) {
                dispatch({type: "SHOW_GRAPH_MODAL", payload: false})
                dispatch({type: "SET_GRAPH_MODAl_INPUT", payload: {}})
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export default function GraphModal(props) {

    const [initCoordinates, setInitCoordinates] = useState({x: "", y: ""})
    const settingsWindow = useRef(null)

    useOutsideAlerter(settingsWindow)

    useEffect(() => {
        setInitCoordinates(props.mouseCoordinates)
    },[])

    const y = String(Number(initCoordinates.y) + 1)
    const x = String(Number(initCoordinates.x) + 1)

    return (
        <div style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            top: "0",
            left: "0"
        }}>
            <div
                ref={settingsWindow}
                className={"modal graph-modal"}
                style={{
                    backgroundColor: "white",
                    boxShadow: "-1px 3px 14px 3px rgba(0,0,0,0.48)",
                    position: "absolute",
                    top: y + "px",
                    left: x + "px",
                }}>
                <GraphModalBody/>
            </div>
        </div>
    )
}
