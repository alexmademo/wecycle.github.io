#! usr/bin/env python

from sys import argv
from os.path import exists
import json as json

script, in_file, out_file = "script", "json/full/places.json", "json/full/places.geojson"

data = json.load(open(in_file))

geojson = {
    "type": "FeatureCollection",
    "features": [
     for d in data:
         {
        "type": "Feature",
        "geometry" : {
            "type": "Point",
            "coordinates": [d["lon"], d["lat"]],
            },
        "properties" : d,
     }]
}


output = open(out_file, 'w')
json.dump(geojson, output)

print(geojson)