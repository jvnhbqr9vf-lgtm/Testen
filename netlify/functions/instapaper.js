const https = require("https");

// Fetch any URL and return its contents (used for RSS feed + article text)
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = https.request(
      {
        hostname: urlObj.hostname,
        path: urlObj.pathname + urlObj.search,
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; InstapperVertaler/1.0)" },
      },
      (res) => {
        // Follow redirects
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return fetchUrl(res.headers.location).then(resolve).catch(reject);
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on("error", reject);
    req.end();
  });
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { action, rssUrl, articleUrl } = JSON.parse(event.body || "{}");

  try {
    if (action === "rss") {
      // Fetch and parse RSS feed
      const { body } = await fetchUrl(rssUrl);

      // Parse RSS items
      const items = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;
      while ((match = itemRegex.exec(body)) !== null) {
        const item = match[1];
        const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) ||
                       item.match(/<title>(.*?)<\/title>/) || [])[1] || "";
        const link = (item.match(/<link>(.*?)<\/link>/) ||
                      item.match(/<feedburner:origLink>(.*?)<\/feedburner:origLink>/) || [])[1] || "";
        const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) ||
                      item.match(/<description>(.*?)<\/description>/) || [])[1] || "";
        const guid = (item.match(/<guid[^>]*>(.*?)<\/guid>/) || [])[1] || link;
        if (title && link) {
          items.push({ id: guid, title: title.trim(), url: link.trim(), description: desc.trim() });
        }
      }

      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      };

    } else if (action === "fetch_article") {
      // Fetch article text
      const { body } = await fetchUrl(articleUrl);
      return {
        statusCode: 200,
        headers: { "Content-Type": "text/html" },
        body,
      };
    }

    return { statusCode: 400, body: JSON.stringify({ error: "Onbekende actie" }) };

  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
