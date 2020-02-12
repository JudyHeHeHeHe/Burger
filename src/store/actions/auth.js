import * as actionTypes from './actionTypes'
import axios from 'axios';

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	}
}

export const authSuccess = (token, userId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: token,
		userId: userId
	}
}

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	}
}

export const logOut = () => {
	localStorage.removeItem('token')
	localStorage.removeItem('expirationDate')
	localStorage.removeItem('userId')

	return {
		type: actionTypes.LOG_OUT
	}
}

export const authLogout = (expirationTime) => {
	return dispatch => {
		setTimeout(() => {
			dispatch(logOut())
		}, expirationTime * 1000)
	}
}

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	}
}

export const auth = (email, password, isSignup) => {
	return dispatch => {
		dispatch(authStart())
		const authData = {
			email: email,
			password: password, 
			returnSecureToken: true
		}

		let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyByGTnJrGLnDW09ELG3yJmf4NX_Xey7lfA'

   if (!isSignup) {
   	url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyByGTnJrGLnDW09ELG3yJmf4NX_Xey7lfA'
   }

		axios.post(url, authData)
		.then(res => {
			dispatch(authSuccess(res.data.idToken, res.data.localId))
			dispatch(authLogout(res.data.expiresIn))
			localStorage.setItem('token', res.data.idToken)
	   	const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000)
	   	localStorage.setItem('expirationDate', expirationDate)
	   	localStorage.setItem('userId', res.data.localId)
		})
		.catch(error => {
			dispatch(authFail(error.response.data.error))
		})
	}
}

export const checkStatus = () => {
	return dispatch => {
		const token = localStorage.getItem('token')
		if (!token) {
			dispatch(logOut())
		} else {
			const expireIn = new Date(localStorage.getItem('expirationDate'))
			if (expireIn <= new Date()) {
				dispatch(logOut())
			} else {
				const userId = localStorage.getItem('userId')
				dispatch(authSuccess(token, userId));
				dispatch(authLogout((expireIn.getTime() - new Date().getTime()) / 1000));
			}
		}
	}
}