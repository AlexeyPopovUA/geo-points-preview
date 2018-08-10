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
        /**
         * @type {Map}
         */
        this.map = new mapboxgl.Map({
            container: this.el.firstChild,
            style: {
                "glyphs": "https://glfonts.lukasmartinelli.ch/fonts/{fontstack}/{range}.pbf",
                //"glyphs": "http://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
                //"glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
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

    /**
     * @private
     */
    addEventListeners() {
        this.map.on("load", this.configureMap.bind(this));

        this.map.on("click", "unclustered-point", this.onSingleMarkerClick.bind(this));
        this.map.on('click', 'clusters', this.onClusterClick.bind(this));

        this.map.on("mouseenter", "clusters", this.makeMousePointer.bind(this));
        this.map.on("mouseenter", "unclustered-point", this.makeMousePointer.bind(this));
        this.map.on("mouseleave", "clusters", this.resetMouse.bind(this));
        this.map.on("mouseleave", "unclustered-point", this.resetMouse.bind(this));
    }

    /**
     * @private
     */
    configureMap(){
        const clusterIconSize = parseInt(this.config.mapConfig["icon-size"]);

        // Add points to map as a GeoJSON source.
        this.map.addSource(MapView.SOURCE_NAME, {
            type: "geojson",
            data: this.config.data,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: this.getClusterRadiusByClusterIconSize(clusterIconSize)
        });

        this.map.addLayer({
            id: "clusters",
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
            id: "cluster-count",
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
            id: "unclustered-point",
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
     * @param e
     */
    onClusterClick(e){
        const features = this.map.queryRenderedFeatures(e.point, {layers: ['clusters']});
        const clusterId = features[0].properties.cluster_id;
        this.map.getSource(MapView.SOURCE_NAME).getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err)
                return;

            this.map.easeTo({
                center: features[0].geometry.coordinates,
                zoom: zoom
            });
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

    reconfigureMap(data) {
        //console.warn(data, this.map);

        //console.warn("reconfigureMap", data);
        this.map.setPaintProperty('clusters', 'circle-radius', parseInt(data["icon-size"]));
        this.map.setLayoutProperty('cluster-count', 'text-size',
            this.getTextSizeByClusterIconSize(parseInt(data["icon-size"])));//todo Fix
        this.map.setPaintProperty('unclustered-point', 'circle-radius',
            this.getSingleSizeByClusterIconSize(parseInt(data["icon-size"])));//todo Fix

        //reconfigure clasterRadius somehow in the data source
    }

    getTextSizeByClusterIconSize(size) {
        return size / 2;
    }

    getSingleSizeByClusterIconSize(size) {
        return size / 2;
    }

    //todo Calculate properly w/o overlapping
    getClusterRadiusByClusterIconSize(size) {
        return size * 2.5;
    }
}

MapView.SOURCE_NAME = "points";