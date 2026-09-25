import { Service } from '@src/services/Service'

export const getAllLocationData = (params) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_LOCATION_LIST', payload: [], isFetching: true })

    await Service.get({ url: `/location/` })
      .then((response) => {
        if (response) {
          dispatch({
            type: 'GET_LOCATION_LIST',
            payload: response,
            isFetching: false
          })
        }
      })
  }
}

export const getAllDeviceData = (params) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_DEVICE_LIST', payload: null, isFetching: true })

    await Service.get({ url: `/report/devices/?location_id=${params}` })
      .then((response) => {
        if (response) {
          dispatch({
            type: 'GET_DEVICE_LIST',
            payload: response,
            isFetching: false
          })
        }
      })
  }
}

export const getAllAdsData = (params) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_ADS_LIST', payload: null, isFetching: true })

    await Service.get({ url: `/reports/ads_list/?device_id[]=${params}` })
      .then((response) => {
        if (response) {
          dispatch({
            type: 'GET_ADS_LIST',
            payload: response,
            isFetching: false
          })
        }
      })
  }
}

export const getAllScreenData = (params) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_SCREEN_LIST', payload: null, isFetching: true })

    await Service.get({ url: `/screen/location_screens/?${new URLSearchParams(params).toString()}` })
      .then((response) => {
        if (response) {
          dispatch({
            type: 'GET_SCREEN_LIST',
            payload: response,
            isFetching: false
          })
        }
      })
  }
}

export const getAllStatesData = (params) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_STATES_LIST', payload: null, isFetching: true })

    await Service.get({ url: `/states/` })
      .then((response) => {
        if (response) {
          dispatch({
            type: 'GET_STATES_LIST',
            payload: response,
            isFetching: false
          })
        }
      })
  }
}

export const getAllCitiesData = (params, type) => {
  return async (dispatch) => {
    if (type === 'monitering') {
      dispatch({ type: 'GET_CITIES_MONITERING_LIST', payload: null, isFetching: true })
    } else {
      dispatch({ type: 'GET_CITIES_LIST', payload: null, isFetching: true })
    }
    await Service.get({ url: `/states/${params}/cities/` })
      .then((response) => {
        if (response) {
          if (type === 'monitering') {
            dispatch({
              type: 'GET_CITIES_MONITERING_LIST',
              payload: response,
              isFetching: false
            })
          } else {
            dispatch({
              type: 'GET_CITIES_LIST',
              payload: response,
              isFetching: false
            })
          }
        }
      })
  }
}
