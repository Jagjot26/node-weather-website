const request = require("request");

const geocode = (address, callback) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    address
  )}.json?access_token=pk.eyJ1IjoianVnajB0IiwiYSI6ImNrYng0Ym81NzBtOWoydHJ2MjFvNWV4a3MifQ.q3Sv43iVd3pwmOdo_e0AFA&limit=1#`;
  request(
    {
      url,
      json: true,
    },
    (error, { body } = {}) => {
      if (error) {
        callback("Can't connect to network", undefined);
      } else if (body.features.length == 0) {
        callback(
          "Can't find the location. Try again with another search term",
          undefined
        );
      } else {
        const locData = {
          longitude: body.features[0].center[0],
          latitude: body.features[0].center[1],
          placeName: body.features[0].place_name,
          address: encodeURIComponent(address),
        };
        callback(undefined, locData);
      }
    }
  );
};

module.exports = geocode;
