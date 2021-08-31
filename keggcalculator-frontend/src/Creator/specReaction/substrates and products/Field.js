import Autocomplete from "@material-ui/lab/Autocomplete";
import {getCompName} from "../../keggReaction/substrate and products/substrate/CompName";
import TextField from "@material-ui/core/TextField";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const Field = (props) => {
    const [component, setComponent] = React.useState(props.compound)
    const generalState = useSelector(state => state.general)
    const dispatch = useDispatch()

    const handleAutoChange = (e, dispatchType, dispatchTypeOptions, compound) => {

        const {value} = e.target
        setComponent(value)
        dispatch({type: dispatchType, payload: value})
        if (compound) {
            dispatch({
                type: dispatchTypeOptions,
                payload: getCompName(generalState.compMap).filter(comp => comp.toLowerCase().indexOf(compound.toLowerCase()) > -1)
            })
        }
    }

    return (
        <div >
            {(component && component.length > 2) || props.boolean ?
                <ToolTipBig title={"Search a metabolite"} placement={"left"}><Autocomplete
                    size={"small"}
                    id={`combo-box-1 ${props.dispatchType}`}
                    options={props.options}
                    name={props.dispatchType}
                    onChange={(event, value) => {
                        dispatch({type: props.dispatchType, payload: value})
                    }}
                    renderInput={params => (
                        <TextField
                            onChange={(e) => handleAutoChange(e, props.dispatchType, props.dispatchTypeOptions, component)}
                            value={component}
                            {...params}
                            label={`${props.dispatchType.substring(11, props.dispatchType.length)}`}
                            variant="outlined"
                        />
                    )}
                /></ToolTipBig> :
                <ToolTipBig title={"Type in the first 3 letters of a metabolite"} placement={"left"}><Autocomplete
                    id={`combo-box-0 ${props.dispatchType}`}
                    size={"small"}
                    options={["Type in..."]}
                    renderInput={params => (
                        <TextField
                            name={props.dispatchType}
                            onChange={(e) => handleAutoChange(e, props.dispatchType, props.dispatchTypeOptions, component)}
                            value={component}
                            {...params}
                            label="Type in three letters..."
                            variant="outlined"
                        />
                    )}
                /></ToolTipBig>
            }
        </div>
    )
}

export default Field
