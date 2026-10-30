import { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import List from './pages/List.jsx';
import Detail from './pages/Detail.jsx';
import Teams from './pages/Teams.jsx';

function App() {
  // Haal de opgeslagen teams op uit localStorage bij het opstarten
  const [teams, setTeams] = useState(() => {
    try {
      const savedTeams = localStorage.getItem('pokemon_teams');
      return savedTeams ? JSON.parse(savedTeams) : [];
    } catch (error) {
      console.error('Fout bij laden van teams uit localStorage:', error);
      return [];
    }
  });

  // Sla teams automatisch op in localStorage zodra de state verandert
  useEffect(() => {
    try {
      localStorage.setItem('pokemon_teams', JSON.stringify(teams));
    } catch (error) {
      console.error('Fout bij opslaan in localStorage:', error);
    }
  }, [teams]);

  // Functie om een nieuw team aan te maken
  const handleCreateTeam = (teamName) => {
    const trimmed = teamName.trim();
    if (!trimmed) {
      return { success: false, message: 'Voer een geldige teamnaam in.' };
    }

    const nameExists = teams.some(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (nameExists) {
      return { success: false, message: 'Er bestaat al een team met deze naam.' };
    }

    const newTeam = {
      id: Date.now().toString(),
      name: trimmed,
      members: [],
    };
    setTeams((prev) => [...prev, newTeam]);
    return { success: true, team: newTeam, message: `Team "${trimmed}" is succesvol aangemaakt!` };
  };

  // Functie om een compleet team te verwijderen
  const handleDeleteTeam = (teamId) => {
    const teamToDelete = teams.find((t) => t.id === teamId);
    const teamName = teamToDelete ? teamToDelete.name : 'Team';
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    return { success: true, message: `Team "${teamName}" is succesvol verwijderd.` };
  };

  // Functie om een Pokémon aan een team toe te voegen (max 6, geen dubbelen)
  const handleAddToTeam = (teamId, pokemon) => {
    const targetTeam = teams.find((t) => t.id === teamId);
    if (!targetTeam) {
      return { success: false, message: 'Team niet gevonden.' };
    }

    if (targetTeam.members.length >= 6) {
      return {
        success: false,
        message: `Team "${targetTeam.name}" is al vol (maximaal 6 Pokémon)!`,
      };
    }

    const alreadyInTeam = targetTeam.members.some(
      (m) => m.name.toLowerCase() === pokemon.name.toLowerCase()
    );
    if (alreadyInTeam) {
      return {
        success: false,
        message: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} zit al in dit team!`,
      };
    }

    const newMember = {
      id: pokemon.id,
      name: pokemon.name,
      image: pokemon.image,
      types: pokemon.types,
    };

    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId ? { ...t, members: [...t.members, newMember] } : t
      )
    );

    return {
      success: true,
      message: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} is toegevoegd aan team "${targetTeam.name}"!`,
    };
  };

  // Functie om een Pokémon uit een team te verwijderen
  const handleRemovePokemonFromTeam = (teamId, pokemonName) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.filter(
                (m) => m.name.toLowerCase() !== pokemonName.toLowerCase()
              ),
            }
          : t
      )
    );
  };

  return (
    <>
      <Header />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/list" element={<List />} />
          <Route
            path="/pokemon/:name"
            element={
              <Detail
                teams={teams}
                onAddToTeam={handleAddToTeam}
                onCreateTeam={handleCreateTeam}
                onDeleteTeam={handleDeleteTeam}
              />
            }
          />
          <Route
            path="/detail/:id"
            element={
              <Detail
                teams={teams}
                onAddToTeam={handleAddToTeam}
                onCreateTeam={handleCreateTeam}
                onDeleteTeam={handleDeleteTeam}
              />
            }
          />
          <Route
            path="/teams"
            element={
              <Teams
                teams={teams}
                onCreateTeam={handleCreateTeam}
                onDeleteTeam={handleDeleteTeam}
                onRemovePokemon={handleRemovePokemonFromTeam}
                onAddToTeam={handleAddToTeam}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;