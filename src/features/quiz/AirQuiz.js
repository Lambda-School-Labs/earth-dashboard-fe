import React, { useState } from "react";
import { Box, TextField, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { green, red } from "@material-ui/core/colors";
import { useDispatch } from "react-redux";
import Confetti from "react-confetti";
import VisTitle from "../visualizations/VisTitle";
import { incrementProgress } from "./quizProgressSlice";

const useStyles = makeStyles({
  input: {
    width: "100%",
    marginBottom: "2rem",
    marginTop: "2rem",
  },
  form: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "20%",
  },
});

export default function AirQuiz() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [answer, setAnswer] = useState({
    answerOne: "",
    answerTwo: "",
  });
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [correct, setCorrect] = useState();

  const handleChange = (e) =>
    setAnswer({ ...answer, [e.target.name]: e.target.value });

  const validateQuestionOne = () =>
    answer.answerOne >= 36 || answer.answerOne <= 38;

  const validateQuestionTwo = () =>
    answer.answerTwo === "15" || answer.answerTwo === "16";

  const restart = () => {
    setAnswer("");
    setShowResults(false);
  };

  const handelSubmit = (e) => {
    e.preventDefault();

    if (answer.answerOne === "" || answer.answerTwo === "") {
      setError({
        error: "Required",
      });
    } else if (validateQuestionOne() && validateQuestionTwo()) {
      setShowResults(true);
      setCorrect(true);
      dispatch(incrementProgress("airQuality"));
    } else {
      setShowResults(true);
      setCorrect(false);
    }
  };

  return (
    <Box
      id="Air-question"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      width="100%"
      height="70vh"
      alignItems="center"
      data-testid="vis-quiz"
    >
      {showResults ? (
        // results page
        <Box
          className="container-results"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "82%",
          }}
        >
          <Box className="answer-results">
            <>
              {correct ? (
                <div
                  className="correct-answer"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      width: "100%",
                      height: "28%",
                      overflow: "hidden",
                      marginTop: "3.5rem",
                    }}
                  >
                    <Confetti
                      className="confetti"
                      gravity={0.4}
                      // run={this.state.animationDone}
                      numberOfPieces={200}
                    />
                  </div>
                  <VisTitle
                    id="bubble-question-title"
                    variant="h4"
                    aria-label="bubble-title"
                  >
                    Results
                  </VisTitle>
                  <div
                    className="correct-answer-one"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <VisTitle
                      id="bubble-question-title"
                      variant="h6"
                      aria-label="bubble-title"
                    >
                      Where did air pollution peak on January 26th?
                    </VisTitle>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <h4>Correct</h4>
                      <CheckCircleIcon style={{ color: green[500] }} />
                    </div>{" "}
                  </div>
                  <div
                    className="correct-answer-two"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <VisTitle
                      id="bubble-question-title"
                      variant="h6"
                      aria-label="bubble-title"
                    >
                      What was the highest level of air pollution during
                      lockdown?
                    </VisTitle>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <h4>Correct</h4>
                      <CheckCircleIcon style={{ color: green[500] }} />
                    </div>{" "}
                  </div>
                </div>
              ) : (
                <div
                  className="wrong-answer"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h1>Failed</h1>
                  <HighlightOffIcon style={{ color: red[500] }} />
                </div>
              )}
            </>
          </Box>
          <Button
            style={{ width: "20%", marginRight: "1rem" }}
            type="submit"
            variant="contained"
            color="primary"
            onClick={restart}
          >
            Retry
          </Button>
        </Box>
      ) : (
        <div>
          <form
            className={classes.form}
            autoComplete="off"
            onSubmit={handelSubmit}
          >
            <div>
              <VisTitle
                id="bubble-question-title"
                variant="h5"
                aria-label="bubble-title"
              >
                Where did air pollution peak on January 26th?
              </VisTitle>
            </div>
            <div>
              <TextField
                className={classes.input}
                id="outlined-error-helper-text"
                error={error.error}
                name="answerOne"
                type="text"
                onChange={handleChange}
                value={answer.answerOne}
                variant="outlined"
                required
              />
              <div>
                <VisTitle
                  id="bubble-question-title"
                  variant="h5"
                  aria-label="bubble-title"
                >
                  What was the highest level of air pollution during lockdown?
                </VisTitle>
              </div>

              <TextField
                className={classes.input}
                id="outlined-error-helper-text"
                error={error.error}
                name="answerTwo"
                type="text"
                onChange={handleChange}
                value={answer.answerTwo}
                variant="outlined"
                required
              />
            </div>
            <Button
              className={classes.button}
              height="20%"
              type="submit"
              variant="contained"
              color="primary"
            >
              Submit
            </Button>
          </form>
        </div>
      )}
    </Box>
  );
}
