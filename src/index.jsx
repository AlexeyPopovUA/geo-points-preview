window.JSX = require('hyperscript');
import Header from "./components/Header.jsx";
import Form from "./components/Form.jsx";
import Footer from "./components/Footer.jsx";
import MapView from "./components/MapView.jsx";
import "./../styles/index.scss";

const fetchUrl = "https://api.github.com/gists/68fa9fc8295e0edd36d169027554c979";

window.addEventListener("load", () => {
    fetch(fetchUrl)
        .then(result => result.json())
        .then(json => {
            const data = JSON.parse(json.files["data-points.json"].content);

            const mapConfig = {
                "icon-size": 15,
                "map-box-br": "51.6836 0.05081",
                "map-box-tl": "51.4904 -0.27603",
                "map-height": 600,
                "map-width": 800
            };
            const form = new Form(mapConfig);
            const map = new MapView({data, mapConfig});

            document.body.appendChild(
                <div className="main">
                    {Header.render()}
                    {form.render()}
                    {map.render()}
                    {Footer.render()}
                </div>
            );

            form.on("form-submit", data => map.reconfigureMap(data));
        })
        .catch(error => console.error(error));
});