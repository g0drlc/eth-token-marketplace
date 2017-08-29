import React from 'react'
import Store from '../../store'
import TokenSaleActions from '../../actions/tokensales'

export default class TokenSaleForm extends React.Component {
  constructor(props){
    super(props)
    this.state = { buyerAddress: '', tokenSale: null, tokenSaleAddress: this.props.tokenSaleAddress }
    this._handleSubmit = this._handleSubmit.bind(this)
    this._updateBuyerAddress = this._updateBuyerAddress.bind(this)
  }

  componentDidMount() {
    Store.subscribe(() => this._onChange())
    Store.dispatch(TokenSaleActions.getTokenSale(this.state.tokenSaleAddress))
  }

  render() {
    const tokenSale = this.state.tokenSale;
    return (
      <div ref="tokenSaleForm">
        {(tokenSale === null) ?
          'Loading...' :
          <form onSubmit={this._handleSubmit}>
            <h3>Apply token sale</h3>
            <div>
              <p className="address">Address <span>{tokenSale.address}</span></p>
              <p className="seller">Seller <span>{tokenSale.seller}</span></p>
              <p className="tokens">Tokens <span>{tokenSale.amount}</span></p>
              <p className="price">Wei <span>{tokenSale.price}</span></p>
              <p className="status">Status <span>{tokenSale.closed ? 'Closed' : 'Opened'}</span></p>
            </div>
            <div className="form-group row">
              <label htmlFor="contract-address" className="col-sm-3 col-form-label">Token Sale (address)</label>
              <div className="col-sm-9"><input value={tokenSale.address} className="form-control" id="contract-address" disabled required/></div>
            </div>
            <div className="form-group row">
              <label htmlFor="buyer-address" className="col-sm-3 col-form-label">You (address)</label>
              <div className="col-sm-9"><input value={this.state.buyerAddress} onChange={this._updateBuyerAddress} className="form-control" id="buyer-address" required/></div>
            </div>
            <button id="apply" className="btn btn-primary">Apply</button>
          </form>
        }
      </div>
    )
  }

  _handleSubmit(e) {
    e.preventDefault()
    Store.dispatch(TokenSaleActions.apply(this.state.tokenSale.address, this.state.buyerAddress))
  }

  _updateBuyerAddress(e) {
    e.preventDefault()
    this.setState({ buyerAddress: e.target.value })
  }

  _onChange() {
    const state = Store.getState();
    if(this.refs.tokenSaleForm && state.tokenSale !== this.state.tokenSale) {
      this.setState({ tokenSale: state.tokenSale });
    }
  }
}
