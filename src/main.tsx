import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// If you wrap your app with Redux Provider, import and use it as normal
// import { Provider } from "react-redux";
// import { store } from "@/redux/store";

import { refreshTokenOnStart } from "@/utils/auth";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

async function start() {
  // Wait for refresh to complete so initial requests get a fresh token
  await refreshTokenOnStart();

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
      <App />
      </Provider>
    </React.StrictMode>
  );
}

start();
