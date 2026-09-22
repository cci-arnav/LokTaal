// Demonstration-only homepage content. Replace with consented, verified archive records.
export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  location: string;
  language: string;
  tradition: string;
  artwork: string;
  duration: string;
  audioUrl?: string;
  credit: string;
  region: string;
  addedOrder: number;
  hasStory?: boolean;
}

export interface FeaturedArtist {
  id: string;
  name: string;
  region: string;
  country: string;
  language: string;
  tradition: string;
  bio: string;
  trackTitle: string;
  image: string;
  audioPreview?: string;
  accentColor: string;
}

export const featuredArtists: FeaturedArtist[] = [
  { id: 'desert-voice', name: 'मीरा लोक समूह', region: 'Rajasthan', country: 'India', language: 'Marwari', tradition: 'Desert ballad', bio: 'A demonstration profile representing community-led songs carried through family gatherings and seasonal celebrations.', trackTitle: 'रेत की स्मृति', image: 'https://images.pexels.com/photos/34203491/pexels-photo-34203491.jpeg?auto=compress&cs=tinysrgb&w=1200', accentColor: '#F0B23D' },
  { id: 'river-voice', name: 'Brahmaputra Ensemble', region: 'Assam', country: 'India', language: 'Assamese', tradition: 'River song', bio: 'A demonstration ensemble inspired by the call-and-response traditions of river communities.', trackTitle: 'River Remembers', image: 'https://images.pexels.com/photos/14115984/pexels-photo-14115984.jpeg?auto=compress&cs=tinysrgb&w=1200', accentColor: '#E06543' },
  { id: 'hill-voice', name: 'Angami Echo Circle', region: 'Nagaland', country: 'India', language: 'Tenyidie', tradition: 'Highland chorus', bio: 'A demonstration profile exploring how collective voices and rhythm preserve community memory.', trackTitle: 'Hills at Dawn', image: 'https://images.pexels.com/photos/30952518/pexels-photo-30952518.jpeg?auto=compress&cs=tinysrgb&w=1200', accentColor: '#78A66A' },
  { id: 'baul-voice', name: 'পথের বাউল', region: 'West Bengal', country: 'India', language: 'Bengali', tradition: 'Baul', bio: 'A fictional editorial profile honouring itinerant song-poets and their living oral philosophy.', trackTitle: 'পথের সুর', image: 'https://images.pexels.com/photos/35273091/pexels-photo-35273091.jpeg?auto=compress&cs=tinysrgb&w=1200', accentColor: '#D99548' },
  { id: 'andes-voice', name: 'Voces del Altiplano', region: 'Andes', country: 'Peru', language: 'Quechua', tradition: 'Andean folk', bio: 'A demonstration collective shaped around flute, strings and highland storytelling.', trackTitle: 'Camino de Tierra', image: 'https://images.pexels.com/photos/16985077/pexels-photo-16985077.jpeg?auto=compress&cs=tinysrgb&w=1200', accentColor: '#56A081' },
  { id: 'griot-voice', name: 'Kora Memory Circle', region: 'West Africa', country: 'Senegal', language: 'Wolof', tradition: 'Griot storytelling', bio: 'A fictional editorial profile celebrating music as a vessel for genealogy, counsel and shared history.', trackTitle: 'Threads of Home', image: 'https://images.pexels.com/photos/31386681/pexels-photo-31386681.jpeg?auto=compress&cs=tinysrgb&w=1200', accentColor: '#F0B23D' },
];

export const indiaFeaturedArtists = featuredArtists.filter((artist) => artist.country === 'India');
export const globalFeaturedArtists = featuredArtists.filter((artist) => artist.country !== 'India');

export const archiveTracks: AudioTrack[] = featuredArtists.map((artist, index) => ({
  id: `archive-${artist.id}`,
  title: artist.trackTitle,
  artist: artist.name,
  location: `${artist.region}, ${artist.country}`,
  language: artist.language,
  tradition: artist.tradition,
  artwork: artist.image,
  duration: ['04:12', '03:48', '05:06', '04:31', '03:57', '05:18'][index],
  credit: index % 2 ? 'Contributor permission recorded' : 'Community credit requested',
  region: artist.region,
  addedOrder: 6 - index,
  hasStory: index % 2 === 0,
}));

export const indiaArchiveTracks = archiveTracks.filter((track) => track.location.endsWith(', India'));
