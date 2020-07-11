import React from 'react'
import FormInput from "../form-input/form-input.component";
import './location-input.styles.css';

class LocationInputPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zip: '',
            lat: null,
            lng: null,
            type: 'restaurant',
            APIkey: 'AIzaSyALcnLOO6jrbkQD5JL7tlMjFfb4EmC4W24',
            keywords:'',
            guid: null,
            radius: 5000,
            restaurantArray: [],
            serverUrl: 'http://localhost:3000'
        }
    }

    handleChange = ( event ) => {
        //dynamically sets the state given an changeEvent
        const {name,value} = event.target
        this.setState({[name]: value})
    }

    handleSubmit = (event) => {
        
        event.preventDefault();
        this.convertToLatLng()
        
    }

    convertToLatLng = () => {
        //This code takes a zip code input from the user, and converts it to latitude an longitude for the application to use in its fetch request
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.zip}&key=${this.state.APIkey}`)
            .then(res => res.json())
            .then(data => this.setState({lat:data.results[0].geometry.location.lat,lng:data.results[0].geometry.location.lng}
                ,()=> this.fetchRestaurants()
                ))
            .catch(err => console.log(err))
    }

    fetchRestaurants = () => {
        //uses a proxy server to get around cors problem
        //takes latitude, longitude, radius, type(restaurant), and apiKey from state and inserts it into fetch(get request) which returns json object with resaurant data
        fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${this.state.lat},${this.state.lng}1&radius=${this.state.radius}&type=${this.state.type}&key=${this.state.APIkey}`)
            .then(res => res.json())
            .then(data => this.handleRestaurantArray(data))
            .catch(err => console.log(err))
    }  

    handleRestaurantArray = (data) => {
        let arr = data.results.map(result => ({name: result.name, rating: null}) )
        this.setState({restaurantArray: arr}, ()=> this.sendRestaurantsArrayToBackend())
    }

    sendRestaurantsArrayToBackend = () => {
        fetch(`${this.state.serverUrl}/123456`,{
            mode: 'cors',
            method: 'POST',
            body: JSON.stringify(this.state.restaurantArray),
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
    }

    render() {
        return(
            <div className="location-form">
                <form  onSubmit={this.handleSubmit}>
                    <h1>Find Restaurants</h1>
                    <FormInput 
                        type="number" 
                        name="zip" 
                        onChange={this.handleChange} 
                        required
                        label="Zip Code" 
                        style={{width: '100%'}}
                    />
                    <button className="submit-button" type='submit'> Submit </button>
                </form>
            </div>

        )
    }
}



export default LocationInputPage;