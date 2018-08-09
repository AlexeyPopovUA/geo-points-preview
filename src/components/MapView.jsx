import "./../../styles/components/MapView.scss";
import mapboxgl from "mapbox-gl";

export default class MapView {
    constructor(config) {
        this.config = config;
        this.el = null;
        this.map = null;
    }

    render() {
        this.el = <div className="map-view">
            <div className="map-view-wrapper"/>
        </div>;

        setTimeout(() => this.renderMap(), 0);

        return this.el;
    }

    renderMap() {
        /**
         * @type {Map}
         */
        this.map = new mapboxgl.Map({
            container: this.el.firstChild,
            style: {
                version: 8,
                zoom: 8, // default zoom.
                center: [0, 51.5], // default center coordinate in [longitude, latitude] format.
                sources: {
                    // Using an open-source map tile layer.
                    "simple-tiles": {
                        type: "raster",
                        tiles: [
                            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        ],
                        tileSize: 256
                    }
                },
                layers: [
                    {
                        id: "simple-tiles",
                        type: "raster",
                        source: "simple-tiles",
                        minzoom: 0,
                        maxzoom: 22
                    }
                ]
            }
        });

        this.addEventListeners();
    }

    addEventListeners() {
        this.map.on("load", () => {
            // Add points to map as a GeoJSON source.
            this.map.addSource("points", {
                type: "geojson",
                data: this.config.data
            });

            // Add a layer to the map to render the GeoJSON points.
            this.map.addLayer({
                id: "points",
                type: "circle",
                source: "points",
                paint: {
                    "circle-radius": 5,
                    "circle-color": "#ff5500",
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#000"
                }
            });
        });

        // Show a popup when clicking on a point.
        this.map.on("click", "points", event => {
            console.log(event);
            new mapboxgl.Popup()
                .setLngLat(event.lngLat)
                .setHTML(`Clicked on ${event.features.length} feature(s).`)
                .addTo(this.map);
        });

        // Change the cursor to a pointer when the mouse is over the points layer.
        this.map.on("mouseenter", "points", () => {
            this.map.getCanvas().style.cursor = "pointer";
        });

        // Change it back to a pointer when it leaves.
        this.map.on("mouseleave", "points", () => {
            this.map.getCanvas().style.cursor = "";
        });
    }
}