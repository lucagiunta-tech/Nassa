/**
 * api/meta-oauth.js — Vercel Serverless Function
 *
 * Meta redirects here after the user grants permissions.
 * Exchanges the code for an access token, fetches FB Pages + IG accounts,
 * then posts the result back to the popup opener via postMessage.
 *
 * MarketingStudio's openMetaOAuth() already listens for:
 *   { type: "META_OAUTH_PAGES", pages: [...] }
 *   { type: "META_OAUTH_ERROR", error: "..." }
 */

export default async function handler(req, res) {
  const { code, error, error_description } = req.query;

  const APP_ID = process.env.META_APP_ID;
  const APP_SECRET = process.env.META_APP_SECRET;
  const REDIRECT_URI = process.env.META_REDIRECT_URI;

  if (error) {
    return res.status(200).setHeader("Content-Type", "text/html").send(
      errorPage(error_description || error)
    );
  }

  if (!code) {
    return res.status(200).setHeader("Content-Type", "text/html").send(
      errorPage("Nessun codice ricevuto da Meta.")
    );
  }

  if (!APP_ID || !APP_SECRET || !REDIRECT_URI) {
    return res.status(200).setHeader("Content-Type", "text/html").send(
      errorPage("Configurazione server incompleta. Controlla le env vars META_APP_ID, META_APP_SECRET, META_REDIRECT_URI.")
    );
  }

  try {
    // 1. Exchange code → short-lived user access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v19.0/oauth/access_token?` +
        new URLSearchParams({ client_id: APP_ID, client_secret: APP_SECRET, redirect_uri: REDIRECT_URI, code })
    );
    const tokenData = await tokenRes.json();
    if (tokenData.error) return res.status(200).setHeader("Content-Type", "text/html").send(errorPage(tokenData.error.message));

    const userToken = tokenData.access_token;

    // 2. Get FB Pages + linked Instagram Business Accounts
    const pagesRes = await fetch(
      `https://graph.facebook.com/v19.0/me/accounts?` +
        new URLSearchParams({
          fields: "id,name,access_token,instagram_business_account{id,name,username}",
          access_token: userToken,
        })
    );
    const pagesData = await pagesRes.json();
    if (pagesData.error) return res.status(200).setHeader("Content-Type", "text/html").send(errorPage(pagesData.error.message));

    const pages = (pagesData.data || []).map((p) => ({
      id: p.id,
      name: p.name,
      pageToken: p.access_token,
      ig: p.instagram_business_account
        ? { id: p.instagram_business_account.id, name: p.instagram_business_account.name, username: p.instagram_business_account.username }
        : null,
    }));

    return res.status(200).setHeader("Content-Type", "text/html").send(successPage(pages));
  } catch (err) {
    return res.status(200).setHeader("Content-Type", "text/html").send(errorPage(err.message || "Errore sconosciuto."));
  }
}

function successPage(pages) {
  return `<!DOCTYPE html><html><body>
    <p style="font-family:sans-serif;text-align:center;margin-top:40px;color:#16a34a">✅ Connesso! Puoi chiudere questa finestra.</p>
    <script>
      window.opener && window.opener.postMessage({ type:"META_OAUTH_PAGES", pages:${JSON.stringify(pages)} }, "*");
      setTimeout(() => window.close(), 800);
    </script>
  </body></html>`;
}

function errorPage(msg) {
  return `<!DOCTYPE html><html><body>
    <p style="font-family:sans-serif;text-align:center;margin-top:40px;color:#dc2626">❌ Errore: ${msg}</p>
    <script>
      window.opener && window.opener.postMessage({ type:"META_OAUTH_ERROR", error:${JSON.stringify(msg)} }, "*");
      setTimeout(() => window.close(), 2000);
    </script>
  </body></html>`;
}
