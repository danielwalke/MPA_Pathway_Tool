import {action, computed, decorate, observable, toJS} from "mobx"
import {requestGenerator} from "../../Request Generator/RequestGenerator";
import {endpoint_getReactionAndProduct} from "../../App Configurations/RequestURLCollection";

class Module_Store {

    constructor() {
        this.reactionsStack = [
            {rawEntity: "", reaction: "", productEntity: "", reactionWithProduct: "", reversible: false}
        ];

        this.enableBackdrop = false;
        this.addReaction = this.addReaction.bind(this)
        this.switchBackdrop = this.switchBackdrop.bind(this)
        this.addCompounds = this.addCompounds.bind(this)
        this.addToReactionStack = this.addToReactionStack.bind(this)
        this.removeFromReactionStack = this.removeFromReactionStack.bind(this)
        this.addReactionWithProduct = this.addReactionWithProduct.bind(this)
        this.getData = this.getData.bind(this)
        this.getValueTag = this.getValueTag.bind(this)
        this.getReactionWithProduct = this.getReactionWithProduct.bind(this)

    }

    // reactionsStack = [
    //     {rawEntity: "", reaction: "", productEntity: "", reactionWithProduct: "", reversible: false}
    // ];
    //
    // enableBackdrop = false;

    addReaction(currentIndex) {
        this.switchBackdrop(true);
        this.getReactionWithProduct(this.reactionsStack[currentIndex].productEntity.compoundId).then(response => {
            if (response.status === 201) {
                this.reactionsStack.push({
                    rawEntity: this.reactionsStack[currentIndex].productEntity,
                    reaction: "",
                    productEntity: "",
                    reactionWithProduct: "",
                    reversible: false
                });
                this.addReactionWithProduct(response.data, currentIndex + 1);
                this.switchBackdrop(false);
            }
        });
    };

    get reactions() {
        return toJS(this.reactionsStack);
    };

    switchBackdrop(flag) {
        this.enableBackdrop = flag;
    };

    addCompounds(compoundList) {
        this.compoundList = compoundList;
    };

    get CompoundList() {
        return toJS(this.compoundList)
    };

    addToReactionStack(reactionIndex, reactionAttribute, attributeValue) {
        this.reactionsStack[reactionIndex][reactionAttribute] = attributeValue;
        if (this.reactionsStack[reactionIndex].reaction !== "" && this.reactionsStack[reactionIndex].productEntity !== "") {
            this.reactionsStack[reactionIndex].reactionWithProduct.map(reactionWithProduct => {
                if (reactionWithProduct.product.compoundId === this.reactionsStack[reactionIndex].productEntity.compoundId) {
                    reactionWithProduct.reactions.map(reaction => {
                        if (reaction.reactionId === this.reactionsStack[reactionIndex].reaction.reactionId) {
                            this.reactionsStack[reactionIndex].reversible = reactionWithProduct.reversible;
                        }
                    })
                }
            })
        }
    };

    removeFromReactionStack(reactionIndex, reactionAttribute) {
        this.reactionsStack[reactionIndex][reactionAttribute] = "";
        if (reactionAttribute === "rawEntity") {
            this.reactionsStack[reactionIndex].reaction = "";
            this.reactionsStack[reactionIndex].productEntity = "";
            this.reactionsStack[reactionIndex].reactionWithProduct = "";
            this.reactionsStack[reactionIndex].reversible = false;
        }
        if (this.reactionsStack[reactionIndex].reaction === "" || this.reactionsStack[reactionIndex].productEntity === "") {
            this.reactionsStack[reactionIndex].reversible = false;
        }
    };

    addReactionWithProduct(data, reactionIndex) {
        let reactionWithProduct = []
        //Non reversible reaction
        data.productSortedReactions.map(reactionAndProduct => {
            reactionAndProduct.reversible = false;
            reactionWithProduct.push(reactionAndProduct);
        });
        //Reversible reaction
        data.productSortedReactionsRev.map(reactionAndProduct => {
            reactionAndProduct.reversible = true;
            reactionWithProduct.push(reactionAndProduct);
        });
        this.reactionsStack[reactionIndex].reactionWithProduct = reactionWithProduct;
    };

    getData(reactionIndex, type, searchEntry) {
        let returnData = [];
        if (type === "reaction") {
            let duplicateFinder = [];
            this.reactionsStack[reactionIndex].reactionWithProduct.map(reactionAndProduct => {
                if ((searchEntry === "" && this.reactionsStack[reactionIndex].productEntity === "") //send all the reactions
                    ||
                    (reactionAndProduct.product.compoundId === this.reactionsStack[reactionIndex].productEntity.compoundId) //send reaction for the chosen product
                ) {
                    reactionAndProduct.reactions.map(reaction => {
                        if (duplicateFinder.indexOf(reaction.reactionId) === -1) {
                            duplicateFinder.push(reaction.reactionId);
                            returnData.push(reaction);
                        }
                    });
                }
            });
        } else {
            if (searchEntry === "") {
                this.reactionsStack[reactionIndex].reactionWithProduct.map(reactionAndProduct => {
                    if (searchEntry === "" && this.reactionsStack[reactionIndex].reaction === "") { //send if no reaction is chosen
                        returnData.push(reactionAndProduct.product);
                    } else {
                        reactionAndProduct.reactions.map(reaction => { //send product for the chosen reaction
                            if (reaction.reactionId === this.reactionsStack[reactionIndex].reaction.reactionId) {
                                returnData.push(reactionAndProduct.product);
                            }
                        })
                    }
                });
            }
        }
        return returnData;
    };

    getValueTag(reactionIndex, type) {
        if (type === "rawEntity") {
            return `${this.reactionsStack[reactionIndex].rawEntity.compoundName} (${this.reactionsStack[reactionIndex].rawEntity.compoundId})`
        } else if (type === "reaction") {
            return `${this.reactionsStack[reactionIndex].reaction.reactionName} (${this.reactionsStack[reactionIndex].reaction.reactionId})`
        } else {
            return `${this.reactionsStack[reactionIndex].productEntity.compoundName} (${this.reactionsStack[reactionIndex].productEntity.compoundId})`
        }
    };

    getReactionWithProduct(compoundId) {
        return requestGenerator("POST", endpoint_getReactionAndProduct, {substrateId: compoundId}, "", "")
    };

    get backdropStatus() {
        return this.enableBackdrop;
    }
}

decorate(Module_Store, {
    reactionsStack: observable,
    enableBackdrop: observable,
    compoundList: observable,
    addReaction: action,
    addCompounds: action,
    addToReaction: action,
    addReactionWithProduct: action,
    removeFromReactionStack: action,
    switchBackdrop: action,
    reactions: computed,
    backdropStatus: computed,
});

const ModuleStore = new Module_Store();

export default ModuleStore;
