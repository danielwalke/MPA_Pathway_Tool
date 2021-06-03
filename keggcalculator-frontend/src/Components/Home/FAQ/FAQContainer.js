import React, {useEffect, useState} from 'react';
import FAQ from "./FAQ";

const FaqContainer = () => {
    const [creatorQuestionList, setCreatorQuestionList] = useState([])
    const [calculatorQuestionList, setCalculatorQuestionList] = useState([])

    const getNewQuestion = (answer, question) => ({question: question, answer: answer})
    const addNewCreatorQuestion = (question, answer, creatorQuestions) => creatorQuestions.push(getNewQuestion(answer, question))
    const addNewCalculatorQuestion = (question, answer,calculatorQuestions) => calculatorQuestions.push(getNewQuestion(answer, question))

    useEffect(() => {
        const creatorQuestions= []
        const calculatorQuestions= []
        addNewCreatorQuestion("My file was imported but I can't see the data-samples", "You can try another browser. Some browsers have limits for specific files, e.g. Google Chrome with 500MB.",creatorQuestions)
        addNewCreatorQuestion("Where can I find help?", "You can find a tutorial below, and a help-section in the Pathway-Creator",creatorQuestions)
        addNewCalculatorQuestion("I cant download my file.", "You might exceeded the access time of 30 minutes. You need to restart the calculation.",calculatorQuestions)
        setCreatorQuestionList(creatorQuestions)
        setCalculatorQuestionList(calculatorQuestions)
    }, [])

    return (
            <div style={{width:"100%", display:"grid", gridTemplateColumns: "1fr 1fr", gap:"5px"}}>
                <div><FAQ name={"Pathway-Creator"} questionList={creatorQuestionList}/></div>
                <div><FAQ name={"Pathway-Calculator"} questionList={calculatorQuestionList}/></div>
            </div>
    );
};

export default FaqContainer;