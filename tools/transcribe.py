import json
import os
import sys

from faster_whisper import WhisperModel

path, size = sys.argv[1], sys.argv[2]
model = WhisperModel(size, device="cpu", compute_type="int8")
segments, _ = model.transcribe(path, vad_filter=True)
sentences = [
    {"start": round(s.start, 1), "end": round(s.end, 1), "text": s.text.strip()}
    for s in segments
]
json.dump(
    {"source": os.path.basename(path), "model": size, "sentences": sentences},
    sys.stdout,
    indent=2,
)
print()
