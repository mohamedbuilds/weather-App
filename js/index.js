let serches = document.querySelector(".serches");
let message = document.querySelector(".message");
let dataList = [];
async function getDataWeather(lat, lon) {
  try {
    showLoader(true);
    let res =
      await fetch(`https://api.weatherapi.com/v1/forecast.json?key=3c52797e52cc495bab4190142251908&q=${lat},${lon}&days=3&lang=en
`);
    let data = await res.json();
    dataList = data.forecast.forecastday;
    displayData();
    displayHoursData();
  } catch (err) {
    message.innerHTML =
      "⚠️ Error fetching weather data. Please check your internet connection.";
    message.classList.remove("d-none");
  } finally {
    showLoader(false);
  }
}

function displayData() {
  let cartonna = "";
  for (let i = 0; i < dataList.length; i++) {
    let date = new Date(dataList[i].date);
    let dayName = date.toLocaleDateString("en-US", { weekday: "long" });

    cartonna += `
      <div class="col-md-4">
        <div class="weather-card text-center p-3 rounded shadow-sm">
          <h4 class="fw-bold">${dayName}</h4>
          <div class="weather-icon mb-2">
            <img src="${dataList[i].day.condition.icon}" alt="icon"/>
          </div>
          <div class="temp fw-bold fs-4">
            ${dataList[i].day.maxtemp_c}°C / ${dataList[i].day.mintemp_c}°C
          </div>
          <p class="small text-info">${dataList[i].day.condition.text}</p>
          <div class="extra mt-2 small">
            🌡️ Temp: ${dataList[i].day.avgtemp_c}°C <br/>
            💧 Humidity: ${dataList[i].day.avghumidity}% <br/>
            🌬️ Wind: ${dataList[i].day.maxwind_kph} kph <br/>
            📝 Condition: ${dataList[i].day.condition.text} <br/>
            🌅 Sunrise: ${dataList[i].astro.sunrise} <br/>
            🌇 Sunset: ${dataList[i].astro.sunset} <br/>
            🌧️ Chance of Rain: ${dataList[i].day.daily_chance_of_rain}% <br/>
          </div>
        </div>
      </div>
    `;
  }
  document.querySelector(".data-wether").innerHTML = cartonna;
}

function displayHoursData() {
  let cartonna = "";

  let hours = dataList[0].hour; // الدخول على الساعات

  for (let j = 0; j < hours.length; j++) {
    let hourData = hours[j];

    cartonna += `
      <div class="hour-card text-center p-3 m-2 rounded shadow-sm bg-light" style="min-width: 120px;">
        <h6 class="hour fw-bold">${hourData.time.split(" ")[1]}</h6>
        <img src="${hourData.condition.icon}" alt="icon" class="mb-2">
        <div class="temp fw-bold">${hourData.temp_c}°C</div>
        <div class="humidity small">💧 ${hourData.humidity}%</div>
        <div class="wind small">🌬️ ${hourData.wind_kph} kph</div>
        <div class="chance-rain small">🌧️ ${hourData.chance_of_rain}%</div>
      </div>
    `;
  }

  document.querySelector(".hourly-forecast").innerHTML = cartonna;
}

// هنا بنستخدم الـ Geolocation
if (navigator.geolocation) {
  // هنا بشوف: هل المتصفح بيدعم خاصية تحديد الموقع (Geolocation API) ولا لأ؟
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      getDataWeather(lat, lon);
    },
    () => {
      // fallback لو المستخدم رفض
      getDataWeather("30.0444", "31.2357"); // إحداثيات القاهرة
    }
  );
} else {
  // لو الجهاز مش بيدعم geolocation أصلاً
  getDataWeather("30.0444", "31.2357");
}
// Search WeatherApp
async function getSearchWeather() {
   message.classList.add("d-none");
  try {
    let word = serches.value.trim();
    if (!word) return;
    let res = await fetch(
      `https://api.weatherapi.com/v1/search.json?key=3c52797e52cc495bab4190142251908&q=${word}`
    );
    let data = await res.json();
    let city = data[0];
    getDataWeather(city.lat, city.lon);
  } catch (error) {
    message.innerHTML =
      "⚠️ Error searching for city. Please check your internet connection";
    message.classList.remove("d-none");
  }
}

serches.addEventListener("input", getSearchWeather);

function showLoader(show) {
  document.querySelector(".loader").style.display = show ? "block" : "none";
}
