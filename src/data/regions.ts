// Mock region data for the LokTaal regional discovery section.
// All artist names, track titles, and descriptions are DEMONSTRATION DATA.
// Replace with real API data when available. Do not treat as real verified artists.

export interface Region {
  id: string;
  name: string;
  country: string;
  shortDescription: string;
  language: string;
  tradition: string;
  artist: string;
  trackTitle: string;
  image: string;
  accentColor: string;
  secondaryColor: string;
  pattern: 'desert' | 'river' | 'mountain' | 'forest' | 'journey' | 'heritage';
  toneFrequency: number;
  bgWord: string;
}

export const regions: Region[] = [
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    country: 'India',
    shortDescription:
      'Desert ballads and rhythmic percussion carried by hereditary musician communities across the Thar.',
    language: 'Marwadi',
    tradition: 'Manganiyar Folk',
    artist: 'कमला देवी एवं लोक मंडली',
    trackTitle: 'माटी री पुकार',
    image:
      'https://images.pexels.com/photos/34203491/pexels-photo-34203491.jpeg?auto=compress&cs=tinysrgb&w=1200',
    accentColor: '#E9A52B',
    secondaryColor: '#C84E37',
    pattern: 'desert',
    toneFrequency: 261.63,
    bgWord: 'मिट्टी',
  },
  {
    id: 'assam',
    name: 'Assam',
    country: 'India',
    shortDescription:
      'River melodies and harvest songs shaped by the Brahmaputra valley and its island monasteries.',
    language: 'Assamese',
    tradition: 'Bihu Folk',
    artist: 'भोरेश्वर लोक दल',
    trackTitle: 'नदी के गीत',
    image:
      'https://images.pexels.com/photos/14115984/pexels-photo-14115984.jpeg?auto=compress&cs=tinysrgb&w=1200',
    accentColor: '#D76643',
    secondaryColor: '#E5B64A',
    pattern: 'river',
    toneFrequency: 293.66,
    bgWord: 'नदी',
  },
  {
    id: 'nagaland',
    name: 'Nagaland',
    country: 'India',
    shortDescription:
      'Highland tribal chants and log-drum rhythms from the hills of the Naga communities.',
    language: 'Naga',
    tradition: 'Angami Folk',
    artist: 'अंगामी लोक समूह',
    trackTitle: 'पहाड़ों की आवाज़',
    image:
      'https://images.pexels.com/photos/30952518/pexels-photo-30952518.jpeg?auto=compress&cs=tinysrgb&w=1200',
    accentColor: '#E5B64A',
    secondaryColor: '#D76643',
    pattern: 'mountain',
    toneFrequency: 329.63,
    bgWord: 'पर्वत',
  },
  {
    id: 'bengal',
    name: 'Bengal',
    country: 'India',
    shortDescription:
      'Baul wanderers and mystic song-poets carrying centuries of oral philosophy across the delta.',
    language: 'Bengali',
    tradition: 'Baul Folk',
    artist: 'লোক সঙ্গীত দল',
    trackTitle: 'পথের গান',
    image:
      'https://images.pexels.com/photos/35273091/pexels-photo-35273091.jpeg?auto=compress&cs=tinysrgb&w=1200',
    accentColor: '#C84E37',
    secondaryColor: '#E5B64A',
    pattern: 'forest',
    toneFrequency: 349.23,
    bgWord: 'जंगल',
  },
  {
    id: 'andes',
    name: 'Andes',
    country: 'South America',
    shortDescription:
      'Andean flute and charro traditions rooted in Quechua communities of the high mountains.',
    language: 'Quechua',
    tradition: 'Folklore Andino',
    artist: 'Comunidad Andina',
    trackTitle: 'Canto de la Tierra',
    image:
      'https://images.pexels.com/photos/16985077/pexels-photo-16985077.jpeg?auto=compress&cs=tinysrgb&w=1200',
    accentColor: '#D88924',
    secondaryColor: '#A9342B',
    pattern: 'journey',
    toneFrequency: 392.0,
    bgWord: 'यात्रा',
  },
  {
    id: 'west-africa',
    name: 'West Africa',
    country: 'West Africa',
    shortDescription:
      'Griot storytelling and djembe rhythms from the oral traditions of West African communities.',
    language: 'Yoruba',
    tradition: 'Griot Drumming',
    artist: 'Onilu Lokajẹ',
    trackTitle: 'Ilẹ̀ Orin',
    image:
      'https://images.pexels.com/photos/31386681/pexels-photo-31386681.jpeg?auto=compress&cs=tinysrgb&w=1200',
    accentColor: '#D44F56',
    secondaryColor: '#E59B32',
    pattern: 'heritage',
    toneFrequency: 466.16,
    bgWord: 'विरासत',
  },
];
