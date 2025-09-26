export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "https://boraktn.github.io"); // tüm originlere izin
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    const tokenData = await tokenRes.json();
    const token = tokenData.access_token;

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

    res.status(200).json({
      name: track.name,
      url: track.external_urls.spotify,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
