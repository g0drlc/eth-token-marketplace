import React from 'react';
import * as ActionTypes from '../actiontypes'

const initialState = { address: '', balance: 0, tokens: 0 };

const AccountsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.RECEIVE_ACCOUNT:
      return Object.assign({}, state, { address: action.address });
    case ActionTypes.RECEIVE_ETHER_BALANCE:
      return Object.assign({}, state, { balance: action.balance.toString() });
    case ActionTypes.RECEIVE_TOKEN_BALANCE:
      return Object.assign({}, state, { tokens: action.tokens.toString() });
    default:
      return state
  }
};

export default AccountsReducer;
