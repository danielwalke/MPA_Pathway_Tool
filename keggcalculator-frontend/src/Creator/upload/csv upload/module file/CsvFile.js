import {Reaction} from "../../model/Reaction";
import {Compound} from "../../model/Compound";
import {NOT_KEY_COMPOUND_OPACITY} from "../../../graph/Constants";

export class CsvColumns{
    columns
    compoundX
    compoundY
    compoundName
    typeOfCompound
    opacity
    reactionX
    reactionY
    reactionAbbreviation
    reversible
    compoundAbbreviation

    constructor(row) {
        this._columns = row.split(";")
        this._compoundX = this._columns[11]
        this._compoundY = this._columns[12]
        this._compoundName = this._columns[5].replaceAll("\t", ";")
        this._typeOfCompound = this._columns[6]
        const keyComp = this._columns[15]
        this._opacity = keyComp.trim() === "true" ? 1 : NOT_KEY_COMPOUND_OPACITY
        this._reactionName =this._columns[1].replaceAll("\t", ";")
        this._reactionX = this._columns[9].trim()
        this._reactionY = this._columns[10]
        this._reactionAbbreviation = this._columns[13]
        this._reversible = this._columns[7] === "reversible"
        this._compoundAbbreviation =this._columns[14]
        this._row = row;
    }

    get row() {
        return this._row;
    }

    get columns() {
        return this._columns;
    }

    get compoundX() {
        return this._compoundX;
    }

    get compoundY() {
        return this._compoundY;
    }

    get compoundName() {
        return this._compoundName;
    }

    get typeOfCompound() {
        return this._typeOfCompound;
    }

    get opacity() {
        return this._opacity;
    }

    get reactionName() {
        return this._reactionName;
    }

    get reactionX() {
        return this._reactionX;
    }

    get reactionY() {
        return this._reactionY;
    }

    get reactionAbbreviation() {
        return this._reactionAbbreviation;
    }

    get reversible() {
        return this._reversible;
    }

    get compoundAbbreviation() {
        return this._compoundAbbreviation;
    }

    getCompound = () => {
        const compound = new Compound(this.compoundName)
        compound._abbreviation = this.compoundAbbreviation
        compound._opacity = this.opacity
        compound._typeOfCompound = this.typeOfCompound
        compound._x = this.compoundX
        compound._y = this.compoundY
        return compound
    }

    createNewReaction = (reaction) =>{
        reaction = new Reaction(this.reactionName)
        reaction._x = this.reactionX
        reaction._y = this.reactionY
        reaction._abbreviation = this.reactionAbbreviation
        reaction._opacity = 1
        reaction._reversible = this.reversible
        return reaction
    }


}

export const getReaction = (reactions, columns) =>{
    let reaction
    const reactionName = columns.reactionName
    if (!isInReaction(reactions, reactionName)) {
        reaction = columns.createNewReaction(reaction)
    } else {
        reaction = findReactionInList(reaction, reactions, reactionName)
    }
    return reaction
}

const isInReaction = (reactions, reactionName) =>{
    return reactions.some(reaction => reaction.reactionName === reactionName)
}
const findReactionInList = (reaction, reactions, reactionName) =>{
    reaction = reactions.find(reaction => reaction.reactionName === reactionName)
    reactions.pop()
    return reaction
}

