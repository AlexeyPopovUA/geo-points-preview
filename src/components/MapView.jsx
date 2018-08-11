import "./../../styles/components/MapView.scss";
import mapboxgl from "mapbox-gl";

export default class MapView {
    constructor(config) {
        this.config = config;
        this.el = null;
        this.map = null;
    }

    render() {
        this.el = (
            <div className="map-view">
                <div className="map-view-wrapper"/>
            </div>
        );

        setTimeout(() => this.renderMap(), 0);

        return this.el;
    }

    /**
     * @private
     */
    renderMap() {
        this.map = new mapboxgl.Map({
            container: this.el.firstChild,
            style: {
                "glyphs": "https://glfonts.lukasmartinelli.ch/fonts/{fontstack}/{range}.pbf",
                //"glyphs": "http://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
                //"glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
                version: 8,
                zoom: 8,
                center: [0, 51.5], //[longitude, latitude]
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

    /**
     * @private
     */
    addEventListeners() {
        this.map.on("load", this.configureMap.bind(this));

        this.map.on("click", MapView.SINGLE_MARKER, this.onSingleMarkerClick.bind(this));
        this.map.on('click', MapView.CLUSTER_LAYER, this.onClusterClick.bind(this));

        this.map.on("mouseenter", MapView.CLUSTER_LAYER, this.makeMousePointer.bind(this));
        this.map.on("mouseenter", MapView.SINGLE_MARKER, this.makeMousePointer.bind(this));
        this.map.on("mouseleave", MapView.CLUSTER_LAYER, this.resetMouse.bind(this));
        this.map.on("mouseleave", MapView.SINGLE_MARKER, this.resetMouse.bind(this));
    }

    /**
     * @private
     */
    configureMap(){
        const clusterIconSize = parseInt(this.config.mapConfig["icon-size"]);

        this.map.addSource(MapView.SOURCE_NAME, {
            type: "geojson",
            data: this.config.data,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: this.getClusterRadiusByClusterIconSize(clusterIconSize)
        });

        this.map.addLayer({
            id: MapView.CLUSTER_LAYER,
            type: "circle",
            source: MapView.SOURCE_NAME,
            filter: ["has", "point_count"],
            paint: {
                "circle-color": "#51bbd6",
                "circle-radius": clusterIconSize,
                "circle-stroke-width": 2
            }
        });

        this.map.addLayer({
            id: MapView.CLUSTER_NUMBER,
            type: "symbol",
            source: MapView.SOURCE_NAME,
            filter: ["has", "point_count"],

            layout: {
                "text-field": "{point_count_abbreviated}",
                "text-font": ["Open Sans Bold"],
                "text-size": this.getTextSizeByClusterIconSize(clusterIconSize)
            }
        });

        this.map.addLayer({
            id: MapView.SINGLE_MARKER,
            type: "circle",
            source: MapView.SOURCE_NAME,
            filter: ["!has", "point_count"],
            paint: {
                "circle-color": "#11b4da",
                "circle-radius": this.getSingleSizeByClusterIconSize(clusterIconSize),
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff"
            }
        });
    }

    reconfigureMap(data) {
        this.config.mapConfig = data;

        this.map.removeLayer(MapView.CLUSTER_LAYER);
        this.map.removeLayer(MapView.CLUSTER_NUMBER);
        this.map.removeLayer(MapView.SINGLE_MARKER);
        this.map.removeSource(MapView.SOURCE_NAME);

        this.configureMap();
    }

    /**
     * @private
     * @param {number} size
     * @returns {number}
     */
    getTextSizeByClusterIconSize(size) {
        return size * 0.75;
    }

    /**
     * @private
     * @param {number} size
     * @returns {number}
     */
    getSingleSizeByClusterIconSize(size) {
        return size * 0.5;
    }

    /**
     * Calculates properly w/o overlapping
     * @private
     * @param {number} size
     * @returns {number}
     */
    getClusterRadiusByClusterIconSize(size) {
        return size * 3;
    }

    /**
     * @private
     */
    makeMousePointer() {
        this.map.getCanvas().style.cursor = "pointer";
    }

    /**
     * @private
     */
    resetMouse() {
        this.map.getCanvas().style.cursor = "";
    }

    /**
     * @private
     * @param event
     */
    onClusterClick(event){
        const features = this.map.queryRenderedFeatures(event.point, {layers: ['clusters']});
        const clusterId = features[0].properties.cluster_id;

        this.map.getSource(MapView.SOURCE_NAME).getClusterExpansionZoom(clusterId, (error, zoom) => {
            if (!error) {
                this.map.easeTo({
                    center: features[0].geometry.coordinates,
                    zoom
                });
            } else {
                console.error(error);
            }
        });
    }

    /**
     * @private
     * @param event
     */
    onSingleMarkerClick(event){
        new mapboxgl.Popup()
            .setLngLat(event.lngLat)
            .setHTML(`Clicked on a feature with id = ${event.features[0].properties.id}`)
            .addTo(this.map);
    }
}

MapView.SOURCE_NAME = "points";
MapView.CLUSTER_LAYER = "clusters";
MapView.CLUSTER_NUMBER = "cluster-count";
MapView.SINGLE_MARKER = "unclustered-point";