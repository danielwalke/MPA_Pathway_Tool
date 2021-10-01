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

const exchangeAt = (index, item, array) => {
    const lastItems = array.filter((item, arrayIndex) => arrayIndex > index)
    const newArray = array.filter((item, arrayIndex) => arrayIndex < index)
    newArray.push(item)
    lastItems.map(item => newArray.push(item))
    return newArray
}

const submitAnnotation = (compound, annotation, dispatch, setUnAnnotatedCompounds, index, unAnnotatedCompounds) => {
    compound.keggId = annotation.substring(annotation.length - 6, annotation.length);
    compound.keggName = annotation;
    const newUnAnnotatedCompounds = exchangeAt(index, compound, unAnnotatedCompounds)
    setUnAnnotatedCompounds(newUnAnnotatedCompounds)
}

const submit = (state, dispatch, listOfSpecies) => {
    //add additional information to each reaction
    const newListOfReactions = addCompoundsToReactions(state, state.general.listOfReactions, listOfSpecies)
    //set reactions
    // const reactions = setReactionsInStore(state, newListOfReactions)
    //set data for the Graph
    // const data = setReactionsAndCompoundsInStore(state, newListOfReactions, dispatch,state.general.listOfReactionGlyphs)
    dispatch({type: "SETLISTOFREACTIONS", payload: newListOfReactions})
    // dispatch({type:"SETREACTIONSINARRAY", payload: reactions})
    dispatch({type: "SETISANNOTATIONPURPOSE", payload: false})
    // dispatch({type: "SETDATA", payload: data})
    dispatch({type: "SETLOADING", payload: false})
    dispatch({type: "SETISSHOWINGREACTIONTABLE", payload: true})
}

const AnnotationModal = () => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)
    const classes = useStyles()

    const [unAnnotatedCompounds, setUnAnnotatedCompounds] = useState([])
    const [annotatedCompounds, setAnnotatedCompounds] = useState([])

    const autoCompleteCompoundsList = state.general.autoCompleteCompoundsList
    const biggIdSelectionList = state.general.biggIdSelectionList

    const data = {kegg: autoCompleteCompoundsList, bigg: biggIdSelectionList}

    useEffect(() => {
        const newListOfSpecies = [];
        annotatedCompounds.map(compound => newListOfSpecies.push(compound))
        unAnnotatedCompounds.map(compound => newListOfSpecies.push(compound))
        dispatch({type: "SETLISTOFSPECIES", payload: newListOfSpecies})
        console.log(unAnnotatedCompounds)
    }, [unAnnotatedCompounds, annotatedCompounds])

    useEffect(() => {
        const listOfSpecies = state.general.listOfSpecies;
        const unAnnotatedCompList = listOfSpecies.filter(species => species.keggId.match(`K[0-9][0-9][0-9][0-9][0-9]`));

        unAnnotatedCompList.map((comp, index) => {
            autoCompleteCompoundsList[`${index}`] = comp.keggId
            biggIdSelectionList[`${index}`] = ""
        })

        dispatch({type: "SET_AUTO_COMPLETE_COMPOUNDS", payload: autoCompleteCompoundsList})
        dispatch({type: "SET_BIGG_ID_SELECTION", payload: biggIdSelectionList})

        setUnAnnotatedCompounds(unAnnotatedCompList)
        setAnnotatedCompounds(listOfSpecies.filter(species => !species.keggId.match(`K[0-9][0-9][0-9][0-9][0-9]`)))
    }, [state.general.isAnnotationPurpose])

    //each row in the modal is virtualized with react-window -> each row is respective for an unannotated Compound
    const AnnotationRow = (props) => {
        const {data, index, style} = props
        const unAnnotatedCompound = unAnnotatedCompounds[index];
        return (
            <div style={style}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "space-between",
                    marginTop: "5px",
                    height: "12vh"
                }}>
                    <div style={{
                        width: "32%",
                        overFlow: "auto"
                    }}>
                        {unAnnotatedCompound.sbmlId.concat("_" + unAnnotatedCompound.sbmlName)}
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
                    <div style={{width: "8%"}}>
                        <button
                            onClick={() => submitAnnotation(unAnnotatedCompound, autoCompleteCompoundsList[index], dispatch, setUnAnnotatedCompounds, index, unAnnotatedCompounds)} //state.general.annotation
                            className={"downloadButton"}>Submit{/*submit annotation*/}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const annotationModal = (
        <div className={classes.paper} style={{width: "80vw", height: "80vh", overflow: "auto"}}>
            <List itemCount={unAnnotatedCompounds.length}
                  itemData={data}
                  onItemsRendered={unAnnotatedCompounds}
                  useIsScrolling={false}
                  height={window.innerHeight * 0.5}
                  itemSize={window.innerHeight * 0.1}>{AnnotationRow}</List>
            <button onClick={() => {
                const newListOfSpecies = [];
                annotatedCompounds.map(compound => newListOfSpecies.push(compound))
                unAnnotatedCompounds.map(compound => newListOfSpecies.push(compound))
                submit(state, dispatch, newListOfSpecies)
            }} className={"downloadButton"} style={{width: "20vw"}}>finish
            </button>
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

