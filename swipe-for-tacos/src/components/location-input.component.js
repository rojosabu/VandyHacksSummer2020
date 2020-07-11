import React from 'react'


class LocationInputPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zip: '',
            lat: null,
            lng: null,
            url: '',
            location: '',
            type: 'restaurant',
            APIkey: 'AIzaSyALcnLOO6jrbkQD5JL7tlMjFfb4EmC4W24',
            keywords:'',
            guid: null,
        }
    }


    convertToLatLng = () => {
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${this.state.zip}&key=${this.state.APIkey}`)
            .then(res => res.json())
            .then(data => this.setState({lat:data.results[0].geometry.location.lat,lng:data.results[0].geometry.location.lng},()=>console.log(this.state.lng)))
            
            
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.convertToLatLng()
        
    }

    handlechange = ( event ) => {
        const {name,value} = event.target
        this.setState({[name]: value})
    }



    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <input type="number" name="zip" onChange={this.handlechange} required/>
                <label>Zip Code</label>
                <button type='submit'> Submit </button>
            </form>


        )
    }
}



export default LocationInputPage;