import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import {connect} from 'react-redux';

class ContactData extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your Name'
				},
				value: '',
				isValid: false,
				rules: {
					required: true
				},
				touched: false
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Street'
				},
				value: '',
				isValid: false,
				rules: {
					required: true
				},
				touched: false
			},
			zipcode: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Zipcode'
				},
				value: '',
				isValid: false,
				rules: {
					required: true,
					minLength: 5,
					maxLength: 5
				},
				touched: false
			},
		  country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Country'
				},
				value: '',
				isValid: false,
				rules: {
					required: true
				},
				touched: false
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Your Email'
				},
				value: '',
				isValid: false,
				rules: {
					required: true
				},
				touched: false
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [
						{value: 'fastest', displayValue: 'Fastest'},
						{value: 'cheapest', displayValue: 'cheapest'}
					]
				},
				value: '',
				touched: false,
				rules: {},
				isValid: true,
			},
		},
		loading: false,
		formIsValid: false
	}

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({loading: true});

		const formData = {};

		for (let formIdentifier in this.state.orderForm) {
			formData[formIdentifier] = this.state.orderForm[formIdentifier].value;
		}

		const order = {
			ingredients: this.props.ings,
			price: this.props.price,
			orderInfo: formData
		}

		axios.post('/orders.json', order)
		.then(response => {
		  this.setState({loading: false});
		  this.props.history.push('/');
		  console.log(order);
		})
		.catch(error => {
			this.setState({loading: false});
		});
	}

	formValidation = (value, rules) => {
		let validity = true;

		if(rules.required && validity) {
			validity = value.trim() !== '';
		}

		if(rules.minLength && validity) {
			validity = value.length >= rules.minLength
		}

		if(rules.maxLength && validity) {
			validity = value.length <= rules.maxLength
		}

		return validity;
	}

	inputChangedHandler = (e, inputIdentifier) => {

		const updatedOrderForm = {...this.state.orderForm};

		const updatedFormElement = {...updatedOrderForm[inputIdentifier]}

		updatedFormElement.value = e.target.value;
		updatedFormElement.touched = true;

		updatedFormElement.isValid = this.formValidation(updatedFormElement.value, updatedFormElement.rules);

		updatedOrderForm[inputIdentifier] = updatedFormElement;

		let formIsValid = true;

		for(let inputIdentifier in updatedOrderForm){
			formIsValid = updatedOrderForm[inputIdentifier].isValid && formIsValid
		}

		this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})

	}

	render() {
		let formElementsArray = [];

		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			})
		}
	
		let form =(
			<form onSubmit={this.orderHandler}> 
				{formElementsArray.map(el => (
					<Input key={el.id} elementType={el.config.elementType} elementConfig={el.config.elementConfig} value={el.config.value} changed={(event)=> this.inputChangedHandler(event, el.id)} inValid={!el.config.isValid} shouldValidate={el.config.rules} touched={el.config.touched}/>
				))}
			  <Button btnType="Success" disabled={!this.state.formIsValid}> Order </Button>
			</form>);

		if (this.state.loading) {
			form = <Spinner />
		}

		return (
			<div className={classes.ContactData}>
			<h4>Enter your contact data</h4>
			{form}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		ings: state.ingredients,
		price: state.totalPrice
	}
}

export default connect(mapStateToProps)(ContactData);









