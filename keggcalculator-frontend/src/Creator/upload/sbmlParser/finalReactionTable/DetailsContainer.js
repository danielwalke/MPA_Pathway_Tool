import React, {useEffect, useState} from 'react';
import Modal from "@material-ui/core/Modal";
import {useStyles} from "../../../ModalStyles/ModalStyles";
import {useDispatch, useSelector} from "react-redux";
import "../SBML.css"
import SbmlIdChanger from "./SbmlIdChanger";
import SbmlNameChanger from "./SbmlNameChanger";
import clonedeep from "lodash/cloneDeep";
import ReactionKeggIdSelector from "../ReactionKeggIdSelector";
import {requestGenerator} from "../../../request/RequestGenerator";
import {endpoint_getReactionsFromCompounds} from "../../../../App Configurations/RequestURLCollection";
import EcSelector from "./ECSelector";

const CreateCompoundString = (compoundObject) => {
    let compoundArray = []
    compoundObject.forEach((compound) => {
            compoundArray.push(compound.sbmlName)
        }
    )
    return compoundArray.join(", ")
}

const DetailsContainer = (props) => {
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    const [previousListOfReactions, setpreviousListOfReactions] = useState({})
    const listOfReactions = state.general.listOfReactions

    const substrateString = CreateCompoundString(props.rowInfo.substrates)
    const productsString = CreateCompoundString(props.rowInfo.products)
    const ecString = props.rowInfo.ecNumbers.join(", ")
    const kString = props.rowInfo.koNumbers.join(", ")

    useEffect(() => {
        setpreviousListOfReactions(clonedeep(listOfReactions))
    }, [])

    useEffect(() => {
        // retrieve reaction information from compounds when the selected row is changed
        const reaction = props.rowInfo
        const compounds = [...reaction.substrates, ...reaction.products]
        let compoundIdString = []

        compounds.forEach(compound => {
            if (compound.keggId && compound.keggId.startsWith('C')) {
                compoundIdString.push(compound.keggId)
            }
        })

        compoundIdString = compoundIdString.join(";")

        requestGenerator("POST",
            endpoint_getReactionsFromCompounds,
            {compoundIds: compoundIdString},
            "", "").then(resp => {
                dispatch({type: "SET_ANNOATION_OPTIONS", payload: resp.data})
                console.log(resp.data)
            }
        )
    }, [props.index])

    return (
        <div style={{display: "flex", flexDirection: "row"}}>
            <div style={{width: "50%", display: "flex", flexDirection: "column", padding: "1em", justifyContent: "space-between"}}>
                <SbmlIdChanger reactionRowInfo={props.rowInfo}
                               listOfReactions={listOfReactions}
                               index={props.index}/>
                <SbmlNameChanger reactionRowInfo={props.rowInfo}
                                 listOfReactions={listOfReactions}
                                 index={props.index}/>
                <ReactionKeggIdSelector reactionRowInfo={props.rowInfo}
                                        listOfReactions={listOfReactions}
                                        index={props.index}/>
                <EcSelector reactionRowInfo={props.rowInfo}
                            listOfReactions={listOfReactions}
                            index={props.index}/>
            </div>
            <div style={{width: "50%", display: "flex", flexDirection: "column", padding: "1em"}}>
                <p>{props.rowInfo.sbmlId}</p>
                <p>{props.rowInfo.sbmlName}</p>
                <p>KEGG ID: {props.rowInfo.keggId}</p>
                <p>Substrates: {substrateString}</p>
                <p>Products: {productsString}</p>
                <p>EC Numbers: {ecString}</p>
                <p>K Numbers: {kString}</p>
            </div>
        </div>

    )
}

export default DetailsContainer

{/*<TableRow>*/
}
{/*    <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={5}>*/
}
{/*        <Collapse in={open} timeout="auto" unmountOnExit>*/
}
{/*            <div style={{display: "flex", flexDirection: "row", padding: "0.3em"}}>*/
}
{/*

{/*            /!*<div><KoSelector reaction={reaction} koNumbers={reaction.koNumbers}/></div>*!/*/
}
{/*            /!*<div><SubstrateSelector reaction={reaction} index={index} substrates={reaction.substrates}/>*!/*/
}
{/*            /!*</div>*!/*/
}
{/*            /!*<div><ProductSelector reaction={reaction} index={index} products={reaction.products}/></div>*!/*/
}
{/*            /!*<div>{reaction.keggId}*!/*/
}
{/*            /!*    <div data-tooltip={"reset reaction"} className={"CircleIcon"}*!/*/
}
{/*            /!*         onClick={() => handleRestoreReaction(reactionClone)}><RestoreIcon/>*!/*/
}
{/*            /!*    </div>*!/*/
}
{/*            /!*</div>*!/*/
}
{/*        </Collapse>*/
}
{/*    </TableCell>*/
}
{/*</TableRow>*/
}
