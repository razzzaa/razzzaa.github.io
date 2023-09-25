import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ExploreIcon from "@mui/icons-material/Explore";
import LuggageIcon from "@mui/icons-material/Luggage";
import PermPhoneMsgIcon from "@mui/icons-material/PermPhoneMsg";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import { Container } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import LoginIcon from "@mui/icons-material/Login";
import { setAuth, setUsers } from "../features/authSlice";
import { toast } from "react-toastify";
import AddCardsModal from "./modals/addCardModal";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import BarChartIcon from "@mui/icons-material/BarChart";

const drawerWidth = 240;
const navItems = ["Home", "About", "Contact", "Log-Out", "Statistics"];

function NavBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [addModalStatus, setAddModalStatus] = React.useState(false);
  const [modalIsClosed, setModalIsClosed] = React.useState(false);

  const cartProducts = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const dispatch = useDispatch();

  const handleAuth = () => {
    dispatch(setAuth(false));
  };

  const handleUser = () => {
    dispatch(setUsers({ name: null, mail: null, id: null, isAdmin: null }));
  };

  const handleLogOut = () => {
    axios
      .get("http://localhost:3030/api/logout")
      .then((res) => {
        handleAuth();
        handleUser();
        toast.error("'You have been logged out. Goodbye!'", {
          position: "bottom-left",
        });
      })
      .catch((err) => console.log(err));
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <ExploreIcon sx={{ color: "#c5aa6a" }} />
        ZIPTRIP
      </Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <HomeIcon />
            <ListItemText primary={"Home"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <LuggageIcon />
            <ListItemText primary={"My-WishList"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <PermPhoneMsgIcon />
            <ListItemText primary={"Contact-Us"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogOut} sx={{ textAlign: "center" }}>
            <LogoutIcon />
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const checkIfModalClosed = (statusData) => {
    setModalIsClosed(statusData);
  };

  const toggleAddModal = () => {
    setAddModalStatus(true);
    setModalIsClosed(false);
  };

  const handleCloseModal = () => {
    setAddModalStatus(false);
  };

  React.useEffect(() => {
    if (modalIsClosed === true) {
      handleCloseModal();
    }
  }, [modalIsClosed]);

  return (
    <Container>
      {addModalStatus && <AddCardsModal checkIsClosed={checkIfModalClosed} />}
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          className="navBar"
          component="nav"
          sx={{
            borderRadius: 5,
            backgroundColor: " #302F2C",
            fontFamily: "Libre Baskerville",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              className="logo"
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
            >
              <ExploreIcon sx={{ color: "#c5aa6a" }} />
              ZIPTRIP
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Link to="/" variant="body2">
                <Button
                  sx={{
                    color: "#fff",
                    "&:hover": {
                      color: "#CAC4B0",
                    },
                  }}
                >
                  {"Home"}
                </Button>
              </Link>
            </Box>
            {isAdmin ? (
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button
                  sx={{
                    display: "none",
                    color: "#fff",
                    "&:hover": {
                      color: "#CAC4B0",
                    },
                  }}
                >
                  {"Contact-Us"}
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button
                  sx={{
                    color: "#fff",
                    "&:hover": {
                      color: "#CAC4B0",
                    },
                  }}
                >
                  {"Contact-Us"}
                </Button>
              </Box>
            )}

            {auth && isAdmin ? (
              <>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Link to="/statistics" variant="body2">
                    <Button
                      sx={{
                        color: "#fff",
                        "&:hover": {
                          color: "#CAC4B0",
                        },
                      }}
                    >
                      <BarChartIcon />
                      {"Statistics"}
                    </Button>
                  </Link>
                </Box>
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Button
                    onClick={toggleAddModal}
                    sx={{
                      color: "#fff",
                      "&:hover": {
                        color: "#CAC4B0",
                      },
                    }}
                  >
                    <AddLocationAltIcon />
                    Add new destination
                  </Button>
                </Box>
              </>
            ) : auth ? (
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Link to="/wishlist" variant="body2">
                  <Button
                    sx={{
                      color: "#fff",
                      "&:hover": {
                        color: "#CAC4B0",
                      },
                    }}
                  >
                    <LocalMallIcon />
                  </Button>
                </Link>
              </Box>
            ) : null}

            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {auth ? (
                <Button
                  onClick={() =>
                    setTimeout(() => {
                      handleLogOut();
                    }, 1000)
                  }
                  sx={{
                    color: "#fff",
                    background: "#b23b3b",
                    borderRadius: "10px",
                    "&:hover": {
                      color: "#CAC4B0",
                    },
                  }}
                >
                  <LogoutIcon />
                  {"Logout"}
                </Button>
              ) : (
                <Link to="/login">
                  <Button
                    sx={{
                      background: "white",
                      borderRadius: "10px",
                      "&:hover": {
                        color: "#CAC4B0",
                      },
                    }}
                  >
                    <LoginIcon />
                    {"Login"}
                  </Button>
                </Link>
              )}
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
    </Container>
  );
}

export default NavBar;
