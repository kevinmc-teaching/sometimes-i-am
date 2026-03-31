const creditsPanel = document.getElementById("credits-panel")
const openCreditsBtn = document.querySelector(".btn-credits")

const RTL_LANGS = new Set(["fa", "ur", "ar", "he"])

openCreditsBtn.addEventListener("click", toggleCreditsPanel)

document.addEventListener("click", (e) => {
  if (!creditsPanel.classList.contains("credits-visible")) return
  if (e.target.closest(".credits-panel") || e.target.closest(".btn-credits")) return
  closeCreditsPanel()
})

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && creditsPanel.classList.contains("credits-visible")) {
    closeCreditsPanel()
  }
})

function toggleCreditsPanel() {
  const isOpen = creditsPanel.classList.toggle("credits-visible")
  creditsPanel.setAttribute("aria-hidden", String(!isOpen))
  openCreditsBtn.setAttribute("aria-expanded", String(isOpen))
}

function closeCreditsPanel() {
  creditsPanel.classList.remove("credits-visible")
  creditsPanel.setAttribute("aria-hidden", "true")
  openCreditsBtn.setAttribute("aria-expanded", "false")
}

async function loadCredits() {
  try {
    const res = await fetch("./credits.json")
    const data = await res.json()
    renderCredits(data)
  } catch (err) {
    console.error("Could not load credits:", err)
  }
}

function renderCredits(data) {
  const frag = document.createDocumentFragment()

  // Close button
  const closeBtn = document.createElement("button")
  closeBtn.className = "credits-close"
  closeBtn.setAttribute("aria-label", "Close credits")
  closeBtn.textContent = "×"
  closeBtn.addEventListener("click", closeCreditsPanel)
  frag.appendChild(closeBtn)

  // Title
  const title = document.createElement("h2")
  title.className = "credits-title"
  title.textContent = "credits"
  frag.appendChild(title)

  // Leads
  const leadsDl = document.createElement("dl")
  leadsDl.className = "credits-dl credits-leads"
  for (const person of data.leads) {
    const dt = document.createElement("dt")
    dt.textContent = person.role
    const dd = document.createElement("dd")
    dd.textContent = person.name
    leadsDl.appendChild(dt)
    leadsDl.appendChild(dd)
  }
  frag.appendChild(leadsDl)

  // Languages
  const hasLanguages = data.languages?.some((l) => l.contributors?.length > 0)
  if (hasLanguages) {
    const langHeading = document.createElement("h3")
    langHeading.className = "credits-subheading"
    langHeading.textContent = "translators / co-authors"
    frag.appendChild(langHeading)

    const langDl = document.createElement("dl")
    langDl.className = "credits-dl credits-languages"

    for (const lang of data.languages) {
      if (!lang.contributors?.length) continue

      const entry = document.createElement("div")
      entry.className = "credits-lang-entry"

      const dt = document.createElement("dt")
      dt.textContent = lang.language
      if (RTL_LANGS.has(lang.langCode)) {
        dt.setAttribute("lang", lang.langCode)
      }
      entry.appendChild(dt)

      // Show role labels only when contributors don't all cover both Text & Voice
      const showRoles =
        lang.contributors.length > 1 ||
        !lang.contributors.every(
          (c) => c.roles.includes("Text") && c.roles.includes("Voice")
        )

      for (const contributor of lang.contributors) {
        const dd = document.createElement("dd")
        if (showRoles) {
          const roleStr = contributor.roles.map((r) => r.toLowerCase()).join(" & ")
          dd.innerHTML = `${contributor.name} <span class="credits-role">${roleStr}</span>`
        } else {
          dd.textContent = contributor.name
        }
        entry.appendChild(dd)
      }

      langDl.appendChild(entry)
    }

    frag.appendChild(langDl)
  }

  creditsPanel.appendChild(frag)
}

loadCredits()
