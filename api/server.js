import fetch from "node-fetch";

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function getToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });
  const data = await res.json();
  return data.access_token;
}

export default async function handler(req, res) {
  try {
    if (!clientId || !clientSecret) {
      return res.status(500).json({ error: "Env vars missing" });
    }

    const token = await getToken();

    const playlistRes = await fetch(
      "https://api.spotify.com/v1/playlists/6ez0yqqXd2m6aye6K9MFU7/tracks?market=TR&limit=1",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const playlistData = await playlistRes.json();
    const total = playlistData.total;
    const randomOffset = Math.floor(Math.random() * total);

    const trackRes = await fetch(
      `https://api.spotify.com/v1/playlists/6ez0yqqXd2m6aye6K9MFU7/tracks?market=TR&limit=1&offset=${randomOffset}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const trackData = await trackRes.json();
    const track = trackData.items[0].track;

    res.status(200).json({ name: track.name, url: track.external_urls.spotify });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Bir hata oluştu", details: e.message });
  }
}
