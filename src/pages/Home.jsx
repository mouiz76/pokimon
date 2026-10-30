import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">PokéAPI Web Applicatie</span>
          <h2 className="hero-title">Welkom bij de Pokémon Team Manager</h2>
          <p className="hero-description">
            Ontdek de originele Pokémon, bekijk gedetailleerde statistieken en stel
            je eigen ultieme team samen van maximaal 6 Pokémon.
          </p>
          <div className="hero-actions">
            <Link to="/list" className="btn btn-primary">
              Bekijk Pokémon Lijst
            </Link>
            <Link to="/teams" className="btn btn-outline">
              Beheer Mijn Teams
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🔴</div>
          <h3>20 Pokémon ophalen</h3>
          <p>
            Automatisch data ophalen via de officiële PokéAPI met laadstatus en
            foutafhandeling.
          </p>
          <Link to="/list" className="feature-link">
            Bekijk lijst →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Gedetailleerde Statistieken</h3>
          <p>
            Bekijk HP, Attack, Defense, Speed, gewicht, lengte en types per Pokémon.
          </p>
          <Link to="/pokemon/pikachu" className="feature-link">
            Bekijk Pikachu →
          </Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>Teams Samenstellen</h3>
          <p>
            Maak meerdere teams aan, voeg maximaal 6 unieke Pokémon toe en bewaar ze
            automatisch in localStorage.
          </p>
          <Link to="/teams" className="feature-link">
            Mijn Teams bekijken →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;