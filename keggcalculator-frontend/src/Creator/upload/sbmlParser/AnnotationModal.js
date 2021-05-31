/*
this component is responsible for showing a modal with all unannotated compounds and allows the annotation of these compounds by selecting the respective KEGG compound
 */


import React, {useEffect, useState} from 'react';
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import {FixedSizeList as List} from "react-window";
import KeggCompoundAutoCompleteList from "./KeggCompoundAutoCompleteList";
import clonedeep from "lodash/cloneDeep";
import {addCompoundsToReactions} from "./ReactionCompoundsAdder";
import {setReactionsAndCompoundsInStore} from "./GraphDrawer";
import {setReactionsInStore} from "./ReactionsSetter";

const exchangeAt = (index, item, array) => {
    const lastItems = array.filter((item,arrayIndex)=> arrayIndex>index)
    const newArray = array.filter((item, arrayIndex) => arrayIndex<index)
    newArray.push(item)
    lastItems.map(item => newArray.push(item))
    return newArray
}

const submitAnnotation = (compound, annotation, dispatch, setUnAnnotatedCompounds, index,unAnnotatedCompounds) =>{
    compound.keggId = annotation.substring(annotation.length-6, annotation.length);
    compound.keggName = annotation;
    const newUnAnnotatedCompounds = exchangeAt(index, compound,unAnnotatedCompounds )
    setUnAnnotatedCompounds(newUnAnnotatedCompounds)
    dispatch({type:"SETANNOTATION", payload:""})
}

const submit = (state, dispatch, listOfSpecies) =>{
    //add additional information to each reaction
    console.log(listOfSpecies)
    const newListOfReactions = addCompoundsToReactions(state, state.general.listOfReactions, listOfSpecies)
    //set reactions
    console.log(setReactionsInStore(state, newListOfReactions))
    const reactions = setReactionsInStore(state, newListOfReactions)
    console.log(reactions)
    //set data for the Graph
    // const data = setReactionsAndCompoundsInStore(state, newListOfReactions, dispatch,state.general.listOfReactionGlyphs)
    dispatch({type:"SETLISTOFREACTIONS", payload: newListOfReactions})
    dispatch({type:"SETREACTIONSINARRAY", payload: reactions})
    dispatch({type:"SETISANNOTATIONPURPOSE", payload:false})
    // dispatch({type: "SETDATA", payload: data})
    dispatch({type:"SETLOADING", payload: false})
    dispatch({type:"SETISSHOWINGREACTIONTABLE", payload: true})
}


const AnnotationModal = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)
    const [autoCompleteCompounds, setAutoCompleteCompounds] = useState({}) //this state stores the value for the autocomplete selectzor
    const [unAnnotatedCompounds, setUnAnnotatedCompounds] = useState([])
    const [annotatedCompounds, setAnnotatedCompounds] = useState([])
    const classes = useStyles()


    useEffect(()=>{
        const newListOfSpecies = [];
        annotatedCompounds.map(compound => newListOfSpecies.push(compound))
        unAnnotatedCompounds.map(compound=> newListOfSpecies.push(compound))
        dispatch({type:"SETLISTOFSPECIES", payload:newListOfSpecies})
    },[unAnnotatedCompounds, annotatedCompounds])

    useEffect(()=>{
        const listOfSpecies = state.general.listOfSpecies;
        const unAnnotatedCompList =  listOfSpecies.filter(species => species.keggId.match(`K[0-9][0-9][0-9][0-9][0-9]`));
        const autoCompleteCompoundsList = {}
        unAnnotatedCompList.map((comp, index) => autoCompleteCompoundsList[`${index}`] = comp.keggId)
        setAutoCompleteCompounds(autoCompleteCompoundsList)
        setUnAnnotatedCompounds(unAnnotatedCompList)
        setAnnotatedCompounds(listOfSpecies.filter(species => !species.keggId.match(`K[0-9][0-9][0-9][0-9][0-9]`)))
    }, [state.general.isAnnotationPurpose])

    //each row in the modal is virtualized with react-window -> each row is respective for an unannotated Compound
    const AnnotationRow = ({index, style}) => {
        const unAnnotatedCompound = unAnnotatedCompounds[index];
        return (
            <div style={style}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "start",
                    marginTop: "5px",
                    height:"12vh"
                }}>
                    <div style={{
                        width: "20%",
                        overFlow: "auto"
                    }}>
                        {unAnnotatedCompound.sbmlId.concat("_" + unAnnotatedCompound.sbmlName)}</div>{/*sbml Name and Id*/}
                    <div style={{width: "54%"}}>
                        <KeggCompoundAutoCompleteList autoCompounds={autoCompleteCompounds} setAutoCompounds={setAutoCompleteCompounds} index={index}/>{/*list of all kegg compounds*/}
                    </div>
                    <div style={{width: "8%"}}>
                        <button
                            onClick={()=> submitAnnotation(unAnnotatedCompound, autoCompleteCompounds[index], dispatch, setUnAnnotatedCompounds, index,unAnnotatedCompounds)} //state.general.annotation
                            className={"downloadButton"}>Submit{/*submit annotation*/}
                        </button>
                    </div>
                    <div style={{width:"18%", overflow:"auto", height:"10vh"}}>
                    {autoCompleteCompounds[index]}
                    </div>
                </div>
            </div>
        );
    };

    const annotationModal = (
        <div className={classes.paper} style={{width: "80vw", height:"80vh", overflow:"auto"}}>
            <List itemCount={unAnnotatedCompounds.length} onItemsRendered={unAnnotatedCompounds}
                  height={window.innerHeight * 0.5}
                  itemSize={window.innerHeight * 0.1}>{AnnotationRow}</List>
            <button onClick={()=> {
                const newListOfSpecies = [];
                annotatedCompounds.map(compound => newListOfSpecies.push(compound))
                unAnnotatedCompounds.map(compound=> newListOfSpecies.push(compound))
                console.log(unAnnotatedCompounds)
                submit(state, dispatch, newListOfSpecies)
            }} className={"downloadButton"} style={{width:"20vw"}}>finish</button>{/*submit all annotation*/}
        </div>
    )
    return (
        <div>
            <Modal className={classes.modal} open={state.general.isAnnotationPurpose}>
                {annotationModal}
            </Modal>
        </div>
    );
};

export default AnnotationModal;

