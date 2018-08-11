export const DataUtils = {
    /**
     * Transforms form data values to numbers
     * @param {{
     *  "icon-size": string,
     *  "map-box-br": string,
     *  "map-box-tl": string,
     *  "map-height": string,
     *  "map-width": string
     * }} formData
     *
     * @returns {{
     *  "icon-size": number,
     *  "map-box-br": {long: number, lat: number},
     *  "map-box-tl": {long: number, lat: number},
     *  "map-height": number,
     *  "map-width": number
     * }}
     */
    parseFormData(formData) {
        const mapBoxBR = formData["map-box-br"].split(" ");
        const mapBoxTL = formData["map-box-tl"].split(" ");

        return {
            "icon-size": parseInt(formData["icon-size"]),
            "map-box-br": mapBoxBR,
            "map-box-tl": mapBoxTL,
            "map-height": parseInt(formData["map-height"]),
            "map-width": parseInt(formData["map-width"])
        };
    }
};