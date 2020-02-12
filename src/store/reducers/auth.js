import * as actionTypes from '../actions/actionTypes'
import {updateObject} from '../utility'


const initialState = {
	idToken: null,
	userId: null,
	error: null,
	authRedirectPath: '/'
}

const authStart = (state, action) => {
	return updateObject(state, {loading: true, error: null})
}


const logOut = (state, action) => {
	return updateObject(state, {idToken: null, userId: null})
}

const setAuthRedirectPath = (state, action) => {
	return updateObject(state, {authRedirectPath: action.path})
}


const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START:
		return authStart(state, action);

		case actionTypes.AUTH_SUCCESS: 
		return updateObject(state, {idToken: action.idToken, userId: action.userId, error: null, loading: false})
  
    case actionTypes.AUTH_FAIL: 
    return updateObject(state, {error: action.error, loading: false})

    case actionTypes.LOG_OUT:
    return logOut(state, action)

    case actionTypes.SET_AUTH_REDIRECT_PATH: 
    return setAuthRedirectPath(state, action)

		default: 
		return state
	}
}

export default reducer;