import React from "react";
import {Graph} from "react-d3-graph";
import {useDispatch, useSelector} from "react-redux";

import {handleSubmit} from "../../../Creator/keggReaction/substrate and products/SubmitHandler";
import clonedeep from "lodash/cloneDeep"
import Modal from "@material-ui/core/Modal";

const Fluxrate = () => {




    return (
        <div>
            <Modal className={classes.modal} open={state.showAbbreviations}
                   onClose={() => dispatch({type: "SWITCHSHOWABBREVIATIONS"})}>
                {body}
            </Modal>
        </div>
    )
}

export default Fluxrate