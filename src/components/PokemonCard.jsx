import { Link } from 'react-router-dom';

function PokemonCard({ name, image, types = [], id, extraAction }) {
  const displayImage = image || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

  return (
    <div className="card">
      {id && <span className="card-id">#{String(id).padStart(3, '0')}</span>}
      <div className="card-image-wrapper">
        <img src={displayImage} alt={name} className="card-image" />
      </div>
      <h3 className="card-title">{name}</h3>
      {types && types.length > 0 && (
        <div className="card-types">
          {types.map((type) => (
            <span key={type} className={`type-badge type-${type.toLowerCase()}`}>
              {type}
            </span>
          ))}
        </div>
      )}
      <div className="card-actions">
        <Link to={`/pokemon/${name}`} className="btn-detail">
          Bekijk details
        </Link>
        {extraAction}
      </div>
    </div>
  );
}

export default PokemonCard;
