/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Button, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export default function Controller({
  data,
  handleReset,
  incrementScore,
  decrementScore,
  setPeriodHandler,
  toggleTimerHandler,
  incrementFoul,
  decrementFoul,
}: {
  data: any;
  handleReset: () => Promise<void>;
  incrementScore: (team: string) => void;
  decrementScore: (team: string) => void;
  setPeriodHandler: (period: number) => void;
  toggleTimerHandler: (status: boolean) => void;
  incrementFoul: (team: string) => void;
  decrementFoul: (team: string) => void;
}) {
  const [localTimer, setLocalTimer] = useState(data.timer);

  // const startStopHandler = () => {
  //   console.log("startStopHander fired");
  //   setIsRunning((prev) => !prev);
  //   if (isRunning) {
  //     // Stop the timer
  //     setLocalTimer(0);
  //     handleTimerToggle();
  //   } else {
  //     // Start the timer
  //     setLocalTimer(1); // or any other logic to start the timer
  //     handleTimerToggle();
  //   }
  // };

  const stopClockHandler = () => {
    console.log("stopClockHandler fired");
    setLocalTimer(0);
    // handleTimerToggle();
    toggleTimerHandler(false);
  };
  const startClockHandler = () => {
    console.log("startClockHandler fired");
    setLocalTimer(1);
    // handleTimerToggle();
    toggleTimerHandler(true);
  };
  const resetHandler = () => {
    console.log("resetHandler fired");
    handleReset();
  };
  const scoreUpHandler = (team: string) => {
    console.log("scoreUpHandler fired");
    incrementScore(team);
  };
  const scoreDownHandler = (team: string) => {
    console.log("scoreDownHandler fired");
    decrementScore(team);
  };
  const periodChangeHandler = (period: number) => {
    console.log("periodChangeHandler fired", period);
    setPeriodHandler(period);
  };

  const foulUpHandler = (team: string) => {
    console.log("foulUpHandler fired", team);
    incrementFoul(team);
  };
  const foulDownHandler = (team: string) => {
    console.log("foulDownHandler fired", team);
    decrementFoul(team);
  };

  useEffect(() => {
    setLocalTimer(data.timer);
    return () => {};
  }, [data.timer]);

  return (
    <>
      <Stack gap={2} mt={2}>
        <Flex gap={2}>
          <Box flex={1}>
            {localTimer === 0 ? (
              <Button w="100%" paddingY={8} onClick={startClockHandler}>
                {"Start Clock"}
              </Button>
            ) : (
              <Button w="100%" paddingY={8} onClick={stopClockHandler}>
                {"Stop Clock"}
              </Button>
            )}
          </Box>
          <Box flex={0}>
            <Button
              onClick={() => {
                resetHandler();
              }}
              paddingY={8}
              css={{
                border: "1px solid black",
                background: "white",
                color: "black",
              }}
            >
              Reset
            </Button>
          </Box>
        </Flex>
        SCORES
        <Flex fontSize={"30vw"} gap={2}>
          <Box
            flex={1}
            textAlign={"center"}
            position={"relative"}
            css={{ border: "1px solid black", borderRadius: 8 }}
          >
            {data.team1_score}
            <Box
              onClick={() => {
                scoreUpHandler("team1");
              }}
              css={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "rgba(0,0,255,0.1)",
              }}
            ></Box>
            <Box
              onClick={() => {
                scoreDownHandler("team1");
              }}
              css={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "rgba(0,0,255,0.2)",
              }}
            ></Box>
          </Box>
          <Box
            flex={1}
            textAlign={"center"}
            position={"relative"}
            css={{ border: "1px solid black", borderRadius: 8 }}
          >
            {data.team2_score}
            <Box
              onClick={() => {
                scoreUpHandler("team2");
              }}
              css={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "rgba(0,0,255,0.1)",
              }}
            ></Box>
            <Box
              onClick={() => {
                scoreDownHandler("team2");
              }}
              css={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "rgba(0,0,255,0.2)",
              }}
            ></Box>
          </Box>
        </Flex>
        FOULS
        <Flex fontSize={"34px"} gap={2}>
          <Box
            flex={1}
            textAlign={"center"}
            position={"relative"}
            css={{
              border: "1px solid black",
              borderRadius: 8,
              paddingY: "40px",
            }}
          >
            {data.team1_fouls}
            <Box
              onClick={() => {
                foulUpHandler("team1");
              }}
              css={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "rgba(0,0,255,0.1)",
              }}
            ></Box>
            <Box
              onClick={() => {
                foulDownHandler("team1");
              }}
              css={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "rgba(0,0,255,0.2)",
              }}
            ></Box>
          </Box>
          <Box
            flex={1}
            textAlign={"center"}
            position={"relative"}
            css={{
              border: "1px solid black",
              borderRadius: 8,
              paddingY: "40px",
            }}
          >
            {data.team2_fouls}
            <Box
              onClick={() => {
                foulUpHandler("team2");
              }}
              css={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "rgba(0,0,255,0.1)",
              }}
            ></Box>
            <Box
              onClick={() => {
                foulDownHandler("team2");
              }}
              css={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "50%",
                background: "rgba(0,0,255,0.2)",
              }}
            ></Box>
          </Box>
        </Flex>
        <Flex css={{ border: "1px solid black", borderRadius: 8 }}>
          {[1, 2, 3, 4].map((period) => {
            return (
              <Box
                key={period}
                onClick={() => {
                  periodChangeHandler(period);
                }}
                flex="1"
                textAlign={"center"}
                padding={2}
                transition={"0.3s ease all"}
                background={
                  data.period === period ? "rgba(0,0,255, 0.1)" : "transparent"
                }
              >
                {period}
              </Box>
            );
          })}
        </Flex>
      </Stack>
    </>
  );
}
