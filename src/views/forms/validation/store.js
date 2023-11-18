import React from 'react';
// import PropTypes from 'prop-types'; // Import PropTypes
import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem('accessToken')
    ? localStorage.getItem('accessToken')
    : null,
  batches: [],
  semesters: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null
      };
    case 'GET_BATCHES':
      return {
        ...state,
        batches : action.payload
      };
    case 'ADD_BATCHES':
      return{
        ...state,
        batches: state.batches.push(action.payload),
      }
    case 'GET_SEM':
      return {
        ...state,
        semesters: action.payload
      }
    case 'ADD_SEM':
      return {
        ...state,
        semesters: state.semesters.push(action.payload)
      }
    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}

// // Add propTypes validation
// StoreProvider.propTypes = {
//   children: PropTypes.node.isRequired
// };
