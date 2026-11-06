import { useEffect, useState } from "react";
import PokemonCard from "./PokemonCard";

function Pokemon({ url, isFavorite, onToggleFavorite }) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Kon Pokémon data niet laden.");
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
  }, [url]);

  if (loading) {
    return (
      <li className="pokemon-card-placeholder">
        <p>Aan het laden...</p>
      </li>
    );
  }

  if (error || !pokemon) {
    return (
      <li className="pokemon-card-placeholder error">
        <p>Laden mislukt</p>
      </li>
    );
  }

  const image =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;

  const isFav =
    typeof isFavorite === "function" ? isFavorite(pokemon.name) : Boolean(isFavorite);

  return (
    <li className="pokemon-list-item">
      <PokemonCard
        id={pokemon.id}
        name={pokemon.name}
        image={image}
        types={pokemon.types.map((t) => t.type.name)}
        isFavorite={isFav}
        onToggleFavorite={onToggleFavorite}
      />
    </li>
  );
}

export default Pokemon;
