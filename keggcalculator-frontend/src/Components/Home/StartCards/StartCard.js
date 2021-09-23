import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {Link} from "react-router-dom";

const useStyles = makeStyles({
    root: {
        minWidth: 275,
    }
});

const StartCard = (props) => {
    const {title, text, link, changeState} = props
    const classes = useStyles()
    return (
        <div>
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        {title}
                    </Typography>
                    <Typography variant="body2" component="p">
                        {text}
                    </Typography>
                </CardContent>
                {props.link ? <CardActions>
                    <Button size="small" onClick={() => {
                        changeState("selectedTab", link)
                    }}><Link to={link} style={{textDecoration: "none", color: "rgb(0,0,0)"}}>Try It</Link></Button>
                </CardActions> : <div></div>}
            </Card>
        </div>
    );
};

export default StartCard;
