import React, {Component} from 'react';
import Order from '../../components/Order/Order';
import axios from '../../axios-orders';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../store/actions/index';
import {connect} from 'react-redux'; 
import Spinner from '../../components/UI/Spinner/Spinner';



class Orders extends Component {

	componentDidMount(){
		this.props.onFetchInit(this.props.token, this.props.userId);
	}

  
	componentDidUpdate(prevState){
		
		if (prevState.orders !== this.props.orders && this.props.clicked) {
			this.props.onDisableButtons();
		}
	}


 cancelSubmitOrders = () => {
 	this.props.history.push('/');
 }

 submitOrders = (orders) => {
 	axios.put('/orders.json', orders)
		.then(res => {
			this.props.history.push('/');
		}).catch(error => {
			alert('error')
		})

 } 

	render (){
		let orders = <Spinner />

		if (!this.props.loading) {
			orders= this.props.orders.map(order => (
				 <Order key={order.id} ingredients={order.ingredients} price={order.price} deleteOrder={()=> this.props.onDeleteOrder(order.id)}/>
			))
		}


		return (
			<div>
				{orders}	
				<div style={{margin: '0 auto', width: '200px', padding: '30px'}}>
			 		<button disabled={this.props.disabled} style={{margin: '0 10px', padding: '0 10px'}} onClick={this.cancelSubmitOrders}>Cancel</button>
			 		<button disabled={this.props.disabled} style={{margin: '0 10px', padding: '0 10px'}} onClick={() => this.submitOrders(this.props.orders)}>Submit</button>
			 	</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		orders: state.order.orders,
	  loading: state.order.loading,
	  disabled: state.order.disabled,
	  clicked: state.order.clicked,
	  token: state.auth.idToken,
	  userId: state.auth.userId
	}
	
}

const mapDispatchToProps = dispatch => {
	return {
		onFetchInit: (token, userId) => dispatch(actions.fetchOrders(token, userId)),
		onDeleteOrder: (id) => dispatch(actions.deleteOrder(id)),
		onDisableButtons: () => dispatch(actions.disableButtons()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders,axios));