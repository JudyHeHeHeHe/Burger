import React, {Component} from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux'; 
import Spinner from '../../components/UI/Spinner/Spinner';


class Orders extends Component {

	componentDidMount(){
		this.props.onFetchInit();
	}

	render (){
		let orders = <Spinner />

		if (!this.props.loading) {
			orders= this.props.orders.map(order => (
				 <Order key={order.id} ingredients={order.ingredients} price={order.price} deleteOrder={()=> this.props.onDeleteOrder(order.id)}/>
			))
		}

   let buttons = null;

		return (
			<div>
				{orders}	
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		orders: state.order.orders,
	  loading: state.order.loading
	}
	
}

const mapDispatchToProps = dispatch => {
	return {
		onFetchInit: () => dispatch(actions.fetchOrders()),
		onDeleteOrder: (id) => dispatch(actions.deleteOrder(id))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders,axios));