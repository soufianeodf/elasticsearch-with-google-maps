# elasticsearch-with-google-maps


# issue of CORS:
* You need to add those lines to elasticsearch.yml
```
http.cors.enabled: true
http.cors.allow-origin: /https?:\/\/(localhost)?(127.0.0.1)?(:[0-9]+)?/
```
