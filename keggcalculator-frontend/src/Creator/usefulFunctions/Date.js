export const getCurrentDateMinute = () =>{
    const today = new Date();
    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate() + "; " + toTwoDigit(today.getHours()) + ":" + toTwoDigit(today.getMinutes());
    return date;
}

const toTwoDigit = (number) =>{
    if(number>0 && number <10){
        return "0"+number
    }else{
        return number
    }
}
