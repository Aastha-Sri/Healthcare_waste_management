// src/App.js
import React from 'react';
import WasteManagement from './components/WasteManagement';
import './styles/styles.css';
import { Container, CssBaseline, Typography, Modal, Backdrop, Fade, IconButton } from '@mui/material'; // Import MUI components
import CloseIcon from '@mui/icons-material/Close'; // Import CloseIcon from MUI icons

function App() {
  const [open, setOpen] = React.useState(false); // State for modal open/close

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="App">
      <CssBaseline />
      <Container maxWidth="md">
        <header className="app-header">
          <Typography variant="h2" align="center" gutterBottom>
            Healthcare Waste Management DApp
          </Typography>
        </header>
        <main>
          <WasteManagement handleOpen={handleOpen} /> {/* Pass handleOpen to WasteManagement */}
        </main>
        {/* Modal for "Know More" section */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className="modal">
              <div className="modal-content">
                <IconButton className="close-button" onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 999 }}>
                  <CloseIcon />
                </IconButton>
                <Typography variant="h4" gutterBottom>
                  Types of Waste and Segregation
                </Typography>
                <Typography variant="body1" paragraph>
                  Information about how waste is segregated in hospitals can be detailed here. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam ultricies tincidunt est, eget congue arcu ultrices sed.
                </Typography>
                <Typography variant="body1" paragraph>
                  Further details about each type of waste and its disposal methods can also be provided.
                </Typography>
              </div>
            </div>
          </Fade>
        </Modal>
      </Container>
    </div>
  );
}

export default App;