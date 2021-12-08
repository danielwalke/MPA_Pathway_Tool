import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {handleChangeInput} from "./NewDataCreator";


export const dataBuilder = (counter, fbaState, dispatch, nodePrev) =>{

        var counter1 = fbaState.data_circular.nodes.length
        const {nodes, links} = handleChangeInput(fbaState, counter1, nodePrev);
        const data = {nodes: nodes, links: links}

        function removeDups(names) {
            let unique = {};
            names.forEach(function(i) {
                if(!unique[i]) {
                unique[i] = true;
                }
            });
            return Object.keys(unique);
        }

        if(fbaState.data_circular.nodes.length > 0){
            const old_data = fbaState.data_circular
            const new_data = {nodes: [...old_data.nodes, ...nodes], links: [...old_data.links, ...links]}

            dispatch({type: 'SETDATACIRCULAR', payload: new_data});

        }
        else{
            dispatch({type: 'SETDATACIRCULAR', payload: data});
        }




    }



