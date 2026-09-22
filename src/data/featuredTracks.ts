// Mock featured folk track data for the LokTaal homepage hero.
// This is demonstration data only — clearly placeholder for replacement by a real API later.
// Do NOT treat artist names, track titles, or locations as real verified artists.

export interface FeaturedTrack {
  id: string;
  title: string;
  artist: string;
  location: string;
  category: string;
  language: string;
  region: string;
  accent: string;
  accentSoft: string;
  artwork: string;
  duration: string;
  verified: boolean;
}

const featuredTrackCatalog: FeaturedTrack[] = [
  {
    id: 'track-rajasthan',
    title: 'माटी री पुकार',
    artist: 'कमला देवी एवं लोक मंडली',
    location: 'जैसलमेर, राजस्थान',
    category: 'मांगणियार लोक',
    language: 'मारवाड़ी',
    region: 'Rajasthan',
    accent: '#E9A52B',
    accentSoft: '#F0BC4D',
    artwork:
      'https://images.pexels.com/photos/15937062/pexels-photo-15937062.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '4:32',
    verified: true,
  },
  {
    id: 'track-assam',
    title: 'नदी के गीत',
    artist: 'भोरेश्वर लोक दल',
    location: 'माजुली, असम',
    category: 'बिहु लोक',
    language: 'असमिया',
    region: 'Assam',
    accent: '#C84E37',
    accentSoft: '#D9684C',
    artwork:
      'https://images.pexels.com/photos/29400421/pexels-photo-29400421.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '3:58',
    verified: true,
  },
  {
    id: 'track-nagaland',
    title: 'पहाड़ों की आवाज़',
    artist: 'अंगामी लोक समूह',
    location: 'कोहिमा, नागालैंड',
    category: 'आदिवासी लोक',
    language: 'नागा',
    region: 'Nagaland',
    accent: '#D8A72C',
    accentSoft: '#E6BE4A',
    artwork:
      'https://images.pexels.com/photos/27641014/pexels-photo-27641014.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '5:12',
    verified: false,
  },
  {
    id: 'track-andes',
    title: 'Canto de la Tierra',
    artist: 'Comunidad Andina',
    location: 'Cusco, Andes',
    category: 'Folklore Andino',
    language: 'Quechua',
    region: 'Andes',
    accent: '#174B3A',
    accentSoft: '#2A6B53',
    artwork:
      'https://images.pexels.com/photos/27935987/pexels-photo-27935987.jpeg?auto=compress&cs=tinysrgb&w=400',
    duration: '4:07',
    verified: true,
  },
];

export const featuredTracks = featuredTrackCatalog.filter((track) => track.region !== 'Andes');
export const globalFeaturedTracks = featuredTrackCatalog.filter((track) => track.region === 'Andes');

export const regionChips = [
  'Rajasthan',
  'Assam',
  'Nagaland',
];
