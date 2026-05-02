import { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchVideo = async () => {
    if (!url) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(url)}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      alert("Eroare la descărcare.");
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#121212', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#FF0000' }}>YouTube Downloader</h1>
      <p>Descarcă rapid videoclipuri de pe YT</p>

      <div style={{ marginTop: '30px' }}>
        <input 
          type="text" 
          placeholder="Lipește link-ul aici (ex: https://youtube.com/watch?v=...)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: '12px', width: '300px', borderRadius: '5px', border: 'none', marginRight: '10px' }}
        />
        <button 
          onClick={fetchVideo}
          disabled={loading}
          style={{ padding: '12px 20px', backgroundColor: '#FF0000', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {loading ? 'Se caută...' : 'DESCARCĂ'}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: '40px', backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '10px', display: 'inline-block' }}>
          <img src={result.thumb} alt="Thumbnail" style={{ width: '300px', borderRadius: '8px' }} />
          <h3 style={{ maxWidth: '300px' }}>{result.title}</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Mapăm link-urile de download disponibile în obiectul returnat de API */}
            {result.links && Object.entries(result.links).map(([quality, linksArray]) => (
              <a 
                key={quality}
                href={linksArray[0]?.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ backgroundColor: '#28a745', color: 'white', padding: '10px', textDecoration: 'none', borderRadius: '5px', fontSize: '14px' }}
              >
                Download {quality} (.mp4)
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
