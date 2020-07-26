import Globe from 'globe.gl';
import {
    request,
    getCoordinates,
    numberWithCommas,
    formatDate
} from './utils';
import {
    GLOBE_IMAGE_URL,
    BACKGROUND_IMAGE_URL,
    GEOJSON_URL,
    BIODATA_API,
} from './constants';
import * as d3 from 'd3';

// Globe container
const globeContainer = document.getElementById('globeViz');

const colorScale = d3.scaleSequentialPow(d3.interpolateYlOrRd).exponent(1 / 4);

const getVal = (feat) => { // Coloring each country according to ratio of (Number of companies / Total Population)
    return feat.bioData.Total / feat.properties.POP_EST;
};

let world;
document.getElementById('modal-opened').style.display = "block";
const flagEndpoint = 'https://corona.lmao.ninja/assets/img/flags'; // Flag endpoint

init();

function init() {
    world = Globe()(globeContainer)
        .globeImageUrl(GLOBE_IMAGE_URL)
        .backgroundImageUrl(BACKGROUND_IMAGE_URL)
        .showGraticules(false)
        .polygonAltitude(0.06)
        .polygonCapColor((feat) => colorScale(getVal(feat)))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.05)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(
            ({
                properties: d,
                bioData: c
            }) => {
                var flagName = d.ADMIN === 'France' ? 'fr' : d.ISO_A2.toLowerCase(); // Setting France and Norway Flag
                flagName = d.ADMIN === 'Norway' ? 'no' : flagName;

                return `
                    <div class="card">
                      <img class="card-img" src="${flagEndpoint}/${flagName}.png" alt="flag" />
                      <div class="container1">
                         <span class="card-title"><b>${d.NAME}</b></span> <br />
                      </div>
                    </div>
                  `
            }
        )
        .onPolygonClick((polygon) => {
            var keys = Object.keys(polygon);


            document.getElementById('modal-opened').style.display = "block";
            document.getElementById('modal1-opened').style.display = "none";
            document.querySelector(".scrollable").innerHTML = '';
            document.querySelector(".scrollable").innerHTML += (polygon.bioData.bioStats);

            document.getElementById("card_title").innerHTML = polygon.properties.NAME;

        })
        .onPolygonHover((hoverD) =>
            world
            .polygonAltitude((d) => (d === hoverD ? 0.12 : 0.06))
            .polygonCapColor((d) =>
                d === hoverD ? 'steelblue' : colorScale(getVal(d))
            )
        )
        .polygonsTransitionDuration(200);
    world.controls().autoRotate = true; // Manage autoRotate property of Globe.
    world.controls().autoRotateSpeed = 0.55;

    getData();
}

let countries = [];
let featureCollection = [];


async function getData() {
    countries = await request(BIODATA_API);
    featureCollection = (await request(GEOJSON_URL)).features;

    document.querySelector('.title-desc').innerHTML =
        'Hover to see country name and click to see details';

    updatePolygonsData();

    updatePointOfView();
}

function updatePolygonsData() {
    for (let x = 0; x < featureCollection.length; x++) {
        const country = featureCollection[x].properties.NAME;
        if (countries[country]) {

            let d = "";
            for (var item in countries[country]) {

                let count = (item != 'Total Company') ? countries[country][item].length : countries[country][item];


                d += "<span id='p1' class='txt' >" + item + ": " + count.toString() + "</span>  <br />";

            }
            featureCollection[x].bioData = {
                Total: countries[country]["Total Company"],
                bioStats: d,
            };
        } else {
            featureCollection[x].bioData = {
                Total: 0,
                bioStats: "",
            };
        }
    }

    const maxVal = Math.max(...featureCollection.map(getVal));
    colorScale.domain([0, maxVal]);
    world.polygonsData(featureCollection); // Updating data
}

$(document).on('click', '.txt', function() {
    var classification = $(this).text();
    classification = classification.split(":")[0];
    var country = $(".card-title").text();
    var d = '';

    if (classification != 'Total Company') {

        let length_ = countries[country][classification].length;

        for (var i = 0; i < length_; i++) {

            d += "<span id='p2' class='txt2' >" + countries[country][classification][i] + '</span> <br/>';
        }

        document.getElementById('modal1-opened').style.display = "block";
        document.querySelector(".scrollable1").innerHTML = '';
        document.querySelector(".scrollable1").innerHTML += (d);
        document.getElementById("card_title1").innerHTML = classification + "<br/>Companies Name";

    }

});

/*$(document).click(function(event){

	var container = $(event.target).attr('id');
	//alert(container);

});*/
async function updatePointOfView() { // Update point of view of globe according to your country
    // Get coordinates
    try {
        const {
            latitude,
            longitude
        } = await getCoordinates();

        world.pointOfView({
                lat: latitude,
                lng: longitude,
            },
            1000
        );
    } catch (e) {
        alert('Unable to set point of view.');
    }
}


// Responsive globe
window.addEventListener('resize', (event) => {
    world.width([event.target.innerWidth]);
    world.height([event.target.innerHeight]);
});
