import { configureStore } from "@reduxjs/toolkit";
import authUserReducer from "./reducers/authSlice";
import userSlice from "./reducers/user";
import { thunk } from "redux-thunk";
import appDataSlice from "./reducers/appData";
// Define the root reducer
const rootReducer = {
  authUser: authUserReducer,
  User: userSlice,
  appData: appDataSlice,
  // Add other reducers here if needed
};

// Configure the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

/**
 * Get store
 */
export const getStore = () => store;
export default store;
