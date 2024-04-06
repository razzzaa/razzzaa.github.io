import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useGetSumQuery } from "../features/getSummedCount";
import CsvFile from "../components/csvDownload";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useSelector } from "react-redux";

export default function Statistics() {
  const { data: countData } = useGetSumQuery();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.isAuthenticated);

  React.useEffect(() => {
    const handleLogOut = () => {
      navigate("/login");
    };
    if (auth === false) {
      handleLogOut();
    }
  }, [auth, navigate]);

  if (!countData || countData.length === 0) {
    return (
      <Container>
        <Typography variant="h6">No data available.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography sx={{ paddingTop: 10, textAlign: "center" }} variant="h3">
        Vacation Report
      </Typography>

      <Grid>
        <Grid item xs={12}>
          <Box>
            <BarChart
              sx={{
                paddingBottom: 2,
                overflowWrap: "break-word",
                whiteSpace: "pre-wrap",
                [`.${axisClasses.bottom}`]: {
                  overflowWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  [`.${axisClasses.tickLabel}`]: {
                    overflowWrap: "break-word",
                    whiteSpace: "pre-wrap",
                    transform: "rotate(45deg)",
                    dominantBaseline: "hanging",
                    textAnchor: "start",
                  },
                  [`.${axisClasses.label}`]: {
                    transform: "translateY(15px)",
                  },
                },
                "--ChartsLegend-itemWidth": "15px",
              }}
              xAxis={[
                {
                  id: "barCategoriesTop",
                  data: countData.map((destinations) => destinations.country),
                  scaleType: "band",
                  position: "top",
                },
              ]}
              series={[
                {
                  data: countData.map(
                    (destinations) => destinations.total_followers_count
                  ),
                },
              ]}
              height={500}
            />
          </Box>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Button
              sx={{
                marginBottom: 3,
              }}
            >
              <CsvFile countData={countData} />
            </Button>
            <Link to="/">
              <Button
                sx={{
                  marginBottom: 3,
                }}
              >
                <ArrowBackIcon />
                back to home page
              </Button>
            </Link>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
