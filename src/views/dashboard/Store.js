import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {

  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,
    batches: localStorage.getItem('batches')
    ? JSON.parse(localStorage.getItem('batches'))
    : null,

  
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
        return{ ...state, batches:action.payload }
    }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}


// how to use 
// code 

// import { useContext } from 'react';
// import { Store } from <>path</>;

// const { state, dispatch: ctxDispatch } = useContext(Store);
//  const { userInfo , batches } = state;

//  const submitHandler = async (e) => {

//     e.preventDefault();

//     Axios.get(`${base_url}/manage/get_batches`, {  
//         headers: {
//           authorization: `Bearer ${userInfo.token}`,
//         },
      
              
//     })
//     .then((response)=>{
//       ctxDispatch({ type: 'GET_BATCHES', payload: response });
//       localStorage.setItem('batches', JSON.stringify(response));
//       navigate('/home')
//     })
//     .catch((error)=>{
//       console.log(error);
      
//     })

//   };
