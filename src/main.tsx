import React from "react";
import ReactDOM from "react-dom/client";
import { setupListeners } from "@reduxjs/toolkit/query";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { appRouter } from "./app/routes";
import { store } from "./app/store";

setupListeners(store.dispatch);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={appRouter} />
    </Provider>
  </React.StrictMode>,
);
