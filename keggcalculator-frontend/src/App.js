import React, {useEffect} from 'react';
import './App.css';
import Home from "./Components/Home/Home";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import CalculatorStore from "./Components/State Management/CalculatorStore";
import {Provider} from "mobx-react"
import ModuleStore from "./Components/State Management/ModuleStore";
import {useDispatch} from "react-redux";
import {host} from "./App Configurations/SystemSettings";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#941680'
        }
    }
})

function App() {

    const dispatch = useDispatch()
    useEffect(() => {
        const headerHeight = document.getElementsByClassName('MuiPaper-root MuiAppBar-root MuiAppBar-positionStatic MuiAppBar-colorPrimary MuiPaper-elevation4')[0].clientHeight;
        const tabHeight = document.getElementsByClassName("MuiTabs-root")[0].clientHeight
        dispatch({type: "SETHEADERHEIGHT", payload: +tabHeight + headerHeight})
    }, [])
    return (
        <Provider CalculatorStore={CalculatorStore} ModuleStore={ModuleStore}>
            <div className="App">
                <ThemeProvider theme={theme}>
                    <Home/>
                </ThemeProvider>
            </div>
        </Provider>
    );
}

export default App;
