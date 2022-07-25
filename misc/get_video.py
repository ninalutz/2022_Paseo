import cv2
import mediapipe as mp
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles
mp_face_mesh = mp.solutions.face_mesh
import csv

# For webcam input:
drawing_spec = mp_drawing.DrawingSpec(thickness=1, circle_radius=1)
cap = cv2.VideoCapture(0)

# reye_landmarks_list = [ 33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
# leye_landmarks_list 
mouth_landmarks_list = [0, 11, 12, 13, 14, 15, 16, 17, 37, 38, 39, 40, 41, 42, 61, 62, 72, 73, 74, 76, 77, 78, 80, 
81, 82, 84, 85, 86, 87, 88, 89, 90, 91, 95, 96, 146, 178, 179, 180, 181, 183, 184, 185, 191, 267, 268, 269, 
270, 271, 272, 291, 292, 302, 303, 304, 306, 307, 310, 311, 312, 314, 315, 316, 317, 319, 320, 321, 324, 
325, 375, 402, 403, 404, 405, 407, 408, 409, 415]

#clockwise starting at left corner
# outer_mouth_landmarks = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146]

outer_mouth_landmarks = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 306, 292, 308, 415, 310, 311, 
312, 13, 82, 81, 80, 191, 78, 62, 76, 61, 76, 62, 78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 292, 
306, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146]

real_time_x = []
real_time_y = []

real_time_out_x = []
real_time_out_y = []

out = cv2.VideoWriter('outpy.avi',cv2.VideoWriter_fourcc('M','J','P','G'), 29, (int(cap.get(3)),int(cap.get(4))))

with mp_face_mesh.FaceMesh(
    max_num_faces=1,
    refine_landmarks=True,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5) as face_mesh:

  while cap.isOpened():
    success, image = cap.read()
    if not success:
      print("Ignoring empty camera frame.")
      # If loading a video, use 'break' instead of 'continue'.
      continue

    #write out debug video file
    out.write(image)
    #start writing sound
    record_to_file('output.wav')

    # To improve performance, optionally mark the image as not writeable to
    # pass by reference.
    image.flags.writeable = False
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(image)

    # Draw the face mesh annotations on the image.
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    
    if results.multi_face_landmarks:

      for face_landmarks in results.multi_face_landmarks:
        connections=mp_face_mesh.FACEMESH_LIPS
        mp_drawing.draw_landmarks(
            image=image,
            landmark_list=face_landmarks, 
            connections = connections,
            landmark_drawing_spec=None,
            connection_drawing_spec=mp_drawing_styles.get_default_face_mesh_contours_style()
            )

        for idx in mouth_landmarks_list:
          loc_x = int(face_landmarks.landmark[idx].x * image.shape[1])
          loc_y = int(face_landmarks.landmark[idx].y * image.shape[0])
          cv2.circle(image,(loc_x, loc_y), 2, (0,255,0), 2)
          real_time_x.append(loc_x)
          real_time_y.append(loc_y)
          # cv2.putText(image, str(idx), (loc_x, loc_y),  cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)

        for idx in outer_mouth_landmarks:
          loc_x = int(face_landmarks.landmark[idx].x * image.shape[1])
          loc_y = int(face_landmarks.landmark[idx].y * image.shape[0])
          cv2.circle(image,(loc_x, loc_y), 2, (0,255,255), 2)
          cv2.putText(image, str(idx), (loc_x, loc_y),  cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 1)

          real_time_out_x.append(loc_x)
          real_time_out_y.append(loc_y)



    cv2.imshow('Paseo 2022 Landmarks',image)
    if cv2.waitKey(1) & 0xFF == ord('q'):
      break
      
cap.release()

with open('whole.csv', 'w', newline='') as f_output:
  csv_output = csv.writer(f_output)
  csv_output.writerow(['x', 'y'])
  for i in range(len(real_time_x)):
    csv_output.writerow([real_time_x[i], real_time_y[i]])


with open('outer.csv', 'w', newline='') as f_output:
  csv_output = csv.writer(f_output)
  csv_output.writerow(['x', 'y'])
  for i in range(len(real_time_out_x)):
    csv_output.writerow([real_time_out_x[i], real_time_out_y[i]])

