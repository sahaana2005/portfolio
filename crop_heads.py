import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
print(f"Total frames: {total_frames}")

# Let's save a grid of all frames step by step to understand the timeline
# 240 frames total. Let's sample every 10 frames from 0 to 239:
# 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200, 210, 220, 230, 239
frames = []
for f in range(0, total_frames, 8):
    cap.set(cv2.CAP_PROP_POS_FRAMES, f)
    ret, frame = cap.read()
    if ret:
        # Crop head region: head is usually in the top center
        h, w = frame.shape[:2]
        head_crop = frame[int(h*0.1):int(h*0.65), int(w*0.35):int(w*0.65)]
        head_small = cv2.resize(head_crop, (120, 120))
        cv2.putText(head_small, f"{f}", (5, 20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        frames.append(head_small)

# Grid of 5x6
n_cols = 6
n_rows = (len(frames) + n_cols - 1) // n_cols
while len(frames) < n_rows * n_cols:
    frames.append(np.zeros_like(frames[0]))

grid_rows = [np.hstack(frames[r*n_cols:(r+1)*n_cols]) for r in range(n_rows)]
grid = np.vstack(grid_rows)
cv2.imwrite("scratch/head_grid.jpg", grid)
print(f"Saved head_grid.jpg with {len(frames)} frames")

cap.release()
