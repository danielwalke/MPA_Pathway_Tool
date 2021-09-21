import React from 'react';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {makeStyles} from "@material-ui/core/styles";
import {ToolTipBig} from "../../main/user-interface/UserInterface";

const useStyles = makeStyles(() => ({
    formControl: {
        width: "80%",
    }
}));


const LabelPositionChanger = (props) => {
    const {compound} = props
    const classes = useStyles()
    const [labelPos, setLabelPos] = React.useState("right")
    const options = ["top", "right", "bottom", "left"]
    // const graphState = useSelector(state=> state.graph)

    const handleLabelPositionChange = (e) => {
        setLabelPos(e.target.value)
        compound.labelPosition = e.target.value
    }

    return (
        <div>
            <br/>
            <div>Label-position</div>
            <FormControl style={{margin: "2px 0"}} size="small" variant="outlined" className={classes.formControl}>
                <ToolTipBig title={"Select a position for the node label"} placement={"right"}>
                    <Select
                        labelId="label position"
                        value={labelPos}
                        onChange={(e) => handleLabelPositionChange(e)}
                    >
                        {options.map(labelPosition => <MenuItem value={labelPosition}>{labelPosition}</MenuItem>
                        )}
                    </Select>
                </ToolTipBig>
            </FormControl>
        </div>
    );
};

export default LabelPositionChanger;
