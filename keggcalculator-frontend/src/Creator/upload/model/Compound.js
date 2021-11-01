export class Compound {
    name
    _opacity
    _x
    _y
    _abbreviation
    _typeOfCompound
    _stoichiometry
    _id
    _biggId

    constructor(name) {
        this.name = name
    }


    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get stoichiometry() {
        return this._stoichiometry;
    }

    set stoichiometry(value) {
        this._stoichiometry = value;
    }

    get opacity() {
        return this._opacity;
    }

    set opacity(value) {
        this._opacity = value;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get abbreviation() {
        return this._abbreviation;
    }

    set abbreviation(value) {
        this._abbreviation = value;
    }

    get typeOfCompound() {
        return this._typeOfCompound;
    }

    set typeOfCompound(value) {
        this._typeOfCompound = value;
    }
}
