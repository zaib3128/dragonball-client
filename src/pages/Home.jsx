import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import SagaTicker from '../components/SagaTicker';
import CharacterSlider from '../components/CharacterSlider';
import FeatureCards from '../components/FeatureCards';
import { API_BASE_URL } from '../config/api';
import characterImages from '../data/characterImages';

const Home = () => {
  const [charactersData, setCharactersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeCharacters = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/home-characters`);
        if (!response.ok) throw new Error('Failed to fetch home characters');
        const data = await response.json();

        const withImages = data.map((char) => ({
          ...char,
          image: characterImages[char.id],
        }));

        setCharactersData(withImages);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeCharacters();
  }, []);

  return (
    <div className="bg-[#F4F1EA] text-black min-h-screen">
      <Hero />
      <SagaTicker />

      {loading && (
        <p className="text-center py-20 font-bold uppercase tracking-widest">Loading characters...</p>
      )}
      {error && (
        <p className="text-center py-20 font-bold uppercase tracking-widest text-[#D32F2F]">
          Could not load characters: {error}
        </p>
      )}
      {!loading && !error && charactersData.length > 0 && (
        <CharacterSlider characters={charactersData} />
      )}

      <FeatureCards />
    </div>
  );
};

export default Home;