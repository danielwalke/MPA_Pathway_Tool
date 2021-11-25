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

    const [modalCoordinates, setModalCoordinates] = useState({x: "", y: ""})
    const settingsWindow = useRef(null)

    useOutsideAlerter(settingsWindow)

    useEffect(() => {
        const browserWidth = window.innerWidth || document.body.clientWidth
        const browserHeight = window.innerHeight || document.body.clientHeight
        const offset = {x: "", y: ""}
        const coordinates = modalCoordinates

        if (browserHeight && browserWidth) {
            offset.x = props.mouseCoordinates.x > browserWidth * 0.66 ? "- 27rem" : ""
            offset.y = props.mouseCoordinates.y > browserHeight * 0.5 ? "- 16rem" : ""
         }

        coordinates.x = `calc(${props.mouseCoordinates.x}px ${offset.x})`
        coordinates.y = `calc(${props.mouseCoordinates.y}px ${offset.y})`

        setModalCoordinates(coordinates)
    },[])

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
                    top: modalCoordinates.y,
                    left: modalCoordinates.x,
                }}>
                <GraphModalBody/>
            </div>
        </div>
    )
}
