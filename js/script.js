
displayCities();


document.getElementById('submit').addEventListener('click',function(){
    const place=document.getElementById('location').value;
    fetch('http://api.weatherapi.com/v1/forecast.json?key=04a0cbeb931a4c99aed183929261903&q='+place+'&days=5&aqi=no&alerts=no')
  .then(response => response.json())
  .then(data => displaydata(data))
  .catch(error => console.error('Error:', error));
});

function displaydata(data){
    document.getElementById('city-weather').innerHTML = '';
    document.getElementById('forecastday').innerHTML = '';
    console.log(data)
    const city=document.createElement('p');
    const cityweather=document.createElement('div');
    cityweather.className='cityweather';
    const text=document.createElement('p');
    const temp=document.createElement('p');
    const humidity=document.createElement('p');
    const windspeed=document.createElement('p');
    humidity.innerHTML='Humidity '+data.current.humidity;
    windspeed.innerHTML='windspeed KPH '+data.current.wind_kph;

    temp.innerHTML=' temprature  '+data.current.temp_c;
    const img=document.createElement('img');
    cityweather.append(img,text,temp,humidity,windspeed)
    img.src=data.current.condition.icon;
    text.innerHTML=data.current.condition.text;
    city.textContent=data.location.name;
    // document.getElementById('city-weather').appendChild(city);
    // document.getElementById('city-weather').appendChild(img);
    // document.getElementById('city-weather').appendChild(text);
    document.getElementById('city-weather').append(city,cityweather);
    data.forecast.forecastday.forEach((element,index) => {
        console.log(element.day.condition.text);
        const forecast=document.createElement('div');
        forecast.className = 'forecastingdiv';
        const date=document.createElement('p');
        const photo=document.createElement('img');
        const phototext=document.createElement('p');
        const mintemp=document.createElement('p');
        const maxtemp=document.createElement('p');
        mintemp.innerHTML='mintemp '+element.day.mintemp_c;
        maxtemp.innerHTML='maxtemp '+element.day.maxtemp_c;

        photo.src=element.day.condition.icon;
        phototext.innerText=element.day.condition.text;
        date.innerHTML=element.date;
        forecast.append(date,photo,phototext,mintemp,maxtemp);
        document.getElementById('forecastday').append(forecast);
    });
const cityname=data.location.name;
    saveCity(cityname);

}

document.getElementById('location').addEventListener('input', function () {
  const value = this.value.trim();
  const error = document.getElementById('error');
  const cityPattern = /^[A-Za-z\s,]+$/;

  if (value === '') {
    error.textContent = '⚠️ City name is required.';
  } else if (value.length < 2) {
    error.textContent = '⚠️ Too short.';
  } else if (!cityPattern.test(value)) {
    error.textContent = '⚠️ Invalid characters.';
  } else {
    error.textContent = '✅ Looks good!';
    error.style.color = 'green';
  }
});


function saveCity(cityName) {
    let cities = JSON.parse(localStorage.getItem('recentCities')) || [];

    //cities = cities.filter(c => c.toLowerCase() !== cityName.toLowerCase());

    cities.unshift(cityName);

    if (cities.length > 5) {
      cities = cities.slice(0, 5);
    }
    localStorage.setItem('recentCities', JSON.stringify(cities));
  }

  function displayCities() {
    const cities = JSON.parse(localStorage.getItem('recentCities')) || [];
    const list = document.getElementById('cityList');

    list.innerHTML = '';

    if (cities.length === 0) {
      list.innerHTML = '<li>No cities saved yet.</li>';
      return;
    }

    cities.forEach(function (city) {
      const li = document.createElement('li');
      li.textContent = city;
      list.appendChild(li);
    });
  }


  function getCoordinates() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve({
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      }),
      err => reject(err.message)
    );
  });
}

document.getElementById('detectBtn').addEventListener('click', async function () {
  const { lat, lon } = await getCoordinates();
  console.log(lat, lon); // 28.6139, 77.2090 — but no city name
    fetch('http://api.weatherapi.com/v1/forecast.json?key=04a0cbeb931a4c99aed183929261903&q='+lat+','+lon+'&days=5&aqi=no&alerts=no')
  .then(response => response.json())
  .then(data => displaydata(data))
  .catch(error => console.error('Error:', error));


  
});