import React from "react";
import ReactDOM from "react-dom/client";
import { StartTimeButton } from "./components/StartTimeButton";
import { URLHelper } from "./helpers/URLHelper";

console.log("CLickup-Clockify-Integration content script loaded");

const createRoot = () => {
  const root = document.createElement("div");
  root.id = "crx-root";
  document.body.appendChild(root);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <StartTimeButton />
    </React.StrictMode>
  );
};

const deleteRoot = () => {
  const root = document.getElementById("crx-root");
  if (root) {
    root.remove();
  }
};

const init = async () => {
  let url = document.location.href;

  document.onreadystatechange = () => {
    console.log(document.readyState);
  };

  window.onload = () => {
    console.log("window loaded");
  };

  window.onunload = () => {
    console.log("window unloaded");
  };

  if (URLHelper.isClickupTaskUrl(url)) {
    createRoot();
  }

  const observer = new MutationObserver(() => {
    if (url === document.location.href) return;
    url = document.location.href;

    if (URLHelper.isClickupTaskUrl(url)) {
      createRoot();
      return;
    }

    deleteRoot();
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

init();
