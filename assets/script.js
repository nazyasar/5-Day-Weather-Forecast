var searchBtn = document.getElementById('search');
var savedList = document.getElementById('saved-searches')
var searchValueEl = document.getElementById('search-value');
var fiveDayContainer = document.getElementById('fiveDay')
var currentContainer = document.getElementById('currentWeather')
var currentCity = document.getElementById('city-name')
var savedCities = []

function handleUserinput() {
  var userInput = searchValueEl.value
  searchForCity(userInput)
}
function searchForCity(searchValue) {
  var nameUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + searchValue + '&limit=1&appid=004fd748031512f527a6894ea14b0642'

  fetch(nameUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      savedSearch(data[0].name);

      var lat = data[0].lat;
      var lon = data[0].lon;
      var name = data[0].name;

      currentCity.textContent = 'Current Weather in ' + name

      fiveDayForecast(lat, lon)
      currentWeather(lat, lon)
    })

}
function currentWeather(lat, lon) {
  var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=004fd748031512f527a6894ea14b0642&units=imperial'
  fetch(currentUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      var iconUrl = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
      currentContainer.innerHTML = ''
      var currentDisplay = document.createElement('div')
      var currentTitle = document.createElement('h3')
      var currentIcon = document.createElement('img')
      var currentTemp = document.createElement('p')
      var currentWind = document.createElement('p')
      var currentHumid = document.createElement('p')

      var date = new Date(data.dt * 1000);
      var month = date.toLocaleString('default', { month: '2-digit' });
      var day = date.toLocaleString('default', { day: '2-digit' });
      var year = date.toLocaleString('default', { year: '2-digit' });
      var formattedDate = month + '/' + day + '/' + year;
      
      currentTitle.textContent = formattedDate
      currentIcon.setAttribute('src', iconUrl)
      currentTemp.textContent = 'Temp: ' + data.main.temp + ' \u00B0F'
      currentWind.textContent = 'Wind: ' + data.wind.speed + ' MPH'
      currentHumid.textContent = 'Humidity: ' + data.main.humidity + ' \%'

      currentDisplay.append(currentTitle, currentIcon, currentTemp, currentWind, currentHumid)
      currentContainer.append(currentDisplay)

    })
}
function fiveDayForecast(lat, lon) {
  var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=004fd748031512f527a6894ea14b0642&units=imperial'
  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {

      var fiveDayArray = []
      fiveDayArray.push(data.list[6], data.list[14], data.list[22], data.list[30], data.list[38])
      fiveDayContainer.innerHTML = '';
      for (var i = 0; i < fiveDayArray.length; i++) {

        var card = document.createElement('div')
        var cardBody = document.createElement('div')
        var cardTitle = document.createElement('h5')
        var cardIcon = document.createElement('img')
        var cardTemp = document.createElement('p')
        var cardWind = document.createElement('p')
        var cardHumid = document.createElement('p')
        var iconUrl = "https://openweathermap.org/img/wn/" + fiveDayArray[i].weather[0].icon + ".png";

        var date = new Date(fiveDayArray[i].dt * 1000);
        var month = date.toLocaleString('default', { month: '2-digit' });
        var day = date.toLocaleString('default', { day: '2-digit' });
        var year = date.toLocaleString('default', { year: '2-digit' });
        var formattedDate = month + '/' + day + '/' + year;

        card.setAttribute('class', 'card')
        cardBody.setAttribute('class', 'card-body')
        cardTitle.setAttribute('class', 'card-title')
        cardTemp.setAttribute('class', 'card-text')
        cardWind.setAttribute('class', 'card-text')
        cardIcon.setAttribute('src', iconUrl)

        cardTitle.textContent = formattedDate
        cardTemp.textContent = 'Temp: ' + fiveDayArray[i].main.temp + ' \u00B0F'
        cardWind.textContent = 'Wind: ' + fiveDayArray[i].wind.speed + ' MPH'
        cardHumid.textContent = 'Humidity: ' + fiveDayArray[i].main.humidity + ' \%'

        cardBody.append(cardTitle, cardIcon, cardTemp, cardWind, cardHumid)
        card.append(cardBody)
        fiveDayContainer.append(card)
      }
    })
}

//local storage
function savedSearch(city) {

  if (savedCities.includes(city) === false) {
    savedCities.push(city)

    localStorage.setItem('cities', JSON.stringify(savedCities))
    creatBtn()
  };

}

function creatBtn() {
  savedList.innerHTML = ''
  for (var i = 0; i < savedCities.length; i++) {
    var newBtn = document.createElement('button')

    newBtn.setAttribute('class', 'btn-info btn m-2')
    newBtn.setAttribute('value', savedCities[i])
    newBtn.textContent = savedCities[i]
    newBtn.addEventListener('click', btnClick)
    savedList.append(newBtn)
  }
}

function loadBtn() {
  var history = localStorage.getItem('cities')

  if (history) {
    savedCities = JSON.parse(history)
  }

  creatBtn()
}

function btnClick(event) {
  searchForCity(event.target.value)
}

loadBtn()
searchBtn.addEventListener('click', handleUserinput)
