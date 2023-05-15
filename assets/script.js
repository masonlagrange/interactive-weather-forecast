var searchbar = document.querySelector(".searchbar")
var searchbtn = document.querySelector(".search-button")
var searchHistory = document.querySelector(".history-list")
var currentWeather = document.querySelector(".current-weather")
var futureCards = document.querySelector('.future-weather')
var weatherHeading = document.querySelector('.current-h2')
var currentIcon = document.querySelector('.current-icon')
var currentTemp = document.querySelector('.current-temp')
var currentWind = document.querySelector('.current-wind')
var currentHum = document.querySelector('.current-hum')
var cardDiv = document.querySelector('.card-div')
var historyArray = []

// Loads local storage to search history
var loadHistory = function () {
    searchHistory.innerHTML = ''
    var storedHistory = JSON.parse(localStorage.getItem('history'))
    if (storedHistory !== null) {
        historyArray = storedHistory
    }
        for (i = 0; i < historyArray.length; i++) {
            var searchHistoryItem = document.createElement('li')
            searchHistoryItem.textContent = historyArray[i]
            searchHistory.appendChild(searchHistoryItem)
        }
}

// Takes in input from either search bar or history click
var formSubmitHandler = function (event, history) {
    if (history === true) {
        var citySearch = event
    } else {
        var citySearch = searchbar.value.trim()
    }
// Makes an API call to the geocoding API and sends that info to other APIs
    if (citySearch) {
        fetch('https://api.openweathermap.org/geo/1.0/direct?q=' + citySearch + '&limit=1&appid=7469a41a0c74ae4542c51ace1281222f')
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        apiCallHandler(data[0].lat, data[0].lon)
                        currentUpdate(data[0].lat, data[0].lon)
                        historyArray.push(citySearch)
                        localStorage.setItem('history', JSON.stringify(historyArray))
                        loadHistory()
                        searchbar.value = ''
                    })
                }
            })
    } else {
        alert('Please search a city')
    }
}

// Deals with the clicking of a history item
var historyClickHandler = function (event) {
    var clickedHistory = event.target

    if (clickedHistory.matches('li') === true) {
        var searchTerm = clickedHistory.innerHTML
    }

    formSubmitHandler(searchTerm, true)
}

// Makes call to 5 day weather API
var apiCallHandler = function (lat, long) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + long + '&appid=7469a41a0c74ae4542c51ace1281222f&units=metric'

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    weatherHeading.innerText = data.city.name + " " + new Date().toLocaleDateString('en-US')
                    updateWeather(data)
                })
            } else {
                alert('Error: ' + response.statusText)
            }
        })
        .catch(function (error) {
            alert('Error with API call')
        })
}

// Makes API call to current weather API
var currentUpdate = function (lat, long) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=7469a41a0c74ae4542c51ace1281222f&units=metric'
    
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // Updates current weather section
                    currentIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
                    currentTemp.innerText = 'Temp: ' + data.main.temp + '°C'
                    currentWind.innerText = 'Wind: ' + data.wind.speed + 'Km/h'
                    currentHum.innerText = 'Humidity: ' + data.main.humidity + '%'
                })
            } else {
                alert('Error: ' + response.statusText)
            }
        })
        .catch(function (error) {
            alert('Error with API call')
        })
}

// Updates 5 day weather forecast
var updateWeather = function (data) {
    console.log(data)
    var cardsHTML = cardDiv.innerHTML
    cardsHTML = ''
    for (i = 0; i < 5; i++) {
        var factor = (8*(i+0.5))
        var dailyCard = (
            `<div class="card">
                <h4>${(data.list[factor].dt_txt).split(' ')[0]}<img class="current-icon" src="https://openweathermap.org/img/wn/${data.list[factor].weather[0].icon}@2x.png"/></h4>
                <h5>Temp: ${data.list[factor].main.temp}°C</h5>
                <h5>Wind: ${data.list[factor].wind.speed}Km/h</h5>
                <h5>Humidity: ${data.list[factor].main.humidity}%</h5>
            </div>`
        )
        cardsHTML += dailyCard
    }
    cardDiv.innerHTML = cardsHTML
}

loadHistory()

searchbtn.addEventListener('click', formSubmitHandler)
searchHistory.addEventListener('click', historyClickHandler)
