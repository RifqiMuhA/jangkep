const fs = require('fs');
const https = require('https');

// This is a known repo with Indonesian geojson data
const url = "https://raw.githubusercontent.com/thetrisatria/geojson-indonesia/master/kabupaten.geojson";

console.log("Fetching GeoJSON...");
https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            console.log("Parsing GeoJSON...");
            const geojson = JSON.parse(data);
            
            // Filter features for Jawa Tengah
            const jateng = {
                type: "FeatureCollection",
                features: geojson.features.filter(f => {
                    const props = f.properties;
                    // Check various common property names for province
                    const prov = props.WADMPR || props.PROVINSI || props.state || props.Propinsi || props.NAME_1;
                    return prov && prov.toUpperCase().includes("JAWA TENGAH");
                })
            };
            
            fs.writeFileSync('public/data/jateng-kabupaten.geojson', JSON.stringify(jateng));
            console.log("Saved " + jateng.features.length + " features to public/data/jateng-kabupaten.geojson");
        } catch (e) {
            console.error("Error parsing or saving: ", e.message);
        }
    });
}).on('error', err => console.error("Error fetching: ", err.message));
