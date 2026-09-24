import cv2
import numpy as np

cap = cv2.VideoCapture("public/character.mp4")

# Cardinal & diagonal poses + center
poses = {
    "UP": 32,
    "UP-LEFT": 55,
    "LEFT": 78,
    "DOWN-LEFT": 101,
    "DOWN": 124,
    "DOWN-RIGHT": 147,
    "RIGHT": 170,
    "UP-RIGHT": 193,
    "UP-LOOP": 216,
    "CENTER": 230
}

grid = []
for name, f_idx in poses.items():
    cap.set(cv2.CAP_PROP_POS_FRAMES, f_idx)
    ret, frame = cap.read()
    if ret:
        small = cv2.resize(frame, (240, 135))
        cv2.putText(small, f"{name} ({f_idx})", (10, 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
        grid.append(small)

top_row = np.hstack(grid[:5])
bot_row = np.hstack(grid[5:])
contact = np.vstack([top_row, bot_row])
cv2.imwrite("scratch/compass_poses.jpg", contact)
print("Saved scratch/compass_poses.jpg")
cap.release()
