export function dateTimeFormat(str, type) {
    if (type === 'date') {
        const dateRegex = /^\d{4}\/\d{2}\/\d{2}$|^\d{2}\/\d{1}\/\d{1}$/;
        if (!dateRegex.test(str)) {
           return "";
        }
        return str;
    } else if (type === 'time') {
        const timeRegex = /^\d{2}:\d{2}$|^\d{1}:\d{1}$|^\d{1}:\d{2}$|^\d{2}:\d{1}$|^\d{1}:\d{1}:\d{1}$|^\d{1}:\d{1}:\d{2}$|^\d{1}:\d{2}:\d{1}$|^\d{1}:\d{2}:\d{2}$|^\d{2}:\d{1}:\d{1}$|^\d{2}:\d{1}:\d{2}$|^\d{2}:\d{2}:\d{1}$|^\d{2}:\d{2}:\d{2}$/;
        if (!timeRegex.test(str)) {
            return "";
        }
        return str;
    } else if (type === 'datetime') {
        const datetimeRegex = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{2}$|^\d{4}\/\d{2}\/\d{2} \d{2}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{1}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{1}:\d{2}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{2}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{2}:\d{2}$|^\d{4}\/\d{2}\/\d{2} \d{2}:\d{1}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{2}:\d{1}:\d{2}$|^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$|^\d{4}\/\d{1}\/\d{1} \d{2}:\d{2}:\d{2}$|^\d{4}\/\d{1}\/\d{2} \d{2}:\d{2}:\d{2}$|^\d{4}\/\d{2}\/\d{1} \d{2}:\d{2}:\d{2}$|^\d{4}\/\d{1,2}\/\d{1,2} \d{1,2}(:\d{1,2})?(:\d{1,2})?$/;
        if (!datetimeRegex.test(str)) {
            return "";
        }
        return str;
    }
}