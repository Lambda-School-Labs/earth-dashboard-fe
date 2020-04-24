import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import mapboxgl from "mapbox-gl";
import {
  Box,
  Slider,
  Typography,
  Backdrop,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import PauseCircleFilledIcon from "@material-ui/icons/PauseCircleFilled";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { getCases } from "./casesSlice";
import "mapbox-gl/src/css/mapbox-gl.css";
import useDebounce from "../../../hooks/useDebounce";

mapboxgl.accessToken = process.env.REACT_APP_CONFIRMED_CASES_MAPBOX_TOKEN;

const useStyles = makeStyles({
  root: {
    marginLeft: "3rem",
    marginRight: "3rem",
  },
  markLabel: {
    transform: "rotate(-45deg)",
    bottom: "-120px",
  },
});

/*
 * Filtering and data fetching is done through the DataProvider HOC. It was not broken out
 * into separate file because it is directly connected to this visualization.
 */
const DataProvider = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { dates, cases, fetching } = useSelector((state) => state.casesReducer);

  // filterBy() requires the map that was constructed in CasesVis so we need to pass it up to the
  // HOC and store it in local state
  const [mapState, setMapState] = useState(null);
  const [dateToFilter, setDateToFilter] = useState({
    date: null,
    sliderValue: null,
  });
  // The date filter is debounced so dragging the slider quickly will not trigger multiple layer filter
  // changes. Filter changes are only registered every 25ms.
  const debouncedDateToFilter = useDebounce(dateToFilter, 25);
  const [play, setPlay] = useState(false);

  // Retrieve the map data on component mount
  useEffect(() => {
    dispatch(getCases());
  }, [dispatch]);

  // Whenver the dateToFilter changes in state, we change the data we are showing by filtering by date
  // There are separate layers for the circles, labels, and heatmap so we set the filter on each
  useEffect(() => {
    const filterBy = (date) => {
      const filters = ["==", "date", date];
      mapState.setFilter("confirmed-cases-circles", filters);
      mapState.setFilter("confirmed-cases-heat", filters);
      mapState.setFilter("confirmed-cases-labels", filters);
    };

    if (dateToFilter.date && mapState) {
      filterBy(debouncedDateToFilter.date);
    }
  }, [mapState, dateToFilter, debouncedDateToFilter]);

  useEffect(() => {
    setDateToFilter({
      date: dates[dates.length - 2],
      sliderValue: dates.length - 2,
    });
  }, [dates]);

  const handleChange = (event, newValue) =>
    setDateToFilter({
      date: dates[newValue],
      sliderValue: newValue,
    });

  useEffect(() => {
    const increaseDate = () => {
      setDateToFilter({
        date: dates[dateToFilter.sliderValue + 1],
        sliderValue: dateToFilter.sliderValue + 1,
      });
    };

    let interval;

    // Move the slider forward one date every 250ms until play=false or we're at the end of the slider
    if (play && dateToFilter.sliderValue < dates.length - 2) {
      interval = setInterval(() => {
        increaseDate();
      }, 250);
    }

    return () => {
      clearInterval(interval);
    };
  }, [dates, dateToFilter.sliderValue, play]);

  const handlePlay = () => {
    setPlay(true);
  };

  const handlePause = () => {
    setPlay(false);
  };

  const valuetext = (value) => `${dates[value]}`;

  // Displaying all dates as marks on the slider will be too crowded so we only display every 7 dates
  const marks = dates
    .map((date, i) => {
      return {
        value: i,
        label: date,
      };
    })
    .filter((_, j) => j % 7 === 0);

  // Display a loading spinner while data is being fetched
  if (fetching) {
    return (
      <Backdrop open invisible>
        <CircularProgress data-testid="progressbar" />
      </Backdrop>
    );
  }

  return (
    <Box display="flex" flexDirection="column" overflow="hidden" py={3}>
      <Typography
        aria-label="map-title"
        variant="h4"
        component="h2"
        gutterBottom
      >
        USA Covid-19 Confirmed Cases Daily Count
      </Typography>
      <CasesVis cases={cases} setMapState={setMapState} />

      <Box display="flex" mx={2} my={4} alignItems="center">
        <IconButton onClick={handlePlay} aria-label="play">
          <PlayCircleFilledIcon fontSize="large" />
        </IconButton>
        <IconButton onClick={handlePause} aria-label="pause">
          <PauseCircleFilledIcon fontSize="large" />
        </IconButton>

        <Slider
          aria-label="date-filter"
          className={classes.root}
          classes={{
            markLabel: classes.markLabel,
          }}
          value={dateToFilter.sliderValue}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-small-steps"
          valueLabelDisplay="auto"
          onChange={handleChange}
          step={1}
          marks={marks}
          min={0}
          max={dates.length - 2}
          // Format the date in the tooltip to MM-dd because the full date does not fit
          valueLabelFormat={(value) =>
            dates[0] !== null && dates[value].substring(1, 5)
          }
        />
      </Box>
    </Box>
  );
};

