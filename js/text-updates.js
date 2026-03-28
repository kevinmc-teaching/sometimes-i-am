import * as state from "./state/language-state.js"
import { SITENAMES, INSTRUCTIONS } from "./ui-text.js"
import { TEXTDATA, LANG_MAP } from "./text-data.js"
import { config } from "./config-data.js"
import * as sounds from "./sounds.js"


let activeColorChannel = null

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

  if (config.colorsMode && activeColorChannel === null) {
    activeColorChannel = ["r", "g", "b"][Math.floor(Math.random() * 3)]
  }

  // Enforce node cap — remove oldest if at limit
  const existingNodes = messagesWrapper.querySelectorAll(".new-text-node")
  if (existingNodes.length >= config.maxNuclearNodes) {
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
  newNodeWrapper.style.top = `${loc.y}px`
  newNodeWrapper.style.left = `${loc.x}px`
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
  activeColorChannel = null
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
  activeColorChannel = null
}

function randomNumber(input) {
  return Math.ceil(Math.random() * input)
}

function randomFontSize(input) {
  return `${randomNumber(input)}cqw`
}

function randomColor() {
  const val = Math.floor(Math.random() * 128)
  const r = activeColorChannel === "r" ? val : 0
  const g = activeColorChannel === "g" ? val : 0
  const b = activeColorChannel === "b" ? val : 0
  return `rgb(${r} ${g} ${b})`
}

function randomGrey() {
  return `hsl(0 0% ${40 + Math.random() * 30}%)`
}
