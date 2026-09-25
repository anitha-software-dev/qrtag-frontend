// ** Initial State
const initialState = {
    locationData: [],
    deviceData: [],
    screenData: [],
    adsData: [],
    stateData: [],
    cityData: [],
    cityMoniteringData: [],
    isFetching: false
}

const common = (state = initialState, action) => {
    switch (action.type) {
        case 'GET_LOCATION_LIST':
            return { ...state, locationData: action.payload, isFetching: action.isFetching }
        case 'GET_DEVICE_LIST':
            return { ...state, deviceData: action.payload, isFetching: action.isFetching }  
        case 'GET_ADS_LIST':
            return { ...state, adsData: action.payload, isFetching: action.isFetching }  
        case 'GET_SCREEN_LIST':
            return { ...state, screenData: action.payload, isFetching: action.isFetching }  
        case 'GET_STATES_LIST':
            return { ...state, stateData: action.payload, isFetching: action.isFetching } 
        case 'GET_CITIES_LIST':
            return { ...state, cityData: action.payload, isFetching: action.isFetching } 
        case 'GET_CITIES_MONITERING_LIST':
            return { ...state, cityMoniteringData: action.payload, isFetching: action.isFetching } 
        default:
            return { ...state }
    }
}

export default common