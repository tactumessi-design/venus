import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVideo = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError("Eroare de conexiune la server.");
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#FF0000' }}>YouTube Downloader</h1>
      <p>Introdu link-ul și apasă butonul</p>

      <div style={{ marginTop: '30px' }}>
        <input 
          type="text" 
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '12px', width: '300px', borderRadius: '5px', border: 'none', marginRight: '10px', color: '#000' }}
        />
        <button 
          onClick={fetchVideo}
          disabled={loading}
          style={{ padding: '12px 20px', backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'SE ÎNCARCĂ...' : 'DESCARCĂ'}
        </button>
      </div>

      {error && <p style={{ color: 'yellow', marginTop: '20px' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '40px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', display: 'inline-block', maxWidth: '90%' }}>
          {/* Imaginea - Verificăm dacă există 'thumbnail' sau 'thumb' */}
          <img 
            src={result.thumbnail || result.thumb || (result.video_details && result.video_details.thumbnail)} 
            alt="Thumbnail" 
            style={{ width: '100%', maxWidth: '400px', borderRadius: '8px' }} 
          />
          
          <h3 style={{ margin: '15px 0' }}>{result.title || "Video Proprocesat"}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Secțiune de Link-uri - Adaptată pentru diverse structuri de API */}
            {result.medias ? (
              // Structura tipică pentru unele API-uri RapidAPI
              result.medias.map((media, index) => (
                <a key={index} href={media.url} target="_blank" rel="noreferrer" style={btnStyle}>
                  Download {media.quality} ({media.extension})
                </a>
              ))
            ) : result.links ? (
              // Structura pe care am încercat-o anterior
              Object.entries(result.links).map(([quality, linksArray]) => (
                <a key={quality} href={linksArray[0]?.url} target="_blank" rel="noreferrer" style={btnStyle}>
                  Download {quality}
                </a>
              ))
            ) : (
              <p>Nu am găsit link-uri directe. Verifică consola (F12).</p>
            )}
          </div>

          {/* DEBUG: Dacă tot nu merge, șterge secțiunea asta după ce vezi ce scrie */}
          <details style={{ marginTop: '20px', textAlign: 'left', fontSize: '10px', color: '#666' }}>
            <summary>Vezi datele brute (JSON)</summary>
            <pre>{JSON.stringify(result, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  backgroundColor: '#28a745',
  color: 'white',
  padding: '12px',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: 'bold'
};
