import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {useStylesSelector} from "./Styles";

const KoSelector = (props) => {
    const state = useSelector(state => state)
    const classes = useStylesSelector()
    const [koNumber, setKoNumber] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [editingMode, setEditingMode] = React.useState(false)
    const [koNumbers, setKoNumbers] = React.useState([])
    const [newKoNumber, setNewKoNumber] = React.useState("")
    const dispatch = useDispatch()

    useEffect(()=>{
        setKoNumbers(props.koNumbers)
    },[props, state.general.listOfReactions])

    const handleChanges = () =>{
        const listOfReactions = state.general.listOfReactions.map(reaction=>{
            if(props.reaction.keggId === reaction.keggId){
                reaction.koNumbers = koNumbers
            }
            return reaction
        })
        dispatch({type:"SETLISTOFREACTIONS", payload: listOfReactions})
    }
    return (
        <div>
            {editingMode ?
                <div><TextField size={"small"} onChange={(e) => setNewKoNumber(e.target.value)} value={newKoNumber}
                                variant={"outlined"} type={"text"}/><AddCircleIcon className={"CircleIcon"}
                                                                                   onClick={() => {
                                                                                       setEditingMode(false)
                                                                                       // dispatch({type:"SET_KO_NUMBERS", payload:[...koNumbers, newKoNumber]})
                                                                                       setKoNumbers([...koNumbers, newKoNumber])
                                                                                   }}/></div>
                : <div><FormControl className={classes.formControl}>
                    <InputLabel id="koNumberInput">ko Number</InputLabel>
                    <Select
                        labelId="ko Number"
                        id="koNumber"
                        open={open}
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        value={koNumber}
                        onChange={(e) => setKoNumber(e.target.value)}
                    >
                        <MenuItem onClick={() => setEditingMode(true)} value={"addRequest"}><AddCircleIcon/></MenuItem>
                        {koNumbers.map((ko, index) => <MenuItem  className={"CircleIcon"} onClick={() => {
                            koNumbers.splice(index, 1)
                            setKoNumbers(koNumbers)
                        }} key={index.toString().concat(ko)} value={ko}><DeleteIcon/>{ko}
                        </MenuItem>)}
                    </Select>
                </FormControl><button className={"downloadButton"} onClick={()=> handleChanges()}>submit changes</button></div>}
        </div>
    )
}

export default KoSelector