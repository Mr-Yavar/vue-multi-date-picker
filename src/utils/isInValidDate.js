import DateObject from "react-date-object";

export function isValidDate(date){
    return date  instanceof Date && !isNaN(date.getTime()) || date instanceof DateObject  && date.isValid;


}