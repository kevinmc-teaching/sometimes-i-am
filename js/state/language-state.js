import { config } from "../config-data.js"

let updatesNum = 0
let polyglotInteractions = 0
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

// POLYGLOT MODE
export function isPolyglot() {
  return updatesNum >= config.polyglotTrigger
}

export function getPolyglotInteractions() {
  return polyglotInteractions
}

export function incrementPolyglotInteractions() {
  polyglotInteractions += 1
}

export function shouldExitPolyglot() {
  return polyglotInteractions >= config.polyglotEnd
}

export function resetPolyglot() {
  updatesNum = 0
  polyglotInteractions = 0
}

// CURRENT BUTTON
export function updateCurrentBtn(btnId) {
  currentBtn = btnId
}

export function getCurrentBtn() {
  return currentBtn
}
