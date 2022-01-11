import React, {useEffect, useState} from 'react';
import Question from "./Question";
import Typography from "@material-ui/core/Typography";


const FAQ = (props) => {
    const {name, questionList} = props
    const [listOfQuestions, setListOfQuestions] = useState([])

    useEffect(() => {
        setListOfQuestions(questionList)
    }, [props, questionList])
    return (
        <div style={{width: "100%"}}>
            <Typography style={{margin: "2px 0"}} variant="h6" component="h3">{name}</Typography>
            {listOfQuestions.map((question, index) => <Question index={index + 1}
                                                                panelId={"panel".concat((index + 1).toString())}
                                                                question={question.question}
                                                                answer={question.answer}
                                                                link={question.link}/>)}
        </div>
    );
};

export default FAQ;
