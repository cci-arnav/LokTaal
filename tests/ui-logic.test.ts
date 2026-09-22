import test from 'node:test';
import assert from 'node:assert/strict';
import { indiaRegions, states, unionTerritories } from '../src/data/indiaStates.ts';
import { demoTunes } from '../src/data/demoTunes.ts';
import { buildSearchIndex, filterSearch } from '../src/lib/search.ts';
import { nextLanguage, normalizeLanguagePreference } from '../src/lib/language.ts';
import { validateAudioFile, validateCoverFile, validateRequiredUploadFields } from '../src/lib/uploadValidation.ts';
import { matchRoute, safeRedirect } from '../src/lib/routing.ts';
import { selectTrack } from '../src/lib/audio.ts';
import { LOADER_FAILSAFE_MS, LOADER_MIN_MS, loaderMayClose } from '../src/lib/loader.ts';

test('search is trimmed, case-insensitive and partial', () => {
  const index = buildSearchIndex(indiaRegions, demoTunes);
  assert.equal(filterSearch(index, '  rAjAs  ')[0]?.title, 'Desert Pulse Demo');
  assert.ok(filterSearch(index, 'baul').some((item) => item.title === 'West Bengal'));
  assert.deepEqual(filterSearch(index, 'nothing-real-here'), []);
});
test('language preference switches and safely defaults', () => { assert.equal(normalizeLanguagePreference('hi'), 'hi'); assert.equal(normalizeLanguagePreference('fr'), 'en'); assert.equal(nextLanguage('en'), 'hi'); assert.equal(nextLanguage('hi'), 'en'); });
test('state and Union Territory data is complete and uniquely slugged', () => { assert.equal(states.length, 28); assert.equal(unionTerritories.length, 8); assert.equal(new Set(indiaRegions.map((item) => item.slug)).size, 36); assert.ok(indiaRegions.every((item) => item.nameHi)); });
test('upload files enforce type and size boundaries', () => { assert.equal(validateAudioFile({ name: 'song.mp3', type: 'audio/mpeg', size: 1024 }), ''); assert.match(validateAudioFile({ name: 'song.wav', type: 'audio/wav', size: 1024 }), /MP3 or M4A/); assert.match(validateAudioFile({ name: 'song.mp3', type: 'audio/mpeg', size: 26 * 1024 * 1024 }), /25 MB/); assert.equal(validateCoverFile({ name: 'cover.webp', type: 'image/webp', size: 1024 }), ''); assert.match(validateCoverFile({ name: 'cover.gif', type: 'image/gif', size: 1024 }), /JPG/); });
test('required upload metadata and consent are validated', () => { const errors = validateRequiredUploadFields({ contributorName: '', email: 'bad', relationship: '', title: '', artist: '', stateSlug: '', district: '', language: '', tradition: '', description: '', culturalStory: '', consent: false, review: false }); assert.ok(errors.title); assert.ok(errors.email); assert.ok(errors.consent); assert.ok(errors.review); });
test('only one active audio selection exists', () => { const first = selectTrack({ trackId: null, isPlaying: false }, 'one'); const second = selectTrack(first, 'two'); assert.deepEqual(second, { trackId: 'two', isPlaying: true }); assert.equal(selectTrack(second, 'two').isPlaying, false); });
test('auth redirect routing stays local and upload route matches', () => { assert.deepEqual(matchRoute('/upload'), { name: 'upload' }); assert.deepEqual(matchRoute('/states/rajasthan'), { name: 'state', slug: 'rajasthan' }); assert.equal(safeRedirect('//evil.example', '/'), '/'); assert.equal(safeRedirect('/upload', '/'), '/upload'); });
test('loader respects minimum duration and has a failsafe', () => { assert.equal(loaderMayClose(0, LOADER_MIN_MS - 1, true), false); assert.equal(loaderMayClose(0, LOADER_MIN_MS, true), true); assert.equal(loaderMayClose(0, LOADER_FAILSAFE_MS, false), true); });
