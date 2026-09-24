import cv2
import numpy as np
import os

cap = cv2.VideoCapture("public/character.mp4")
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Total frames: {total_frames}")

# Let's inspect frames at regular intervals across the entire video
# We have 192 frames total. Let's make an overview montage of 24 frames (every 8 frames)
# and another montage of the final 24 frames (168 to 191).
frames_grid = []
step = total_frames // 24
for i in range(24):
    frame_idx = i * step
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
    ret, frame = cap.read()
    if ret:
        small = cv2.resize(frame, (160, 90))
        # Draw frame number
        cv2.putText(small, str(frame_idx), (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        frames_grid.append(small)

# Arrange into 4 rows of 6
rows = [np.hstack(frames_grid[r*6 : (r+1)*6]) for r in range(4)]
montage = np.vstack(rows)
cv2.imwrite("scratch/montage_overview.jpg", montage)
print("Saved scratch/montage_overview.jpg")

# Also check the last 20 frames specifically for neutral / center pose
last_frames = []
for f in range(max(0, total_frames - 20), total_frames):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, frame = cap.read()
    if ret:
        small = cv2.resize(frame, (160, 90))
        cv2.putText(small, str(f), (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        last_frames.append(small)

if last_frames:
    n_cols = 5
    n_rows = (len(last_frames) + n_cols - 1) // n_cols
    # Pad if necessary
    while len(last_frames) < n_rows * n_cols:
        last_frames.append(np.zeros_like(last_frames[0]))
    last_rows = [np.hstack(last_frames[r*n_cols : (r+1)*n_cols]) for r in range(n_rows)]
    last_montage = np.vstack(last_rows)
    cv2.imwrite("scratch/montage_last.jpg", last_montage)
    print("Saved scratch/montage_last.jpg")

cap.release()
