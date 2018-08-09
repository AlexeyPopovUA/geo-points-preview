import "./../../styles/components/Form.scss";

export default class Form {
    constructor() {

    }

    render() {
        return (
            <div className="form">
                <fieldset>
                    <legend>Map size</legend>
                    <label htmlFor="map-width">Width</label>
                    <input type="number" name="map-width" id="map-width" value="800"/>
                    <br/>
                    <label htmlFor="map-height">Height</label>
                    <input type="number" name="map-height" id="map-height" value="600"/>
                </fieldset>
                <fieldset>
                    <legend>Icon size</legend>
                    <label htmlFor="icon-size">Radius</label>
                    <input type="number" name="icon-size" id="icon-size" value="10"/>
                </fieldset>
                <fieldset>
                    <legend>Map bounding box</legend>
                    <label htmlFor="map-box-tl">Top left</label>
                    <input type="text" name="map-box-tl" id="map-box-tl" value="51.4904 -0.27603"/>
                    <br/>
                    <label htmlFor="map-box-br">Bottom right</label>
                    <input type="text" name="map-box-br" id="map-box-br" value="51.6836 0.05081"/>
                </fieldset>
            </div>
        );
    }
}