import ReactDOM from "react-dom/client";
import { URLHelper } from "./helpers/URLHelper";
import { TimeButton } from "./components/TimeButton";
import { UtilsHelper } from "./helpers/UtilsHelper";

console.info("Clickify Extension Info: content script loaded");

const createRoot = async () => {
  const element = await UtilsHelper.waitForElement(
    ".cu-task-header__section_rightside "
  );

  const root = document.createElement("div");
  root.id = "clickify-extension-root";
  element.insertBefore(root, element.childNodes[0]);

  ReactDOM.createRoot(root).render(<TimeButton />);
};

const deleteRoot = () => {
  const root = document.getElementById("crx-root");
  if (root) {
    root.remove();
  }
};

const init = async () => {
  let url = document.location.href;

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
