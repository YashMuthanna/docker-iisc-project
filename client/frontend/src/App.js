import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Container, Nav, Navbar, Form, Button, Row, Col, Image } from 'react-bootstrap';
import axios from 'axios'

function App() {
  // Ref for the sections
  const homeRef = useRef(null);
  const uploadRef = useRef(null);
  const processedRef = useRef(null);
  const [progress, setProgress] = useState( {started: false, pc: 0} )
  const [msg, setMsg] = useState( )

  // State for uploaded image
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  function handleImage(e) {
    setUploadedImage(e.target.files[0]);
  }

  const handleSubmit = async () => {
    try {
      if (!uploadedImage) {
        setMsg("No file selected");
        return ;
      }
      const formData = new FormData();
      formData.append('files[]', uploadedImage);
      console.log(uploadedImage.name)
      setMsg("Uploading...");
      setProgress(prevState => {
        return {...prevState, started: true}
      });
      const response = await axios.post('http://127.0.0.1/upload', formData, {
        onUploadProgress: (progressEvent) => {
          setProgress(prevState => {
            return {...prevState, pc: progressEvent.progress * 100 }
          });
        },
        headers: {
          'Custom-Header': "value",
          'Content-Type': 'multipart/form-data'
        }
      });
      setMsg("Upload Successful");
      // Assuming the response contains the processed image URL
      
      // Update the processedImage state
    } catch (error) {
      console.error('Error uploading image:', error);
      setMsg("Upload Failed");
    }
    const new_img = "processed_" + uploadedImage.name
    console.log(new_img)
    const resp = await axios.get(`http://127.0.0.1/processed/${new_img}`, {
      responseType: 'arraybuffer' // Specify responseType as 'arraybuffer' to handle binary data
    });
    const blob = new Blob([resp.data], { type: 'image/jpeg' }); // Specify the appropriate MIME type based on the file type

    // Create a URL for the blob object
    const imageUrl = URL.createObjectURL(blob);

    // Set the processedImage state with the URL of the processed image
    setProcessedImage(imageUrl);
    console.log(processedImage)

  }
  
  

  // Function to handle smooth scrolling
  const scrollToRef = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Navbar expand='lg' bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Object Detection</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link onClick={() => scrollToRef(homeRef)}>Home</Nav.Link>
              <Nav.Link onClick={() => scrollToRef(uploadRef)}>Upload Image</Nav.Link>
              <Nav.Link onClick={() => scrollToRef(processedRef)}>Processed Images</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container ref={homeRef} style={{ marginTop: '40px' }}>
        {/* Home Section */}
        <h2>Home</h2>
        <h4>Welcome! </h4>
        <p>This website is built using <strong>React</strong> and <strong>Flask</strong>. <br />  The goal of this project is to develop a web-based application that enables users to upload transportation-related images and perform object detection on those images. </p>
        <p>For the object detection, YOLO pre-trained model is being used.</p>
      </Container>

      <Container ref={uploadRef} style={{ marginTop: '40px' }}>
        {/* Upload Image Section */}
        <h2>Upload Image</h2>
        <input type='file' name='photo' onChange={handleImage}/>
        <Button onClick={handleSubmit}>Submit</Button>
      </Container>

      <Container ref={processedRef} style={{ marginTop: '40px' }}>
        {/* Processed Images Section */}
        <h2>Processed Images</h2>
        <Container>
          <Row>
            <Col xs={12} md={12}>
              <p>Before Processing</p>
              { progress.started && <progress max="100" value={ progress.pc }> </progress> }
              {msg && <span>{msg}</span>}
              <div style={{margin: '10px', width: '300px', height: '300px', overflow: 'hidden' }}>
                {uploadedImage && <Image src={URL.createObjectURL(uploadedImage)} alt="Uploaded" fluid />}
              </div>
            </Col>
            <Col xs={12} md={12}>
              <p>After Processing</p>
              <div style={{margin: '10px', width: '300px', height: '300px', overflow: 'hidden' }}>
                {processedImage && <Image src={processedImage} alt="Processed" fluid />}
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}

export default App;
