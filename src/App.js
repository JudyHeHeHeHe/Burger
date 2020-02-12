import React, {Component} from 'react';
import Layout from "./hoc/Layout/Layout";
import BurderBuilder from './containers/BurgerBuilder/BurgerBuilder';
import {Route, withRouter, Switch, Redirect} from 'react-router-dom';
import Logout from './containers/Auth/Logout/Logout'
import * as actions from './store/actions/index'
import {connect} from 'react-redux'

import asyncComponent from './hoc/asyncComponent/asyncComponent';

const asyncCheckout = asyncComponent(() => {
  return import('./containers/Checkout/Checkout');
})

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth');
})

const asyncOrders = asyncComponent(() => {
  return import('./containers/Orders/Orders');
})

class App extends Component {
  componentDidMount () {
    this.props.onAuthCheck()
  }


  render(){

    let routes = (
      <Switch>
        <Route path="/" exact component={BurderBuilder} />
        <Route path="/auth" component={asyncAuth}/>
        <Redirect to ="/" />
      </Switch>
    );

    if (this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/" exact component={BurderBuilder} />
          <Route path="/checkout" component={asyncCheckout} />
          <Route path="/orders" component={asyncOrders}/>
          <Route path="/logout" component={Logout}/>
          <Route path="/auth" component={asyncAuth}/>
          <Redirect to ="/" />
       </Switch>
      )
      
    }
    return (
      <div>
        <Layout>
          {routes}
        </Layout>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.idToken !== null
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAuthCheck: () => dispatch(actions.checkStatus())
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));