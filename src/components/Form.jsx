import "./../../styles/components/Form.scss";
import fromPairs from "lodash/fromPairs";
import EventEmitter from 'events';

export default class Form extends EventEmitter {
    constructor(config) {
        super(config);

        this.config = config;
        this.el = null;
    }

    render() {
        this.el = (
            <form className="form" action="#">
                <fieldset>
                    <legend>Map size</legend>
                    <label htmlFor="map-width">Width</label>
                    <input disabled="disabled" type="number" name="map-width" id="map-width" value={this.config["map-width"]}/>
                    <br/>
                    <label htmlFor="map-height">Height</label>
                    <input disabled="disabled" type="number" name="map-height" id="map-height" value={this.config["map-height"]}/>
                </fieldset>
                <fieldset>
                    <legend>Icon size</legend>
                    <label htmlFor="icon-size">Radius</label>
                    <input type="number" name="icon-size" id="icon-size" value={this.config["icon-size"]}/>
                </fieldset>
                <fieldset>
                    <legend>Map bounding box</legend>
                    <label htmlFor="map-box-bl">Bottom left</label>
                    <input type="text" name="map-box-bl" id="map-box-bl" value={this.config["map-box-bl"].join(" ")}/>
                    <br/>
                    <label htmlFor="map-box-tr">Top right</label>
                    <input type="text" name="map-box-tr" id="map-box-tr" value={this.config["map-box-tr"].join(" ")}/>
                </fieldset>
                <button className="submit">Ok</button>
            </form>
        );

        this.attachEventListers();

        return this.el;
    }

    /**
     * @private
     */
    attachEventListers() {
        this.el.querySelector(".submit").addEventListener("click", this.onSubmit.bind(this));
    }

    /**
     * @private
     */
    onSubmit(event) {
        event.preventDefault();
        this.emit("form-submit", this.getFormData());
    }

    getFormData() {
        const formData = new FormData(this.el);
        return fromPairs(Array.from(formData.entries()));
    }
}