import {host} from "../../../App Configurations/SystemSettings";

const exit = () => "Are you sure you want to exit?"

export const dontTriggerWindowExitWarning = () => window.onbeforeunload = exit

export const triggerLoadingWarning = dispatch => dispatch({type: "SWITCHLOADING"})

export const isHostLocalHost = host === "http://127.0.0.1"
