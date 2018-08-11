# geo-points-preview
Preview and clusterize given geo points set

**[Demo link](https://alexeypopovua.github.io/geo-points-preview/)**


**How and why does it work?**

There are several solutions written in JS that solve clusterization problem: https://github.com/Leaflet/Leaflet.markercluster, https://github.com/mapbox/supercluster, https://github.com/googlemaps/v3-utility-library/tree/master/markerclusterer etc.

I decided to use built-in clusterization in mapbox-gl-js npm module because it is the simplest way to solve the task, already implemented and supposed to be working quickly for big data amounts. The only thing needs to be adjusted is dependency between icon cluster size and clusterization radius.

mapbox-gl-js module was used to show the map and to calculate clustering of data points.

**Features:**

Use configuration form to change map size, cluster icon size and navigation bounding box.

Click on a cluster in order to open next level of grouping.

Click on a single item in order to see the tooltip with point id.

**Development:**

In order to run dev build with watcher run:

`npm run build-dev`

In order to run production build run:

`npm run build-prod`

In order to generate release build run:

`npm run build-release`

... and then run index.html to see the result in the browser.