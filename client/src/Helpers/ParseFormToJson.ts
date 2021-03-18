
const ParseFormToJson = ( formData :  FormData) => {
    try {
        let object: any = {};
        formData.forEach(function (value: any, key: any) {
        object[key] = value;
        });
        var json = JSON.stringify(object);

        return JSON.parse(json);
    } catch (error) {
        return null;
    }
}

export default ParseFormToJson;