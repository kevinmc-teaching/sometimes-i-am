import * as buttons from "./buttons.js"
import * as sounds from "./sounds.js"
import * as state from "./state/language-state.js"
import * as textUpdates from "./text-updates.js"
import * as config from "./config.js"

const langMenu = document.getElementById("language-menu")

export function menuSetup() {
  const lang = state.getLang()
  const optionDefault = langMenu.querySelector(`option[value=${lang}]`)
  if (optionDefault) optionDefault.selected = true

  document.body.classList.add(`lang-${lang}`)
  textUpdates.showInstructions()

  langMenu.addEventListener("change", function (e) {
    e.stopPropagation()
    const langChoice = e.target.value

    state.setLang(langChoice)
    buttons.resetPolyglotUI()
    textUpdates.updateUIText(langChoice)

    const adminPanel = document.querySelector(".admin-panel")
    if (adminPanel?.classList?.contains("admin-visible")) {
      config.translatePreferenceLabels(langChoice)
    }

    textUpdates.showInstructions()
    buttons.removeButtons()
    buttons.addButtons()
    toggleBodyLangClass(langChoice)
    sounds.removeSounds()
    sounds.loadSounds(langChoice)
    textUpdates.removeTextNodes()
    config.syncAdminPanelFromConfig()
  })

  // Hide instructions on any click outside the language menu
  window.addEventListener("click", (e) => {
    if (e.target.closest("#language-menu")) return
    textUpdates.hideInstructions()
  })
}

function toggleBodyLangClass(newClass) {
  document.body.classList.forEach((cls) => {
    if (cls.startsWith("lang-")) {
      document.body.classList.remove(cls)
    }
  })
  document.body.classList.add(`lang-${newClass}`)
}
