export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Te rog introdu un link YouTube valid." });
  }

  // URL-ul de la RapidAPI conform imaginii tale
  const apiURL = `https://youtube-video-fast-downloader-24-7.p.rapidapi.com/get-video-info?url=${encodeURIComponent(url)}`;
  
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': '3c36651be6msha2372a8bc16361bp178192jsnbedb382ff3f3',
      'x-rapidapi-host': 'youtube-video-fast-downloader-24-7.p.rapidapi.com'
    }
  };

  try {
    const apiResponse = await fetch(apiURL, options);
    const data = await apiResponse.json();

    // Verificăm dacă API-ul a returnat un rezultat valid
    if (!data || data.status === false) {
      return res.status(404).json({ error: "Video-ul nu a putut fi găsit." });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Eroare la procesarea cererii." });
  }
}
