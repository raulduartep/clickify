import ReactDOM from "react-dom/client";
import { URLHelper } from "./helpers/URLHelper";
import { TimeButton } from "./components/TimeButton";

console.info("ClickClock Extension Info: content script loaded");

const waitForElement = async (selector: string) => {
  return new Promise<Element>((resolve) => {
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    const observer = new MutationObserver(() => {
      const mutationElement = document.querySelector(selector);
      if (mutationElement) {
        resolve(mutationElement);
        observer.disconnect();
        return;
      }
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
    });
  });
};

const createRoot = async () => {
  const element = await waitForElement(".cu-task-header__section_rightside ");

  const root = document.createElement("div");
  root.id = "click-clock-extension-root";
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
