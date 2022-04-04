# Express.js <img src="https://cdn.icon-icons.com/icons2/2415/PNG/512/express_original_logo_icon_146527.png" width="26px"/> and MongoDB <img src="https://cdn.icon-icons.com/icons2/2415/PNG/512/mongodb_original_logo_icon_146424.png" width="26px"/> Countries and Cities API with Authetification, using [JWT](https://jwt.io/) and data from [simplemaps.com](https://simplemaps.com/data/world-cities) 🌍

## Description:

Populate database from the csv file. Authorize user and get token in order to access authorized routes.

## Read Files from csv.

### Run script to open, read and populate countries and cities collection with data from _worldcities.csv_ :

### First run script to import countries data

<br/>

- To open, read and populate countries collection, run:

```
 node ./utils/populate -importcountriesdata
```

- To open, read and populate cities collection, run:

```
 node ./utils/populate -importcitiesdata
```

## Unauthorized routes: <br>

- /api/v1/register-user [POST]<br/>
  **Description**: Register user and get token.<br/>
  **Required fields**: firstname, lastname, email, password
- /api/v1/login [POST]<br/>
  **Description**: Login user and get token<br/>
  **Required fields**: email, password

## Authorized routes: <br>

When sending request, set authorization header -> 'Authorization' : 'Bearer ${token}'<br/>

### User:

- /api/v1/logged-user [GET]<br/>
  **Description**: Get currently logged user <br/>

### Countries:

- /api/v1/countries [GET] <br/>
  **Description**: Get countries and search by queries<br/>
  **Accepted queries**: id, name
- /api/v1/country-cities [GET]<br/>
  **Description**: Get countries with populated virtuals _'cities'_ based on referential value between countries and cities and search by queries.<br>
  **Accepted queries**: id, name, id and city, name and city, id and lat and lng, name and lat and lng, name and (gt or gte or lte or lt or population)<br>
- /countries/nearest-and-farthest-cities/:id [GET]<br>
  **Description**: Based on the selected country (id), get the two cities with the shortest and two cities with the longest distances including distance value in KM, calculated with [haversine formula] cities latitude and longitude(https://en.wikipedia.org/wiki/Haversine_formula) <br>
  **Required params**: id<br>

### Cities:

- /api/v1/cities [GET] <br/>
  **Description**: Get cities and search by queries<br/>
  **Accepted queries**: name, lat & lng, country, countryId, gt, gte, lt, lte and population
- /api/v1/cities/:id [GET]<br/>
  **Description**: Get city by id<br/>
  **Required params**: id

### Stack 💻

<img src="https://cdn.icon-icons.com/icons2/2415/PNG/512/express_original_logo_icon_146527.png" width="20px"/> [Express.js](https://expressjs.com/)<br>
<img src="https://cdn.icon-icons.com/icons2/2415/PNG/512/nodejs_plain_logo_icon_146409.png" width="20px"/> [Node.js](https://nodejs.org/en/)<br>
<img src="https://cdn.icon-icons.com/icons2/2415/PNG/512/mongodb_original_logo_icon_146424.png" width="20px"/> [MongoDB](https://www.mongodb.com/) <br>

## Requirements:

Install node modules: <br>

```
npm install
```

Mongo DB URL 🍃<br>
In the **./config/.env** file, fill MONGO_URL variable with your MongoDB url
<br><br>
JWT Secret 🔐<br>
In the **./config/.env** file, fill JWT_SECRET variable with your desired JWT secret
<br>

## Dev server:

```
npm run dev
```

## Production:

```
npm start
```

## Live demo for testing:

https://express-countries-and-cities.herokuapp.com/
