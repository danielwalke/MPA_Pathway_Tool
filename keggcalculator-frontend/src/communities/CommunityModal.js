import React, {useState} from 'react';
import "./CommunityCss.css"
import {useDispatch, useSelector} from "react-redux";
import DropZone from "./DropZone";
import {handleJSONGraphUpload} from "../Creator/upload/json upload/ModuleUploadFunctionsJSON";

const CommunityModal = () => {
    const communityState = useSelector(state => state.communities)
    const [files, setFiles] = useState([])
    const dispatch = useDispatch()

    const uploadPathway = files => {
        setFiles(files)
        let reader = new FileReader()
        reader.readAsText(files[0])
        reader.onload = e => {
            const result = e.target.result.trim()
            try {
                const reactions = JSON.parse(result)
                const {nodes, links} = handleJSONGraphUpload(reactions, dispatch, {})
            } catch (e) {
                console.error(e)
            }
        }
    }

    return (
        <div className={"center white"}>
            {communityState.nodeId &&
            <div>
                {communityState.nodeId}
             <DropZone uploadPathway={uploadPathway} files={files}/>
            </div>}
        </div>
    );
};

export default CommunityModal;
