import {useDispatch, useSelector} from "react-redux";
import React, {useEffect} from "react";
import TextField from "@material-ui/core/TextField";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {FormControl, InputLabel, MenuItem, Select} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import {useStylesSelector} from "./Styles";
import {getCompoundId} from "../SbmlReader/ReaderFunctions";
import {Autocomplete} from "@material-ui/lab";
import {
    OuterElementContext,
    OuterElementType,
    renderRow,
    useResetCache
} from "../KeggCompoundAutoCompleteList";
import {VariableSizeList} from "react-window";
import Checkbox from "@material-ui/core/Checkbox";


// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const {children, ...other} = props;
    const itemData = React.Children.toArray(children);
    const itemCount = itemData.length;
    const gridRef = useResetCache(itemCount);
    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={window.innerHeight * 0.4}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => {
                        const compoundName = itemData[index].props.children
                        return (
                            window.innerHeight * 0.07 * Math.ceil(compoundName.length / 20)
                        )
                    }}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    );
});

const SubstrateSelector = (props) => {
    const state = useSelector(state => state)
    const classes = useStylesSelector()
    const [substrate, setSubstrate] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [editingMode, setEditingMode] = React.useState(false)
    const [substrates, setSubstrates] = React.useState([])
    const [newSubstrateId, setNewSubstrateId] = React.useState("") //setting sbml id
    const [newSubstrateName, setNewSubstrateName] = React.useState("") //setting sbml name
    const [newStoichiometry, setNewStoichiometry] = React.useState(1)
    const [newKeggName, setNewKeggName] = React.useState("")
    const [isChanged, setIsChanged] = React.useState(false)
    const [oldSubstrates, setOldSubstrates] = React.useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        setSubstrates(props.substrates)
        setOldSubstrates(props.substrates)
    }, [props, state.general.listOfReactions])

    const handleChanges = () => {
        const listOfReactions = state.general.listOfReactions.map(reaction => {
            if (props.reaction.keggId === reaction.keggId) {
                reaction.substrates = substrates
            }
            return reaction
        })
        setIsChanged(true)
        dispatch({type: "SETLISTOFREACTIONS", payload: listOfReactions})
    }

    const handleAddSubstrate = () =>{
        setEditingMode(false)
        let numberOfCompounds = substrates.length;
        state.general.listOfReactions.map(r => {
            numberOfCompounds += r.substrates.length
            numberOfCompounds += r.products.length
            return null;
        })
        const keggId = getCompoundId(numberOfCompounds);
        const newSubstrate = {
            sbmlId: newSubstrateId,
            sbmlName: newSubstrateName,
            keggId: newKeggName.length>1 ? newKeggName.substring(newKeggName.length-6,newKeggName.length) : keggId,
            stoichiometry: newStoichiometry.toString(),
            keggName: newKeggName.length>1 ? newKeggName : keggId,
        }
        setSubstrates([...substrates, newSubstrate])
    }
    return (
        <div>
            {editingMode ?
                <div>
                    <TextField label={"sbmlId"} size={"small"} onChange={(e) => setNewSubstrateId(e.target.value)} value={newSubstrateId}
                                variant={"outlined"} type={"text"}/>
                    <TextField label={"sbmlName"} size={"small"} onChange={(e) => setNewSubstrateName(e.target.value)} value={newSubstrateName}
                               variant={"outlined"} type={"text"}/>
                    <TextField type={"number"} value={newStoichiometry}
                               onChange={(e) => setNewStoichiometry(+e.target.value)}/>
                    <Autocomplete
                        onChange={(event,value)=> setNewKeggName(value)}
                        id="keggAnnotation"
                        style={{width: "100%"}}
                        label={"optional: "}
                        disableListWrap
                        value={newKeggName}
                        classes={classes}
                        ListboxComponent={ListboxComponent}
                        options={Object.values(state.general.compoundId2Name)}
                        renderInput={(params) => <TextField {...params} variant="outlined" label="optional: " placeholder={"keggName"}/>}
                    />
                    <AddCircleIcon
                        className={"CircleIcon"}
                        onClick={() => {
                            handleAddSubstrate()
                        }}/>
                </div>
                : <div>
                    {substrates.map((subst, index) => <div key={"SubstrateList" + index}><Checkbox checked={isChanged || oldSubstrates.includes(subst)}/>{subst.sbmlId};{subst.sbmlName}:{subst.stoichiometry}</div>)}
                    <FormControl className={classes.formControl}>
                    <InputLabel id="substratesInput">substrates</InputLabel>
                    <Select
                        labelId="substrates"
                        id="substrates"
                        open={open}
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        value={substrate.sbmlId}
                        onChange={(e) => setSubstrate(e.target.value)}
                    >
                        <MenuItem onClick={() => {
                            setEditingMode(true)
                            setIsChanged(false)
                        }} value={"addRequest"}><AddCircleIcon/></MenuItem>
                        {substrates.map((subst, index) => <MenuItem className={"CircleIcon"} onClick={() => {
                            substrates.splice(index, 1)
                            setSubstrates(substrates)
                        }} key={index.toString().concat(subst.sbmlId + ";" + subst.sbmlName +":" +subst.stoichiometry)} value={subst.sbmlId.concat(";" + subst.sbmlName +":" +subst.stoichiometry)}><DeleteIcon/>{subst.sbmlId};{subst.sbmlName}:{subst.stoichiometry}
                        </MenuItem>)}
                    </Select>
                </FormControl>
                    <button style={{width:"10vw"}} className={"downloadButton"} onClick={() => handleChanges()}>submit changes</button>
                </div>}
        </div>
    )
}

export default SubstrateSelector