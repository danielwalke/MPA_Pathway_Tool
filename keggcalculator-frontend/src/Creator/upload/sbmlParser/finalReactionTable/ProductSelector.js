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

const ProductSelector = (props) => {
    const state = useSelector(state => state)
    const classes = useStylesSelector()
    const [product, setProduct] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [editingMode, setEditingMode] = React.useState(false)
    const [products, setProducts] = React.useState([])
    const [newProductId, setNewProductId] = React.useState("") //setting sbml id
    const [newProductName, setNewProductName] = React.useState("") //setting sbml name
    const [newStoichiometry, setNewStoichiometry] = React.useState(1)
    const [newKeggName, setNewKeggName] = React.useState("")
    const [isChanged, setIsChanged] = React.useState(false)
    const [oldProducts, setOldProducts] = React.useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        setProducts(props.products)
        setOldProducts(props.products)
    }, [props, state.general.listOfReactions])

    const handleChanges = () => {
        const listOfReactions = state.general.listOfReactions.map(reaction => {
            if (props.reaction.keggId === reaction.keggId) {
                reaction.products = products
            }
            return reaction
        })
        setIsChanged(true)
        dispatch({type: "SETLISTOFREACTIONS", payload: listOfReactions})
    }

    const handleAddProduct = () =>{
        setEditingMode(false)
        let numberOfCompounds = products.length;
        state.general.listOfReactions.map(r => {
            numberOfCompounds += r.substrates.length
            numberOfCompounds += r.products.length
            return null;
        })
        const keggId = getCompoundId(numberOfCompounds);
        const newProduct = {
            sbmlId: newProductId,
            sbmlName: newProductName,
            keggId: newKeggName.length>1 ? newKeggName.substring(newKeggName.length-6,newKeggName.length) : keggId,
            stoichiometry: newStoichiometry.toString(),
            keggName: newKeggName.length>1 ? newKeggName : keggId,
        }
        setProducts([...products, newProduct])
    }
    return (
        <div>
            {editingMode ?
                <div>
                    <TextField label={"sbmlId"} size={"small"} onChange={(e) => setNewProductId(e.target.value)} value={newProductId}
                               variant={"outlined"} type={"text"}/>
                    <TextField label={"sbmlName"} size={"small"} onChange={(e) => setNewProductName(e.target.value)} value={newProductName}
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
                            handleAddProduct()
                        }}/>
                </div>
                : <div>
                    {products.map((prod, index) => <div key={"productList" + index}><Checkbox checked={isChanged || oldProducts.includes(prod)}/>{prod.sbmlId};{prod.sbmlName}:{prod.stoichiometry}</div>)}
                    <FormControl className={classes.formControl}>
                        <InputLabel id="productInput">products</InputLabel>
                        <Select
                            labelId="products"
                            id="products"
                            open={open}
                            onClose={() => setOpen(false)}
                            onOpen={() => setOpen(true)}
                            value={product.sbmlId}
                            onChange={(e) => setProduct(e.target.value)}
                        >
                            <MenuItem onClick={() => {
                                setEditingMode(true)
                                setIsChanged(false)
                            }} value={"addRequest"}><AddCircleIcon/></MenuItem>
                            {products.map((prod, index) => <MenuItem className={"CircleIcon"} onClick={() => {
                                products.splice(index, 1)
                                setProducts(products)
                            }} key={index.toString().concat(prod.sbmlId + ";" + prod.sbmlName +":" +prod.stoichiometry)} value={prod.sbmlId.concat(";" + prod.sbmlName +":" +prod.stoichiometry)}><DeleteIcon/>{prod.sbmlId};{prod.sbmlName}:{prod.stoichiometry}
                            </MenuItem>)}
                        </Select>
                    </FormControl>
                    <button style={{width:"10vw"}} className={"downloadButton"} onClick={() => handleChanges()}>submit changes</button>
                </div>}
        </div>
    )
}

export default ProductSelector