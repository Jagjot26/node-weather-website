const request = require("request");

const forecast = (lat, long, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=265180683c94de9da36a9795df1386ee&query=${encodeURIComponent(
    lat
  )},${encodeURIComponent(long)}`;
  request(
    {
      url,
      json: true,
    },
    (error, { body } = {}) => {
      if (error) {
        callback("Can't connect to network", undefined);
      } else if (body.error) {
        callback("Can't find the location", undefined);
      } else {
        const fore = {
          temp: body.current.temperature,
          feelsLike: body.current.feelslike,
          description: body.current.weather_descriptions[0],
        };
        callback(undefined, fore);
      }
    }
  );
};

module.exports = forecast;
