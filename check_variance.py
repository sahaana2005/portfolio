from PIL import Image
import numpy as np

im = Image.open("public/frames/center.webp")
arr = np.array(im)

left_col = arr[:, 0, :3]
right_col = arr[:, -1, :3]
top_row = arr[0, :, :3]

print("Left column R min-max:", left_col[:,0].min(), left_col[:,0].max())
print("Left column G min-max:", left_col[:,1].min(), left_col[:,1].max())
print("Left column B min-max:", left_col[:,2].min(), left_col[:,2].max())
print("Right column R min-max:", right_col[:,0].min(), right_col[:,0].max())
print("Right column G min-max:", right_col[:,1].min(), right_col[:,1].max())
print("Right column B min-max:", right_col[:,2].min(), right_col[:,2].max())
