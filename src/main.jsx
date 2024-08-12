import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import "./scss/index.scss";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ConfigProvider } from "antd";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { configureStore } from "@reduxjs/toolkit";
import { reducers } from './redux/store.js'

const persistConfig = {
  key: "root",
  storage,
};
const persistReducers = persistReducer(persistConfig , reducers);
const store = configureStore({
  reducer: persistReducers,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(({
    serializableCheck : false
  })),
});
const persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
          <GoogleOAuthProvider clientId="412760261459-noepjutocuui1bn3dq0r28oim676cs8k.apps.googleusercontent.com">
            <ConfigProvider
              theme={{
                token: {
                  fontFamily: "Poppins",
                  colorPrimary: "#8c193f",
                },
              }}
            >
              <App />
            </ConfigProvider>
            </GoogleOAuthProvider>
          </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
