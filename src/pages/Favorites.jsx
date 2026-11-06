import { useState } from 'react';
import { Link } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';

function Favorites({ favorites = [], onToggleFavorite, onAddToTeam, teams = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState({});
  const [teamMessage, setTeamMessage] = useState({});

  const filteredFavorites = favorites.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPokemonToTeam = (pokemon) => {
    const teamId = selectedTeamId[pokemon.name];
    if (!teamId) {
      setTeamMessage((prev) => ({
        ...prev,
        [pokemon.name]: { text: 'Kies eerst een team.', type: 'error' },
      }));
      return;
    }

    if (onAddToTeam) {
      const result = onAddToTeam(teamId, pokemon);
      setTeamMessage((prev) => ({
        ...prev,
        [pokemon.name]: {
          text: result.message,
          type: result.success ? 'success' : 'error',
        },
      }));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-with-badge">
          <h2>Mijn Favoriete Pokémon</h2>
          <span className="count-pill">❤️ {favorites.length}</span>
        </div>
        <p>Jouw persoonlijke verzameling van favoriete Pokémon, bewaard in je browser.</p>
      </div>

      {favorites.length > 0 && (
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Zoek in favorieten op naam..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🤍</div>
          <h3>Nog geen favoriete Pokémon</h3>
          <p>
            Je hebt nog geen favorieten opgeslagen. Klik op het hartje (🤍) bij een Pokémon in de{' '}
            <Link to="/list" className="link-inline">
              Pokémon Lijst
            </Link>{' '}
            of op de detailpagina om hem aan je favorieten toe te voegen!
          </p>
          <div style={{ marginTop: '20px' }}>
            <Link to="/list" className="btn btn-primary">
              Ontdek Pokémon
            </Link>
          </div>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <p className="no-results">Geen favorieten gevonden voor "{searchTerm}".</p>
      ) : (
        <ul className="pokemon-grid">
          {filteredFavorites.map((pokemon) => (
            <li key={pokemon.name} className="pokemon-list-item">
              <PokemonCard
                id={pokemon.id}
                name={pokemon.name}
                image={pokemon.image}
                types={pokemon.types}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                extraAction={
                  teams.length > 0 ? (
                    <div className="fav-team-add">
                      <select
                        value={selectedTeamId[pokemon.name] || ''}
                        onChange={(e) =>
                          setSelectedTeamId((prev) => ({
                            ...prev,
                            [pokemon.name]: e.target.value,
                          }))
                        }
                        className="team-select"
                        style={{ width: '100%', marginBottom: '6px', fontSize: '12px', height: '34px' }}
                      >
                        <option value="">+ Kies team</option>
                        {teams.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.members.length}/6)
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAddPokemonToTeam(pokemon)}
                        className="btn btn-secondary btn-small"
                        style={{ width: '100%' }}
                      >
                        Toevoegen aan team
                      </button>
                      {teamMessage[pokemon.name] && (
                        <div
                          className={`feedback-alert feedback-${teamMessage[pokemon.name].type}`}
                          style={{ marginTop: '6px', fontSize: '11px', padding: '6px' }}
                        >
                          {teamMessage[pokemon.name].text}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(pokemon)}
                      className="btn btn-outline btn-small"
                      style={{ width: '100%' }}
                    >
                      Verwijder favoriet
                    </button>
                  )
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Favorites;
