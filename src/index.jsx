window.JSX = require('hyperscript');
import Header from "./components/Header.jsx";
import "./../styles/index.scss";

const fetchUrl = "https://api.github.com/gists/68fa9fc8295e0edd36d169027554c979";

window.addEventListener("load", () => {
    fetch(fetchUrl)
        .then(result => result.json())
        .then(json => {
            const data = JSON.parse(json.files["data-points.json"].content);
            const points = data.features;
            console.warn("fetch", data);

            document.body.appendChild(
                <div className="main">
                    {Header.render()}
                    <div className="sections">

                    </div>
                    <div className="footer">
                        <div className="author">Developed by O.Popov, 2018</div>
                        <div className="sources">
                            <a href="https://github.com/AlexeyPopovUA/geo-points-preview">GitHub sources</a>
                        </div>
                    </div>
                </div>);
        })
        .catch(error => console.error(error));
});