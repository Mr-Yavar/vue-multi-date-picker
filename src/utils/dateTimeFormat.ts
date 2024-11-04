// make a new union type
type strType = "time" | "date" | "datetime";

export function dateTimeFormat(str: string, type: strType) {
  if (type === "date") {
    const dateRegex: RegExp = /^\d{4}\/\d{2}\/\d{2}$|^\d{2}\/\d{1}\/\d{1}$/;
    if (!dateRegex.test(str)) {
      return "";
    }
    return str;
  } else if (type === "time") {
    const timeRegex: RegExp =
      /^\d{2}:\d{2}$|^\d{1}:\d{1}$|^\d{1}:\d{2}$|^\d{2}:\d{1}$|^\d{1}:\d{1}:\d{1}$|^\d{1}:\d{1}:\d{2}$|^\d{1}:\d{2}:\d{1}$|^\d{1}:\d{2}:\d{2}$|^\d{2}:\d{1}:\d{1}$|^\d{2}:\d{1}:\d{2}$|^\d{2}:\d{2}:\d{1}$|^\d{2}:\d{2}:\d{2}$/;
    if (!timeRegex.test(str)) {
      return "";
    }
    return str;
  } else if (type === "datetime") {
    const datetimeRegex: RegExp =
      /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{2}$|^\d{4}\/\d{2}\/\d{2} \d{2}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{1}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{1}:\d{2}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{2}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{1}:\d{2}:\d{2}$|^\d{4}\/\d{2}\/\d{2} \d{2}:\d{1}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{2}:\d{1}:\d{2}$|^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{1}$|^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$|^\d{4}\/\d{1}\/\d{1} \d{2}:\d{2}:\d{2}$|^\d{4}\/\d{1}\/\d{2} \d{2}:\d{2}:\d{2}$|^\d{4}\/\d{2}\/\d{1} \d{2}:\d{2}:\d{2}$|^\d{4}\/\d{1,2}\/\d{1,2} \d{1,2}(:\d{1,2})?(:\d{1,2})?$/;
    if (!datetimeRegex.test(str)) {
      return "";
    }
    return str;
  }
}
