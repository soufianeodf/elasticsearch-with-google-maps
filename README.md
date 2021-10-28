# elasticsearch-with-google-maps

A proof of concept of finding the closest X place/s to your chosen location using Elasticsearch and Google Maps.

# Demo

Website: https://soufianeodf.github.io/elasticsearch-with-google-maps/

# issue of CORS:
* You need to add those lines to elasticsearch.yml
```
http.cors.enabled: true
http.cors.allow-origin: /https?:\/\/(localhost)?(127.0.0.1)?(:[0-9]+)?/
```
