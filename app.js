// ***** selectors ******
const day = document.querySelector(".day");
const time = document.querySelector(".time");
const degC = document.querySelector(".degreesC");
const precipitation = document.querySelector(".precipitation-percent");
const humidity = document.querySelector(".humidity-percent");
const windSpeed = document.querySelector(".wind-speed");
const locationTitle = document.querySelector(".title");
const weatherCode = document.querySelector(".weather-code");

// weather codes
const weatherCodes = {
	0: "Clear sky",
	1: "Mainly clear",
	2: "Partly cloudy",
	3: "Overcast",
	45: "Fog",
	48: "Fog",
	51: "Drizzle: Light",
	52: "Drizzle: Moderate",
	53: "Drizzle: Dense intensity",
	56: "Freezing Drizzle: Light",
	57: "Freezing Drizzle: Dense intensity",
	61: "Rain: Slight",
	63: "Rain: Moderate",
	65: "Rain: Heavy intensity",
	66: "Freezing Rain: Light",
	67: "Freezing Rain: Heavy intensity",
	71: "Snow fall: Slight",
	73: "Snow fall: Moderate",
	75: "Snow fall: Heavy intensity",
	77: "Snow grains",
	80: "Rain showers: Slight",
	81: "Rain showers: Moderate",
	82: "Rain showers: Violent",
	85: "Snow showers: Slight",
	86: "Snow showers: Heavy",
	95: "Thunderstorm: Slight or moderate",
	96: "Thunderstorm with slight hail",
	99: "Thunderstorm with heavy hail",
};

// Save URL to variable serves as default also
let apiEndpoint =
	"https://api.open-meteo.com/v1/forecast?latitude=50.8284&longitude=-0.1395&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=uv_index&daily=weather_code,uv_index_max&timezone=GMT";

// Create async function to deal with api request - callback function as param
async function fetchWeather(callback) {
	// call to get position from browser
	const position = await getPosition();
	const lat = position.coords.latitude.toFixed(4);
	const long = position.coords.longitude.toFixed(4);

	// adjusted variable to work with geo api.
	latSlice = lat.slice(0, -1);
	longSlice = long.slice(0, -1);

	// build out url with lat and long
	apiEndpoint = updateApiEndpoint(apiEndpoint, lat, long);

	// use reverse geo.
	const geoCodeApiEndpoint = `https://api.postcodes.io/postcodes?lon=${longSlice}&lat=${latSlice}`;
	const reverseGeoResponse = await fetch(geoCodeApiEndpoint, { method: "GET" });
	if (!reverseGeoResponse.ok) {
		console.error(reverseGeoResponse.status);
		console.error(reverseGeoResponse.text());
	}

	// call for reverse geo data and set title
	const geoData = await reverseGeoResponse.json();
	const exactLocation = geoData.result[0].admin_ward;
	locationTitle.textContent = exactLocation;

	// call for weather data
	const response = await fetch(apiEndpoint, { method: "GET" });

	if (!response.ok) {
		console.error(response.status);
		console.error(response.text());
		return;
	}
	// parse the response
	const data = await response.json();
	callback(data);
}

// Alternative to using fetch
function getPosition() {
	// Simple wrapper
	return new Promise((res, rej) => {
		navigator.geolocation.getCurrentPosition(res, rej);
	});
}

function updateApiEndpoint(apiEndpoint, lat, long) {
	apiEndpoint = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=uv_index&daily=weather_code,uv_index_max&timezone=GMT`;
	return apiEndpoint;
}

// callback function to be used with api call
function displayData(weatherData) {
	const currentTime = weatherData.current.time;
	time.textContent = formatDate(currentTime);

	const currentTemp = weatherData.current.temperature_2m;
	degC.textContent = `${currentTemp} ℃`;

	const currentPrecipitation = weatherData.current.precipitation;
	precipitation.textContent = `${currentPrecipitation} mm`;
	console.log(currentPrecipitation);

	const currentHumidity = weatherData.current.relative_humidity_2m;
	humidity.textContent = `${currentHumidity} %`;

	const currentWindSpeed = weatherData.current.wind_speed_10m;
	windSpeed.textContent = `${currentWindSpeed} km/h`;

	const currentWeatherCode = weatherData.current.weather_code;
	weatherCode.textContent = `${weatherCodes[currentWeatherCode]}`;
}

// date format should be iso8601 string YYYY-MM-DDT00:00
function formatDate(timeString) {
	// Convert the time string to a Date object
	const date = new Date(timeString);

	// Define options for toLocaleString() to format the date
	const options = {
		weekday: "long",
		hour: "numeric",
		minute: "numeric",
		hourCycle: "h12",
	};

	// Format the date to the desired format
	const formattedTime = date.toLocaleString("en-GB", options);

	// Output: "Friday 10:30 am"
	return formattedTime;
}

fetchWeather(displayData);

// // Alternative to setting the callback function
// async function useData() {
//       const weatherData = await fetchWeather();
//       // Use weatherData object here
//   }
