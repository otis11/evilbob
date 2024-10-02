let dialogId = 'bob'
let dialog = null
let search = null
let itemsContainer = null
let items = [{
    title: 'Test script',
}]
console.log('injected bob')


function createDialog() {
  dialog = document.createElement('dialog')
  dialog.id = dialogId
  search = document.createElement('input')
  search.type = 'text'
  search.placeholder = 'Search...'
  itemsContainer = document.createElement('ul')
  search.addEventListener('input', filterItems)
  dialog.appendChild(search)
  dialog.appendChild(itemsContainer)
  return dialog
}

function filterItems() {
    let filtered = items.filter(item => item.title.toLowerCase().includes(search.value.toLowerCase()))
    itemsContainer.innerHTML = filtered.map(item => `<li>${item.title}</li>`).join('')
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "bob.trigger") {
    if(!dialog) {
      dialog = createDialog()
      document.body.appendChild(dialog)
    }
    filterItems()
    dialog.showModal()
    search.focus()
  }
});