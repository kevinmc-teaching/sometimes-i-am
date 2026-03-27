export const STORAGE_KEY = "appConfig"

export const configResetData = {
  nuclearTrigger: 60,
  nuclearEnd: 500,
  maxNuclearNodes: 40,
  maxFZMessage: 14,
  maxFZSynonym: 8,
  maxFZMessageNode: 3,
  maxFZSynonymNode: 1.5,
  baseVolume: 1,
  fadeFactor: 0.3,
  minVolume: 0.2,
  nodeOpacityBtmLimit: 0.3,
  nodeOpacityTopLimit: 0.7,
  hideMainTextAtNuclear: true,
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
