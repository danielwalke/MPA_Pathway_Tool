import {makeStyles} from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    paper: {
        backgroundColor: "white",
        fontFamily: "Roboto",
        // border: '2px solid rgb(150, 25, 130)',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(4, 4, 4),
        borderRadius: "10px 10px 10px 10px",
    }
}));
