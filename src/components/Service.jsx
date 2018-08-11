export const Service = {
    /**
     * Retrieves the data
     * @param {string} url
     * @returns {Promise}
     */
    getData(url) {
        return fetch(url)
            .then(result => result.json())
            .then(json => JSON.parse(json.files["data-points.json"].content));
    }
};