const CasesVis = ({ cases, setMapState }) => {
  const mapContainer = useRef(null);
  const initialData = useRef(cases);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: process.env.REACT_APP_CONFIRMED_CASES_MAPBOX_STYLE,
      center: [-100, 38],
      zoom: 3.5,
    });

    map.on("load", () => {
      map.addSource("confirmed-cases", {
        type: "geojson",
        data: initialData.current,
      });

      setMapState(map);

      map.addLayer(
        {
          id: "confirmed-cases-heat",
          type: "heatmap",
          source: "confirmed-cases",
          maxzoom: 5,
          paint: {
            // Increase the heatmap weight based on number of cases
            "heatmap-weight": [
              "interpolate",
              ["cubic-bezier", 0, 1, 1, 0],
              ["get", "cases"],
              0,
              0,
              10,
              1,
              100,
              2,
              300,
              3,
              1000,
              4,
              5000,
              5,
              10000,
              6,
              25000,
              7,
              50000,
              8,
              100000,
              9,
              125000,
              10,
            ],
            // Increase the heatmap color weight weight by zoom level
            // heatmap-intensity is a multiplier on top of heatmap-weight
            "heatmap-intensity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              1,
              9,
              3,
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparancy color
            // to create a blur-like effect.
            "heatmap-color": [
              "interpolate",
              ["linear"],
              ["heatmap-density"],
              0,
              "rgba(33,102,172,0)",
              0.2,
              "rgb(103,169,207)",
              0.4,
              "rgb(209,229,240)",
              0.6,
              "rgb(253,219,199)",
              0.8,
              "rgb(239,138,98)",
              1,
              "rgb(178,24,43)",
            ],
            // Adjust the heatmap radius by zoom level
            "heatmap-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              0,
              2,
              9,
              20,
            ],
            // Transition from heatmap to circle layer by zoom level
            "heatmap-opacity": [
              "interpolate",
              ["linear"],
              ["zoom"],
              3.5,
              1,
              5,
              0.3,
            ],
          },
        },
        "waterway-label"
      );

      map.addLayer(
        {
          id: "confirmed-cases-circles",
          type: "circle",
          source: "confirmed-cases",
          minzoom: 5,
          paint: {
            // Size circle radius by earthquake magnitude and zoom level
            "circle-radius": [
              "interpolate",
              ["linear"],
              ["zoom"],
              5,
              [
                "interpolate",
                ["cubic-bezier", 0, 1, 1, 0],
                ["get", "cases"],
                0,
                0,
                100000,
                100,
              ],
              16,
              [
                "interpolate",
                ["linear"],
                ["get", "cases"],
                1,
                1,
                10,
                10,
                100,
                15,
                1000,
                20,
                10000,
                25,
                25000,
                30,
                50000,
                35,
                100000,
                40,
              ],
            ],
            // Color circle by cases
            "circle-color": [
              "interpolate",
              ["linear"],
              ["get", "cases"],
              1,
              "rgba(33,102,172,0)",
              10,
              "rgb(103,169,207)",
              100,
              "rgb(209,229,240)",
              1000,
              "rgb(253,219,199)",
              10000,
              "rgb(239,138,98)",
              25000,
              "rgb(178,24,43)",
            ],
            "circle-stroke-color": "white",
            "circle-stroke-width": 1,
          },
        },
        "waterway-label"
      );

      map.addLayer({
        id: "confirmed-cases-labels",
        type: "symbol",
        source: "confirmed-cases",
        minzoom: 8,
        layout: {
          "icon-allow-overlap": true,
          "text-field": ["get", "cases"],
          "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
        paint: {
          "text-color": "rgba(0,0,0,0.5)",
        },
      });
    });

    return () => {
      map.remove();
    };
  }, [setMapState]);

  return (
    <div
      aria-labelledby="map-title"
      data-testid="map"
      ref={mapContainer}
      style={{ height: "75vh" }}
    />
  );
};

export default DataProvider;