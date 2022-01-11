import TextField from "@material-ui/core/TextField";
import React, {useState} from "react";
import CloseIcon from "@material-ui/icons/Close";
import "../../main/Buttons.css"
import IconButton from "@material-ui/core/IconButton";
import {withStyles} from "@material-ui/core";

const deleteButton = (onClickHandler) => {
    return (
        <IconButton style={{height: "2rem", width: "2rem"}} onClick={() => onClickHandler()}>
            <CloseIcon/>
        </IconButton>
    )
}

const SearchField = (props) => {
    const [searchValue, setSearchValue] = useState('')

    const handleChange = (input) => {
        props.setFilterBy(input)
    }

    const handleDelete = () => {
        setSearchValue("")
        handleChange("")
    }

    return(
        <TextField
            hiddenLabel
            placeholder={"Search"}
            variant={"outlined"}
            size={"small"}
            value={searchValue}
            InputProps={{
                endAdornment: deleteButton(handleDelete),
                style: {height: "2rem"}}}
            onChange={(e) => {
                setSearchValue(e.target.value)
                handleChange(e.target.value)
            }}
            style={{height: "2rem"}}
        />
    )
}

export default SearchField
