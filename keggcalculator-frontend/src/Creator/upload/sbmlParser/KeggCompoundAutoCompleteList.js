/*
this component is responsible for showing all keggcompounds (more then 29000) with an appropriate performance
 */

import React, {useEffect} from 'react';
import {Autocomplete} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {VariableSizeList} from "react-window";
import {makeStyles} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";

export const useStylesList = makeStyles({
    listbox: {
        boxSizing: 'border-box',
        '& ul': {
            padding: 0,
            margin: 0,
        },
    },
});

export const LISTBOX_PADDING = 8; // px

export const renderRow = (props) => {
    const {data, index, style} = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: style.top + LISTBOX_PADDING,
        },
    });
}

export const OuterElementContext = React.createContext({});

export const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

export const useResetCache = (data) => {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}

// Adapter for react-window
export const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
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
                            window.innerHeight * 0.07 * Math.ceil(compoundName.length / 50)
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

const KeggCompoundAutoCompleteList = (props) => {
    const dispatch = useDispatch()
    const state = useSelector(state => state)
    const classes = useStylesList();

    const [completeCompoundList, setCompleteCompoundList] = React.useState([])

    useEffect(() => {
        setCompleteCompoundList(Object.values(state.general.compoundId2Name))
    }, [state.general.isAnnotationPurpose])

    return (
            <Autocomplete
            onChange={(event, value) => {
                // sets "autoCompounds" and updates the global state
                props.data[props.index] = value;
                dispatch({type: "SET_AUTO_COMPLETE_COMPOUNDS", payload: props.data})

                // props.setAutoCompounds(props.autoCompounds)
            }} //dispatch({type:"SETANNOTATION", payload: value})
            id="AnnotationSelector"
            style={{width: "50%"}}
            value={props.data[props.index]}
            classes={classes}
            ListboxComponent={ListboxComponent}
            options={completeCompoundList}
            renderInput={(params) => (
                <TextField {...params} variant="outlined" label="KEGG Compound"/>)}
            />
    );
};

export default KeggCompoundAutoCompleteList;
