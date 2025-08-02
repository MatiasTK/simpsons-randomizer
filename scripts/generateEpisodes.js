const API_TOKEN = process.env.TMDB_API_TOKEN;

const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_SIZE = 'w300';
const SIMPSONS_TV_ID = '456-the-simpsons';
const IMAGES_URL = `https://media.themoviedb.org/t/p/${IMAGE_SIZE}`;
const MAX_SEASON = 34;
const TIMEOUT = 1000;

import fs from 'fs';

const getEpisodes = async () => {
  console.log('🔄 Starting to fetch episodes...');
  const episodes = [];
  for (let season = 1; season <= MAX_SEASON; season++) {
    const seasonUrl = `${API_URL}/tv/${SIMPSONS_TV_ID}/season/${season}?language=es-MX`;
    const response = await fetch(seasonUrl, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    const data = await response.json();
    episodes.push({
      season,
      air_date: data.air_date,
      quantity: data.episodes.length,
      episodes: data.episodes.map(episode => ({
        number: episode.episode_number,
        title: episode.name,
        description: episode.overview,
        image: `${IMAGES_URL}${episode.still_path}`,
      })),
    });

    await new Promise(resolve => setTimeout(resolve, TIMEOUT));
    console.log(`✅ Season ${season} processed`);
  }

  console.log('\n🌟 All seasons processed');

  return episodes;
};

const episodes = await getEpisodes();

fs.writeFileSync('episodes.json', JSON.stringify(episodes, null, 2));
