window.JSX = require('hyperscript');
import Header from "./components/Header.jsx";
import Form from "./components/Form.jsx";
import Footer from "./components/Footer.jsx";
import MapView from "./components/MapView.jsx";
import {DataUtils} from "./utils/DataUtils.jsx";
import {Service} from "./components/Service.jsx";
import {Config} from "./configuration/defaults.jsx";
import "./../styles/index.scss";

window.addEventListener("load", () => {
    Service.getData(Config.fetchUrl)
        .then(json => {
            const data = JSON.parse(json.files["data-points.json"].content);

            const mapConfig = Config.mapConfig;
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

            form.on("form-submit", data => map.reconfigureMap(DataUtils.parseFormData(data)));
        })
        .catch(error => console.error(error));
});