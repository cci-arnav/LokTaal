export type AdministrativeType = 'state' | 'union-territory';
export interface IndiaRegion { slug: string; name: string; nameHi: string; type: AdministrativeType; featured?: boolean; languages?: string[]; traditions?: string[]; }

export const indiaRegions: IndiaRegion[] = [
  { slug: 'andhra-pradesh', name: 'Andhra Pradesh', nameHi: 'आंध्र प्रदेश', type: 'state' },
  { slug: 'arunachal-pradesh', name: 'Arunachal Pradesh', nameHi: 'अरुणाचल प्रदेश', type: 'state' },
  { slug: 'assam', name: 'Assam', nameHi: 'असम', type: 'state', featured: true, languages: ['Assamese'], traditions: ['Bihu'] },
  { slug: 'bihar', name: 'Bihar', nameHi: 'बिहार', type: 'state', traditions: ['Sohar', 'Kajri'] },
  { slug: 'chhattisgarh', name: 'Chhattisgarh', nameHi: 'छत्तीसगढ़', type: 'state' },
  { slug: 'goa', name: 'Goa', nameHi: 'गोवा', type: 'state' },
  { slug: 'gujarat', name: 'Gujarat', nameHi: 'गुजरात', type: 'state', traditions: ['Garba', 'Dayro'] },
  { slug: 'haryana', name: 'Haryana', nameHi: 'हरियाणा', type: 'state' },
  { slug: 'himachal-pradesh', name: 'Himachal Pradesh', nameHi: 'हिमाचल प्रदेश', type: 'state' },
  { slug: 'jharkhand', name: 'Jharkhand', nameHi: 'झारखंड', type: 'state' },
  { slug: 'karnataka', name: 'Karnataka', nameHi: 'कर्नाटक', type: 'state' },
  { slug: 'kerala', name: 'Kerala', nameHi: 'केरल', type: 'state' },
  { slug: 'madhya-pradesh', name: 'Madhya Pradesh', nameHi: 'मध्य प्रदेश', type: 'state' },
  { slug: 'maharashtra', name: 'Maharashtra', nameHi: 'महाराष्ट्र', type: 'state', featured: true, languages: ['Marathi'], traditions: ['Lavani', 'Powada'] },
  { slug: 'manipur', name: 'Manipur', nameHi: 'मणिपुर', type: 'state' },
  { slug: 'meghalaya', name: 'Meghalaya', nameHi: 'मेघालय', type: 'state' },
  { slug: 'mizoram', name: 'Mizoram', nameHi: 'मिज़ोरम', type: 'state' },
  { slug: 'nagaland', name: 'Nagaland', nameHi: 'नागालैंड', type: 'state', featured: true, traditions: ['Highland chorus'] },
  { slug: 'odisha', name: 'Odisha', nameHi: 'ओडिशा', type: 'state' },
  { slug: 'punjab', name: 'Punjab', nameHi: 'पंजाब', type: 'state', featured: true, languages: ['Punjabi'], traditions: ['Tappa', 'Boliyan'] },
  { slug: 'rajasthan', name: 'Rajasthan', nameHi: 'राजस्थान', type: 'state', featured: true, languages: ['Marwari'], traditions: ['Manganiyar', 'Maand'] },
  { slug: 'sikkim', name: 'Sikkim', nameHi: 'सिक्किम', type: 'state' },
  { slug: 'tamil-nadu', name: 'Tamil Nadu', nameHi: 'तमिलनाडु', type: 'state', featured: true, languages: ['Tamil'], traditions: ['Villupattu'] },
  { slug: 'telangana', name: 'Telangana', nameHi: 'तेलंगाना', type: 'state' },
  { slug: 'tripura', name: 'Tripura', nameHi: 'त्रिपुरा', type: 'state' },
  { slug: 'uttar-pradesh', name: 'Uttar Pradesh', nameHi: 'उत्तर प्रदेश', type: 'state' },
  { slug: 'uttarakhand', name: 'Uttarakhand', nameHi: 'उत्तराखंड', type: 'state' },
  { slug: 'west-bengal', name: 'West Bengal', nameHi: 'पश्चिम बंगाल', type: 'state', featured: true, languages: ['Bengali'], traditions: ['Baul', 'Bhatiyali'] },
  { slug: 'andaman-and-nicobar-islands', name: 'Andaman and Nicobar Islands', nameHi: 'अंडमान और निकोबार द्वीपसमूह', type: 'union-territory' },
  { slug: 'chandigarh', name: 'Chandigarh', nameHi: 'चंडीगढ़', type: 'union-territory' },
  { slug: 'dadra-and-nagar-haveli-and-daman-and-diu', name: 'Dadra and Nagar Haveli and Daman and Diu', nameHi: 'दादरा और नगर हवेली और दमन और दीव', type: 'union-territory' },
  { slug: 'delhi', name: 'Delhi', nameHi: 'दिल्ली', type: 'union-territory' },
  { slug: 'jammu-and-kashmir', name: 'Jammu and Kashmir', nameHi: 'जम्मू और कश्मीर', type: 'union-territory' },
  { slug: 'ladakh', name: 'Ladakh', nameHi: 'लद्दाख', type: 'union-territory' },
  { slug: 'lakshadweep', name: 'Lakshadweep', nameHi: 'लक्षद्वीप', type: 'union-territory' },
  { slug: 'puducherry', name: 'Puducherry', nameHi: 'पुदुचेरी', type: 'union-territory' },
];

export const states = indiaRegions.filter((region) => region.type === 'state');
export const unionTerritories = indiaRegions.filter((region) => region.type === 'union-territory');
