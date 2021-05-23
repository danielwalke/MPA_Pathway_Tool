import React, {useEffect, useState} from 'react';
import {Checkbox} from "@material-ui/core";

const KeyCompoundChanger = (props) => {
    const [isKeyCompound, setIsKeyCompound] = useState(false)

    useEffect(()=>{
        const opacity = props.compound.opacity
        setIsKeyCompound(opacity===1)
    },[props])

    const changeOpacity = (e) =>{
        e.preventDefault()
        if(isKeyCompound){
            props.handleIsNotKeyCompound(e)
        }else{
            props.handleIsKeyCompound(e)
        }
        setIsKeyCompound(!isKeyCompound)
    }

    return (
        <div><Checkbox checked={isKeyCompound} onClick={(e) => changeOpacity(e)}/>key-Compound?</div>
    );
};

export default KeyCompoundChanger;