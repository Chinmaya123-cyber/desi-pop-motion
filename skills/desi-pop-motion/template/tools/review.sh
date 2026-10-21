#!/bin/bash
# usage: tools/review.sh <video> <outprefix> t1 t2 ... (multiples of 10 best)
V=$1; P=$2; shift 2; mkdir -p out/review; i=0
for t in "$@"; do ffmpeg -v error -y -ss $t -i "$V" -frames:v 1 -vf "scale=270:480" out/review/f$(printf %02d $i).png; i=$((i+1)); done
n=$i; g=0; s=0
while [ $s -lt $n ]; do
  e=$((s+9)); [ $e -ge $n ] && e=$((n-1)); c=$((e-s+1)); ins=""; lab=""; lay=""
  for k in $(seq $s $e); do ins="$ins -i out/review/f$(printf %02d $k).png"; j=$((k-s)); lab="$lab[$j]"; x=$(( (j%5)*270 )); y=$(( (j/5)*480 )); lay="$lay${lay:+|}${x}_${y}"; done
  if [ $c -eq 1 ]; then cp out/review/f$(printf %02d $s).png out/review/${P}$g.png; else ffmpeg -v error -y $ins -filter_complex "${lab}xstack=inputs=$c:layout=$lay:fill=black" out/review/${P}$g.jpg; fi
  g=$((g+1)); s=$((e+1))
done
ls out/review/${P}*
