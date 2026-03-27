import { config } from "../config-data.js"

let updatesNum = 0
let nuclearInteractions = 0
let currentBtn = 1

function detectBrowserLang() {
  const full = navigator.language || navigator.userLanguage
  const short = full.split("-")[0]
  const supported = ["en", "fr", "ja", "it", "es", "fa", "ur", "de", "ko", "ms"]
  return supported.includes(short) ? short : "en"
}

let currentLang = localStorage.getItem("langChoice") || detectBrowserLang()

// LANGUAGE
export function setLang(lang) {
  currentLang = lang
  localStorage.setItem("langChoice", lang)
}

export function getLang() {
  return currentLang
}

// NORMAL MODE COUNTER
export function getUpdatesNum() {
  return updatesNum
}

export function incrementUpdatesNum() {
  updatesNum += 1
}

export function resetUpdatesNum() {
  updatesNum = 0
}

// NUCLEAR MODE
export function isNuclear() {
  return updatesNum >= config.nuclearTrigger
}

export function getNuclearInteractions() {
  return nuclearInteractions
}

export function incrementNuclearInteractions() {
  nuclearInteractions += 1
}

export function shouldExitNuclear() {
  return nuclearInteractions >= config.nuclearEnd
}

export function resetNuclear() {
  updatesNum = 0
  nuclearInteractions = 0
}

// CURRENT BUTTON
export function updateCurrentBtn(btnId) {
  currentBtn = btnId
}

export function getCurrentBtn() {
  return currentBtn
}
