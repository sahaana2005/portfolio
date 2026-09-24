import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")

# Let's save frames 20, 25, 30, ... 215, and 230 to scratch/frames_detailed
import os
os.makedirs("scratch/frames_detailed", exist_ok=True)

test_frames = list(range(20, 220, 5)) + [225, 230, 235]
for f in test_frames:
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, frame = cap.read()
    if ret:
        cv2.imwrite(f"scratch/frames_detailed/{f:03d}.jpg", frame)

print(f"Saved {len(test_frames)} detailed frames.")
cap.release()
