/**
 * Set up copy/paste for code blocks
 */
const clipboardButton = id =>
  `<a id="copy-button-${id}" class="btn copybtn o-tooltip--left" data-tooltip="Copy" data-clipboard-target="#${id}">
    <i class="far fa-copy"></i>
  </a>`

// Clears selected text since ClipboardJS will select the text when copying
const clearSelection = () => {
  if (window.getSelection) {
    window.getSelection().removeAllRanges()
  } else if (document.selection) {
    document.selection.empty()
  }
}

// Changes tooltip text for two seconds, then changes it back
const temporarilyChangeTooltip = (el, newText) => {
  const oldText = el.getAttribute('data-tooltip')
  el.setAttribute('data-tooltip', newText)
  setTimeout(() => el.setAttribute('data-tooltip', oldText), 2000)
}

const addCopyButtonToCodeCells = () => {
  // If ClipboardJS hasn't loaded, wait a bit and try again. This
  // happens because we load ClipboardJS asynchronously.
  if (window.ClipboardJS === undefined) {
    setTimeout(addCopyButtonToCodeCells, 250)
    return
  }

  pageElements['codeCells'].forEach((codeCell) => {
    const id = codeCell.getAttribute('id')
    if (document.getElementById("copy-button" + id) == null) {
      codeCell.insertAdjacentHTML('afterend', clipboardButton(id));
    }
  })

  const clipboard = new ClipboardJS('.copybtn')
  clipboard.on('success', event => {
    clearSelection()
    temporarilyChangeTooltip(event.trigger, 'Copied!')
  })

  clipboard.on('error', event => {
    temporarilyChangeTooltip(event.trigger, 'Failed to copy')
  })

  // Get rid of clipboard before the next page visit to avoid memory leak
  document.addEventListener('turbolinks:before-visit', () =>
    clipboard.destroy()
  )
}

initFunction(addCopyButtonToCodeCells);