import React from 'react'
import Store from '../store'
import Modal from './Modal.react'
import Navbar from './Navbar.react'
import SearchActions from '../actions/search'
import NetworkActions from '../actions/network'
import BuySellPage from './buy-sell/BuySellPage.react'
import TokenSalePage from './token-sale/TokenSalePage.react'
import TokenPurchasePage from './token-purchase/TokenPurchasePage.react'
import { withRouter, Redirect, Switch, Route } from 'react-router-dom'

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = { error: null, connected: null, couldAccessAccount: null, fetching: false, search: {} }
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(NetworkActions.checkConnection())
    Store.dispatch(NetworkActions.checkAccountAccess())
  }

  render() {
    const connected = this.state.connected
    const couldAccessAccount = this.state.couldAccessAccount
    const fetching = connected && couldAccessAccount && this.state.fetching

    return (
      <div ref="app">
        <Navbar searchContract={address => this._searchContract(address)} />
        <div className="container">
          <div id="errors">{this.state.error ? this.state.error.message : ''}</div>
          <Switch>
            <Route path="/" exact component={BuySellPage}/>
            <Route path="/token-sale/:address" component={TokenSalePage}/>
            <Route path="/token-purchase/:address" component={TokenPurchasePage}/>
          </Switch>
        </div>
        <Modal open={fetching} progressBar message={'...loading...'}/>
        <Modal open={!connected} message={'Please access using MIST or Metamask'}/>
        <Modal open={connected && !couldAccessAccount} message={'Please enable your account'}/>
      </div>
    )
  }

  _searchContract(address) {
    if(address.length > 40) {
      Store.dispatch(SearchActions.searchContract(address))
    }
  }

  _onChange() {
    const state = Store.getState()
    this._redirectToContractForms(state)
    if(this.refs.app) this.setState({
      error: state.error,
      search: state.search,
      fetching: state.fetching,
      connected: state.network.connected,
      couldAccessAccount: state.network.couldAccessAccount
    })
  }

  _redirectToContractForms(state) {
    if(state.search.found) {
      state.search.tokenSale ?
        this.props.history.push(`/token-sale/${state.search.tokenSale}`) :
        this.props.history.push(`/token-purchase/${state.search.tokenPurchase}`)
      Store.dispatch(SearchActions.resetSearch())
    }
  }
}

export default withRouter(App);
