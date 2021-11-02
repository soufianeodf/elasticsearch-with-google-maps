# elasticsearch-with-google-maps

A proof of concept of finding the closest X place/s to your chosen location using Elasticsearch and Google Maps.

# Demo

Website: https://soufianeodf.github.io/elasticsearch-with-google-maps/

# Resources Used
* [Find closest subway station with ElasticSearch](https://web.archive.org/web/20170625134636/http://gauth.fr/2012/09/find-closest-subway-station-with-elasticsearch/)
* [A simple geo-search demonstration using Google Maps and a hosted Elasticsearch index](https://github.com/baojie/elastic-map)
* [MVC GOOGLE MAPS SEARCH USING ELASTICSEARCH](https://damienbod.com/2015/01/07/mvc-google-maps-search-using-elasticsearch/)
* [Move Google Maps Markers: Change (Update) Marker position on Google Maps without refreshing](https://www.aspsnippets.com/Articles/Move-Google-Maps-Markers-Change-Update-Marker-position-on-Google-Maps-without-refreshing.aspx)

# issue of CORS:
* You need to add those lines to elasticsearch.yml
```
http.cors.enabled: true
http.cors.allow-origin: /https?:\/\/(localhost)?(127.0.0.1)?(:[0-9]+)?/
```
