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
import { logout } from "@/redux/actions/authAction";

async function start() {
  const ok = await refreshTokenOnStart();
  if (!ok) {
    store.dispatch<any>(logout());
    window.location.href = "/login";
    return;
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <Provider store={store}>
      <App />
      </Provider>
    </React.StrictMode>
  );
}

start();
