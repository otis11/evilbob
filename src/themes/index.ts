import "./dark.css"

type Theme = 'dark'
const defaultTheme: Theme = 'dark'

function setCurrentTheme(theme: Theme) {
    chrome.storage.sync.set({'theme': theme})
    globalThis.document.documentElement.setAttribute('data-theme', theme)
}

async function getCurrentTheme() {
    const result = await chrome.storage.sync.get(['theme'])
    return result.theme || defaultTheme
}

;(async () => {
    setCurrentTheme(await getCurrentTheme())
})()
