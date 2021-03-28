import React from 'react';
import './App.css';
import Home from "./Components/Home/Home";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import CalculatorStore from "./Components/State Management/CalculatorStore";
import {Provider} from "mobx-react"
import ModuleStore from "./Components/State Management/ModuleStore";

const theme = createMuiTheme({
    palette:{
        primary:{
            main: '#941680'
        }
    }
})

function App() {

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
