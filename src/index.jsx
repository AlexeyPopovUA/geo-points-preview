window.JSX = require('hyperscript');
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import MapView from "./components/MapView.jsx";
import "./../styles/index.scss";

const fetchUrl = "https://api.github.com/gists/68fa9fc8295e0edd36d169027554c979";

window.addEventListener("load", () => {
    fetch(fetchUrl)
        .then(result => result.json())
        .then(json => {
            const data = JSON.parse(json.files["data-points.json"].content);
            console.warn("fetch", data);

            document.body.appendChild(
                <div className="main">
                    {Header.render()}
                    {(new MapView({data})).render()}
                    {Footer.render()}
                </div>);
        })
        .catch(error => console.error(error));
});