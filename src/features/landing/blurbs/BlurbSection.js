import React, { useState, useEffect } from "react";
import { Box, Typography } from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";
import axios from "axios";
import Blurb from "./Blurb";
import { ReactComponent as Arrow } from "../arrow.svg";

const useStyles = makeStyles({
  headingText: {
    marginTop: "4.625em",
    marginBottom: "2.875em",
  },
  headingTextBar: {
    position: "absolute",
    display: "block",
    marginTop: "-10.5em",
    zIndex: -1,
    left: "50%",
    marginLeft: "-262px",

    "@media (max-width:1440px)": {
      width: "350px",
      marginTop: "-7.4em",
      marginLeft: "-175px",
    },
  },
  subHeadingText: {
    marginTop: "3.875em",
    marginBottom: "4em",
  },
  subHeadingTextBar: {
    position: "absolute",
    display: "block",
    marginTop: "-12.8em",
    zIndex: -1,
    left: "50%",
    marginLeft: "-427.5px",

    "@media (max-width:1440px)": {
      width: "600px",
      marginTop: "-9.14em",
      marginLeft: "-300px",
    },
  },
  learnMoreText: {
    marginTop: "6em",
  },
  bottomText: {
    marginBottom: "2.25em",
  },
});

const BlurbSection = () => {
  const classes = useStyles();
  const [confirmedCases, setConfirmedCases] = useState(0);

  useEffect(() => {
    axios
      .get("https://api.covid19api.com/summary")
      .then((response) =>
        setConfirmedCases(response.data.Global.TotalConfirmed.toLocaleString())
      );
  }, []);

  return (
    <>
      <Typography
        id="what-is-earth-dashboard"
        className={classes.headingText}
        variant="h2"
        align="center"
      >
        What is Earth Dashboard?
      </Typography>
      <svg
        className={classes.headingTextBar}
        width="524"
        height="22"
        viewBox="0 0 524 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0L524 6.11111L522.998 22H0V0Z"
          fill="#F3B041"
          fillOpacity="0.35"
        />
      </svg>

      <Box display="flex" justifyContent="space-around">
        <Blurb id={1}>Earth Dashboard is an interactive playground</Blurb>
        <Blurb id={2}>
          Earth Dashboard is a learning tool for data visualization.
        </Blurb>
        <Blurb id={3}>
          Earth Dashboard lets you immerse yourself in real-time data.
        </Blurb>
      </Box>
      <Typography
        variant="h3"
        align="center"
        className={classes.subHeadingText}
      >
        A look at what is happening on Earth right now:
      </Typography>
      <svg
        className={classes.subHeadingTextBar}
        width="855"
        height="22"
        viewBox="0 0 855 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 0L855 6.11111L853.365 22H0V0Z"
          fill="#F3B041"
          fillOpacity="0.35"
        />
      </svg>

      <Box display="flex" justifyContent="space-around">
        <Blurb id={4}>
          As people are starting to stay at home, more wildlife have been
          spotted on empty streets.
        </Blurb>
        <Blurb id={5}>
          There are <strong>{confirmedCases} confirmed COVID-19 cases</strong>{" "}
          world-wide.
        </Blurb>
        <Blurb id={6}>
          Two cats have tested positive for COVID-19 in New York.
        </Blurb>
      </Box>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography
          variant="h5"
          component="p"
          className={classes.learnMoreText}
          align="center"
        >
          Want to learn more?
        </Typography>
        <Typography
          variant="h5"
          component="p"
          className={classes.bottomText}
          align="center"
        >
          Let&apos;s play around with some visuals
        </Typography>
        <Arrow />
      </Box>
    </>
  );
};

export default BlurbSection;