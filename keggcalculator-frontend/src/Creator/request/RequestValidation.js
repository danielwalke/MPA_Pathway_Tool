export const isRequestValid = (compound) => {
    if (compound != null) {
        return compound.match(/\s[C,G,R,U,M][0-9][0-9][0-9][0-9][0-9]/) != null;
    }
}