import {saveAs} from "file-saver";
export const parse = async (event) => {
    let files = await event.target.files;
    let reader = new FileReader()
    reader.readAsText(files[0])
    let outputString = "name;ko-numbers;ec-numbers;taxonomy;"
    reader.onload = e => {
        const result = e.target.result.trim()
        const lines = result.split("\n")
        const header = lines[0]
        const headerEntries = header.split(";")
        for (let iterator = 16; iterator < 60; iterator++) {
            if (iterator < 59) {
                outputString += headerEntries[iterator]
                outputString += ","
            } else {
                outputString += headerEntries[iterator]
                outputString += "\n"
            }
        }
        lines.shift()
        lines.map(line => {
            const entries = line.split(";")
            outputString = outputString.concat(entries[1] + ";")
            const koArray = entries[13].match(/K[0-9][0-9][0-9][0-9][0-9]/g) // check if k number inside
            if (koArray !== null) {
                koArray.map((ko, index) => {
                    if (index < koArray.length - 1) {
                        outputString = outputString.concat(ko.toString() + ",")
                    } else {
                        outputString = outputString.concat(ko.toString() + ";")
                    }
                })
            } else {
                outputString += ";"
            }
            const ecArray = entries[14].match(/[0-9]*\.[0-9]*\.[0-9]*\.-|[0-9]*\.[0-9]*\.[0-9]*\.[0-9]*|[0-9]*\.[0-9]*\.-\.-|[0-9]*\.-\.-\.-/g) //check if any ec number is inside
            if (ecArray !== null) {
                ecArray.map((ec, index) => {
                    if (index < ecArray.length - 1) {
                        outputString = outputString.concat(ec.toString() + ",")
                    } else {
                        outputString = outputString.concat(ec.toString() + ";")
                    }
                })
            } else {
                outputString += ";"
            }

            for(let iterator = 3; iterator<11; iterator++){
                outputString = outputString.concat(entries[iterator] + ",")
            }
            outputString = outputString.substring(0, outputString.length-2)
            outputString += ";"
            for (let iterator = 16; iterator < 60; iterator++) {
                if (iterator < 59) {
                    outputString += entries[iterator].trim()
                    outputString += ","
                } else {
                    outputString += entries[iterator].trim()
                    outputString += "\n"
                }
            }
        })
        let blob = new Blob(new Array(outputString.trim()), {type: "text/plain;charset=utf-8"});
        saveAs(blob, "MPAfile.csv")
    }
}