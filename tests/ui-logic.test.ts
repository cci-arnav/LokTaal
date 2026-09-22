import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { indiaRegions, states, unionTerritories } from '../src/data/indiaStates.ts';
import { demoTunes } from '../src/data/demoTunes.ts';
import { buildSearchIndex, filterSearch } from '../src/lib/search.ts';
import { nextLanguage, normalizeLanguagePreference } from '../src/lib/language.ts';
import { validateAudioFile, validateCoverFile, validateRequiredUploadFields } from '../src/lib/uploadValidation.ts';
import { authorizeRoute, matchRoute, requiredAccess, safeRedirect } from '../src/lib/routing.ts';
import { canContributorEdit, canSubmitStatus, cleanupTargets, createStoragePath, isPublicSong, ownsSong, statusLabel } from '../src/lib/submissionRules.ts';
import { formatAudioTime, selectTrack } from '../src/lib/audio.ts';
import { LOADER_FAILSAFE_MS, LOADER_MIN_MS, loaderMayClose } from '../src/lib/loader.ts';

test('search is trimmed, case-insensitive and partial', () => {
  const index = buildSearchIndex(indiaRegions, demoTunes);
  assert.equal(filterSearch(index, '  rAjAs  ')[0]?.title, 'Desert Pulse Demo');
  assert.ok(filterSearch(index, 'baul').some((item) => item.title === 'West Bengal'));
  assert.deepEqual(filterSearch(index, 'nothing-real-here'), []);
});
test('Assam search results navigate to the demo song and state route', () => { const results = filterSearch(buildSearchIndex(indiaRegions, demoTunes), 'Assam'); assert.ok(results.some((item) => item.title === 'River Reed Demo' && item.href === '/states/assam')); assert.ok(results.some((item) => item.title === 'Assam' && item.href === '/states/assam')); });
test('language preference switches and safely defaults', () => { assert.equal(normalizeLanguagePreference('hi'), 'hi'); assert.equal(normalizeLanguagePreference('fr'), 'en'); assert.equal(nextLanguage('en'), 'hi'); assert.equal(nextLanguage('hi'), 'en'); });
test('state and Union Territory data is complete and uniquely slugged', () => { assert.equal(states.length, 28); assert.equal(unionTerritories.length, 8); assert.equal(new Set(indiaRegions.map((item) => item.slug)).size, 36); assert.ok(indiaRegions.every((item) => item.nameHi)); });
test('upload files enforce type and size boundaries', () => { assert.equal(validateAudioFile({ name: 'song.mp3', type: 'audio/mpeg', size: 1024 }), ''); assert.match(validateAudioFile({ name: 'song.wav', type: 'audio/wav', size: 1024 }), /MP3 or M4A/); assert.match(validateAudioFile({ name: 'song.mp3', type: 'audio/mpeg', size: 26 * 1024 * 1024 }), /25 MB/); assert.equal(validateCoverFile({ name: 'cover.webp', type: 'image/webp', size: 1024 }), ''); assert.match(validateCoverFile({ name: 'cover.gif', type: 'image/gif', size: 1024 }), /JPG/); });
test('required upload metadata and consent are validated', () => { const errors = validateRequiredUploadFields({ contributorName: '', email: 'bad', relationship: '', title: '', artist: '', stateSlug: '', district: '', language: '', tradition: '', description: '', culturalStory: '', consent: false, review: false }); assert.ok(errors.title); assert.ok(errors.email); assert.ok(errors.consent); assert.ok(errors.review); });
test('only one active audio selection exists', () => { const first = selectTrack({ trackId: null, isPlaying: false }, 'one'); const second = selectTrack(first, 'two'); assert.deepEqual(second, { trackId: 'two', isPlaying: true }); assert.equal(selectTrack(second, 'two').isPlaying, false); });
test('audio progress time is formatted safely', () => { assert.equal(formatAudioTime(0), '0:00'); assert.equal(formatAudioTime(65.9), '1:05'); assert.equal(formatAudioTime(Number.NaN), '0:00'); });
test('auth redirect routing stays local and preserves the upload target', () => { assert.deepEqual(matchRoute('/upload'), { name: 'upload' }); assert.equal(safeRedirect('//evil.example', '/'), '/'); assert.equal(safeRedirect('/upload', '/'), '/upload'); });
test('protected and admin routes enforce the expected session role', () => {
  const upload = matchRoute('/upload'); const moderation = matchRoute('/admin/submissions');
  assert.equal(requiredAccess(upload), 'authenticated'); assert.equal(authorizeRoute(upload, false, false), 'login'); assert.equal(authorizeRoute(upload, true, false), 'allow');
  assert.equal(requiredAccess(moderation), 'admin'); assert.equal(authorizeRoute(moderation, false, false), 'login'); assert.equal(authorizeRoute(moderation, true, false), 'home'); assert.equal(authorizeRoute(moderation, true, true), 'allow');
});
test('submission transitions, ownership and publication checks are strict', () => {
  assert.equal(canContributorEdit('draft'), true); assert.equal(canContributorEdit('rejected'), true); assert.equal(canContributorEdit('pending'), false); assert.equal(canSubmitStatus('approved'), false);
  assert.equal(ownsSong({ user_id: 'user-a' }, 'user-a'), true); assert.equal(ownsSong({ user_id: 'user-a' }, 'user-b'), false);
  assert.equal(isPublicSong({ status: 'approved', published_at: '2026-09-22T00:00:00Z' }), true); assert.equal(isPublicSong({ status: 'approved', published_at: null }), false);
});
test('storage paths are scoped, sanitized and unique', () => {
  const first = createStoragePath('user-id', 'song-id', 'Village Song (final).MP3'); const second = createStoragePath('user-id', 'song-id', 'Village Song (final).MP3');
  assert.match(first, /^user-id\/song-id\/[a-f0-9-]+-village-song-final\.mp3$/); assert.notEqual(first, second); assert.deepEqual(cleanupTargets(first, null), { audio: [first], covers: [] });
});
test('submission statuses have English and Hindi labels', () => { assert.equal(statusLabel('pending', 'en'), 'Pending review'); assert.equal(statusLabel('pending', 'hi'), 'समीक्षा लंबित'); });
test('dynamic state routes retain their slug', () => { assert.deepEqual(matchRoute('/states/rajasthan'), { name: 'state', slug: 'rajasthan' }); assert.deepEqual(matchRoute('/states/tamil-nadu'), { name: 'state', slug: 'tamil-nadu' }); });
test('unknown paths use the internal not-found route', () => { assert.deepEqual(matchRoute('/missing-page'), { name: 'not-found' }); });
test('loader respects minimum duration and has a failsafe', () => { assert.equal(loaderMayClose(0, LOADER_MIN_MS - 1, true), false); assert.equal(loaderMayClose(0, LOADER_MIN_MS, true), true); assert.equal(loaderMayClose(0, LOADER_FAILSAFE_MS, false), true); });
test('Vercel rewrites application routes to the SPA entry point', () => { const config = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8')); assert.deepEqual(config.rewrites, [{ source: '/(.*)', destination: '/index.html' }]); });
