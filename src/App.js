import './App.css';
import { isoCountries } from './isoCountries.js'; 
import React from 'react';
import {TextField} from '@material-ui/core'; 
import WeatherDataDisplay from './WeatherDataDisplay';

class App extends React.Component {
  constructor(props) {
    super(props); 
    this.state = {
      query: '', 
      isFahrenheit: true,
      error: null, 
      location: null, 
      time: null, /* time of data calculation */ 
      temp: null, 
      iconID: null, 
      description: null, 
      sunrise: null, 
      sunset: null, 
      feelsLike: null, 
      humidity: null, 
      low: null, 
      high: null 
    }
    this.handleKeyPress = this.handleKeyPress.bind(this); 
    this.handleChangeDegrees = this.handleChangeDegrees.bind(this); 
  }

  componentDidMount() {
    const successCallback = position => {
      let units = this.state.isFahrenheit ? 'imperial' : 'metric'; 
      let url = process.env.REACT_APP_BASE_URL + 'weather?lat=' + position.coords.latitude + 
                '&lon=' + position.coords.longitude + 
                '&units=' + units + '&APPID=' + process.env.REACT_APP_WEATHER_API_KEY; 
      this.fetchWeatherData(url); 
    };

    const errorCallback = error => {
      console.log('Failed to retrieve location. \n' + error.message + '. Error code: ' + error.code); 
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successCallback,errorCallback, 
        { enableHighAccuracy: false, timeout: 2000, maximumAge: 3600000 });
    }
  }
  
  handleKeyPress(event) {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      let units = this.state.isFahrenheit ? 'imperial' : 'metric'; 
      let url = process.env.REACT_APP_BASE_URL + 'weather?'; 
      url += (event.target.value.match(/^[0-9]+$/) ? 'zip=' : 'q='); 
      url += event.target.value.trim() + '&units=' + units + '&APPID=' + process.env.REACT_APP_WEATHER_API_KEY; 

      this.fetchWeatherData(url); 
    }
  }

  fetchWeatherData(url) {
    fetch(url)
      .then(response => response.json())
      .then((result) => {
        if (result.cod === 200) {
          this.setState({
            query: '', 
            error: null, 
            location: result.name + ', ' + isoCountries[result.sys.country].name, 
            time: this.formatDateStamp(result.dt), 
            temp: result.main.temp.toFixed(2), 
            iconID: result.weather[0].icon, 
            description: result.weather[0].description, 
            sunrise: this.formatTime(result.sys.sunrise, result.timezone), 
            sunset: this.formatTime(result.sys.sunset, result.timezone), 
            feelsLike: result.main.feels_like.toFixed(2), 
            humidity: result.main.humidity, 
            low: result.main.temp_min.toFixed(2), 
            high: result.main.temp_max.toFixed(2) 
          }); 
        } else {
          this.setState({ 
            error: result.message
          }); 
        }
      }, 
      (error) => {
        this.setState({
          error: error.message
        }); 
      }); 
  }

  formatTime(unixTime, offset) {
    // ex. 'Fri, 06 Feb 2021 21:58:44 GMT;
    let gmtString = new Date((unixTime + offset) * 1000).toGMTString();
    let time = gmtString.split(' ')[4].split(':');
    let hour = time[0]; 
    let minute = time[1]; 
    return this.twelveHourFormat(hour, minute); 
  }

  formatDateStamp(unixTime) {
    let date = new Date(unixTime * 1000); 
    let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let nth = (date) => {
      if (date > 3 && date < 21) {
        return 'th'; 
      }
      switch (date % 10) {
        case 1:
          return 'st'; 
        case 2: 
          return 'nd'; 
        case 3: 
          return 'rd'; 
        default: 
          return 'th'; 
      }
    }
    
    let month = months[date.getMonth()]; 
    let dayOfMonth = date.getDate(); 
    let year = date.getFullYear(); 

    return month + ' ' + dayOfMonth + nth(dayOfMonth) + ', ' + year + ' ' + 
      this.twelveHourFormat(date.getHours(), date.getMinutes()); 
  }

  twelveHourFormat(hour, minutes) {
    let h = (hour % 12) ? hour % 12 : 12; 
    let m = (minutes > 0 && minutes < 10) ? '0' + minutes : minutes;
    return h + ':' + m + (hour >= 12 ? 'PM' : 'AM'); 
  }    

  handleChangeDegrees() {
    let conversionFunction = this.state.isFahrenheit ? this.toCelsius : this.toFahrenheit; 
    this.setState({
      isFahrenheit: !this.state.isFahrenheit, 
      temp: conversionFunction(this.state.temp),
      feelsLike: conversionFunction(this.state.feelsLike),  
      low: conversionFunction(this.state.low), 
      high: conversionFunction(this.state.high), 
    });
  }

  toCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5 / 9).toFixed(2);  
  }
  
  toFahrenheit(celsius) {
    return ((celsius * 9 / 5) + 32).toFixed(2); 
  }

  render() {
    return (
      <div className='App'>
        <TextField
          label='Enter city or US ZIP code'
          color='primary' 
          style = {{width: 250}} 
          value={this.state.query}
          onChange={(event) => 
            this.setState({ query: event.target.value, error: null })
          }
          onKeyPress={this.handleKeyPress} /> 
        <WeatherDataDisplay
          query={this.state.query}
          onChange={this.handleChangeDegrees}
          isFahrenheit={this.state.isFahrenheit}
          error={this.state.error}
          location={this.state.location}
          time={this.state.time}
          temp={this.state.temp}
          iconID={this.state.iconID}
          description={this.state.description} 
          sunrise={this.state.sunrise} 
          sunset={this.state.sunset}
          feelsLike={this.state.feelsLike}
          humidity={this.state.humidity}
          low={this.state.low} 
          high={this.state.high} />
      </div>
    ); 
  }
}

export default App;
