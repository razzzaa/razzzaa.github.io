import { Box, Button, Container, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState, useRef, Fragment } from "react";
import AirplanemodeActiveIcon from "@mui/icons-material/AirplanemodeActive";
import ImageList from "@mui/material/ImageList";
import MovingImages from "../components/movingImages";
import TokenTimer from "../components/tokenTimer";
import {
  useGetAllDataQuery,
  usePagginationDataQuery,
} from "../features/getAllDataApi";
import TripCard from "../components/tripCards";
import SelectDateFav from "../components/dateFavSelect";
import { useSelector } from "react-redux";
import { useGetFollowersQuery } from "../features/followersApi";
import { useInfiniteQuery } from "@tanstack/react-query";

axios.defaults.withCredentials = true;

function Home() {
  const [isAnimated, setIsAnimated] = useState(false);
  const [isAnimatedHeader, setIsAnimatedHeader] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(false);

  TokenTimer();

  //REDUX AUTH + GET USERID AND FOLLOWED VOCATION ID
  /*...............................................................................................................................................................................*/
  const auth = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.id);
  const { data: followersData, refetch: refetchFollowers } =
    useGetFollowersQuery(userId);
  const likedData = followersData && followersData.data;
  const liked = likedData ? likedData.map((items) => items.vocation_id) : [];

  const isFilteredFav = useSelector((state) => state.filter.isFavFiltered);
  const isFilteredDate = useSelector((state) => state.filter.isDateFiltered);

  const { data: allData } = useGetAllDataQuery();
  const vocData = allData?.data;
  const maxItemsOnPage = vocData?.length;
  const maxPages = Math.ceil(maxItemsOnPage / 8);

  const handleNextClick = () => {
    if (page < maxPages) {
      setPage(page + 1);
    } else {
      setLastPage(true);
    }
  };

  const handlePrevClick = () => {
    if (page >= 2) {
      setPage(page - 1);
      setLastPage(false);
    }
  };

  const animatedRef = useRef(null);
  const animatedImgRef = useRef(null);
  const animatedHeaderRef = useRef(null);

  const handleScroll = () => {
    const box1Position = animatedRef.current.getBoundingClientRect();
    const box2Position = animatedHeaderRef.current.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    const offset = viewportHeight / 1.5;

    setIsAnimated(box1Position.top <= offset);
    setIsAnimatedHeader(box2Position.top <= offset);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const {
    data: pagData,
    isLoading,
    isFetching,
  } = usePagginationDataQuery(page);
  const paginated = pagData?.data;

  //   INFINITE SCROLLING OPTION
  //............................................................................................................................................................................
  /* 
  let pageData = null;

  const getData = async (page) => {
    try {
      const { data: callData } = await axios.get(
        `http://localhost:3030/api/data`,
        {
          params: {
            page,
          },
        }
      );
      pageData = callData.data;
      return pageData;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["query"],
    async ({ pageParam = 1 }) => {
      const response = await getData(pageParam);
      return response;
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [pageData],
        pageParams: [1],
      },
    }
  );

  const itemsPerPage = 8;
  const totalItems = 22;
  const totalAvailablePages = Math.ceil(totalItems / itemsPerPage); */

  //............................................................................................................................................................................

  return (
    <>
      <Grid className="dark" container spacing={2}>
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          sx={{
            margin: 10,
            color: "white",
          }}
        >
          <Box
            sx={{
              paddingY: 20,
            }}
            className="welcome"
          >
            <Typography
              sx={{
                paddingY: 4,
              }}
              variant="h3"
              component="h1"
            >
              Your Journey Starts Here...
              <AirplanemodeActiveIcon
                fontSize="large"
                className="animated-plane"
              />
            </Typography>
            <Box>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
              id cum suscipit, pariatur illo dicta libero enim veniam excepturi
              nisi quos corporis? Impedit, natus velit! Quidem provident
              expedita quos ab. Eveniet tenetur voluptatum recusandae accusamus
              laborum in, consectetur sunt, veritatis aspernatur, nobis sit
              necessitatibus eos porro. Eaque ipsam impedit accusantium modi
              praesentium officia adipisci aperiam pariatur ad? Consectetur,
              explicabo at. Quibusdam dolorem dignissimos rerum deleniti tempore
              mollitia, in nihil iusto facilis beatae saepe ut. Ex minus,
              perferendis vel voluptatem delectus saepe et iure, beatae error
              reiciendis dolor nobis. Rem, labore.
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={6}
          sx={{ marginY: 20, display: "flex", justifyContent: "end" }}
        >
          <Box
            ref={animatedImgRef}
            sx={{
              borderRadius: 40,
              width: 550,
              height: 450,
              overflowY: "hidden",
            }}
          >
            <ImageList
              className="scrolling-animation"
              variant="masonry"
              cols={3}
              gap={8}
            >
              {vocData?.map((items) => (
                <MovingImages movingData={items} />
              ))}
            </ImageList>
          </Box>
        </Grid>
      </Grid>

      <Grid
        className="white"
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "end", position: "relative" }}
      >
        <Grid
          item
          xs={8}
          sm={8}
          md={6}
          lg={4}
          container
          spacing={2}
          sx={{ margin: 10 }}
        >
          <Box
            ref={animatedRef}
            className={`animated-box ${isAnimated ? "animate" : ""}`}
            sx={{ paddingTop: 30 }}
          >
            <Typography variant="h3" component="h1">
              ZipTrip: Unveil the World, One Journey at a Time
            </Typography>

            <Box>
              At ZipTrip, we're more than a travel agency. We're your personal
              guides to the world, crafting unforgettable journeys that immerse
              you in the heart of each destination. Our team of adventurers
              creates bespoke itineraries, showcasing hidden treasures and
              authentic experiences. With a commitment to excellence, we curate
              seamless trips that resonate with your preferences. About Us:
              ZipTrip is your key to exceptional travel. Our experienced team
              designs tailor-made adventures that let you explore ancient ruins,
              indulge in culinary delights, relax on pristine beaches, or
              embrace exhilarating activities. We handpick accommodations with
              local character, and our expert guides share insights that unlock
              the culture of each place. <br />
              Our Promise: Our focus goes beyond planning; we curate experiences
              that leave a lasting impact. As you embark on a ZipTrip, you're
              surrounded by discovery, connection, and awe-inspiring moments.
              We're dedicated to responsible travel, supporting communities and
              making a positive impact wherever we go.
              <br /> Your Adventure Awaits: Imagine wandering bustling markets,
              connecting with locals, and immersing in traditions. With ZipTrip,
              each day is a new chapter of exploration. Let us handle the
              details while you embrace the thrill of discovering new
              perspectives. Unveil the world with ZipTrip, one journey at a
              time. Your adventure begins now.
            </Box>
          </Box>
        </Grid>
        <div className="wave">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </Grid>

      <Grid
        className="white"
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "start" }}
      >
        <Grid item xs={8} sm={8} md={6} lg={4} sx={{ margin: 10 }}></Grid>
      </Grid>

      <Box
        ref={animatedHeaderRef}
        className={`animated-box ${isAnimatedHeader ? "animate" : ""}`}
      >
        <Typography
          className="dark"
          sx={{ color: "white" }}
          textAlign="center"
          variant="h4"
          component="h1"
        >
          Your All-Inclusive Travel Experience Awaits.
        </Typography>
        <SelectDateFav />
      </Box>
      <Box className="white">
        <Container>
          <Grid container spacing={3}>
            {paginated?.map((post) => {
              const isLiked = isFilteredFav && auth && liked.includes(post.id);
              const cardDate = new Date(post.next_departure);
              const isRelevantDateForCss = cardDate > new Date();

              if (isFilteredFav && isFilteredDate && auth) {
                if (isLiked && isRelevantDateForCss) {
                  return (
                    <TripCard
                      page={page}
                      vocation={post}
                      key={post.id}
                      isRelevantDateForCss={isRelevantDateForCss}
                    />
                  );
                }
              } else if (isFilteredFav && auth) {
                if (isLiked) {
                  return (
                    <TripCard
                      vocation={post}
                      key={post.id}
                      isRelevantDateForCss={isRelevantDateForCss}
                    />
                  );
                }
              } else if (isFilteredDate) {
                if (isRelevantDateForCss) {
                  return (
                    <TripCard
                      vocation={post}
                      key={post.id}
                      isRelevantDateForCss={isRelevantDateForCss}
                    />
                  );
                }
              } else {
                return (
                  <TripCard
                    vocation={post}
                    key={post.id}
                    isRelevantDateForCss={isRelevantDateForCss}
                  />
                );
              }

              return null;
            })}
          </Grid>
          <Box sx={{ marginY: 5, display: "flex", justifyContent: "center" }}>
            <Button onClick={handlePrevClick} isLoading={isFetching}>
              Previous
            </Button>
            {lastPage ? (
              <Button>NO MORE PAGES</Button>
            ) : (
              <Button onClick={handleNextClick} isLoading={isFetching}>
                Next
              </Button>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default Home;
