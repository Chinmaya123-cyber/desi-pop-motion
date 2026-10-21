"""Word-timed lyrics, to sync text hits to the vocal.

    .venv/bin/python -I tools/transcribe.py refs/song.mp3 [--lang en|hi] [--from 0 --to 90] [--prompt "known lyric words"]

Prints one line per phrase with each word's start time (seconds in the ORIGINAL song).
Tips: Hindi/Hinglish songs read best with --lang en (romanised, sometimes translated);
pass --prompt with the words you expect to sharpen the timing. Timings are about ±0.15s,
so snap visual hits to the nearest beat from tools/beatgrid.py.
"""
import argparse, json, os, subprocess, tempfile
import numpy as np
from scipy.io import wavfile
from faster_whisper import WhisperModel

ap = argparse.ArgumentParser()
ap.add_argument('song'); ap.add_argument('--lang', default='en'); ap.add_argument('--from', dest='a', type=float, default=0)
ap.add_argument('--to', dest='b', type=float, default=None); ap.add_argument('--prompt', default=None); ap.add_argument('--json', default=None)
args = ap.parse_args()
tmp = os.path.join(tempfile.mkdtemp(), 'a.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', args.song, '-ac', '1', '-ar', '16000', tmp], check=True)
sr, a = wavfile.read(tmp); a = a.astype(np.float32) / 32768
a = a[int(args.a * sr): int(args.b * sr) if args.b else None]
m = WhisperModel('small', device='cpu', compute_type='int8')  # numpy input avoids a PyAV version bug
segs, _ = m.transcribe(a, word_timestamps=True, language=args.lang, initial_prompt=args.prompt)
out = []
for sg in segs:
    words = [{'w': w.word.strip(), 's': round(w.start + args.a, 2), 'e': round(w.end + args.a, 2)} for w in (sg.words or [])]
    print(f'[{sg.start + args.a:7.2f}] ' + ' '.join(f"{w['w']}@{w['s']:.2f}" for w in words))
    out.append({'start': sg.start + args.a, 'end': sg.end + args.a, 'text': sg.text, 'words': words})
if args.json:
    json.dump(out, open(args.json, 'w'), ensure_ascii=False, indent=1)
