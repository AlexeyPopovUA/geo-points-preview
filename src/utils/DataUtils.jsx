export const DataUtils = {
    /**
     * Transforms form data values to numbers
     * @param {{
     *  "icon-size": string,
     *  "map-box-tr": string,
     *  "map-box-bl": string,
     *  "map-height": string,
     *  "map-width": string
     * }} formData
     *
     * @returns {{
     *  "icon-size": number,
     *  "map-box-tr": {long: number, lat: number},
     *  "map-box-bl": {long: number, lat: number},
     *  "map-height": number,
     *  "map-width": number
     * }}
     */
    parseFormData(formData) {
        const mapBoxTR = formData["map-box-tr"].split(" ");
        const mapBoxBL = formData["map-box-bl"].split(" ");

        return {
            "icon-size": parseInt(formData["icon-size"]),
            "map-box-tr": mapBoxTR,
            "map-box-bl": mapBoxBL,
            "map-height": parseInt(formData["map-height"]),
            "map-width": parseInt(formData["map-width"])
        };
    }
};