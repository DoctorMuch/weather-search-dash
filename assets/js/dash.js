const getLocationWeather = function(city, country){
  let apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + country +"&appid=20cbe6c3f0ca1d4ed9861d6b956f3bc9";
  fetch(apiUrl).then(function(response){
    response.json().then(function(data){
      console.log(data);
    });
  });
};
getLocationWeather("new york, us");