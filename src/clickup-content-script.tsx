import ReactDOM from 'react-dom/client'

import { ClickupInjectContainer } from '@containers/clickup-inject'
import { ClickupHelper } from '@helpers/clickup'
import { StorageHelper } from '@helpers/storage'
import { UtilsHelper } from '@helpers/utils'

console.info('Clickify Extension Info: content script loaded')

const createRoot = async () => {
  const version = await ClickupHelper.getClickupVersion()

  const alreadyExist = document.getElementById('clickify-extension-root')
  if (alreadyExist) return

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

  chrome.runtime.onMessage.addListener(
    UtilsHelper.wrapAsyncFunction(async (message: any) => {
      if (message.type === 'GET_TASK') {
        const version = await ClickupHelper.getClickupVersion()
        const { projects } = await StorageHelper.get(['projects'])

        const description = ClickupHelper.getCurrentTimeEntryDescription(version)
        const project = ClickupHelper.getCurrentProject(projects, version)

        return {
          description,
          project,
        }
      }
    })
  )
}

init()
