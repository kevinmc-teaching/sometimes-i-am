import { config, configResetData, STORAGE_KEY } from "./config-data.js"
import { PREFERENCES_TEXT } from "./ui-text.js"
import { getLang } from "./state/language-state.js"

export { config, configResetData }

const adminPanel = document.querySelector(".admin-panel")
const openPrefsBtn = document.querySelector(".btn-config")
const PREFS_BTN_KEY = "prefsBtnVisible"

// Apply stored button visibility on page load
;(() => {
  const stored = localStorage.getItem(PREFS_BTN_KEY)
  if (stored === "false") openPrefsBtn.style.display = "none"
})()

adminPanel.addEventListener("input", handleAdminChange)
adminPanel.addEventListener("change", handleAdminChange)

openPrefsBtn.addEventListener("click", () => {
  translatePreferenceLabels()
  openPreferencesPanel()
})

// Keyboard shortcut: type "@@@" to toggle preferences panel
// Keyboard shortcut: type "xxx" or "XXX" to toggle visibility of the preferences button
;(() => {
  let buffer = ""
  const TRIGGER_PANEL = "@@@"
  const TRIGGER_BTN = "xxx"
  const TRIGGER_BTN_UPPER = "XXX"
  const MAX_LEN = Math.max(TRIGGER_PANEL.length, TRIGGER_BTN.length)

  document.addEventListener("keydown", (e) => {
    const t = e.target
    const tag = t && t.tagName
    if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return
    if (typeof e.key !== "string" || e.key.length !== 1) return

    buffer = (buffer + e.key).slice(-MAX_LEN)

    if (buffer.endsWith(TRIGGER_PANEL)) {
      translatePreferenceLabels()
      openPreferencesPanel()
      buffer = ""
    } else if (buffer.endsWith(TRIGGER_BTN) || buffer.endsWith(TRIGGER_BTN_UPPER)) {
      togglePrefsButton()
      buffer = ""
    }
  })
})()

function togglePrefsButton() {
  const hidden = openPrefsBtn.style.display === "none"
  openPrefsBtn.style.display = hidden ? "" : "none"
  localStorage.setItem(PREFS_BTN_KEY, String(hidden))
}

export function translatePreferenceLabels(lang = getLang()) {
  const dict = PREFERENCES_TEXT?.[lang] ?? PREFERENCES_TEXT?.en ?? {}
  const labels = adminPanel.querySelectorAll("label[for]")

  labels.forEach((label) => {
    const key = label.getAttribute("for")
    const translated = dict[key]
    if (typeof translated === "string" && translated.trim()) {
      label.textContent = translated
    }
  })
}

function openPreferencesPanel() {
  const isOpen = adminPanel.classList.toggle("admin-visible")
  adminPanel.setAttribute("aria-hidden", String(!isOpen))
  openPrefsBtn.setAttribute("aria-expanded", String(isOpen))
}

function handleAdminChange(e) {
  const input = e.target.closest("input")
  if (!input || !adminPanel.contains(input)) return

  const { id, type, checked } = input

  if (type === "checkbox" && id === "reset-to-defaults") {
    if (checked) resetToDefaults()
    input.checked = false
    return
  }

  if (type === "checkbox" && id in config) {
    config[id] = checked
    saveConfig()
    return
  }

  if (type === "range") {
    updateConfig(id, input.value)
    updateOutput(id, input.value)
  }
}

export function updateConfig(id, rawValue) {
  if (!(id in config)) return
  const num = Number(rawValue)
  if (Number.isNaN(num)) return
  config[id] = num
  saveConfig()
}

export function resetToDefaults() {
  for (const [key, val] of Object.entries(configResetData)) {
    if (key in config) config[key] = val
  }
  localStorage.removeItem(STORAGE_KEY)
  syncAdminPanelFromConfig()
}

export function syncAdminPanelFromConfig() {
  const sliders = adminPanel.querySelectorAll("input[type='range']")
  sliders.forEach((slider) => {
    const key = slider.id
    if (key in config) {
      slider.value = String(config[key])
      updateOutput(slider.id, config[key])
    }
  })

  const checkboxes = adminPanel.querySelectorAll("input[type='checkbox']")
  checkboxes.forEach((checkbox) => {
    const key = checkbox.id
    if (key in config && typeof config[key] === "boolean") {
      checkbox.checked = config[key]
    }
  })
}

function saveConfig() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

const OUTPUT_UNITS = {
  maxFZMessage: "cqw",
  maxFZSynonym: "cqw",
  maxFZMessageNode: "cqw",
  maxFZSynonymNode: "cqw",
  maxRotation: "°",
}

function updateOutput(id, value) {
  const output = adminPanel.querySelector(`output[for="${id}"]`)
  if (output) output.value = `${value}${OUTPUT_UNITS[id] ?? ""}`
}
