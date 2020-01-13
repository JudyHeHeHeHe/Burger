import * as actionTypes from '../actions/actionTypes';
import {updateObject} from '../utility'


const initialState = {
	orders: [],
	loading: false,
	purchased: false
}

const purchaseBurgerSuccess = (state, action) => {
	const newOrder = updateObject(action.orderData, {id: action.orderId}) 

	const content = {
		loading: false,
		purchased: true,
		order: state.orders.concat(newOrder)
	}

  return updateObject(state, content)
}

const purchaseInit = (state, action) => {
	return updateObject(state, {loading: false})
}

const purchaseBurgerStart = (state, action) => {
	return updateObject(state, {loading: false})
}

const purchaseBurgerFail = (state, action) => {
	return updateObject(state, {loading: true})
}

const fetchOrdersStart = (state, action) => {
	return updateObject(state, {loading: false})
} 

const fetchOrdersFail = (state, action) => {
	return updateObject(state, {loading: false})
} 

const fetchOrdersSUCCESS = (state, action) => {
	return updateObject(state, {orders: action.orders, loading: false})
} 

const reducer = (state = initialState, action) => {
	switch(action.type) {
		case actionTypes.PURCHASE_INIT: return purchaseInit(state, action)
		case actionTypes.PURCHASE_BURGER_START: return purchaseBurgerFail(state, action);
		case actionTypes.PURCHASE_BURGER_SUCCESS: return purchaseBurgerSuccess(state, action);
		case actionTypes.PURCHASE_BURGER_FAIL: return purchaseBurgerStart(state, action)
		
		case actionTypes.FETCH_ORDERS_START: return fetchOrdersStart(state, action)
	  case actionTypes.FETCH_ORDERS_SUCCESS: return fetchOrdersSUCCESS(state, action)
	  case actionTypes.FETCH_ORDERS_FAIL: return fetchOrdersFail(state, action)
	   
		default: return state;
	}
}

export default reducer;