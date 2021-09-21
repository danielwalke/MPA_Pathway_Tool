import React, {useEffect, useState} from 'react';
import {Checkbox} from "@material-ui/core";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const KeyCompoundChanger = (props) => {
    const [isKeyCompound, setIsKeyCompound] = useState(false)

    useEffect(() => {
        const opacity = props.compound.opacity
        setIsKeyCompound(opacity === 1)
    }, [props])

    const changeOpacity = (e) => {
        e.preventDefault()
        if (isKeyCompound) {
            props.handleIsNotKeyCompound(e)
        } else {
            props.handleIsKeyCompound(e)
        }
        setIsKeyCompound(!isKeyCompound)
    }

    return (
        <div><ToolTipBig title={isKeyCompound ? "Reduce opacity of chosen node" : "Increase opacity of chosen node"}
                         placement={"right"}>
            <Checkbox checked={isKeyCompound} onClick={(e) => changeOpacity(e)}/>
        </ToolTipBig>key-Compound?</div>
    );
};

export default KeyCompoundChanger;
