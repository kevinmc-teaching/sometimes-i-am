import { config } from "./config-data.js"
import * as state from "./state/language-state.js"
import { TEXTDATA } from "./text-data.js"
import * as textUpdates from "./text-updates.js"
import * as sounds from "./sounds.js"

const buttonContainer = document.querySelector(".button-grid")
const nuclearStatus = document.getElementById("nuclear-status")
const nuclearCurrentEl = document.getElementById("nuclear-current")
const nuclearEndEl = document.getElementById("nuclear-end")
let abortController = null

export function addButtons() {
  const lang = state.getLang()
  const btnQuantity = Object.keys(TEXTDATA[lang]).length

  const gridClass =
    btnQuantity <= 60
      ? "grid-small"
      : btnQuantity <= 70
      ? "grid-medium"
      : "grid-large"

  buttonContainer.classList.add(gridClass)

  const frag = document.createDocumentFragment()
  for (let i = 0; i < btnQuantity; i++) {
    const btn = document.createElement("button")
    btn.type = "button"
    btn.className = `btn-${i + 1}`
    btn.dataset.buttonId = String(i + 1)
    btn.textContent = String(i + 1)
    frag.appendChild(btn)
  }
  buttonContainer.appendChild(frag)

  abortController = new AbortController()
  const { signal } = abortController
  buttonContainer.addEventListener("click", doButtonStuff, { signal })
  buttonContainer.addEventListener("pointerover", doButtonStuff, { signal })
}

export function removeButtons() {
  if (abortController) {
    abortController.abort()
    abortController = null
  }
  buttonContainer.classList.remove("grid-small", "grid-medium", "grid-large")
  buttonContainer.querySelectorAll("button").forEach((btn) => btn.remove())
}

function doButtonStuff(e) {
  if (e.type === "pointerover" && e.pointerType !== "mouse") return

  const targetedElement = e.target
  if (!targetedElement || targetedElement.tagName !== "BUTTON") return

  const btnId = Number(targetedElement.dataset.buttonId)
  if (!Number.isFinite(btnId)) return

  state.updateCurrentBtn(btnId)

  if (state.isNuclear()) {
    // Hide main text and show status panel on first nuclear interaction
    if (state.getNuclearInteractions() === 0) {
      if (config.hideMainTextAtNuclear) textUpdates.hideMainText()
      nuclearEndEl.textContent = config.nuclearEnd
      nuclearStatus.hidden = false
    }

    textUpdates.newTextNode()
    state.incrementNuclearInteractions()
    nuclearCurrentEl.textContent = state.getNuclearInteractions()

    if (state.shouldExitNuclear()) {
      exitNuclearMode()
    }
    return
  }

  textUpdates.updateMainText(btnId)
  sounds.playSound(btnId)
  state.incrementUpdatesNum()
}

function exitNuclearMode() {
  state.resetNuclear()
  textUpdates.showMainText()
  textUpdates.fadeOutTextNodes(() => {
    nuclearStatus.hidden = true
    nuclearCurrentEl.textContent = "0"
  })
}

export function resetNuclearUI() {
  state.resetNuclear()
  textUpdates.showMainText()
  nuclearStatus.hidden = true
  nuclearCurrentEl.textContent = "0"
}
