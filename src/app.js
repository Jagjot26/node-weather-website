const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const app = express();

//define paths for express config
const publicDirPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//setup handlebars engine and view location and change it from the default location which is {/public/views}
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setup static directory to serve
app.use(express.static(publicDirPath));

app.get("", (req, res) => {
  res.render("index", { title: "Weather", name: "Jagjot Singh" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About me", name: "Jagjot Singh" });
});

app.get("/help", (req, res) => {
  res.render("help", {
    message: "Send help lol",
    title: "Help",
    name: "Jagjot Singh",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({ error: "Address not specified" }); //return is imp here because if we dont, res.send will be called twice and response can only be sent once
  }

  geocode(
    req.query.address,
    (error, { longitude, latitude, placeName } = {}) => {
      if (error) {
        return res.send({ error: error });
      }
      forecast(
        latitude,
        longitude,
        (error, { temp, feelsLike, description } = {}) => {
          if (error) {
            return res.send({ error: error });
          }
          const forecast = `${description}. It is currently ${temp}°C out and it feels like ${feelsLike}°C.`;
          return res.send({
            forecast,
            location: placeName,
            address: req.query.address,
          });
        }
      );
    }
  );
});

//catch all for help/dwfefwe pages
app.get("/help/*", (req, res) => {
  res.render("404Page", {
    title: "404",
    errorMessage: "Help article not found",
    name: "Jagjot Singh",
  });
});

//catch all for any pages not referenced by app.get
app.get("*", (req, res) => {
  res.render("404Page", {
    title: "404",
    errorMessage: "Page not found",
    name: "Jagjot Singh",
  });
});

app.listen(3000, () => {
  console.log("App is now running on port 3000");
});
