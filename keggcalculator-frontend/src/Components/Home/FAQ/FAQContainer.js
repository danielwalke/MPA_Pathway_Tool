import React, {useEffect, useState} from 'react';
import FAQ from "./FAQ";
import {Card, CardContent} from "@material-ui/core";

const FaqContainer = () => {
    const [creatorQuestionList, setCreatorQuestionList] = useState([])
    const [calculatorQuestionList, setCalculatorQuestionList] = useState([])

    const getNewQuestion = (answer, question, link) => ({question: question, answer: answer, link: link})
    const addNewCreatorQuestion = (question, answer, creatorQuestions, link) => creatorQuestions.push(getNewQuestion(answer, question, link))
    const addNewCalculatorQuestion = (question, answer, calculatorQuestions, link) => calculatorQuestions.push(getNewQuestion(answer, question, link))
    useEffect(() => {
        const creatorQuestions = []
        const calculatorQuestions = []
        addNewCreatorQuestion("My taxonomy wasn't added to the downloaded SBML-file", "Probably you have added a taxonomy, which is not defined by the NCBI-taxonomy.", creatorQuestions, "")
        addNewCreatorQuestion("My file was imported but I can't see the data-samples", "You can try another browser. Some browsers have limits for specific files, e.g. Google Chrome with 500MB.", creatorQuestions, "")
        addNewCreatorQuestion("Where can I find help?", "You can find a tutorial below, and a help-section in the Pathway-Creator", creatorQuestions, "")
        addNewCalculatorQuestion("I cant download my file.", "You might exceeded the access time of 30 minutes. You need to restart the calculation.", calculatorQuestions, "")
        addNewCalculatorQuestion("Where can I report a problem?", "You can report any issue ", calculatorQuestions, "https://github.com/danielwalke/MPA_Pathway_Tool/issues/new")
        addNewCreatorQuestion("Where can I report a problem?", "You can report any issue ", creatorQuestions, "https://github.com/danielwalke/MPA_Pathway_Tool/issues/new")
        setCreatorQuestionList(creatorQuestions)
        setCalculatorQuestionList(calculatorQuestions)
    }, [])

    return (
        <div style={{width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px"}}>
            <Card><CardContent><FAQ name={"Pathway-Creator"} questionList={creatorQuestionList}/></CardContent></Card>
            <Card><CardContent><FAQ name={"Pathway-Calculator"}
                                    questionList={calculatorQuestionList}/></CardContent></Card>
        </div>
    );
};

export default FaqContainer;
