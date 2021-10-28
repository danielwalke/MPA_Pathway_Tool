import React from "react";

export const annotationIndicator = (rowProp) => {

    const hasAnnotationColor = "lightGreen"
    const annotationMissingColor = "#FF696D"

    let hasAnnotation = true

    if (typeof rowProp === 'object') {
        if (rowProp.length === 0) {
            hasAnnotation = false
        }
    } else if (typeof rowProp === 'string') {
        if (rowProp) {
            if (rowProp.startsWith('K') || rowProp.startsWith('U')) {
                hasAnnotation = false
            }
        } else {
            hasAnnotation = false
        }
    }

    return (
        <span
            className={"indicator-circle"}
            style={hasAnnotation ? {backgroundColor: hasAnnotationColor} : {backgroundColor: annotationMissingColor}}>
            {hasAnnotation ? 'Yes' : 'No'}
        </span>
    )
}
