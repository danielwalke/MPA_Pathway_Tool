import React, {useEffect, useState} from 'react';
import {Autocomplete} from "@material-ui/lab";
import {TextField} from "@material-ui/core";
import {useDispatch, useSelector} from "react-redux";
import {VariableSizeList} from "react-window";
import {
    OuterElementContext,
    OuterElementType,
    renderRow,
    useResetCache, useStylesList
} from "../upload/sbmlParser/KeggCompoundAutoCompleteList";


const TaxonomyNcbi = (props) => {
    const [taxonomyListNcbiFiltered, setTaxonomyListNcbiFiltered] = useState([]);
    const state = useSelector(state => state)
    const dispatch = useDispatch()

    useEffect(()=>{
        const taxonomyNcbiList = state.taxonomy.taxonomyNcbiList
        const taxonomicRank = state.general.taxonomicRank
        const filteredTaxonomyListFiltered = taxonomyNcbiList.filter(taxonomy => taxonomy.taxonomicRank === taxonomicRank)
        setTaxonomyListNcbiFiltered(filteredTaxonomyListFiltered)
    },[state.taxonomy.taxonomyNcbiList, state.general.taxonomicRank])

    const handleAutoChange = (e) => {
        const {value} = e.target
        dispatch({type: props.dispatchTaxonomy, payload: value})
         setTaxonomyListNcbiFiltered(taxonomyListNcbiFiltered.filter(taxonomy => taxonomy.taxonomicName.toLowerCase().indexOf(value.toLowerCase()) > -1))
        }


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
                        itemSize={() => 50}
                        overscanCount={5}
                        itemCount={itemCount}
                    >
                        {renderRow}
                    </VariableSizeList>
                </OuterElementContext.Provider>
            </div>
        );
    });


    const classes = useStylesList()
    return (
        <div>
            {state.general.taxonomicRank !== "species" || props.taxonomy.length>4? <Autocomplete
                ListboxComponent={ListboxComponent}
                disableListWrap
                classes={classes}
                size={"small"}
                id="taxonomyBox"
                options={taxonomyListNcbiFiltered.map(taxonomy => taxonomy.taxonomicName)}
                name={"taxonomy"}
                onChange={(event, value) => {
                    dispatch({type: props.dispatchTaxonomy, payload: value})
                }}
                renderInput={params => (
                    <TextField
                        onChange={(event) => dispatch({type: props.dispatchTaxonomy, payload: event.target.value})}
                        value={props.taxonomy}
                        {...params}
                        label="taxonomy"
                        variant="outlined"
                    />
                )}
            />:
                <TextField type={"text"} onChange={(event) => handleAutoChange(event)} style={{width:"100%"}}
                           value={props.taxonomy} label={"type in 5 letters of your species"}/>
            }
        </div>
    );
};

export default TaxonomyNcbi;
