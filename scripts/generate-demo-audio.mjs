import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const output = join(process.cwd(), 'public', 'audio', 'demo');
mkdirSync(output, { recursive: true });
const sampleRate = 22050;
const seconds = 8;
const tracks = [
  ['rajasthan', [220, 277, 330], 3], ['punjab', [196, 247, 294], 4], ['assam', [262, 294, 392], 2],
  ['west-bengal', [233, 311, 349], 3], ['maharashtra', [247, 330, 370], 5], ['tamil-nadu', [220, 294, 349], 6],
];

function createWav(frequencies, pulse) {
  const samples = sampleRate * seconds;
  const dataSize = samples * 2;
  const buffer = Buffer.alloc(44 + dataSize);
  buffer.write('RIFF', 0); buffer.writeUInt32LE(36 + dataSize, 4); buffer.write('WAVEfmt ', 8);
  buffer.writeUInt32LE(16, 16); buffer.writeUInt16LE(1, 20); buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(sampleRate, 24); buffer.writeUInt32LE(sampleRate * 2, 28); buffer.writeUInt16LE(2, 32); buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36); buffer.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const note = frequencies[Math.floor(t * 2) % frequencies.length];
    const envelope = Math.min(1, t * 5, (seconds - t) * 5) * (0.55 + 0.45 * Math.pow(Math.sin(Math.PI * pulse * t), 8));
    const tone = Math.sin(2 * Math.PI * note * t) * 0.45 + Math.sin(2 * Math.PI * note * 1.5 * t) * 0.13;
    buffer.writeInt16LE(Math.max(-1, Math.min(1, tone * envelope)) * 32767, 44 + i * 2);
  }
  return buffer;
}
for (const [name, frequencies, pulse] of tracks) writeFileSync(join(output, `${name}.wav`), createWav(frequencies, pulse));
