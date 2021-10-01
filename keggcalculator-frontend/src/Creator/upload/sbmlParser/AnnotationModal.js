/*
this component is responsible for showing a modal with all unannotated compounds and allows the annotation of these compounds by selecting the respective KEGG compound
 */


import React, {useEffect, useState} from 'react';
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import {FixedSizeList as List} from "react-window";
import KeggCompoundAutoCompleteList from "./KeggCompoundAutoCompleteList";
import {addCompoundsToReactions} from "./ReactionCompoundsAdder";
import BiggCompoundAnnotation from "./BiggCompoundAnnotation";

const submit = (state, dispatch, compoundsForAnnotation) => {
    const newKeggCompounds = state.general.autoCompleteCompoundsList
    const newBiggCompounds = state.general.biggIdSelectionList
    const newCompoundsForAnnotation = compoundsForAnnotation

    for (const [key, value] of Object.entries(newKeggCompounds)) {
        newCompoundsForAnnotation[key].keggId = value.substring(-6)
        newCompoundsForAnnotation[key].keggName = value
        newCompoundsForAnnotation[key].biggId = newBiggCompounds[key]
    }

    //add additional information to each reaction
    const newListOfReactions = addCompoundsToReactions(state, state.general.listOfReactions, newCompoundsForAnnotation)

    dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
    dispatch({type: "SETISANNOTATIONPURPOSE", payload: false})
    dispatch({type: "SETLOADING", payload: false})
    dispatch({type: "SETISSHOWINGREACTIONTABLE", payload: true})
}

const AnnotationModal = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)
    const classes = useStyles()

    const [compoundsForAnnotation, setCompoundsForAnnotation] = useState([])

    const autoCompleteCompoundsList = state.general.autoCompleteCompoundsList
    const biggIdSelectionList = state.general.biggIdSelectionList

    const data = {kegg: autoCompleteCompoundsList, bigg: biggIdSelectionList}

    useEffect(() => {
        // initializes list of species in global state
        const newListOfSpecies = [];
        compoundsForAnnotation.map(compound => newListOfSpecies.push(compound))
        dispatch({type: "SETLISTOFSPECIES", payload: newListOfSpecies})
    }, [compoundsForAnnotation])

    useEffect(() => {
        const listOfSpecies = state.general.listOfSpecies;

        listOfSpecies.map((comp, index) => {
            autoCompleteCompoundsList[`${index}`] = comp.keggId
            biggIdSelectionList[`${index}`] = ""
        })

        dispatch({type: "SET_AUTO_COMPLETE_COMPOUNDS", payload: autoCompleteCompoundsList})
        dispatch({type: "SET_BIGG_ID_SELECTION", payload: biggIdSelectionList})

        setCompoundsForAnnotation(listOfSpecies)
    }, [state.general.isAnnotationPurpose])

    //each row in the modal is virtualized with react-window -> each row is respective for an unannotated Compound
    const AnnotationRow = (props) => {
        const {data, index, style} = props
        const compoundForAnnotation = compoundsForAnnotation[index];
        const compoundId = data.kegg[index] ? data.kegg[index] : ""
        const annotationIndicator =
            compoundId.match(`C[0-9][0-9][0-9][0-9][0-9]`) ||
            compoundId.match(`G[0-9][0-9][0-9][0-9][0-9]`) ? "lightGreen" : "red"
        return (
            <div style={style}>
                <div style={{
                    marginTop: "0.1em",
                }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                        height: "100%",
                    }}>
                        <div style={{
                            width: "1rem",
                            height: "1rem",
                            background: annotationIndicator,
                            borderRadius: "0.5rem"
                        }}>
                        </div>
                        <div style={{
                            width: "32%",
                            overFlow: "auto"
                        }}>
                            {compoundForAnnotation.sbmlId.concat("_" + compoundForAnnotation.sbmlName)}
                        </div>
                        {/*sbml Name and Id*/}
                        <div style={{width: "30%"}}>
                            <KeggCompoundAutoCompleteList index={index}
                                                          data={data}/>{/*list of all kegg compounds*/}
                        </div>
                        <div style={{width: "30%"}}>
                            <BiggCompoundAnnotation index={index}
                                                    data={data}/> {}
                            {/*                            list of Bigg Ids*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const annotationModal = (
        <div className={classes.paper}
             style={{
                 width: "80vw",
                 height: "80vh",
                 overflow: "auto",
                 display: "flex",
                 flexDirection: "column",
                 justifyContent: "space-between"}}>
            <List style={{flex: "1 1 auto", height: "100%"}}
                itemCount={compoundsForAnnotation.length}
                  itemData={data}
                  onItemsRendered={compoundsForAnnotation}
                  useIsScrolling={false}
                  height={window.innerHeight * 0.5}
                  itemSize={window.innerHeight * 0.1} >
                {AnnotationRow}
            </List>
            <div style={{flex: "0 0 auto"}} >
                <button onClick={() => {
                    submit(state, dispatch, compoundsForAnnotation)
                }} className={"downloadButton"} style={{width: "20vw"}}>finish
                </button>
            </div>
            {/*submit all annotation*/}
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

