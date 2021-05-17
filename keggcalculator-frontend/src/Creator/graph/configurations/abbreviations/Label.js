import React from "react";

export const labelNodes = (node, graphState) => {
    return graphState.abbreviationsObject[`${node.id}`]
}