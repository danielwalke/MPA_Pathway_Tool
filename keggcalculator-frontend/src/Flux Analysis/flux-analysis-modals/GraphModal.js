import React, {useEffect, useRef, useState} from "react";

function useOutsideAlerter(ref) {
    useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
            console.log(ref.current)
            if (ref.current && !ref.current.contains(event.target)) {
                console.log("You clicked outside of me!");
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
        setInitCoordinates(props.windowCoordinates)
    },[])

    const y = String(Number(initCoordinates.y) + 1)
    const x = String(Number(initCoordinates.x) + 1)

    return (
        <div
            ref={settingsWindow}
            style={{
                backgroundColor: "white",
                boxShadow: "-1px 3px 14px 3px rgba(0,0,0,0.48)",
                height: "20vh",
                width: "20vw",
                position: "absolute",
                top: y + "px",
                left: x + "px",
                zIndex: "1001"
            }}>
            Hellooooooooo
        </div>
    )
}
