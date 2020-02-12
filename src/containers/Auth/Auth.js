import React, {Component} from 'react';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';
import {connect} from "react-redux";
import Spinner from '../../components/UI/Spinner/Spinner'
import {Redirect} from 'react-router-dom'
import {formValidation} from '../../shared/utility'

class Auth extends Component {
	state = {
		controls: {
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'email',
					placeholder: 'Your Username'
				},
				value: '',
				isValid: false,
				rules: {
					required: true,
					isEmail: true
				},
				touched: false
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: 'password',
					placeholder: 'Your Password'
				},
				value: '',
				isValid: false,
				rules: {
					required: true,
					minLength: 6
				},
				touched: false
			}
		},
		isSignup: true
	}

	componentDidMount () {
		if (!this.props.building && this.props.authRedirect !== '/') {
			this.props.onSetAuthRedirectPath();
		}
	}

	inputChangedHandler = (e, controlName) => {
		const updatedControls = {
			...this.state.controls,
			[controlName]: {
				...this.state.controls[controlName],
				value: e.target.value,
				isValid: formValidation(e.target.value, this.state.controls[controlName].rules),
				touched: true
			}
		}

		this.setState({controls: updatedControls})
	}

	submitHandler = (e) => {
   	e.preventDefault();
   	this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup)
  }

  switchAuthModeHandler = () => {
  	this.setState(prevState => {
  		return {
  			isSignup: !prevState.isSignup
  		}
  	})
  }


	render() {
		let formElementsArray = [];

		for (let key in this.state.controls) {
			formElementsArray.push({
				id: key,
				config: this.state.controls[key]
			})
		}

		let form =formElementsArray.map(el => (
			<Input key={el.id} elementType={el.config.elementType} elementConfig={el.config.elementConfig} value={el.config.value} changed={(event)=> this.inputChangedHandler(event, el.id)} inValid={!el.config.isValid} shouldValidate={el.config.rules} touched={el.config.touched}/>
		))

    if (this.props.loading) {
    	form = <Spinner />
    }

    let errorMessage = null;

    if (this.props.error) {
    	errorMessage = <p>{this.props.error.message}</p>
    }

    let authRedirect = null;

    if (this.props.isAuthenticated) {
    	authRedirect = <Redirect to={this.props.authRedirect} />
    }

		return (
			<div className={classes.Auth}>
			{authRedirect}
			{errorMessage}
				<form onSubmit= {this.submitHandler}>
					{form}
					<Button btnType="Success"> Submit </Button>	
				</form>
				<Button clicked={this.switchAuthModeHandler} btnType="Danger"> Switch to {this.state.isSignup ? 'SIGN IN' : 'SIGN UP'} </Button>
			</div>
		)
	}
}
const mapStateToProps = state => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuthenticated: state.auth.idToken,
		building: state.burgerBuilder.building,
		authRedirect: state.auth.authRedirectPath
	}
}


const mapDispatchToProps = dispatch => {
	return{
		onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);