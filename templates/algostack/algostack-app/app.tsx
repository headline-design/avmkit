"use client";

import React from "react";
import { Provider } from "react-redux";
import ClientApp from "@/algostack-app/client-app";

import { configureReduxStores } from "@/dashboard/redux/store";

const store = configureReduxStores();

const App = () => {
  return (
    <Provider store={store}>
      <ClientApp />
    </Provider>
  );
}

export default App;
