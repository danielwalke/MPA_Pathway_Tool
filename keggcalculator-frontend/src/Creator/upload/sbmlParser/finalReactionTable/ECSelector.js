import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {useStylesSelector} from "./Styles";
import Checkbox from "@material-ui/core/Checkbox";
import {Autocomplete} from "@material-ui/lab";
import Chip from "@material-ui/core/Chip";

const EcSelector = (props) => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const [options, setOptions] = useState([])
    // const [selectedEC, setSelectedEC] = useState(options[])

    useEffect(() => {
        let ecNumberOptions = []
        state.general.reactionAnnotationTableOptions.forEach(reaction => {
            for (const ecNumber of reaction.ecNumbersString) {
                // add ec number to options only if it isn't present already
                if (!props.reactionRowInfo.ecNumbers.includes(ecNumber)) {
                    ecNumberOptions.push(ecNumber)
                }
            }
        })
        setOptions(ecNumberOptions)

    }, [state.general.reactionAnnotationTableOptions, props.reactionRowInfo.ecNumbers])

    return (
        <Autocomplete
            size={"small"}
            id={"ecNumberSelector"}
            multiple
            limitTags={4}
            options={options}
            value={props.reactionRowInfo.ecNumbers}
            onChange={(event, value) => {
                // addition of selected ec number
                const newListOfReactions = props.listOfReactions
                newListOfReactions[props.index].ecNumbers = [...value]

                dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
            }}
            renderTags={(values) =>
                values.map((value) => (
                    <Chip
                        label={value}
                        onDelete={() => {
                            // deletion of ec number
                            const newListOfReactions = props.listOfReactions
                            const newEcNumbers = newListOfReactions[props.index].ecNumbers
                            const arrIndex = props.listOfReactions[props.index].ecNumbers.indexOf(value)

                            if (arrIndex > -1) {
                                newEcNumbers.splice(arrIndex, 1)
                                newListOfReactions[props.index].ecNumbers = [...newEcNumbers]
                            }

                            dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
                        }}
                    />
                ))
            }
            renderInput={params => (
                <TextField
                    // onChange={(event) => handleChange(event)}
                    value={props.reactionRowInfo.ecNumbers}
                    {...params}
                    label="EC Number Suggestions"
                    variant="outlined"
                />
            )}
        />
    )

}


// const EcSelector = (props) => {
//     const state = useSelector(state => state)
//     const classes = useStylesSelector()
//     const [ecNumber, setEcNumber] = React.useState("");
//     const [open, setOpen] = React.useState(false);
//     const [editingMode, setEditingMode] = React.useState(false)
//     const [ecNumbers, setEcNumbers] = React.useState([])
//     const [newEcNumber, setNewEcNumber] = React.useState("")
//     const [isChanged, setIsChanged] = React.useState(false)
//     const [oldEcNumbers, setOldEcNumbers] = React.useState([])
//     const dispatch = useDispatch()
//
//
//     useEffect(() => {
//         setEcNumbers(props.ecNumbers)
//         setOldEcNumbers(props.ecNumbers)
//     }, [props, state.general.listOfReactions])
//
//     const handleSubmitEcNumbersChanges = () => {
//         const listOfReactions = state.general.listOfReactions.map(reaction => {
//             if (props.reaction.keggId === reaction.keggId) {
//                 reaction.ecNumbers = ecNumbers
//             }
//             return reaction
//         })
//         setIsChanged(true)
//         dispatch({type: "SETLISTOFREACTIONS", payload: listOfReactions})
//     }
//     return (
//         <div>
//             {editingMode ?
//                 <div>
//                     <TextField size={"small"} onChange={(e) => setNewEcNumber(e.target.value)} value={newEcNumber}
//                                 variant={"outlined"} type={"text"}/>
//                     <AddCircleIcon className={"CircleIcon"}
//                                    onClick={() => {
//                                        setEditingMode(false)
//                                        setEcNumbers([...ecNumbers, newEcNumber])
//                                    }}/>
//                 </div>
//                 : <div>
//                     {ecNumbers.map((ec, index) => <div key={"ecNumberList" + index}><Checkbox
//                         checked={isChanged || oldEcNumbers.includes(ec)}/>{ec}</div>)}
//                     <FormControl className={classes.formControl}>
//                         <InputLabel id="ecNumberInput">ec Number</InputLabel>
//                         <Select
//                             labelId="ec Number"
//                             id="ecNumber"
//                             open={open}
//                             onClose={() => setOpen(false)}
//                             onOpen={() => setOpen(true)}
//                             value={ecNumber} //
//                             onChange={(e) => setEcNumber(e.target.value)}>
//                             <MenuItem onClick={() => {
//                                 setIsChanged(false)
//                                 setEditingMode(true)
//                             }} value={"addRequest"}><AddCircleIcon/></MenuItem>
//                             {ecNumbers.map((ec, index) => <MenuItem className={"CircleIcon"} onClick={() => {
//                                 ecNumbers.splice(index, 1)
//                                 setEcNumbers(ecNumbers)
//                             }} key={index.toString().concat(ec)} value={ec}><DeleteIcon/>{ec}
//                             </MenuItem>)}
//                         </Select>
//                     </FormControl>
//                     <button style={{width: "10vw"}}
//                             className={"downloadButton"} onClick={() => handleSubmitEcNumbersChanges()}>submit changes
//                     </button>
//                 </div>}
//         </div>
//     )
// }

export default EcSelector
