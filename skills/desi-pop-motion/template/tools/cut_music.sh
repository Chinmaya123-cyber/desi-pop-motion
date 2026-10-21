#!/bin/bash
# Cut a slice of a song for the video, optionally muffled at the start so the "drop" lands with the visuals.
#   tools/cut_music.sh <song> <start_sec> <length_sec> <out.wav> [muffle_sec]
# Example: tools/cut_music.sh refs/song.mp3 67.77 12.255 public/audio/thanks.wav 1.935
set -e
SONG=$1; START=$2; LEN=$3; OUT=$4; MUF=${5:-0}
FADE_AT=$(python3 -c "print(max(0, $LEN - 0.9))")
if python3 -c "import sys; sys.exit(0 if float('$MUF') > 0 else 1)"; then
  REST=$(python3 -c "print($LEN - $MUF)"); FO=$(python3 -c "print(max(0, $LEN - $MUF - 0.8))")
  ffmpeg -v error -y -ss $START -t $LEN -i "$SONG" -filter_complex \
    "[0:a]asplit[a][b];[a]atrim=0:$MUF,lowpass=f=480,lowpass=f=480,volume=0.8,afade=t=in:st=0:d=0.15,asetpts=PTS-STARTPTS[a1];[b]atrim=$MUF:$LEN,asetpts=PTS-STARTPTS,afade=t=out:st=$FO:d=0.8[b1];[a1][b1]concat=n=2:v=0:a=1" \
    -ar 44100 -c:a pcm_s16le "$OUT"
else
  ffmpeg -v error -y -ss $START -t $LEN -i "$SONG" -af "afade=t=in:st=0:d=0.05,afade=t=out:st=$FADE_AT:d=0.9" -ar 44100 -c:a pcm_s16le "$OUT"
fi
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
