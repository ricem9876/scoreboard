"use client";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useTimeClock from "../../hooks/useTimeClock";
import { useWakeLock } from "../../hooks/useWakeLock";
import "./style.css";
import { Saira_Stencil_One } from "next/font/google";
const saira_Stencil_One = Saira_Stencil_One({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: "400",
});

const TeamCard = ({
  name,
  color,
  score,
}: {
  name: string | number;
  color: string;
  score: string | number;
}) => {
  return (
    <Box
      flex="1"
      textAlign="center"
      display="flex"
      alignItems={"center"}
      justifyContent={"center"}
      position={"relative"}
    >
      <Box
        // border="4px solid white"
        display="inline-block"
        p={20}
        boxShadow={`inset 0 24px 0 0 ${color}`}
        borderRadius={20}
        color="white"
        background="rgba(0,0,0,0.5)"
        backdropFilter={"blur(10px)"}
      >
        <Heading
          fontSize={"7vw"}
          lineHeight={1}
          textTransform={"capitalize"}
          color="white"
          mb={10}
        >
          {name}
          {/* <Box
            display="inline-block"
            h={10}
            w={10}
            backgroundColor={color}
          ></Box> */}
        </Heading>
        <Box>
          <Box
            // background="black"
            fontSize={"15vw"}
            color="white"
            // background="red"
            lineHeight={1}
          >
            {score}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

// import backgroundImage from "../assets/images/soccer.jpg";
export default function Scoreboard() {
  const [data, setData] = useState({
    team1_score: 0,
    team2_score: 0,
    team1_color: "#FF0000",
    team2_color: "#0000FF",
    team1_name: "test",
    team2_name: "test",
    timer: false,
    period: 1,
    resetcount: 0,
  });
  const [timerValue, setTimerValue] = useState(0); // obsolete
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [scoreColor, setScoreColor] = useState<string>("");
  const { time, start, pause, reset, isRunning } = useTimeClock();
  useWakeLock();

  const scoreEventHandler = function (color: string) {
    setScoreAnimation(true);
    setScoreColor(color);
    setTimeout(() => {
      setScoreAnimation(false);
    }, 1000);
  };

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = (event) => {
      const updatedData = JSON.parse(event.data);
      setData(updatedData);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // TODO: REMOVE
  // Old way
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (data.timer) {
      // Start the timer
      timerInterval = setInterval(() => {
        setTimerValue((prevValue) => prevValue + 1);
      }, 1000);
    }
    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [data.timer]);

  useEffect(() => {
    console.log("reset detected");
    reset();
    // TODO: REMOVE - OLD
    setTimerValue(0);
  }, [data.resetcount]);

  useEffect(() => {
    console.log("TEAM 1 SCORE CHANGED");
    scoreEventHandler(data.team1_color);
  }, [data.team1_score]);

  useEffect(() => {
    console.log("TEAM 2 SCORE CHANGED");
    scoreEventHandler(data.team2_color);
  }, [data.team2_score]);

  useEffect(() => {
    if (data.timer) {
      start();
    } else {
      pause();
    }
    return () => {};
  }, [data.timer, pause, start]);

  return (
    <Box
      backgroundColor="black"
      p={8}
      w={"100vw"}
      h={"100vh"}
      className={`${saira_Stencil_One.className}`}
    >
      <Box
        position="absolute"
        className={`backgroundImage`}
        top="0"
        left="0"
        width="100%"
        height="100%"
        opacity={"0.1"}
        zIndex={0}
      ></Box>
      <Flex
        flexDir={"column"}
        height={"100%"}
        borderRadius={12}
        zIndex={0}
        pos={"relative"}
      >
        <Flex flex="1" width="100%" flexDir={"column"}>
          <Flex flex="0" alignItems={"center"} justifyContent={"center"}>
            <Box flex="0" fontSize={"10vw"} textAlign={"center"}>
              <Box
                background="black"
                color="white"
                display={"inline-block"}
                paddingY={3}
                paddingX={8}
                mr={20}
                borderRadius={20}
              >
                {time}({isRunning ? "ye" : "ne"})-{formatTime(timerValue)}
              </Box>
            </Box>
            <Box flex="0" fontSize={"5vw"}>
              {Array.from({ length: data.period }).map((item, index) => {
                return (
                  <Box
                    key={index * 0.244}
                    // display="inline-block"
                    width={10}
                    height={10}
                    background={"yellow"}
                    boxShadow={"0 0 10px yellow"}
                    borderRadius={40}
                    mb={8}
                  />
                );
              })}
              {Array.from({ length: 4 - data.period }).map((item, index) => {
                return (
                  <Box
                    key={index * 0.244}
                    width={10}
                    height={10}
                    background={"white"}
                    boxShadow={"0 0 10px white"}
                    borderRadius={40}
                    mb={8}
                  />
                );
              })}
            </Box>
          </Flex>{" "}
          <Flex fontSize={"4vw"} flex="1">
            <TeamCard
              name={data.team1_name}
              color={data.team1_color}
              score={data.team1_score}
            />
            <TeamCard
              name={data.team2_name}
              color={data.team2_color}
              score={data.team2_score}
            />
          </Flex>
        </Flex>
      </Flex>

      <Box
        css={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform:
            "translate(-50%,-50%) " +
            `${scoreAnimation ? "scale(1)" : "scale(0)"}`,
          fontSize: "20vw",
          transition: "0.3s ease all",
          opacity: scoreAnimation ? "1" : "0",
          background: scoreColor,
          borderRadius: 20,
          lineHeight: 1,
          padding: "16px",
        }}
      >
        SCORE!
      </Box>
    </Box>
  );
}
