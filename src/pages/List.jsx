import { useEffect, useState } from "react";
import Pokemon from "../components/Pokemon";

function List() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("https://pokeapi.co/api/v2/pokemon?limit=20")
      .then((res) => {
        if (!res.ok) {
          throw new Error("De PokéAPI is momenteel niet bereikbaar.");
        }
        return res.json();
      })
      .then((data) => {
        setPokemons(data.results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Pokémon Lijst</h2>
        <p>De eerste 20 Pokémon opgehaald via de officiële PokéAPI.</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Zoek een Pokémon op naam..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && (
        <div className="status-message">
          <p>Pokémon aan het laden...</p>
        </div>
      )}

      {error && (
        <div className="status-message error">
          <p>Foutmelding: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <ul className="pokemon-grid">
          {filteredPokemons.map((p) => (
            <Pokemon key={p.name} url={p.url} />
          ))}
        </ul>
      )}

      {!loading && !error && filteredPokemons.length === 0 && (
        <p className="no-results">Geen Pokémon gevonden voor "{searchTerm}".</p>
      )}
    </div>
  );
}

export default List;
