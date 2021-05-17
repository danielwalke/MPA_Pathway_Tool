import Modal from "@material-ui/core/Modal";
import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {useStyles} from "../../ModalStyles/ModalStyles";

const UserInfo = () => {
    const generalState = useSelector(state => state.general)
    const dispatch = useDispatch()
    const classes = useStyles()

    const body = (
        <div className={classes.paper}>
            <h1>Help</h1>
            <p>If you have any questions look into our <b>FAQ</b> or use the <b>tutorial</b> (link)</p>
            <h2>Upload section</h2>
            <p>You can upload your <b>experimental data</b> by clicking on
                You can upload your <b>pathway</b> by clicking on</p>

            <h2>Single reaction</h2>
            <p>You can choose between a <b>KEGG reaction</b> () and a <b>user-defined reaction</b> (). You need to define your desired substrate, product and the appropriate reaction.</p>

            <h2>Multiple reaction</h2>
            <p>You can import <b>multiple reactions</b> all at one by using import multiple reactions.
                There you can decide whether you want to import a complete <b>KEGG Module</b>, import multiple <b>EC- numbers</b> or multiple K- numbers.</p>

            <h2>Download</h2>
            <p>You can download all information by using Download. You can choose between downloading your pathway as <b>CSV</b>, <b>SBML</b>, and <b>JSON</b>.
                You can also download your pathway as an <b>SVG</b> and your mapped data as <b>CSV</b>.</p>

                <h2>Visualisation</h2>
            <p>Picture with compound node, reaction node and edge explanation
            By clicking a compound node you can <b>add a new reaction</b> from KEGG.
            By clicking a reaction node you get <b>information</b> like the equation, ec and K numbers. It also provides a <b>detailed heatmap</b> for the samples.
            By double clicking any node you can receive information about the compound like its <b>structure</b> or <b>reaction equation</b> and you can choose whether the compound is a <b>key metabolite</b> or not (reduced Opacity if chosen).
            By right clicking any node you can <b>delete</b> it
                By clicking on an <b>edge</b> you can reduce their Opacity.</p>

            <h2>Configurarions</h2>
            <p>You can enable or disable a <b>force</b> on your created nodes.
            If you want to <b>separate nodes</b> with multiple edges you can split them by using Separate nodes.
                If you want to change the labels of your created nodes you can set <b>abbreviations</b> using Abbreviations.</p>

            <h2>Mapping</h2>
            <p>You can define your minimum, maximum and the midpoint of your heatmap and then <b>map data</b> of individual samples by clicking on the corresponding button.
                For information of mapped data of all samples you can click on the respective reaction (see Visualisation).
                You can also download the mapped data by clicking <b>download heatmap</b>. (see download)</p>
            {/*<img width={"300vw"} src={Mouse} alt={"description"}/>*/}
            {/*<br/>*/}
            {/*<ReactPlayer url={Video} playing={true} loop={true}/>*/}
        </div>
    )

    return (
        <Modal open={generalState.showUserInfo} style={{margin:"10vh", height: "80vh", overflow: "auto"}}
               onClose={() => dispatch({type: "SWITCHSHOWUSERINFO"})}>
            {body}
        </Modal>
    )
}

export default UserInfo