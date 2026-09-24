import cv2
import os

cap = cv2.VideoCapture("public/character.mp4")
os.makedirs("scratch/frame_samples", exist_ok=True)

total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

# Save every 5th frame and frame 0, plus the last 30 frames to inspect
saved = []
for f_idx in range(total_frames):
    ret, frame = cap.read()
    if not ret:
        break
    if f_idx % 6 == 0 or f_idx >= 150:
        cv2.imwrite(f"scratch/frame_samples/frame_{f_idx:03d}.jpg", frame)
        saved.append(f_idx)

cap.release()
print(f"Saved {len(saved)} sample frames to scratch/frame_samples")
