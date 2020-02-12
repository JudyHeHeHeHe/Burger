import React, {Component} from 'react';
import classes from './Layout.css';
import Aux from '../Aux/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'
import {connect} from 'react-redux'


class Layout extends Component {
	state ={
		showSideDrawer: false
	}

	SideDrawerClosedHandler = () => {
		this.setState({showSideDrawer:false})
	}

	SideDrawerToggleHandler = () => {
    this.setState((prevState) => {
    	return {
    		showSideDrawer:!this.state.showSideDrawer
    	}
    })
	}

	render (){
		return (
			<Aux>
			  <Toolbar DrawerToggleClicked = {this.SideDrawerToggleHandler} isAuth={this.props.isAuthenticated}/>
			  <SideDrawer open={this.state.showSideDrawer} closed={this.SideDrawerClosedHandler} isAuth={this.props.isAuthenticated}/>
				<main className={classes.Content}>
					{this.props.children}
				</main>
			</Aux>
		)
	}
}
const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.idToken
	}
}
export default connect(mapStateToProps)(Layout);