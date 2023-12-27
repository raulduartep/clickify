import ReactDOM from "react-dom/client";
import { UtilsHelper } from "./helpers/UtilsHelper";
import { ClickupContainer } from "./components/ClickupContainer";
import { ClickupHelper } from "./helpers/ClickupHelper";

console.info("Clickify Extension Info: content script loaded");

const createRoot = async () => {
  const htmlElement = await UtilsHelper.waitForElement(".cu-v2, .cu-v3");
  const version = htmlElement.className.includes("cu-v2") ? "v2" : "v3";
  const root = document.createElement("div");
  root.id = "clickify-extension-root";

  if (version === "v2") {
    const parent = await UtilsHelper.waitForElement(
      ".cu-task-header__section_rightside"
    );
    parent.insertBefore(root, parent.childNodes[0]);
  } else {
    const parent = await UtilsHelper.waitForElement(
      "cu-task-view-integrations-lazy"
    );
    parent.insertBefore(root, parent.childNodes[0]);
  }

  ReactDOM.createRoot(root).render(<ClickupContainer version={version} />);
};

const deleteRoot = () => {
  const root = document.getElementById("clickify-extension-root");
  if (root) {
    root.remove();
  }
};

const init = async () => {
  let url = document.location.href;

  if (ClickupHelper.isClickupTaskUrl(url)) {
    createRoot();
  }

  const observer = new MutationObserver(() => {
    if (url === document.location.href) return;
    url = document.location.href;

    if (ClickupHelper.isClickupTaskUrl(url)) {
      createRoot();
      return;
    }

    deleteRoot();
  });

  observer.observe(document.body, { childList: true, subtree: true });
};

init();
