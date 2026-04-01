import * as state from "./state/language-state.js"
import { SITENAMES, INSTRUCTIONS } from "./ui-text.js"
import { TEXTDATA, LANG_MAP } from "./text-data.js"
import { config } from "./config-data.js"
import * as sounds from "./sounds.js"


let activeColor = null

const activeSitenameSpan = document.getElementById("active-sitename")
const instructionTextSpan = document.querySelector(".instruction-text")
const langMenu = document.getElementById("language-menu")
const messagesWrapper = document.querySelector(".messages-output-wrapper")
const messageTextEl = document.querySelector(".message-text")
const messageSynonymEl = document.querySelector(".message-synonym")

export function hideInstructions() {
  instructionTextSpan.style.display = "none"
}

export function showInstructions() {
  instructionTextSpan.style.display = "block"
}

export function hideMainText() {
  messageTextEl.style.visibility = "hidden"
  messageSynonymEl.style.visibility = "hidden"
}

export function showMainText() {
  messageTextEl.style.visibility = "visible"
  messageSynonymEl.style.visibility = "visible"
}

export function updateUIText(lang) {
  const optionDefault = langMenu.querySelector(`option[value=${lang}]`)
  if (optionDefault) optionDefault.selected = true

  document.body.className = ""
  document.body.classList.add(`lang-${lang}`)

  activeSitenameSpan.textContent = SITENAMES[lang] ?? ""
  instructionTextSpan.textContent = INSTRUCTIONS[lang] ?? ""
}

export function updateMainText(btnIdOverride) {
  const lang = state.getLang()
  const btnId = Number(btnIdOverride ?? state.getCurrentBtn())

  const entry = TEXTDATA?.[lang]?.[btnId]
  if (!entry) return

  messageTextEl.textContent = entry.text ?? ""
  messageTextEl.style.fontSize = randomFontSize(config.maxFZMessage)

  messageSynonymEl.textContent = entry.synonym ?? ""
  messageSynonymEl.style.fontSize = randomFontSize(config.maxFZSynonym)
}

export function newTextNode() {
  const { language, text, synonym, sound, number } = randomTextBlock()

  if (config.colorsMode && activeColor === null) {
    const picks = [config.colorPick1, config.colorPick2, config.colorPick3]
    activeColor = picks[Math.floor(Math.random() * picks.length)]
  }

  // Enforce node cap — remove oldest if at limit
  const existingNodes = messagesWrapper.querySelectorAll(".new-text-node")
  if (existingNodes.length >= config.maxPolyglotNodes) {
    existingNodes[0].remove()
  }

  const newNodeWrapper = document.createElement("div")
  newNodeWrapper.classList.add("new-text-node")
  newNodeWrapper.style.rotate = `${(Math.random() * 2 - 1) * config.maxRotation}deg`

  const newMessage = document.createElement("p")
  newMessage.textContent = text
  newMessage.classList.add("message-text")
  newMessage.style.fontSize = randomFontSize(config.maxFZMessageNode)
  if (config.colorsMode) newMessage.style.color = randomColor()
  newNodeWrapper.appendChild(newMessage)

  const newSynonym = document.createElement("p")
  newSynonym.textContent = synonym
  newSynonym.classList.add("message-synonym", "synonym-node")
  newSynonym.style.fontSize = randomFontSize(config.maxFZSynonymNode)
  if (config.colorsMode) newSynonym.style.color = randomGrey()
  newNodeWrapper.appendChild(newSynonym)

  messagesWrapper.appendChild(newNodeWrapper)

  newNodeWrapper.style.position = "absolute"
  const loc = randomLocation()
  const nodeW = newNodeWrapper.offsetWidth
  const maxX = messagesWrapper.clientWidth - nodeW / 2
  newNodeWrapper.style.left = `${Math.min(loc.x, maxX)}px`
  newNodeWrapper.style.top = `${loc.y}px`
  newNodeWrapper.style.opacity = randomOpacity()

  sounds.randomSound(language, number, sound)
}

function randomTextBlock() {
  const languages = Object.keys(SITENAMES)
  const randLang = languages[Math.floor(Math.random() * languages.length)]
  const randData = TEXTDATA[randLang]
  const keys = Object.keys(randData)
  const randKey = keys[Math.floor(Math.random() * keys.length)]
  const randPhraseBlock = randData[randKey]

  return {
    language: randLang,
    text: randPhraseBlock.text,
    synonym: randPhraseBlock.synonym,
    sound: randPhraseBlock.sound,
    number: randPhraseBlock.soundNum,
  }
}

function randomLocation() {
  const w = messagesWrapper.clientWidth
  const h = messagesWrapper.clientHeight
  return {
    x: Math.ceil(Math.random() * w),
    y: Math.ceil(Math.random() * h),
  }
}

function randomOpacity() {
  return (
    Math.random() * config.nodeOpacityTopLimit + config.nodeOpacityBtmLimit
  ).toFixed(2)
}

export function removeTextNodes() {
  messagesWrapper.querySelectorAll(".new-text-node").forEach((n) => n.remove())
  activeColor = null
}

export function fadeOutTextNodes(onComplete) {
  const nodes = [...messagesWrapper.querySelectorAll(".new-text-node")]
  nodes.forEach((n) => {
    n.style.transition = "opacity 1s"
    n.style.opacity = "0"
  })
  setTimeout(() => {
    nodes.forEach((n) => n.remove())
    onComplete?.()
  }, 1000)
  activeColor = null
}

function randomNumber(input) {
  return Math.ceil(Math.random() * input)
}

function randomFontSize(input) {
  return `${randomNumber(input)}cqw`
}

function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, Math.round(l * 100)]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h
  switch (max) {
    case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
    case g: h = ((b - r) / d + 2) / 6; break
    case b: h = ((r - g) / d + 4) / 6; break
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function randomColor() {
  const [h, s] = hexToHsl(activeColor)
  const l = 10 + Math.floor(Math.random() * 55)
  return `hsl(${h} ${s}% ${l}%)`
}

function randomGrey() {
  return `hsl(0 0% ${40 + Math.random() * 30}%)`
}
