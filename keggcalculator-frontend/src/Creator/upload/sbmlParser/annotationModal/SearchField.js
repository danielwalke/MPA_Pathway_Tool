import TextField from "@material-ui/core/TextField";
import React, {useState} from "react";


const SearchField = (props) => {
    const [searchValue, setSearchValue] = useState('')

    const handleChange = (input) => {
        props.setFilterArray(props.array.filter(item => item.sbmlId.includes(input) || item.sbmlName.includes(input)))
    }

    return(
        <TextField label="Search"
                   variant={"outlined"}
                   size={"small"}
                   value={searchValue}
                   onChange={(e) => {
                       setSearchValue(e.target.value)
                       handleChange(e.target.value)
                   }}/>
    )
}

export default SearchField
