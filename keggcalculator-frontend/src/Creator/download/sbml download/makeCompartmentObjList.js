import React from "react";

const makeCompartmentObjList = (compartmentsRaw) => {
    return compartmentsRaw.map(compartment => {
        return {
            '@': {
                id: compartment.compartment,
                name: compartment.compartmentName,
                constant: compartment.constant
            }
        }
    })
}

export default makeCompartmentObjList
