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
    state: any,
    dispatch: React.Dispatch<any>,
    doWeatherCheck: any
}
>({
        state: initialState,
    dispatch: (action: { type: string, data?: any }) => null,
    doWeatherCheck: async () => null
    });

let reducer = (state: any, action: {type: string, data?: any}) => {
    const perfume = {...state.perfume};
    switch(action.type) {
        case "setAll":
            state = action.data;
            break;
        case "setWeather":
            state = { ...state, weather: action.data, cityName: action.data.name, isSaving: true };
            break;
        case "setWeatherScores":
            state = {...state, weatherScores: WeatherApi.buildWeatherData(state.weather)};
            break;
        case "setLocation":
            state = { ...state, location: { longitude: action.data.longitude, latitude: action.data.latitude }, isSaving: true };
            break;
        case "setSetting":
            let settings = {...state.settings}
            settings[action.data.type] = action.data.value
            state = { ...state, settings, isSaving: true }
            break;
        case "updateLocLookup":
            let d = new Date();
            state = { ...state, lastLocLookup: d.toISOString(), isSaving: true }
            break;
        case "createPerfume":
            perfume[action.data.id] = action.data
            state = { ...state, perfume, isSaving: true }
            break;
        case "deletePerfume":
            perfume[action.data] = undefined
            state = { ...state, perfume, isSaving: true }
            break;
        case "setSaving":
            state = { ...state, isSaving: action.data }

  }
    state = { ...state }
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
    const [weatherLoading, setWeatherLoading] = useState(false)

    useEffect(() => {
        if (!storage){return}
        initializeStorage();
        return
    }, [storage])

    useEffect(() => {
        if (!loaded || weatherLoading) { return }
        console.log("Firing weather check")
        doWeatherCheck();
        return;
    }, [loaded])

    useEffect(() => {
        if (!state.isSaving) { return }
        saveState();
        return
    }, [state.isSaving])

    useEffect(() => {
        if (!state.weather) { return }

        dispatch({type: "setWeatherScores"})

        return
    }, [state.weather] )

    const saveState = async () => {
        try {
            await storage.set("state", state);
            dispatch({ type: "setSaving", data: false })
        } catch {
            console.log("error")
        }
    }

    const initializeStorage = async () => {
        await storage.create();

        let savedState: any = await storage.get("state");

        dispatch({type: "setAll", data: savedState ?? initialState})
        setLoaded(true)
    }

    const findLocation = async () => {
        console.log("In location")
        const data = await Geolocation.getCurrentPosition();
        console.log("got coords", data.coords.latitude, data.coords.longitude)
        dispatch({type: "setLocation", data: data.coords})

        let w = await WeatherApi.getWeatherForLocation(data.coords.latitude, data.coords.longitude);
        console.log(w)
        dispatch({type: "setWeather", data: w})
        setWeatherLoading(false)
        return
    };

    const doWeatherCheck = async () => {
        if (loaded && !weatherLoading) {
            setWeatherLoading(true)
            console.log("In weather check", state.lastLocLookup)
            if (state.lastLocLookup === undefined || !state.lastLocLookup || !state.weatherScores) {
                console.log("Getting weather, lookup undefined")
                findLocation();
                dispatch({ type: "updateLocLookup" })
            } else {
                console.log("Getting weather from last time")
                let startDate = new Date(state.lastLocLookup);
                let endDate = new Date()
                var minutes = (endDate.getTime() - startDate.getTime()) / 60000;
                console.log(minutes)
                if (minutes > 5) { //TODO: Change back to 10
                    console.log("Getting weather from last time")
                    findLocation();
                    dispatch({ type: "updateLocLookup" })
                }
            }
        } else {
            console.log("Not loaded")
        }
    }

    let value: any = { state, dispatch, doWeatherCheck };

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
}

let AppContextConsumer = AppContext.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer };