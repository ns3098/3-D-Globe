// Controls the image of the Globe.
export const GLOBE_IMAGE_URL =
  '//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg';
  
  
// Controls the background image of the globe
export const BACKGROUND_IMAGE_URL =
  '//cdn.jsdelivr.net/npm/three-globe/example/img/night-sky.png';
  
// Geojson Url which is used to identify countires on globe
export const GEOJSON_URL =
  'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson';
  
  
 // Reading from backend server
export const BIODATA_API =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3030'
    : 'Address of your hosted data server';
