import React, {Component} from "react";
import NavigationBar from "../Header/NavigationBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import SvgIcon from "@material-ui/core/SvgIcon";
import CreateIcon from '@material-ui/icons/Create';
import HomeIcon from '@material-ui/icons/Home';
import {BrowserRouter, NavLink, Route, Switch} from "react-router-dom"
import UploadPanel from "../Module Calculator/UploadPanel";
import {requestGenerator} from "../../Request Generator/RequestGenerator";
import {endpoint_getCompoundList} from "../../App Configurations/RequestURLCollection";
import {inject, observer} from "mobx-react";
import App from "../../Creator/main/App"
import Start from "./Start";
import {makeStyles} from "@material-ui/core";
import {getLastItemOfList} from "../../Creator/usefulFunctions/Arrays";
import {Redirect} from 'react-router'
import {host} from "../../App Configurations/SystemSettings";
import Footer from "../Footer/Footer";

class Home extends Component {

    constructor(props) {
        super(props);
        const lastTab = "home"//this.getLastTab(window.location.href)
        this.state = {
            selectedTab: `/${lastTab}`,
            reload: true,
        }
        this.changeState = this.changeState.bind(this)
        this.getLastTab = this.getLastTab.bind(this)
    }

    getLastTab = (url) => {
        const urlEntries = url.split("/")
        return getLastItemOfList(urlEntries)
    }

    componentDidMount() {
        //TODO: delete the following line after fixing haproxy error
        if (host !== "http://127.0.0.1") window.location.href = 'http://141.44.141.132:9001/home'
        requestGenerator("GET", endpoint_getCompoundList, "", "").then(response => {
            this.props.ModuleStore.addCompounds(response.data);
        })
        this.changeState("reload", false)
    }

    changeState(stateName, value) {
        this.setState({[stateName]: value})
    };

    render() {
        return (
            <div>
                <header>
                    <NavigationBar/>
                </header>
                <main>
                    <div style={{borderRadius: "0", background: "#941680"}}>
                        <div style={{borderRadius: "30px 30px 0 0", background: "white"}}>
                            <BrowserRouter>
                                <CustomTabs state={this.state} changeState={this.changeState}/>
                                <Switch>
                                    {this.state.reload ? <Redirect to={"/home"} target="_blank"/> : null}
                                    {/*<div><h3 style={{margin: "5% 0 0 0"}}>Under Construction</h3> <img style={{width: "70%", padding: "3%"}} src={underConstruction}/></div>*/}
                                    <Route path={"/home"}><Start changeState={this.changeState}/></Route>
                                    <Route path={"/creator"}><App changeState={this.changeState}/></Route>
                                    <Route path={"/calculator"}> <UploadPanel changeState={this.changeState}/></Route>
                                </Switch>
                            </BrowserRouter>
                        </div>
                    </div>
                </main>
                {this.state.selectedTab === "/home" && <footer>
                    <Footer/>
                </footer>}
            </div>
        );
    }
}

export default inject("ModuleStore")(observer(Home));

const CustomTabs = (props) => {
    const useStyles = makeStyles({
        indicator: {
            backgroundColor: "rgb(150, 25, 130)",
            height: "5px"
        }
    })
    const classes = useStyles()
    const {state, changeState} = props
    return (
        <Tabs variant={"fullWidth"} textColor={"primary"} indicatorColor={"primary"} orientation={"horizontal"}
              scrollButtons={"auto"}
              classes={
                  {indicator: classes.indicator}
              }
              value={state.selectedTab}
              onChange={(event, tabValue) => changeState("selectedTab", tabValue)}>
            <Tab icon={<HomeIcon/>} to={"/home"}
                 value={"/home"} label={"Home"} component={NavLink}/>
            <Tab icon={<CreateIcon/>} to={"/creator"}
                 value={"/creator"} label={"Pathway-Creator"} component={NavLink}/>
            <Tab icon={<SvgIcon>
                <path xmlns="http://www.w3.org/2000/svg"
                      d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M13.03,7.06L14.09,6l1.41,1.41 L16.91,6l1.06,1.06l-1.41,1.41l1.41,1.41l-1.06,1.06L15.5,9.54l-1.41,1.41l-1.06-1.06l1.41-1.41L13.03,7.06z M6.25,7.72h5v1.5h-5 V7.72z M11.5,16h-2v2H8v-2H6v-1.5h2v-2h1.5v2h2V16z M18,17.25h-5v-1.5h5V17.25z M18,14.75h-5v-1.5h5V14.75z"/>
            </SvgIcon>}
                 value={"/calculator"} label={"Pathway-Calculator"}
                 to={"/calculator"} component={NavLink}
            />
        </Tabs>
    )
}
