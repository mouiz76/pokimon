import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';

function Teams({ teams = [], onCreateTeam, onDeleteTeam, onRemovePokemon, onAddToTeam }) {
  const [newTeamName, setNewTeamName] = useState('');
  const [formMessage, setFormMessage] = useState(null);
  const [availablePokemons, setAvailablePokemons] = useState([]);
  const [quickAddSelection, setQuickAddSelection] = useState({});
  const [quickAddMessage, setQuickAddMessage] = useState({});

  // Haal de eerste 20 Pokémon op voor de snelle toevoeg-optie op de teampagina
  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then((res) => res.json())
      .then((data) => setAvailablePokemons(data.results || []))
      .catch((err) => console.error('Kon beschikbare Pokémon niet ophalen:', err));
  }, []);

  const handleCreateTeamSubmit = (e) => {
    e.preventDefault();
    if (!onCreateTeam) return;

    const result = onCreateTeam(newTeamName);
    if (result.success) {
      setNewTeamName('');
      setFormMessage({ text: result.message, type: 'success' });
    } else {
      setFormMessage({ text: result.message, type: 'error' });
    }
  };

  const handleDeleteTeamClick = (team) => {
    if (window.confirm(`Weet je zeker dat je team "${team.name}" wilt verwijderen?`)) {
      if (onDeleteTeam) {
        const result = onDeleteTeam(team.id);
        setFormMessage({ text: result.message, type: 'success' });
      }
    }
  };

  const handleQuickAdd = async (teamId) => {
    const pokemonName = quickAddSelection[teamId];
    if (!pokemonName) {
      setQuickAddMessage((prev) => ({
        ...prev,
        [teamId]: { text: 'Selecteer eerst een Pokémon om toe te voegen.', type: 'error' },
      }));
      return;
    }

    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await res.json();
      const pokemonObj = {
        id: data.id,
        name: data.name,
        image: data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default,
        types: data.types.map((t) => t.type.name),
      };

      const result = onAddToTeam(teamId, pokemonObj);
      setQuickAddMessage((prev) => ({
        ...prev,
        [teamId]: { text: result.message, type: result.success ? 'success' : 'error' },
      }));
    } catch {
      setQuickAddMessage((prev) => ({
        ...prev,
        [teamId]: { text: 'Kon Pokémon gegevens niet ophalen.', type: 'error' },
      }));
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Pokémon Teams</h2>
        <p>Stel je droomteams samen met maximaal 6 unieke Pokémon per team.</p>
      </div>

      {/* Team aanmaken sectie */}
      <div className="card-box team-create-box">
        <h3>Nieuw team aanmaken</h3>
        <form onSubmit={handleCreateTeamSubmit} className="team-create-form">
          <input
            type="text"
            placeholder="Bijv. Vuur Meesters of Kanto Kampioenen..."
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            className="input-text"
          />
          <button type="submit" className="btn btn-primary">
            + Team aanmaken
          </button>
        </form>

        {formMessage && (
          <div className={`feedback-alert feedback-${formMessage.type}`}>
            {formMessage.text}
          </div>
        )}
      </div>

      {/* Teams weergave */}
      <div className="teams-list">
        {teams.length === 0 ? (
          <div className="empty-state">
            <h3>Nog geen teams aangemaakt</h3>
            <p>
              Maak hierboven een team aan en voeg Pokémon toe via de{' '}
              <Link to="/list" className="link-inline">
                Pokémon Lijst
              </Link>{' '}
              of via de detailpagina's!
            </p>
          </div>
        ) : (
          teams.map((team) => (
            <div key={team.id} className="team-card-section">
              <div className="team-card-header">
                <div>
                  <h3 className="team-name">{team.name}</h3>
                  <span className="team-count-badge">
                    {team.members.length} / 6 Pokémon
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteTeamClick(team)}
                  className="btn btn-danger btn-small"
                  title="Dit hele team verwijderen"
                >
                  Verwijder team
                </button>
              </div>

              {/* Leden van het team */}
              {team.members.length === 0 ? (
                <p className="no-members">
                  Dit team heeft nog geen Pokémon. Voeg er maximaal 6 toe!
                </p>
              ) : (
                <ul className="pokemon-grid team-grid">
                  {team.members.map((member) => (
                    <li key={member.name} className="pokemon-list-item">
                      <PokemonCard
                        id={member.id}
                        name={member.name}
                        image={member.image}
                        types={member.types}
                        extraAction={
                          <button
                            type="button"
                            onClick={() => onRemovePokemon(team.id, member.name)}
                            className="btn btn-danger btn-small"
                          >
                            Verwijderen
                          </button>
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}

              {/* Snelle toevoeger op de teampagina */}
              {team.members.length < 6 && availablePokemons.length > 0 && (
                <div className="quick-add-container">
                  <span className="quick-add-label">Snel Pokémon toevoegen aan dit team:</span>
                  <div className="quick-add-form">
                    <select
                      value={quickAddSelection[team.id] || ''}
                      onChange={(e) =>
                        setQuickAddSelection((prev) => ({
                          ...prev,
                          [team.id]: e.target.value,
                        }))
                      }
                      className="team-select"
                    >
                      <option value="">-- Kies een Pokémon --</option>
                      {availablePokemons.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(team.id)}
                      className="btn btn-secondary btn-small"
                    >
                      + Toevoegen
                    </button>
                  </div>
                  {quickAddMessage[team.id] && (
                    <div
                      className={`feedback-alert feedback-${quickAddMessage[team.id].type}`}
                      style={{ marginTop: '8px' }}
                    >
                      {quickAddMessage[team.id].text}
                    </div>
                  )}
                </div>
              )}

              {team.members.length >= 6 && (
                <p className="team-full-notice">
                  Dit team is compleet met 6 Pokémon!
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Teams;
