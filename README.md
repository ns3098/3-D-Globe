
# 3-D Globe

### Installing (Front-End)

1. Install dependencies
```sh
npm install
```

2. Fire up the server and watch files
```sh
npm run dev
```

### Installing (Back-End)

1. Go to backend folder
```sh
cd backend
```

2. Install dependencies
```sh
npm install
```
3. Start the server
```sh
npm start
```

### Compiles and minifies for production
```sh
npm run build
```

# Overview of Modules

### backend/Data.js

  - This module is responsible for reading CSV data from a given link and parse it.
  - You just need to modify **'this.BioDataURL'** variable according to your address.
 - If needed you also need to map your country name, inside **'src/constant.js'** file go to the address of the variable ***GEOJSON_URL*** and compare the country name on this address with the country name present in your CSV data. For example in CSV file US is written as **United States** but on ***GEOJSON_URL*** address it's written as **United States of America**. This check needs to be done manually for some countries only like UAE, UK, etc.
 - If renaming is required you can add the country name present in your CSV file as a key in **this.countryRenameMapper** variable(which is of type hashmap) and country name present on ***GEOJSON_URL*** address as a value. For more clarity check ***this.countryRenameMapper*** variable.
 - Data read from the address is served on port 3030 in the form of json.
 - Format of data is : 
 > {CountryName: {"Total Company":X, "SectorName1":[CompanyName1, CompanyName2], SectorName2":[CompanyName1, CompanyName2]}, ***Again same structure for different country***}

- You can also check the format of data locally on localhost:3030.
- You can also change the format of data according to your need, refer **fetchBioData** function inside ***BioData*** class.

### backend/index.js
- This module basically fetches the data from **Data.js** file and serves it on port 3030 in json format.
- Right now it is using the cache of **'1 hour'**, it means after every 1 hour new data will be fetched from the address of CSV file automatically. No need to restart the server after updating your CSV file.
- Check the file for more comments.



### src/constant.js
- This module is used to define all the APIs in our application and also background image for our Globe. Check file for more clarity.
- Now consider the ***BIODATA_API*** variable 
```
export const BIODATA_API =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3030'
    : 'Address of your hosted data server';
```
> This ternary operator will check for the condition whether node is running in ***development*** environment or not. If it's running locally i.e. in ***development*** mode then the application will go to **localhost:3030** for backend data else if it's in **Production** environment it'll go to next address for fetching the backend data. So if it's in production environment it is necessary to add the address of your hosted backed at the place of dummy string **'Address of your hosted data server'**.

### src/app.js

- This module shows the globe and data to the user
- **polygonLabel** basically handles the data to be shown to the user when Globe is hovered. It is a tooltip. 
- **onPolygonClick** is triggered when any country on the Globe is clicked.
- **onPolygonHover** is triggered when Globe is hovered.
- Check the file for more clarity and better understanding.



