import * as React from "react";
import PropTypes from "prop-types";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSpring, animated } from "@react-spring/web";
import axios from "axios";
import { FormControl, Grid, TextField } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  useAddVocationMutation,
  useGetAllDataQuery,
} from "../../features/getAllDataApi";

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 4,
};

export default function AddCardsModal(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    refetchAllData();
    props.checkIsClosed(true);
  };

  const {
    data,
    isLoading,
    isError,
    refetch: refetchAllData,
  } = useGetAllDataQuery();

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDate();
  const formattedDate = `${month.toString().padStart(2, "0")}-${day
    .toString()
    .padStart(2, "0")}-${year}`;

  const schema = yup.object().shape({
    destination: yup.string().max(250).required(),
    country: yup.string().max(250).required(),
    header: yup.string().max(250).required(),
    description: yup.string().max(10000).required(),
    days: yup.number().typeError("Days must be a valid number").required(),
    date: yup.date().min(formattedDate).required("date is a required field"),
    price: yup
      .number()
      .typeError("Price must be a valid number")
      .max(10000, "Price cannot exceed $10,000")
      .required("Price is required"),
    img: yup
      .mixed()
      .test("fileSize", "The image is too large", (value) => {
        if (value && value.length > 0) {
          return value[0].size <= 10485760; // Check file size
        }
        return true;
      })
      .test("fileType", "Unsupported image format", (value) => {
        if (value && value.length > 0) {
          return ["image/jpeg", "image/png", "image/gif"].includes(
            value[0].type
          );
        }
        return true;
      })
      .test("required", "Please upload an image", (value) => {
        return value && value.length > 0; // Check if a file is selected
      }),
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [addVocation, { isLoading: loads, error }] = useAddVocationMutation();

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("destination", data.destination);
    formData.append("country", data.country);
    formData.append("header", data.header);
    formData.append("description", data.description);
    formData.append("days", data.days);
    formData.append("date", data.date);
    formData.append("price", data.price);

    const imgArray = Array.from(data.img);
    imgArray.map((file) => formData.append("img", file));
    console.log(imgArray);

    addVocation(formData)
      .unwrap()
      .then((response) => {
        handleClose();
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    handleOpen();
  }, []);

  return (
    <div>
      <Modal
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            TransitionComponent: Fade,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography
              color="red"
              id="spring-modal-title"
              variant="h6"
              component="h2"
              sx={{ marginBottom: 4, textAlign: "center" }}
            >
              Add A New Destination
            </Typography>
            <FormControl component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Box>
                    <TextField
                      fullWidth
                      id="destination"
                      label="Destination"
                      variant="outlined"
                      {...register("destination")}
                    />
                    <Typography component="h5" variant="body2">
                      {errors.destination?.message}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <TextField
                      fullWidth
                      id="country"
                      label="Country"
                      variant="outlined"
                      type="text"
                      {...register("country")}
                    />
                    <Typography component="h5" variant="body2">
                      {errors.country?.message}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <TextField
                      fullWidth
                      id="price"
                      label="Price"
                      variant="outlined"
                      type="text"
                      {...register("price")}
                    />
                    <Typography component="h5" variant="body2">
                      {errors.price?.message}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={12}>
                  <Box>
                    <TextField
                      fullWidth
                      id="header"
                      label="Header"
                      multiline
                      rows={2}
                      {...register("header")}
                    />
                    <Typography component="h5" variant="body2">
                      {errors.header?.message}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={12}>
                  <Box>
                    <TextField
                      fullWidth
                      id="description"
                      label="Description"
                      multiline
                      rows={6}
                      {...register("description")}
                    />
                    <Typography component="h5" variant="body2">
                      {errors.description?.message}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <TextField
                      fullWidth
                      id="days"
                      label="Days"
                      rows={6}
                      {...register("days")}
                    />
                    <Typography component="h5" variant="body2">
                      {errors.days?.message}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Controller
                      name="date"
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            {...field}
                            value={field.value || null}
                            onChange={(date) => field.onChange(date)}
                          />
                        </LocalizationProvider>
                      )}
                    />
                    <Typography component="h5" variant="body2">
                      {errors.date?.message}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <input type="file" {...register("img")} multiple />
                    <Typography component="h5" variant="body2">
                      {errors.img?.message}
                    </Typography>
                  </Box>
                </Grid>
                <Grid
                  sx={{ display: "flex", justifyContent: "center" }}
                  item
                  xs={12}
                >
                  <Button type="submit" startIcon={<CloudUploadIcon />}>
                    UPLOAD
                  </Button>
                  <Button onClick={handleClose}>CLOSE</Button>
                </Grid>
              </Grid>
            </FormControl>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
