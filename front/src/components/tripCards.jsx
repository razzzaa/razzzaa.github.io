import {
  Box,
  Fab,
  Grid,
  Paper,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import axios from "axios";
import {
  AccessTime,
  FlightTakeoff,
  ExpandMore,
  Add,
  Info,
  Favorite,
  FavoriteBorder,
  HeartBroken,
  Edit,
  Delete,
} from "@mui/icons-material";
import Rating from "@mui/material/Rating";
import { useEffect, useRef, useState } from "react";
import VocationDesc from "./modals/vocationDescModal";
import ImgBackdrop from "./modals/vocationImageModal";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cartSlice";
import LogInCart from "./modals/needLogInCart";
import LogInFav from "./modals/needLoginFavorite";
import {
  useGetFollowersQuery,
  useAddFollowerMutation,
  useRemoveFollowerMutation,
} from "../features/followersApi";
import {
  useDeleteVocationMutation,
  useGetAllDataQuery,
} from "../features/getAllDataApi";
import { toast } from "react-toastify";
import DeleteConfirmationDialog from "./modals/deletionModal";
import EditCardsModal from "./modals/editModal";

const theme = createTheme({
  components: {
    MuiTypography: {
      variants: [
        {
          props: {
            variant: "body2",
          },
          style: {
            fontSize: 9,
          },
        },
      ],
    },
  },
});

function TripCard(props) {
  const {
    country,
    days,
    header,
    description,
    destination,
    id,
    img_name,
    next_departure,
    price,
    rating,
    followers_count,
  } = props.vocation;
  const localDate = new Date(next_departure);
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(localDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const isRelevantDateForCss = props.isRelevantDateForCss;

  const [expandedDesc, setExpandedDesc] = useState(false);
  const [expandedImg, setExpandedImg] = useState(false);
  const [isAnimatedVocations, setIsAnimatedVocations] = useState(true);
  const [isLoggedModal, setIsLoggedModal] = useState(false);
  const [isLoggedModalFav, setIsLoggedModalFav] = useState(false);
  const [modalClosed, setModalClosed] = useState(false);
  const [followersCount, setFollowersCount] = useState(followers_count);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletionConfirmed, setDeletionConfirmed] = useState(false);
  const [editModalStatus, setEditModalStatus] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState(false);

  const animatedVocationsRef = useRef(null);

  //AUTO ANIMATE ON FILTER
  //...................................................................................................................................................................................
  const filteredFav = useSelector((state) => state.filter.isFavFiltered);
  const filteredDate = useSelector((state) => state.filter.isDateFiltered);
  const isFiltered = filteredFav || filteredDate;
  const isFilteredBoth = filteredFav && filteredDate;
  const shouldAnimate = isFiltered || isFilteredBoth;

  // Update the animation state based on the filter variables
  const animationClass = shouldAnimate ? "animate" : "";
  //...................................................................................................................................................................................

  const handleScroll = () => {
    const box3Position = animatedVocationsRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const offset = viewportHeight / 1.2;

    setIsAnimatedVocations(box3Position.top <= offset);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const imageArray = img_name.split(",");
  const departure = next_departure.split("T")[0];
  const mainImage = imageArray.find((imageName) =>
    imageName.includes("MI.jpg")
  );
  const toggleDescModal = () => {
    setExpandedDesc(true);
    setModalClosed(false);
  };

  const toggleDescImg = () => {
    setExpandedImg(true);
    setModalClosed(false);
  };

  const toggleLoggedModal = () => {
    setIsLoggedModal(true);
    setModalClosed(false);
  };

  const toggleLoggedModalFav = () => {
    setIsLoggedModalFav(true);
    setModalClosed(false);
  };

  const toggleEditModal = () => {
    setEditModalStatus(true);
    setModalClosed(false);
  };

  const dispatch = useDispatch();

  //REDUX AUTH AND USERDATA
  /*...............................................................................................................................................................................*/
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.id);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const { data: followersData } = useGetFollowersQuery(userId);
  const likedData = followersData && followersData.data;
  const liked = likedData ? likedData.map((items) => items.vocation_id) : [];
  const likedCards = liked.includes(id);
  /*...............................................................................................................................................................................*/

  const [addFollower] = useAddFollowerMutation();
  const [removeFollower] = useRemoveFollowerMutation();

  const [deleteVocation] = useDeleteVocationMutation();

  const handleDeleteVocation = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeletion = () => {
    deleteVocation(id);
    setDeleteDialogOpen(false);
    setDeletionConfirmed(true);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const checkIfModalClosed = (statusData) => {
    setModalClosed(statusData);
  };

  const handleCloseModal = () => {
    setExpandedDesc(false);
    setExpandedImg(false);
    setIsLoggedModal(false);
    setIsLoggedModalFav(false);
    setEditModalStatus(false);
    setAddModalStatus(false);
  };

  const handleRemoveFollower = (vocationId) => {
    removeFollower({ vocation_id: vocationId, user_id: userId });
    setFollowersCount((prevCount) => prevCount - 1);
    toast.error("Removed From Liked List", {
      position: "bottom-left",
      icon: <HeartBroken color="red" />,
    });
  };

  const handleAddFollower = (vocationId) => {
    if (auth) {
      addFollower({ vocation_id: vocationId, user_id: userId });
      setFollowersCount((prevCount) => prevCount + 1);
      toast.success("Added To Liked List", {
        position: "bottom-left",
        icon: <Favorite color="red" />,
      });
    } else {
      toggleLoggedModalFav();
    }
  };

  useEffect(() => {
    if (modalClosed === true) {
      handleCloseModal();
    }
  }, [modalClosed]);

  return (
    <>
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDeletion}
      />
      {isLoggedModal && <LogInCart checkIsClosed={checkIfModalClosed} />}
      {isLoggedModalFav && <LogInFav checkIsClosed={checkIfModalClosed} />}
      {expandedImg && (
        <ImgBackdrop
          description={description}
          country={country}
          imageArray={imageArray}
          header={header}
          checkIsClosed={checkIfModalClosed}
        />
      )}
      {editModalStatus && (
        <EditCardsModal
          mainImage={mainImage}
          cardsData={props.vocation}
          fixedDate={formattedDate}
          checkIsClosed={checkIfModalClosed}
          page={props.page}
        />
      )}
      <Grid
        ref={animatedVocationsRef}
        className={`animated-box ${
          animationClass ? "animate" : isAnimatedVocations ? "animate" : ""
        }`}
        item
        xs={6}
        sm={4}
        md={3}
      >
        <ThemeProvider theme={theme}>
          <Paper
            className={isRelevantDateForCss ? "" : "vocationEnded"}
            elevation={10}
            sx={{
              marginY: 2,
              borderRadius: 5,
              transition: "transform 0.15s, box-shadow 0.5s", // Add transition properties
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: "5px 5px 10px 3px rgba(0, 0, 0, 0.6)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                position: "relative",
                alignItems: "center",
              }}
            >
              <img
                className="listImg"
                src={`/images/countriesImg/${country.toLowerCase()}/${mainImage}`}
                alt={country}
              />
              {isAdmin === 1 ? (
                <Box>
                  <Fab
                    onClick={toggleEditModal}
                    aria-label="edit"
                    size="medium"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: "1px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Edit sx={{ position: "absolute", top: 20 }} />
                    <Typography
                      variant="body2"
                      sx={{
                        position: "absolute",
                        top: 10,
                      }}
                    >
                      Edit
                    </Typography>
                  </Fab>
                  <Fab
                    aria-label="delete"
                    size="medium"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: "50px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Delete
                      onClick={() => handleDeleteVocation()}
                      sx={{ position: "absolute", top: 20 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        position: "absolute",
                        top: 10,
                      }}
                    >
                      Delete
                    </Typography>
                  </Fab>
                </Box>
              ) : (
                <>
                  <Fab
                    onClick={toggleDescImg}
                    aria-label="add"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: "1px",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Info />
                  </Fab>
                  <Fab
                    aria-label="add"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: "45px",
                      backgroundColor: "transparent",
                    }}
                  >
                    {likedCards && auth ? (
                      <>
                        <Favorite
                          sx={{ color: "#aa2e25" }}
                          onClick={() => handleRemoveFollower(id)}
                        />
                      </>
                    ) : (
                      <>
                        <FavoriteBorder onClick={() => handleAddFollower(id)} />
                      </>
                    )}
                    <Typography variant="h7">
                      {followersCount > 0 ? followersCount : ""}
                    </Typography>
                  </Fab>
                  {isRelevantDateForCss ? (
                    auth ? (
                      <Fab
                        aria-label="add"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: "89px",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => handleAddToCart(props.vocation)}
                      >
                        <Add />
                      </Fab>
                    ) : (
                      <Fab
                        onClick={toggleLoggedModal}
                        aria-label="add"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 0,
                          right: "89px",
                          backgroundColor: "transparent",
                        }}
                      >
                        <Add />
                      </Fab>
                    )
                  ) : null}
                </>
              )}
            </Box>
            <Paper elevation={6}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  background: "#36454f",
                  color: "white",
                }}
              >
                <Typography variant="body1" component="p">
                  <FlightTakeoff sx={{ width: 16 }} /> departure:{" "}
                  {formattedDate}
                </Typography>
              </Box>
            </Paper>
            <Box padding={3}>
              {expandedDesc && (
                <VocationDesc
                  imageArray={imageArray}
                  header={header}
                  description={description}
                  checkIsClosed={checkIfModalClosed}
                />
              )}
              <Typography variant="subtitle1" component="h2">
                {header} <ExpandMore onClick={toggleDescModal} />
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="body2" component="p">
                  <AccessTime sx={{ width: 16 }} /> {days} Days
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Rating
                  name="read-only"
                  value={rating}
                  readOnly
                  precision={0.5}
                />
                <Typography variant="body3" component="p" marginLeft={0.5}>
                  {rating}
                </Typography>
                {/* <Typography variant="body2" component="p" marginLeft={1.5}>
                (655 reviews)
              </Typography> */}
              </Box>
              <Box
                sx={{
                  borderRadius: 5,
                  backgroundColor: "#3cb371",
                  display: "inline-block",
                  padding: "0 8px",
                  marginY: 1,
                }}
              >
                <Typography
                  color={"white"}
                  variant="h6"
                  component="h3"
                  marginTop={0}
                >
                  ${price}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </ThemeProvider>
      </Grid>
    </>
  );
}

export default TripCard;
