import React, {useEffect} from 'react';
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '10%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

const Question = (props) => {
    const {panelId, index, answer, question,link} = props
    const [expanded, setExpanded] = React.useState(false)

    const handleChange = (panel) => (e, isExpanded) =>{
        setExpanded(isExpanded ? panel : false)
    }

    const classes = useStyles()
    return (
        <Accordion expanded={expanded === panelId} onChange={handleChange(panelId)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
            >
                <Typography className={classes.heading}>{index}) </Typography>
                <Typography className={classes.secondaryHeading}>{question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    {answer}
                    {link.length>0 && <a href={link}>here.</a>}
                </Typography>
            </AccordionDetails>
        </Accordion>
    );
};

export default Question;