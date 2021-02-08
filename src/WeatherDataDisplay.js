import React from 'react';
import './WeatherDataDisplay.css';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

class WeatherDataDisplay extends React.Component { 
    render() {
        if (!this.props.error && this.props.temp) {
            return (
                <div key={this.props.location} className='weather-display'>
                    <div className='header-info'>
                        <div className='location'>{this.props.location}</div>
                        <div className='date' color='secondary'>{this.props.time}</div>
                    </div>

                    <div className='flex-container'>
                        <div className='temp-container'> 
                            <div className='temperature'>{this.props.temp}{this.props.isFahrenheit ? '°F' : '°C'}</div>
                        </div>
                        
                        <div className='weather-icon-container'>
                            <img alt='weather icon' src={process.env.REACT_APP_WEATHER_ICON_URL + this.props.iconID + '.png'} />
                            <div className='description'>{this.props.description}</div>
                        </div>
                    </div>
                    
                    <div className='weather-stats'>
                        <div>
                            <span className='stat-header'>Sunrise:</span> <br />
                            <span className='sunrise'>{this.props.sunrise}</span>
                        </div>
                        <div>
                            <span className='stat-header'>Sunset:</span> <br />
                            <span className='sunset'>{this.props.sunset}</span>
                        </div>
                        <div>
                            <span className='stat-header'>Feels Like:</span> <br />
                            <span className='feels-like'>{this.props.feelsLike}{this.props.isFahrenheit ? '°F' : '°C'}</span>
                        </div>
                        <div>
                            <span className='stat-header'>Humidity:</span> <br />
                            <span className='humidity'>{this.props.humidity}%</span>
                        </div>
                        <div>
                            <span className='stat-header'>Low:</span> <br />
                            <span className='low'>{this.props.low}{this.props.isFahrenheit ? '°F' : '°C'}</span>
                        </div>
                        <div>
                            <span className='stat-header'>High:</span> <br />
                            <span className='high'>{this.props.high}{this.props.isFahrenheit ? '°F' : '°C'}</span>
                        </div>
                    </div>

                    <div className='radio-buttons'>
                        <RadioGroup 
                            className='radio-buttons' 
                            aria-label='anonymous' 
                            name='anonymous' 
                            value={this.props.isFahrenheit} 
                            onChange={this.props.onChange} row>
                            <FormControlLabel value={true} control={<Radio color='primary' />} label='Fahrenheit' />
                            <FormControlLabel value={false} control={<Radio color='primary' />} label='Celsius' />
                        </RadioGroup>
                    </div>
                </div>
            ); 
        } else if (this.props.error) {
            return <p key={this.props.query + +(new Date())} className='error-message'>
                Error: {this.props.error === 'city not found' ? this.props.error + ' for input \'' + this.props.query + '\'' : this.props.error}.
                </p>
        } else {
            return null; 
        }
    }
}

export default WeatherDataDisplay; 