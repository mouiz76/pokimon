import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function Detail({ teams = [], onAddToTeam, onCreateTeam, onDeleteTeam }) {
  const { name, id } = useParams();
  const pokemonIdentifier = name || id;

  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [newTeamName, setNewTeamName] = useState('');
  const [teamMessage, setTeamMessage] = useState(null);

  useEffect(() => {
    if (!pokemonIdentifier) return;

    setLoading(true);
    setError(null);
    setTeamMessage(null);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonIdentifier.toLowerCase()}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Pokémon "${pokemonIdentifier}" kon niet worden gevonden.`);
        }
        return res.json();
      })
      .then((data) => {
        setPokemon(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [pokemonIdentifier]);

  // Hulpfunctie om een specifieke statistiek op te zoeken
  const getStat = (statName) => {
    if (!pokemon || !pokemon.stats) return 0;
    const statItem = pokemon.stats.find((s) => s.stat.name === statName);
    return statItem ? statItem.base_stat : 0;
  };

  const handleAddPokemon = (e) => {
    e.preventDefault();
    if (!selectedTeamId) {
      setTeamMessage({ text: 'Kies eerst een team uit de lijst.', type: 'error' });
      return;
    }

    if (onAddToTeam) {
      const result = onAddToTeam(selectedTeamId, {
        id: pokemon.id,
        name: pokemon.name,
        image: pokemon.sprites?.other?.['official-artwork']?.front_default || pokemon.sprites?.front_default,
        types: pokemon.types.map((t) => t.type.name),
      });

      setTeamMessage({
        text: result.message,
        type: result.success ? 'success' : 'error',
      });
    }
  };

  const handleCreateTeamSubmit = (e) => {
    e.preventDefault();
    if (!onCreateTeam) return;

    const result = onCreateTeam(newTeamName);
    if (result.success) {
      setNewTeamName('');
      setSelectedTeamId(result.team.id);
      setTeamMessage({
        text: `${result.message} Je kunt nu direct "${pokemon.name}" toevoegen.`,
        type: 'success',
      });
    } else {
      setTeamMessage({ text: result.message, type: 'error' });
    }
  };

  const handleDeleteSelectedTeam = () => {
    if (!selectedTeamId || !onDeleteTeam) {
      setTeamMessage({ text: 'Selecteer eerst een team dat je wilt verwijderen.', type: 'error' });
      return;
    }

    const teamToDelete = teams.find((t) => t.id === selectedTeamId);
    if (!teamToDelete) return;

    if (window.confirm(`Weet je zeker dat je team "${teamToDelete.name}" wilt verwijderen?`)) {
      const result = onDeleteTeam(selectedTeamId);
      setSelectedTeamId('');
      setTeamMessage({ text: result.message, type: 'success' });
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="status-message">
          <p>Pokémon gegevens aan het ophalen...</p>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="page-container">
        <div className="status-message error">
          <p>{error || 'Er is een fout opgetreden bij het laden van deze Pokémon.'}</p>
          <Link to="/list" className="btn btn-secondary">
            ← Terug naar Pokémon lijst
          </Link>
        </div>
      </div>
    );
  }

  const image =
    pokemon.sprites?.other?.['official-artwork']?.front_default ||
    pokemon.sprites?.front_default ||
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

  const hp = getStat('hp');
  const attack = getStat('attack');
  const defense = getStat('defense');
  const speed = getStat('speed');

  return (
    <div className="page-container">
      <div className="detail-navigation">
        <Link to="/list" className="btn btn-secondary">
          ← Terug naar Pokémon lijst
        </Link>
      </div>

      <div className="detail-card">
        <div className="detail-header">
          <span className="detail-id">#{String(pokemon.id).padStart(3, '0')}</span>
          <h2 className="detail-title">{pokemon.name}</h2>
          <div className="card-types">
            {pokemon.types.map((t) => (
              <span key={t.type.name} className={`type-badge type-${t.type.name.toLowerCase()}`}>
                {t.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="detail-content">
          <div className="detail-image-box">
            <img src={image} alt={pokemon.name} className="detail-image" />
          </div>

          <div className="detail-info">
            <h3>Fysieke eigenschappen</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Lengte (Height):</span>
                <span className="info-value">{pokemon.height / 10} m</span>
              </div>
              <div className="info-item">
                <span className="info-label">Gewicht (Weight):</span>
                <span className="info-value">{pokemon.weight / 10} kg</span>
              </div>
            </div>

            <h3>Statistieken (Base Stats)</h3>
            <div className="stats-list">
              <div className="stat-row">
                <span className="stat-name">HP</span>
                <span className="stat-number">{hp}</span>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar stat-hp"
                    style={{ width: `${Math.min((hp / 200) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="stat-row">
                <span className="stat-name">Attack</span>
                <span className="stat-number">{attack}</span>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar stat-attack"
                    style={{ width: `${Math.min((attack / 200) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="stat-row">
                <span className="stat-name">Defense</span>
                <span className="stat-number">{defense}</span>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar stat-defense"
                    style={{ width: `${Math.min((defense / 200) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="stat-row">
                <span className="stat-name">Speed</span>
                <span className="stat-number">{speed}</span>
                <div className="stat-bar-container">
                  <div
                    className="stat-bar stat-speed"
                    style={{ width: `${Math.min((speed / 200) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Team Beheer & Toevoegen sectie */}
            <div className="team-add-section">
              <h3>Teams Beheer &amp; Toevoegen</h3>

              {teams.length > 0 ? (
                <div className="team-existing-block">
                  <p className="team-action-desc">Voeg deze Pokémon toe aan een bestaand team:</p>
                  <form onSubmit={handleAddPokemon} className="team-add-form">
                    <select
                      value={selectedTeamId}
                      onChange={(e) => setSelectedTeamId(e.target.value)}
                      className="team-select"
                      aria-label="Kies een team"
                    >
                      <option value="">-- Kies een team --</option>
                      {teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name} ({team.members.length}/6 Pokémon)
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="btn btn-primary">
                      + Toevoegen aan team
                    </button>
                    {selectedTeamId && (
                      <button
                        type="button"
                        onClick={handleDeleteSelectedTeam}
                        className="btn btn-danger btn-small"
                        title="Verwijder dit geselecteerde team"
                      >
                        Verwijder dit team
                      </button>
                    )}
                  </form>
                </div>
              ) : (
                <p className="team-hint">
                  Je hebt nog geen Pokémon-teams. Maak hieronder direct je eerste team aan!
                </p>
              )}

              {/* Direct een nieuw team aanmaken */}
              <div className="team-inline-create">
                <span className="team-inline-label">Of maak direct een nieuw team aan:</span>
                <form onSubmit={handleCreateTeamSubmit} className="team-add-form">
                  <input
                    type="text"
                    placeholder="Nieuwe teamnaam (bijv. Bliksem Bazen)..."
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="input-text"
                  />
                  <button type="submit" className="btn btn-secondary">
                    + Team aanmaken
                  </button>
                </form>
              </div>

              {teamMessage && (
                <div className={`feedback-alert feedback-${teamMessage.type}`}>
                  {teamMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;