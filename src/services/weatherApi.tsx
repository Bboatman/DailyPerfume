import axios from 'axios';

const baseUrl = "https://api.openweathermap.org/data/2.5/";

const WeatherApi = {
    getWeatherForLocation: async function(latitude: number, longitude: number) {
        const connection = axios.create({
            baseURL: baseUrl
        })

        const resp = await connection.post(`weather?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_OPEN_WEATHER}&units=metric`)
        if (resp.data != null) {               
            return resp.data
        } 
        else {
            return null
        }
    },
    getHeatLevel: function(data: any){
        let temperature = data.main.feels_like
        if (temperature >= 29){
            return 5 
        } else if (temperature >= 20){
            return 4
        } else if (temperature >= 15){
            return 3
        } else if (temperature >= 0){
            return 2
        } else {
            return 1
        }
    },

    getGloomLevel: function(data: any){
        let clouds = data?.clouds?.all / 100; // %coverage
        let rain = (data.rain && data.rain["1h"] ? data.rain["1h"] : 0) / 6; // 7.62mm is considered high rainfall
        let snow = (data.snow && data.snow["1hr"] ? data.snow["1h"] : 0) / 11; // 12.7mm is considered heavy snowfall
        let visibility = 1 - (data.visibility / 10000); // meter (max 10,000 m) as percent poss
        let ret = (clouds + rain + snow + visibility) / 2
        if (ret < 0){ ret = 0}
        else if (ret > 1) { ret = 1 }
        return 1 - ret
    },

    temperatureToString: function(value: number){
        let temp_map: any = {
            5: "hot",
            4: "warm",
            3: "temperate",
            2: "cool",
            1: "cold"
        }
        return temp_map[value]
    },
    
    buildWeatherData: function(data: any){
        let heatLevel: number = this.getHeatLevel(data);
        let temp: string = this.temperatureToString(heatLevel);
        let gloom: number = this.getGloomLevel(data);
        return {
            heatLevel,
            temp,
            gloom
        }
    }
};

export default WeatherApi;