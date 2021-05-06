import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import Modal from "@material-ui/core/Modal";
import {useEffect, useState} from "react";
import {FixedSizeList as List} from "react-window";
import {VariableSizeList} from "react-window"
import {makeStyles} from '@material-ui/core/styles';
import {useStyles as modalStyles} from "../ModalStyles/ModalStyles";
import PropTypes from 'prop-types';
import {
    drawGraphFromSbml,
    getReactionsFromSbml,
    getSpeciesInformation,
    setReactionList
} from "../download/SbmlDownloadFunctions";

//TODO remove state.sbmlCompound,
const submitCompound = (species, dispatch, speciesSBML, compounds, generalState, index) => {
    const keggSpeciesList = speciesSBML.filter(species => species.keggAnnotations.length > 0)
    keggSpeciesList.map(species => species.id = species.keggAnnotations[0].substring(species.keggAnnotations[0].length - 6, species.keggAnnotations[0].length))
    keggSpeciesList.map(species => species.compoundName = generalState.compoundId2Name[species.compoundId])
    console.log(compounds)
    console.log(keggSpeciesList)
    compounds.map(compound => keggSpeciesList.push(compound))
    dispatch({type:"SETANNOTATEDSPECIESLIST",payload: keggSpeciesList} )
}

const useStylesList = makeStyles({
    listbox: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0,
        },
    },
});

const LISTBOX_PADDING = 8; // px

function renderRow(props) {
    const {data, index, style} = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: style.top + LISTBOX_PADDING,
        },
    });
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

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
                            window.innerHeight * 0.05 * Math.ceil(compoundName.length / 50)
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

ListboxComponent.propTypes = {
    children: PropTypes.node,
};

const getSpeciesIds = (reactionCompounds, speciesList, list) =>{
    console.log(reactionCompounds)
    for(const compound of reactionCompounds){
        const species = speciesList.filter(species => species.id === compound.id)[0]
        species.stoichiometry = compound.stoichiometry
        list.push(species)
    }
    return list
}

const addSpeciesInformation = (reactions, species) => {

    for(const reaction of reactions){
        reaction.substrateObjects = getSpeciesIds(reaction.substrates, species, reaction.substrateObjects)
        reaction.productObjects = getSpeciesIds(reaction.products, species, reaction.productObjects)
    }
}

const submitAnnotatedData = (state, dispatch,graphState) =>{
    const {reactions,unAnnotatedReactions} = getReactionsFromSbml(state.sbmlObject) //get reactions and their links
    const reactionObjects = getSpeciesInformation(reactions, state.sbmlObject) // get for each compound in eacch reaction the information about compounds
    const unAnnotatedReactionsObjects = getSpeciesInformation(unAnnotatedReactions, state.sbmlObject)
    state.annotatedSbmlSpecies.length>0 && addSpeciesInformation(reactionObjects, state.annotatedSbmlSpecies)
    state.annotatedSbmlSpecies.length>0 && addSpeciesInformation(unAnnotatedReactionsObjects, state.annotatedSbmlSpecies)
    reactionObjects.length>0 && setReactionList(reactionObjects, dispatch)
    unAnnotatedReactionsObjects.length>0 && setReactionList(unAnnotatedReactionsObjects, dispatch)
    let data = {nodes: [], links: []}
    data = drawGraphFromSbml(reactionObjects, data,graphState)
    data = drawGraphFromSbml(unAnnotatedReactionsObjects, data,graphState)
    const allReactions = data.nodes.filter(node => node.symbolType ==="diamond")
    console.log(allReactions.length + " reactions found")
    console.log(data)
    dispatch({type:"SETDATA", payload:data})
    dispatch({type: "SWITCHISMODULEIMPORT"})
    dispatch({type: "SETLOADING", payload: false})
    dispatch({type:"SWITCHSHOWSBMLKEGGCONVERTER"})
}


const SBMLKEGGConverter = (props) => {
    const generalState = useSelector(state => state.general)
    const [options, setOptions] = useState([])
    const [compounds, setCompounds] = useState([])
    const [filteredSpecies, setFilteredSpecies] = useState([])
    const {speciesSBML, reactionsSBML, showSbmlKeggConverter} = props
    const state = useSelector(state => state.keggReaction)
    const dispatch = useDispatch()
    const classesModal = modalStyles()
    const classes = useStylesList()


    useEffect(() => {
        const compoundList = Object.values(state.compoundId2Name)
        setOptions(compoundList)
    }, [state.sbmlSpecies])

    useEffect(()=>{
        let filteredSpeciesList = speciesSBML.filter(species => species.keggAnnotations.length === 0)
        const emptyCompounds = filteredSpeciesList.map(species => ({id:species.id, name:species.name, compoundId: species.id, compoundName:species.name})) //species.name //""
        setCompounds(emptyCompounds)
        console.log(emptyCompounds)
        setFilteredSpecies(filteredSpeciesList)
    },[speciesSBML] )


    const Row = ({index, style}) => (
        <div style={style}>
            <div style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "start",
                marginTop: "5px"
            }}>
                <div style={{width: "20%", overFlow: "auto"}}>{filteredSpecies[index].id} {filteredSpecies[index].name}:</div>
                <div style={{width: "65%"}}>
                    <Autocomplete
                        onChange={(event,value)=> setCompounds(exchangeAt(index, value, compounds,filteredSpecies[index]))}
                        id="AnnotationSelector"
                        style={{width: "70%"}}
                        disableListWrap
                        classes={classes}
                        value={compounds[index].compoundName}
                        ListboxComponent={ListboxComponent}
                        options={options}
                        renderInput={(params) => <TextField {...params} variant="outlined" label="KEGG Compound" />}
                    />
                </div>
                <div style={{width: "15%"}}>
                    <button
                        onClick={() => submitCompound(filteredSpecies[index], dispatch, speciesSBML, compounds , generalState, index)}
                        className={"downloadButton"}>Submit
                    </button>
                </div>
            </div>
        </div>
    );
    const graphState = useSelector(state => state.graph)
    const body = (<div style={{width: "70vw", backgroundColor: "white", height: "70vh", overflow: "auto"}}>
        <List itemCount={filteredSpecies.length} onItemsRendered={filteredSpecies} height={window.innerHeight * 0.5}
              itemSize={window.innerHeight * 0.1} widrh={300}>{Row}</List>
        <button className={"downloadButton"} onClick={() => submitAnnotatedData(state, dispatch,graphState)}>Submit</button>
    </div>)

    return (
        <div>

            <Modal className={classesModal.modal} open={showSbmlKeggConverter}>
                {body}
            </Modal>

        </div>
    )
}

const exchangeAt = (index, item, array, species) => {
    const lastItems = array.filter((item,arrayIndex)=> arrayIndex>index)
    const newArray = array.filter((item, arrayIndex) => arrayIndex<index)
    const itemObject = {
        name: species.name,
        id: item.substring(item.length-6, item.length),
        compoundName: item
    }
    newArray.push(itemObject)
    lastItems.map(item => newArray.push(item))
    return newArray
}

export default SBMLKEGGConverter