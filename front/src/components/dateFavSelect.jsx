import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setDateFilter, setFavoritesFilter } from "../features/favDateSlice";

export default function ControlledCheckbox() {
  const dispatch = useDispatch();

  const favorite = useSelector((state) => state.filter.isFavFiltered);
  const date = useSelector((state) => state.filter.isDateFiltered);
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const handleChangeFav = () => {
    dispatch(setFavoritesFilter(!favorite));
  };

  const handleChangeDate = () => {
    dispatch(setDateFilter(!date));
  };

  React.useEffect(() => {});

  return (
    <Container sx={{ display: "flex", justifyContent: "end" }}>
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          justifyContent: "end",
          marginY: 2,
        }}
      >
        <Grid item xs={6} md={4} lg={3} xl={3}>
          <Box>
            {auth && isAdmin !== 1 ? (
              <FormControl fullWidth>
                <FormControlLabel
                  label="Show Liked Cards Only"
                  labelPlacement="start"
                  control={
                    <Checkbox
                      checked={favorite}
                      onChange={handleChangeFav}
                      inputProps={{ "aria-label": "controlled" }}
                    />
                  }
                />
              </FormControl>
            ) : (
              <FormControl fullWidth>
                <FormControlLabel
                  label="Show Liked Cards Only"
                  labelPlacement="start"
                  control={
                    <Checkbox
                      checked={false}
                      onChange={handleChangeFav}
                      inputProps={{ "aria-label": "controlled" }}
                      disabled
                    />
                  }
                />
              </FormControl>
            )}
          </Box>
        </Grid>
        <Grid item xs={6} md={4} lg={3} xl={3}>
          <Box>
            <FormControl fullWidth>
              <FormControlLabel
                label="Show Relevant Dates Only"
                labelPlacement="start"
                control={
                  <Checkbox
                    checked={date}
                    onChange={handleChangeDate}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                }
              />
            </FormControl>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
