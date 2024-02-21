import ReactDOM from 'react-dom/client'

import { ClickupInjectContainer } from '@containers/clickup-inject'
import { ClickupHelper } from '@helpers/clickup'
import { StorageHelper } from '@helpers/storage'
import { UtilsHelper } from '@helpers/utils'

console.info('Clickify Extension Info: content script loaded')

const createRoot = async () => {
  const htmlElement = await UtilsHelper.waitForElement('.cu-v2, .cu-v3')
  const version = htmlElement.className.includes('cu-v2') ? 'v2' : 'v3'
  const root = document.createElement('div')
  root.id = 'clickify-extension-root'

  if (version === 'v2') {
    const parent = await UtilsHelper.waitForElement('.cu-task-header__section_rightside')
    parent.insertBefore(root, parent.childNodes[0])
  } else {
    const parent = await UtilsHelper.waitForElement('.cu-task-hero-section__actions')
    parent.insertBefore(root, parent.childNodes[2])
  }

  ReactDOM.createRoot(root).render(<ClickupInjectContainer version={version} />)
}

const deleteRoot = () => {
  const root = document.getElementById('clickify-extension-root')
  if (root) {
    root.remove()
  }
}

const init = async () => {
  const { apiKey } = await StorageHelper.get(['apiKey'])
  if (!apiKey) {
    console.info('Clickify Extension Info: API Key not found. Please open the extension and set your API Key.')
    return
  }

  let url = document.location.href

  if (ClickupHelper.isClickupTaskUrl(url)) {
    createRoot()
  }

  const observer = new MutationObserver(() => {
    if (url === document.location.href) return
    url = document.location.href

    if (ClickupHelper.isClickupTaskUrl(url)) {
      createRoot()
      return
    }

    deleteRoot()
  })

  observer.observe(document.body, { childList: true, subtree: true })
}

init()
