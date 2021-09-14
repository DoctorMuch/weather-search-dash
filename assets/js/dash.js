const getLocationWeather = function(city, country){
  let apiUrl = "http://api.openweathermap.org/data/2.5/weather?q=" + city + country;
  fetch(apiUrl).then(function(response){
    response.json().then(function(data){
      console.log(data);
    });
  });
};
getLocationWeather("new york, us");