window.onload = function(){
  makeHistory(searchArray);
};

let searchFormEl = document.getElementById("search-form");
let cityInputEl = document.getElementById("city-search");
let resultsEl = document.getElementById("results");
let searchArray = JSON.parse(localStorage.getItem("city")) || [];
console.log("this is searchArray at start of application", searchArray)

// Commenting this out right now. Was trying to write function to call in order to keep getLocationWeather func from getting bloated.
let makeHistory = function(array){
  locationLoad(searchArray);
  if(searchArray){  
    for (let i=0;i<array.length;i++){
    $(resultsEl)
      .append(`<button>${searchArray[i]}</button>`)
    }
    // for (let i=0;i<array.length;i++){
    //   let cityBtn = document.createElement("button");
    //   cityBtn.textContent = array[i].value;
    //   resultsEl.appendChild(cityBtn);
    // }
  }
};



let searchHandler = function(event){
  event.preventDefault();
  let cityName = cityInputEl.value.trim();

  if (cityName){
    getLocationWeather(cityName);
    cityInputEl.value="";
    locationSave(cityName);
    makeHistory(searchArray);

  } else {
    alert("Please enter a city name!");
  }
};


const getLocationWeather = function(city){
  // locationLoad();

  let cityText = document.getElementById("current-weather");
  
  let apiUrl = "http://api.openweathermap.org/data/2.5/weather?q="+city+"&units=imperial&appid=20cbe6c3f0ca1d4ed9861d6b956f3bc9";
  fetch(apiUrl)
  .then(function(response){
    response.json()
    .then(function(data){
      let date = dayjs().format("MM/DD/YYYY");
      
      console.log(data.wind.deg);
      // Tried to translate wind direction from meteorological degrees to direction; function below.
      let windDirEl= '';
      windDirEl = windDirCalc(data.wind.deg);
      console.log(windDirEl);
     
      $(cityText)
          .html(`<h2>${data.name}(${date})</h2>`)

      fetch("http://api.openweathermap.org/data/2.5/onecall?lat="+data.coord.lat+"&lon="+data.coord.lon+"&units=imperial&exclude=minutely,hourly&appid=20cbe6c3f0ca1d4ed9861d6b956f3bc9")
      .then(function(response){
        response.json()
        .then(function(data){
          let tempCurrent = Math.round(data.current.temp);
          let windSpd = Math.round(data.current.wind_speed);
          let humidityCurrent = data.current.humidity;
          let weatherIcon = data.current.weather[0].icon;
          let uvI = data.current.uvi;
          let alert = uvAlert(uvI);
          let forecast = $("#five-forecast");
          let dailyW = $("#five-days");
          $(cityText)
            .append(`<img src=http://openweathermap.org/img/wn/${weatherIcon}.png></img>`)
            .append(`<li>Current Temperature: ${tempCurrent}&#176F</li>`)
            .append(`<li>Wind Speed: ${windSpd} mph</li>`) //Gusts up to ${data.current.wind_gust} mph. See note below
            .append(`<li>Humidity: ${humidityCurrent}%</li>`)
            .append(`<li class=${alert}>UV Index: ${uvI}</li>`)
            .attr("style", "border:2px solid rgba(80, 77, 77, 0.445)")
            .addClass("display-box");

          $(forecast)
            .html(`<h3>Five-Day Forecast</h3>`)
            .append(dailyW);
          
            let fiveDay = [data.daily[0], data.daily[1], data.daily[2], data.daily[3], data.daily[4]];
              for(let i=0;i<fiveDay.length;i++){
                let forecastLow = Math.round(data.daily[i].temp.min);
                let forecastHigh = Math.round(data.daily[i].temp.max);
            
            $(dailyW)
              .append(`<div></div`)
              .append(`<h4>${dayjs().add(i+1, 'day').format("MM/DD/YYYY")}</h4>`)
              .append(`<img src=http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}.png></img>`)
              .append(`<li>High: ${forecastHigh}&#176F, Low: ${forecastLow}&#176F</li>`)
              .append(`<li>Wind: ${data.daily[i].wind_speed} mph</li>`) //Want to add wind gusts later, but don't want to spend more time right now on it.
              .append(`<li>Humidity: ${data.daily[i].humidity}%`);
          }
        })
      })
    });
  });
};

let locationSave = function(entry){
  console.log("This searchArray right before pushing data", searchArray)
  searchArray.push(entry);
  localStorage.setItem("city", JSON.stringify(searchArray));
};

let locationLoad = function(){
  searchArray = JSON.parse(localStorage.getItem("city"));
  console.log(searchArray);
};

let uvAlert = function(number){
  if (number <= 2){
    $(this).addClass("safety");
  } else if (number > 2 && number <=5){
    $(this).addClass("alert");
  } else if (number >5 && number <=7){
    $(this).addClass("warn");
  } else if(number >7 && number <=10) {
    $(this).addClass("danger");
  } else {
    $(this).addClass("stay-inside");
  }
};

let windDirCalc = function(deg){
  let windDir = "";
  if (deg > 348.75 || deg < 11.25){
    windDir === "N";
  }
  if (deg >= 11.25 && deg<33.75){
    windDir==="NNE";
  }
  if (deg >=33.75 && deg<56.25){
    windDir==="NE";
  }
  if(deg>=56.25 && deg<78.75){
    windDir==="ENE";
  }
  if(deg>=78.75 && deg<101.25){
    windDir==="E";
  }
  if(deg>=101.25 && deg<123.75){
    windDir==="ESE";
  }
  if(deg>=123.75 && deg<146.25){
    windDir==="SE";
  }
  if(deg>=146.25 && deg<168.75){
    windDir==="SSE";
  }
  if(deg>=168.75 && deg<191.25){
    windDir==="S";
  }
  if(deg>=191.25 && deg<213.75){
    windDir==="SSW";
  }
  if(deg>213.75 && deg<236.25){
    windDir==="SW";
  }
  if(deg>=236.25 && deg<258.75){;
    windDir==="WSW";
  }
  if(deg>=258.75 && deg<281.25){
    windDir==="W";
  }
  if(deg>=281.25 && deg<303.75){
    windDir==="WNW";
  }
  if(deg>=303.75 && deg<326.25){
    windDir==="NW";
  }
  if(deg>=326.25 && deg<348.75){
    windDir==="NNW";
  }
  return windDir;
};

searchFormEl.addEventListener("submit", searchHandler);
