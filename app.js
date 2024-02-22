// Save URL to variable
const apiEndpoint =
	"https://api.open-meteo.com/v1/forecast?latitude=50.8284&longitude=-0.1395&current=temperature_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=uv_index&daily=weather_code,uv_index_max&timezone=GMT";

// Create async function to deal with api request
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
