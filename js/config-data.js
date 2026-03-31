export const STORAGE_KEY = "appConfig"

export const configResetData = {
  polyglotTrigger: 60,
  polyglotEnd: 500,
  maxPolyglotNodes: 40,
  maxFZMessage: 14,
  maxFZSynonym: 8,
  maxFZMessageNode: 3,
  maxFZSynonymNode: 1.5,
  baseVolume: 1,
  fadeFactor: 0.3,
  minVolume: 0.2,
  nodeOpacityBtmLimit: 0.3,
  nodeOpacityTopLimit: 0.7,
  hideMainTextAtPolyglot: true,
  colorsMode: false,
  maxRotation: 20,
  colorPick1: "#ff0000",
  colorPick2: "#00cc00",
  colorPick3: "#0000ff",
}

function loadConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")
    return { ...configResetData, ...saved }
  } catch {
    return { ...configResetData }
  }
}

export const config = loadConfig()
