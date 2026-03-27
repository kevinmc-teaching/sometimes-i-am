import { TEXTDATA, LANG_MAP } from "./text-data.js"
import { config } from "./config-data.js"

const activeSounds = []

export function loadSounds(lang) {
  const soundsData = TEXTDATA[lang]
  const fullLang = LANG_MAP[lang]

  for (const key of Object.keys(soundsData)) {
    const entry = soundsData[key]
    const audio = document.createElement("audio")
    audio.id = `sound-${entry.soundNum}`
    audio.dataset.playing = "false"
    audio.src = `./sounds/${fullLang}/${entry.sound}`
    audio.addEventListener("error", () => {
      console.warn(`Audio not found: sounds/${fullLang}/${entry.sound}`)
    })
    addSoundListeners(audio)
    document.body.appendChild(audio)
  }
}

export function removeSounds() {
  document.querySelectorAll("audio").forEach((s) => document.body.removeChild(s))
  activeSounds.length = 0
}

export function randomSound(language, soundNum, sound) {
  const fullLang = LANG_MAP[language]
  if (!fullLang) return

  const audio = document.createElement("audio")
  audio.src = `./sounds/${fullLang}/${sound}`
  audio.addEventListener("error", () => {
    console.warn(`Random audio not found: sounds/${fullLang}/${sound}`)
    if (audio.parentNode) audio.parentNode.removeChild(audio)
  })
  audio.addEventListener("ended", () => {
    if (audio.parentNode) audio.parentNode.removeChild(audio)
  })
  document.body.appendChild(audio)
  audio.play().catch((err) => {
    console.warn(`Could not play random audio: ${err.message}`)
  })
}

export function playSound(btnId = 1) {
  const sound = document.querySelector(`#sound-${btnId}`)
  if (!sound) return

  const i = activeSounds.indexOf(sound)
  if (i !== -1) activeSounds.splice(i, 1)
  activeSounds.unshift(sound)

  sound.volume = config.baseVolume
  sound.play().catch((err) => {
    console.warn(`Could not play sound ${btnId}: ${err.message}`)
  })

  manageActiveSounds()
}

function addSoundListeners(sound) {
  sound.addEventListener("play", () => { sound.dataset.playing = "true" })
  sound.addEventListener("pause", () => { sound.dataset.playing = "false" })
  sound.addEventListener("ended", () => {
    sound.dataset.playing = "false"
    sound.volume = config.baseVolume
    const index = activeSounds.indexOf(sound)
    if (index !== -1) activeSounds.splice(index, 1)
  })
}

function manageActiveSounds() {
  activeSounds.forEach((sound, index) => {
    if (sound.dataset.playing === "true") {
      const newVolume = config.baseVolume - index * config.fadeFactor
      sound.volume = Math.max(newVolume, config.minVolume)
    }
  })
}
