#PROJECT SUBMISSION
##Yash Muthanna Nellamakada

GOAL: Develop a web-based application that enables users to upload transportation-related images (such as traffic camera images) and perform object detection on those images

Project has been built using React for the frontend, Flask has been used to build the API. YOLOv8 from the ultralytics package has been used as a pre-trained model for the object detection. Packaged the web application using Docker for easy deployment. 

##STEPS TO RUN 
Refer to demo_video.mp4

Docker must be installed on the system to be able to run locally. 

1) Download zip file of the entire repository
2) Extract the zip files
3) Open the project folder in any terminal
4) Make sure ./client ./server and docker-compose.yml should be visible from current folder
5) Run Command docker-compose up
