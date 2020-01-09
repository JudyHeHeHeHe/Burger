import React, {Component} from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import {connect} from 'react-redux';
import * as actionTypes from '../../store/actions'


class BurderBuilder extends Component {
	state = {
		purchasing: false,
		loading: false,
		error: false
	}

	componentDidMount () {
		// axios.get('https://react-my-burger-a65a5.firebaseio.com/ingredients.json')
		// .then(response => {
		// 	this.setState({ingredients:response.data})
		// })
		// .catch(error => {
		// 	this.setState({error: true})
		// })
	}

	// addIngredientHandler = (type) => {
	// 	const oldCount = this.state.ingredients[type];
	// 	const updatedCount = oldCount + 1;
	// 	const updatedIngredients = {...this.state.ingredients};
	// 	updatedIngredients[type] = updatedCount;

	// 	const priceAddition = INGREDIENT_PRICES[type];
	// 	const oldPrice = this.state.totalPrice;
	// 	const newPrice = oldPrice + priceAddition;
	// 	this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
	// 	this.updatePurchaseState(updatedIngredients);

	// }

 //  removeIngredientHandler = (type) => {
 //  	const oldCount = this.state.ingredients[type];
 //  	if (oldCount <= 0) {
 //  		return; 
 //  	}
	// 	const updatedCount = oldCount - 1;
	// 	const updatedIngredients = {...this.state.ingredients};
	// 	updatedIngredients[type] = updatedCount;

	// 	const priceDeduction = INGREDIENT_PRICES[type];
	// 	const oldPrice = this.state.totalPrice;
	// 	const newPrice = oldPrice - priceDeduction;
	// 	this.setState({totalPrice: newPrice, ingredients: updatedIngredients})
	// 	this.updatePurchaseState(updatedIngredients);
	// }

	updatePurchaseState (ingredients){
		const sum = Object.keys(ingredients).map(igKey => {
			return ingredients[igKey];
		}).reduce((sum, el) => {
			return sum + el;
		},0)

		return sum > 0;
	}

	purchaseHandler = () => {
		this.setState({purchasing: true});
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}

	// purchaseContinueHandler = () => {
	// 	const queryParams = [];
	// 	for(let i in this.state.ingredients) {
	// 		queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
	// 	}
		
 //    queryParams.push('price=' + this.props.price);

	// 	const queryString = queryParams.join('&');

	// 	this.props.history.push({
	// 		pathname: '/checkout',
	// 		search: '?' + queryString
	// 	});
	// }

	purchaseContinueHandler = () => {
		this.props.history.push('/checkout');
	}

	render() {
		const disableInfo = {
			...this.props.ings
		};

		for(let key in disableInfo) {
			disableInfo[key] = disableInfo[key] <= 0
		}

    let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />
    let orderSummary = null;

    if (this.props.ings) {
    	burger = (
				<Aux>
					<Burger ingredients={this.props.ings}/>
					<BuildControls 
					  ingredientAdded = {this.props.onIngredientAdded} 
						ingredientRemoved = {this.props.onIngredientRemoved}
					  price = {this.props.price}
						disabled = {disableInfo}
						purchasable = {this.updatePurchaseState(this.props.ings)}
						ordered={this.purchaseHandler}/>
				</Aux>
		  )

		  orderSummary = <OrderSummary price={this.props.price} ingredients={this.props.ings} purchaseCanceled={this.purchaseCancelHandler} purchaseContinued={this.purchaseContinueHandler}/>
    }

    if(this.state.loading) {
			orderSummary = <Spinner />
		}
		

		return (
			<Aux>
			  <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
			  	{orderSummary}
			  </Modal>
				{burger}
			</Aux>
		)
	}
}

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice
	}
}

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded : (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
		onIngredientRemoved : (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurderBuilder, axios));






















