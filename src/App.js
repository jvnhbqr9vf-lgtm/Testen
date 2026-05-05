import { useState } from "react";

const STORAGE_KEY = "instapaper_vertalingen";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }

  body {
    background: #0e0e0e;
    color: #e8e2d9;
    font-family: 'IBM Plex Sans', sans-serif;
  }

  :root {
    --bg: #0e0e0e;
    --bg2: #161616;
    --bg3: #1e1e1e;
    --border: #2a2a2a;
    --accent: #c9a96e;
    --accent2: #8fb8a0;
    --text: #e8e2d9;
    --muted: #6b6560;
    --danger: #c96e6e;
  }

  .app {
    height: 100vh;
    display: grid;
    grid-template-columns: 300px 1fr;
    grid-template-rows: 56px 1fr;
    overflow: hidden;
  }

  .header {
    grid-column: 1 / -1;
    padding: 0 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg2);
  }

  .header-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.25rem;
    color: var(--accent);
  }

  .header-title span {
    color: var(--muted);
    font-style: italic;
    font-size: 0.82rem;
    margin-left: 10px;
  }

  .status {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.65rem;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  .dot.green { background: var(--accent2); }
  .dot.yellow { background: var(--accent); }

  .sidebar {
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-top { flex-shrink: 0; }

  .sec {
    padding: 14px 16px;
    border-bottom: 1px solid var(--border);
  }

  .label {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
  }

  .field { display: flex; flex-direction: column; gap: 6px; }

  input.inp {
    background: var(--bg3);
    border: 1px solid var(--border);
    color: var(--text);
    padding: 7px 10px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    border-radius: 3px;
    width: 100%;
    transition: border-color 0.2s;
  }

  input.inp:focus { outline: none; border-color: var(--accent); }
  input.inp::placeholder { color: var(--muted); }

  .btn {
    padding: 7px 13px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    letter-spacing: 0.04em;
    border: 1px solid var(--border);
    background: var(--bg3);
    color: var(--text);
    cursor: pointer;
    border-radius: 3px;
    transition: all 0.18s;
    white-space: nowrap;
  }

  .btn:hover { border-color: var(--accent); color: var(--accent); }
  .btn.p { background: var(--accent); color: #0e0e0e; border-color: var(--accent); font-weight: 500; }
  .btn.p:hover { background: #d4b47a; }
  .btn.d { border-color: var(--danger); color: var(--danger); }
  .btn.d:hover { background: var(--danger); color: #0e0e0e; }
  .btn:disabled { opacity: 0.38; cursor: not-allowed; }
  .btn.full { width: 100%; }

  .err {
    margin-top: 7px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.65rem;
    color: var(--danger);
    line-height: 1.5;
  }

  .tabs {
    display: flex;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .tab {
    flex: 1;
    padding: 9px 0;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    color: var(--muted);
    cursor: pointer;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
  }

  .tab:hover { color: var(--text); }
  .tab.on { color: var(--accent); border-bottom-color: var(--accent); }

  .list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .item {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.12s;
    position: relative;
  }

  .item:hover { background: var(--bg3); }
  .item.on { background: var(--bg3); border-left: 2px solid var(--accent); }

  .item-saved::after {
    content: '●';
    position: absolute;
    top: 12px;
    right: 12px;
    color: var(--accent2);
    font-size: 0.45rem;
  }

  .item-title {
    font-family: 'Playfair Display', serif;
    font-size: 0.82rem;
    line-height: 1.38;
    margin-bottom: 3px;
  }

  .item-meta {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.6rem;
    color: var(--muted);
  }

  .hint {
    padding: 20px 16px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.65rem;
    color: var(--muted);
    line-height: 1.7;
  }

  .main {
    overflow-y: auto;
    padding: 40px 52px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .empty {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: var(--muted);
    text-align: center;
  }

  .empty-icon { font-size: 2.2rem; opacity: 0.25; }

  .empty p {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    line-height: 1.7;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--muted);
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.72rem;
    padding: 48px 0;
  }

  .spin {
    width: 15px; height: 15px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .art-header {
    margin-bottom: 30px;
    padding-bottom: 22px;
    border-bottom: 1px solid var(--border);
  }

  .lang-badge {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.6rem;
    letter-spacing: 0.1em;
    color: var(--muted);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .badge {
    padding: 2px 7px;
    border: 1px solid var(--border);
    border-radius: 2px;
    font-size: 0.58rem;
  }

  .badge.nl { border-color: var(--accent2); color: var(--accent2); }

  .art-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.9rem;
    line-height: 1.22;
    margin-bottom: 6px;
  }

  .art-orig {
    font-family: 'Playfair Display', serif;
    font-style: italic;
    font-size: 0.85rem;
    color: var(--muted);
    margin-bottom: 16px;
  }

  .art-actions { display: flex; gap: 8px; flex-wrap: wrap; }

  .art-body {
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.97rem;
    line-height: 1.88;
    color: #d0cbc2;
    max-width: 680px;
  }

  .art-body p { margin-bottom: 1.15em; }

  .banner {
    background: #0d1a10;
    border: 1px solid var(--accent2);
    color: var(--accent2);
    padding: 9px 14px;
    border-radius: 3px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.68rem;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .art-err {
    background: #1a0d0d;
    border: 1px solid var(--danger);
    color: var(--danger);
    padding: 10px 14px;
    border-radius: 3px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.7rem;
    margin-bottom: 16px;
    line-height: 1.5;
  }
`;

function loadSaved() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}

function persist(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

function stripHtml(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.innerText || d.textContent || "";
}

function downloadTxt(a) {
  const content = [
    a.translatedTitle,
    "=".repeat(60),
    `Originele titel: ${a.title}`,
    `Bron: ${a.url}`,
    `Vertaald op: ${new Date(a.savedAt).toLocaleString("nl-NL")}`,
    "",
    "=".repeat(60),
    "",
    a.translatedBody,
  ].join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const el = document.createElement("a");
  el.href = url;
  el.download = `${a.translatedTitle.slice(0, 40).replace(/[^a-z0-9]/gi, "_")}.txt`;
  el.click();
  URL.revokeObjectURL(url);
}

async function apiInstapaper(body) {
  const res = await fetch("/api/instapaper", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res;
}

async function apiTranslate(text) {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`Vertaalfout: ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(`Vertaalfout: ${data.error}`);
  return data.translation;
}

export default function App() {
  const [tab, setTab] = useState("leeslijst");
  const [rssUrl, setRssUrl] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listErr, setListErr] = useState("");
  const [selected, setSelected] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [transErr, setTransErr] = useState("");
  const [article, setArticle] = useState(null);
  const [saved, setSaved] = useState(loadSaved);
  const [justSaved, setJustSaved] = useState(false);

  const savedIds = new Set(saved.map(a => a.id));

  async function loadList() {
    if (!rssUrl) { setListErr("Vul je Instapaper RSS-URL in."); return; }
    setListErr(""); setLoadingList(true);
    try {
      const res = await fetch("/api/instapaper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rss", rssUrl }),
      });
      const data = await res.json();
      if (data.error) { setListErr(data.error); return; }
      setBookmarks(data.items || []);
      if (!data.items?.length) setListErr("Geen artikelen gevonden.");
    } catch (e) { setListErr(e.message); }
    finally { setLoadingList(false); }
  }

  async function selectArticle(b) {
    setSelected(b.id);
    setArticle(null);
    setTransErr("");
    setJustSaved(false);
    setTranslating(true);

    try {
      // Already saved? Load from cache
      const cached = saved.find(a => a.id === b.id);
      if (cached) { setArticle(cached); return; }

      // Fetch article text
      let bodyText = "";
      try {
        const res = await fetch("/api/instapaper", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "fetch_article", articleUrl: b.url }),
        });
        if (res.ok) {
          const html = await res.text();
          bodyText = stripHtml(html).slice(0, 5000);
        }
      } catch { /* fall through */ }
      if (!bodyText) bodyText = stripHtml(b.description || "").slice(0, 5000);

      // Translate title + body in parallel
      const [translatedTitle, translatedBody] = await Promise.all([
        apiTranslate(b.title),
        bodyText ? apiTranslate(bodyText) : Promise.resolve(""),
      ]);

      const result = {
        id: b.id,
        title: b.title,
        translatedTitle,
        translatedBody,
        url: b.url,
        savedAt: Date.now(),
      };
      setArticle(result);
    } catch (e) { setTransErr(e.message); }
    finally { setTranslating(false); }
  }

  function saveArticle() {
    if (!article) return;
    const updated = [article, ...saved.filter(a => a.id !== article.id)];
    setSaved(updated);
    persist(updated);
    setJustSaved(true);
  }

  function deleteArticle(id) {
    const updated = saved.filter(a => a.id !== id);
    setSaved(updated);
    persist(updated);
    if (article?.id === id) setArticle(null);
  }

  function openSaved(a) {
    setSelected(a.id);
    setArticle(a);
    setTab("leeslijst");
    setTransErr("");
    setJustSaved(false);
  }

  const isSaved = article && savedIds.has(article.id);

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="header-title">
            Lezer <span>Instapaper → Nederlands</span>
          </div>
          <div className="status">
            <span className={`dot ${bookmarks.length > 0 ? "green" : "yellow"}`}></span>
            {bookmarks.length > 0 ? `${bookmarks.length} artikelen` : "Niet verbonden"}
          </div>
        </header>

        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-top">
            <div className="sec">
              <div className="label">Instapaper RSS-URL</div>
              <div className="field">
                <input className="inp" placeholder="https://instapaper.com/rss/..." value={rssUrl} onChange={e => setRssUrl(e.target.value)} type="url" />
              </div>
            </div>

            <div className="sec">
              <button className="btn p full" onClick={loadList} disabled={loadingList}>
                {loadingList ? "Laden…" : "Leeslijst ophalen"}
              </button>
              {listErr && <div className="err">{listErr}</div>}
            </div>

            <div className="tabs">
              <button className={`tab ${tab === "leeslijst" ? "on" : ""}`} onClick={() => setTab("leeslijst")}>
                Leeslijst ({bookmarks.length})
              </button>
              <button className={`tab ${tab === "opgeslagen" ? "on" : ""}`} onClick={() => setTab("opgeslagen")}>
                Opgeslagen ({saved.length})
              </button>
            </div>
          </div>

          <div className="list">
            {tab === "leeslijst" && bookmarks.length === 0 && (
              <div className="hint">Vul je gegevens in en klik op "Leeslijst ophalen" om je artikelen te zien.</div>
            )}
            {tab === "leeslijst" && bookmarks.map(b => (
              <div
                key={b.id}
                className={`item ${selected === b.id ? "on" : ""} ${savedIds.has(b.id) ? "item-saved" : ""}`}
                onClick={() => selectArticle(b)}
              >
                <div className="item-title">{b.title}</div>
                <div className="item-meta">{(() => { try { return new URL(b.url).hostname; } catch { return ""; } })()}</div>
              </div>
            ))}

            {tab === "opgeslagen" && saved.length === 0 && (
              <div className="hint">Nog niets opgeslagen. Selecteer een artikel en klik op "Opslaan in browser".</div>
            )}
            {tab === "opgeslagen" && saved.map(a => (
              <div
                key={a.id}
                className={`item item-saved ${selected === a.id ? "on" : ""}`}
                onClick={() => openSaved(a)}
              >
                <div className="item-title">{a.translatedTitle}</div>
                <div className="item-meta">{new Date(a.savedAt).toLocaleDateString("nl-NL")}</div>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          {transErr && <div className="art-err">⚠ {transErr}</div>}

          {translating && (
            <div className="loading">
              <div className="spin"></div>
              Artikel ophalen en vertalen naar Nederlands…
            </div>
          )}

          {!translating && !article && !transErr && (
            <div className="empty">
              <div className="empty-icon">◎</div>
              <p>Verbind je Instapaper-account,<br />laad je leeslijst en klik een artikel aan.</p>
            </div>
          )}

          {!translating && article && (
            <>
              {justSaved && (
                <div className="banner">
                  <span>✓ Opgeslagen in browser</span>
                  <button className="btn" style={{ padding: "3px 9px", fontSize: "0.62rem" }} onClick={() => setJustSaved(false)}>×</button>
                </div>
              )}

              <div className="art-header">
                <div className="lang-badge">
                  <span className="badge nl">NL</span>
                  Vertaald door Groq AI
                </div>
                <h1 className="art-title">{article.translatedTitle}</h1>
                {article.title !== article.translatedTitle && (
                  <div className="art-orig">Origineel: {article.title}</div>
                )}
                <div className="art-actions">
                  {!isSaved && <button className="btn p" onClick={saveArticle}>Opslaan in browser</button>}
                  <button className="btn" onClick={() => downloadTxt(article)}>↓ Download .txt</button>
                  <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <button className="btn">Origineel ↗</button>
                  </a>
                  {isSaved && <button className="btn d" onClick={() => deleteArticle(article.id)}>Verwijderen</button>}
                </div>
              </div>

              <div className="art-body">
                {article.translatedBody
                  ? article.translatedBody.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
                  : <p style={{ color: "var(--muted)", fontStyle: "italic", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.8rem" }}>
                      Geen artikeltekst beschikbaar via de Instapaper API — alleen de titel is vertaald.
                    </p>
                }
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}
