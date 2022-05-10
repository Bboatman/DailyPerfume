import { Geolocation } from '@awesome-cordova-plugins/geolocation';
import React, { useEffect, useReducer, createContext, useState } from "react";
import WeatherApi from "../services/weatherApi";
import { Storage } from '@ionic/storage';

let initialState = {
    settings: {
        gloom: true,
        temp: false,
        mood: true,
        fanciness: true
    }, 
    perfume: {}
}

const AppContext = createContext<{
        state: any;
        dispatch: React.Dispatch<any>;
    }>({
        state: initialState,
        dispatch: (action: {type: string, data?: any}) => null
    });

let reducer = (state: any, action: {type: string, data?: any}) => {
    const perfume = {...state.perfume};
    switch(action.type) {
        case "setAll":
            state = action.data;
            break;
        case "setWeather":
            state = {...state, weather: action.data, cityName: action.data.name};
            break;
        case "setWeatherScores":
            state = {...state, weatherScores: WeatherApi.buildWeatherData(state.weather)};
            break;
        case "setLocation":
            state = {...state, location: {longitude: action.data.longitude, latitude: action.data.latitude}};
            break;
        case "setSetting":
            let settings = {...state.settings}
            settings[action.data.type] = action.data.value
            state = {...state, settings}
            break;
        case "updateLocLookup":
            let d = new Date();
            state = {...state, lastLocLookup: d.toISOString()}
            break;
        case "createPerfume":
            perfume[action.data.id] = action.data
            state = {...state, perfume}
            console.log("Saving")
            break;
        case "deletePerfume":
            perfume[action.data] = undefined
            state = {...state, perfume}
            console.log("deleting")
            break;

  }
  console.log(state)
  return state;
};

function AppContextProvider(props: any) {
    const fullInitialState = {
        ...initialState,
    }

    const [state, dispatch] = useReducer(reducer, fullInitialState);
    const [storage] = useState(new Storage());
    const [loaded, setLoaded] = useState(false);
    let value: any = { state, dispatch};

    useEffect(() => {
        if (!storage){return}
        initializeStorage();
        return
    }, [storage])

    useEffect(() => {
        if (loaded){
            let startDate = new Date(state.lastLocLookup);
            let endDate = new Date()
            var minutes = (endDate.getTime() - startDate.getTime()) / 60000 ;
            if (minutes > 10 || !state.lastLocLookup){
                findLocation();
                dispatch({type: "updateLocLookup"})
            }
        }
        return;
    }, [loaded])

    useEffect(() => {
        if (!loaded){return}
        try{
            storage.set("state", state)
        } catch {
            console.log("error")
        }
        return
    }, [state])

    useEffect(() => {
        if (!state.weather) { return }

        dispatch({type: "setWeatherScores"})

        return
    }, [state.weather] )

    const initializeStorage = async () => {
        await storage.create();

        let savedState: any = await storage.get("state");

        console.log("intializing", savedState);

        dispatch({type: "setAll", data: savedState ?? initialState})
        setLoaded(true)
    }

    const findLocation = async () => {
        console.log("Finding weather / location");

        const data = await Geolocation.getCurrentPosition();
        dispatch({type: "setLocation", data: data.coords})

        let w = await WeatherApi.getWeatherForLocation(data.coords.latitude, data.coords.longitude);
        dispatch({type: "setWeather", data: w})
        return
    };

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };