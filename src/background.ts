async function openPopup(message: any) {
  const window = await chrome.windows.create({
    focused: true,
    height: 600,
    width: 400,
    type: 'popup',
    url: `index.html/#?${new URLSearchParams({ ...message.payload, fromInjection: true }).toString()}`,
  })

  chrome.windows.onFocusChanged.addListener(async () => {
    try {
      if (!window.id) return
      const popupWindow = await chrome.windows.get(window.id)

      if (!popupWindow.focused && popupWindow.id) {
        chrome.windows.remove(popupWindow.id)
      }
    } catch {
      /* empty */
    }
  })
}

const functionByType: Record<string, (message: any) => Promise<void>> = {
  OPEN_POPUP: openPopup,
}

chrome.runtime.onMessage.addListener(async (message: any) => {
  await functionByType[message.type](message)
})
