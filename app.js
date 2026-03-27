import * as state from "./js/state/language-state.js"
import * as textUpdates from "./js/text-updates.js"
import * as menu from "./js/menu.js"
import * as buttons from "./js/buttons.js"
import * as sounds from "./js/sounds.js"
import * as config from "./js/config.js"

const lang = state.getLang()

menu.menuSetup()
textUpdates.updateUIText(lang)
sounds.loadSounds(lang)

buttons.addButtons()
config.syncAdminPanelFromConfig()
