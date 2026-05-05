# Lezer — Instapaper Vertaler

Vertaal je Instapaper-leeslijst automatisch naar Nederlands via Groq AI.
**Volledig gratis, geen creditcard nodig.**

---

## Wat heb je nodig?

1. Een [GitHub-account](https://github.com) (gratis)
2. Een [Netlify-account](https://netlify.com) (gratis)
3. Je Instapaper e-mailadres + wachtwoord
4. Een **Groq API-sleutel** → [console.groq.com](https://console.groq.com)
   - Registreer met e-mail → ga naar **API Keys** → klik **Create API Key**
   - Geen creditcard nodig

---

## Deployen in 5 stappen

### Stap 1 — Zet de code op GitHub

1. Ga naar [github.com](https://github.com) en log in
2. Klik op **+** → **New repository**, geef het een naam (bijv. `instapaper-vertaler`)
3. Klik **Create repository**
4. Klik op **uploading an existing file**, sleep alle bestanden hierheen
5. Klik **Commit changes**

### Stap 2 — Verbind met Netlify

1. Ga naar [app.netlify.com](https://app.netlify.com) en log in
2. Klik op **Add new site** → **Import an existing project** → **GitHub**
3. Selecteer je repository
4. Netlify detecteert de instellingen automatisch via `netlify.toml`
5. Klik op **Deploy site**

### Stap 3 — Voeg je Groq API-sleutel toe

1. Ga in Netlify naar **Site configuration** → **Environment variables**
2. Verwijder de bestaande `ANTHROPIC_API_KEY` variabele als die er nog staat
3. Klik op **Add a variable**
4. Vul in:
   - **Key:** `GROQ_API_KEY`
   - **Value:** jouw Groq API-sleutel (begint met `gsk_...`)
5. Klik **Save**
6. Ga naar **Deploys** → **Trigger deploy** → **Deploy site**

### Stap 4 — Open de app

1. Ga naar jouw Netlify-URL (bijv. `https://jouw-naam-123.netlify.app`)
2. Vul je Instapaper e-mailadres en wachtwoord in
3. Klik **Leeslijst ophalen**

### Stap 5 — Gebruik

- Klik een artikel aan → titel + tekst worden automatisch naar Nederlands vertaald
- Klik **Opslaan in browser** om het te bewaren (blijft staan na sluiten)
- Klik **↓ Download .txt** voor een tekstbestand
- Opgeslagen artikelen staan onder het tabblad **Opgeslagen**

---

## Mapstructuur

```
instapaper-vertaler/
├── netlify.toml                  ← Netlify configuratie
├── package.json
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   └── App.js                    ← De hele app
└── netlify/
    └── functions/
        ├── instapaper.js         ← Proxy voor Instapaper API
        └── translate.js          ← Vertaling via Groq AI
```

---

## Veelgestelde vragen

**Zijn mijn gegevens veilig?**
Je Instapaper-gegevens gaan alleen via de Netlify-functie als CORS-proxy en worden nergens opgeslagen. Je Groq API-sleutel staat alleen in Netlify's omgevingsvariabelen, nooit in de code.

**Hoeveel kost het?**
Groq heeft een gratis tier die ruim voldoende is voor persoonlijk gebruik. Geen creditcard nodig.

**Artikel heeft geen tekst?**
De Instapaper tekst-API werkt niet voor alle artikelen. De titel wordt altijd vertaald.
