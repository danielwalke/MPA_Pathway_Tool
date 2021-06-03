import React, {useEffect, useState} from 'react';
import Question from "./Question";




const FAQ = (props) => {
    const {name, questionList} = props
    const [listOfQuestions, setListOfQuestions] = useState([])

    useEffect(() => {
        setListOfQuestions(questionList)
    }, [props, questionList])
    return (
        <div style={{width: "100%"}}>
            <h3>{name}</h3>
            {listOfQuestions.map((question, index) => <Question index={index+1} panelId={"panel".concat((index+1).toString())}
                                                                question={question.question}
                                                                answer={question.answer}/>)}
        </div>
    );
};

export default FAQ;