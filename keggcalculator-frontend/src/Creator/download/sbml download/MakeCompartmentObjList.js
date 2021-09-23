import React from "react";

const MakeCompartmentObjList = (compartmentsRaw) => {
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

export default MakeCompartmentObjList
