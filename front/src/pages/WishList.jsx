import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./cart.css";
import {
  addToCart,
  clearCart,
  decreaseCart,
  removeFromCart,
} from "../features/cartSlice";
import { useEffect } from "react";

function Cart() {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };

  const handleDecreaseCart = (product) => {
    dispatch(decreaseCart(product));
  };

  const handleIncreaseCart = (product) => {
    dispatch(addToCart(product));
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleLogOut = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (auth === false) {
      handleLogOut();
    } else {
      console.log("oi");
    }
  }, [auth]);

  return (
    <>
      <Container
        sx={{
          marginY: 10,
        }}
        className="cart-container"
      >
        <Typography variant="h2" component="h1" sx={{ textAlign: "center" }}>
          Shopping Cart
        </Typography>
        {cart.cartItems.length === 0 ? (
          <Grid sx={{ display: "flex", justifyContent: "center" }}>
            <Grid item lg={12}>
              <Box className="cartEmpty">
                <Typography variant="h6" component="p">
                  Your cart is currently empty
                </Typography>
                <Box className="startShopping">
                  <Button>
                    <ArrowBackIcon />
                    <Link to="/">Start Shoping</Link>
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          <div>
            <div className="titles">
              <h3 className="product-title">Destination</h3>
              <h3 className="price">Price/Person</h3>
              <h3 className="quantity">People</h3>
              <h3 className="total">Total</h3>
            </div>
            <div className="cart-items">
              {cart.cartItems &&
                cart.cartItems.map((cartItem) => (
                  <div className="cart-item" key={cartItem.id}>
                    <div className="cart-product">
                      <img
                        src={`/images/countriesImg/${cartItem.country.toLowerCase()}/${
                          cartItem.img_name.split(",")[0]
                        }`}
                        alt={cartItem.country}
                      />
                      <div>
                        <h3>{cartItem.destination}</h3>
                        <p>{cartItem.header}</p>
                        <Button
                          type="button"
                          variant="contained"
                          onClick={() => handleRemoveFromCart(cartItem)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                    <div className="cart-product-price">${cartItem.price}</div>
                    <div className="cart-product-quantity">
                      <Button onClick={() => handleDecreaseCart(cartItem)}>
                        -
                      </Button>
                      <div className="count">{cartItem.cartQuantity}</div>
                      <Button onClick={() => handleIncreaseCart(cartItem)}>
                        +
                      </Button>
                    </div>
                    <div className="cart-product-total-price">
                      ${cartItem.price * cartItem.cartQuantity}
                    </div>
                  </div>
                ))}
            </div>
            <div className="cart-summary">
              <Button
                sx={{ marginY: 2 }}
                variant="contained"
                color="error"
                className="clear-btn"
                onClick={() => handleClearCart()}
              >
                Clear Cart
              </Button>
              <div className="cart-checkout">
                <Button sx={{ marginY: 2 }} variant="contained">
                  Check out
                </Button>
                <div className="continue-shopping">
                  <Link to="/">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="bi bi-arrow-left"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                      />
                    </svg>
                    <span>Continue Shopping</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  );
}

export default Cart;