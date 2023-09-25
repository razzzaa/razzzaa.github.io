import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "1px",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export default function ImageModal(props) {
  const [open, setOpen] = React.useState(false);

  const checkIsClosed = () => {
    const data = true;
    props.checkIsClosed(data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    checkIsClosed();
  };

  React.useEffect(() => {
    handleOpen();
  }, []);

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            {props.header}
          </Typography>
          <Typography
            variant="subtitle2"
            id="modal-modal-description"
            sx={{ mt: 2 }}
          >
            {props.description}
          </Typography>
          <Button
            onClick={handleClose}
            sx={{ marginY: 2, paddingY: 1 }}
            variant="contained"
            color="error"
          >
            close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
