import { NavLink } from 'react-router-dom';

function Navigation({ favoritesCount = 0 }) {
  return (
    <nav className="navigation">
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/list">Pokémon Lijst</NavLink></li>
        <li>
          <NavLink to="/favorites">
            Favorieten {favoritesCount > 0 && <span className="nav-badge">{favoritesCount}</span>}
          </NavLink>
        </li>
        <li><NavLink to="/pokemon/pikachu">Pokémon Detail</NavLink></li>
        <li><NavLink to="/teams">Mijn Teams</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navigation;