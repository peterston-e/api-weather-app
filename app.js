// ***** selectors ******
const day = document.querySelector(".day");
const time = document.querySelector(".time");
const degC = document.querySelector(".degreesC");
const precipitation = document.querySelector(".precipitation-percent");
const humidity = document.querySelector(".humidity-percent");
const windSpeed = document.querySelector(".wind-speed");

// Save URL to variable
const apiEndpoint =
	"https://api.open-meteo.com/v1/forecast?latitude=50.8284&longitude=-0.1395&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=uv_index&daily=weather_code,uv_index_max&timezone=GMT";

// Create async function to deal with api request - callback function as param
async function fetchWeather(callback) {
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

// callback function to be used with api call
function displayData(weatherData) {
	const currentTime = weatherData.current.time;
	time.textContent = currentTime;

	const currentTemp = weatherData.current.temperature_2m;
	degC.textContent = `${currentTemp} ℃`;

	const currentPrecipitation = weatherData.current.precipitation;
	precipitation.textContent = `${currentPrecipitation} %`;

	const currentHumidity = weatherData.current.relative_humidity_2m;
	humidity.textContent = `${currentHumidity} %`;

	const currentWindSpeed = weatherData.current.wind_speed_10m;
	windSpeed.textContent = `${currentWindSpeed} km/h`;
}

// date format should be iso8601 string YYYY-MM-DDT00:00
function convertDate(date) {
	// split the date
	const dateArray = date.split("T");
	// extract time
	const hourMin = dateArray[1];
	console.log(hourMin);

	const todaysDate = new Date(date);
	const dayNum = todaysDate.getDay();

	// extract day of the week
	const dayNames = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];

	const weekday = dayNames[dayNum];
	console.log(weekday);
	// return dayName;
}
convertDate("2024-02-23T08:00");

fetchWeather(displayData);

// // Alternative to setting the callback function
// async function useData() {
//       const weatherData = await fetchWeather();
//       // Use weatherData object here
//   }
