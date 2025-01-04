"use client";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import { PiSoccerBall } from "react-icons/pi";
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

  const [timerValue, setTimerValue] = useState(0);

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

  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;

    if (data.timer) {
      // Start the timer
      timerInterval = setInterval(() => {
        setTimerValue((prevValue) => prevValue + 1);
      }, 1000);
    }

    return () => {
      // Stop the timer when data.timer becomes false or component unmounts
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [data.timer]);

  useEffect(() => {
    console.log("reset detected");
    setTimerValue(0);
    // clearInterval(timerInterval);
  }, [data.resetcount]);

  useEffect(() => {
    console.log("TEAM 1 SCORE CHANGED");
    // run animation
  }, [data.team1_score]);

  useEffect(() => {
    console.log("TEAM 2 SCORE CHANGED");
    // run animation
  }, [data.team2_score]);
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
        // background="rgba(255,255,255,0.5)"
        flexDir={"column"}
        height={"100%"}
        borderRadius={12}
        zIndex={0}
        pos={"relative"}
      >
        {/*  MOVE TO CORNER !!!!  <Box flex={0} color="black" textAlign={"center"} p={6}>
          <Box display="inline-block">
            <Text
              whiteSpace={"nowrap"}
              fontSize={"3xl"}
              fontWeight={"bold"}
              color="white"
            >
              The Valley MP
            </Text>
          </Box>
        </Box> */}
        {/* <Flex flex={1} width={"100%"} alignItems={"center"}>
          <Flex
            flex={1}
            alignItems={"center"}
            justifyContent={"center"}
            perspective={"600px"}
          >
            <Flex
              background="white"
              textAlign={"center"}
              paddingY={16}
              paddingX={20}
              flexDir={"column"}
              transform="rotateY(15deg)"
              borderRadius={20}
            >
              <Box flex={0}>
                <Box
                  display="inline-block"
                  mb={4}
                  bg={data.team1_color}
                  borderRadius={"200px"}
                >
                  <PiSoccerBall size={"80px"} color="white" />
                </Box>
              </Box>
              <Heading fontSize="2.3vw" lineHeight={1} flex={0}>
                Razorbacks
              </Heading>
              <Flex
                fontSize={"15vw"}
                flex={1}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Box>{data.team1_score}</Box>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            flex={1}
            alignItems={"center"}
            justifyContent={"center"}
            perspective={"600px"}
          >
            <Flex
              background="white"
              textAlign={"center"}
              paddingY={16}
              paddingX={20}
              flexDir={"column"}
              transform="rotateY(-15deg)"
              borderRadius={20}
            >
              <Box flex={0}>
                <Box
                  display="inline-block"
                  mb={4}
                  bg={data.team2_color}
                  borderRadius={"200px"}
                >
                  <PiSoccerBall size={"80px"} color="white" />
                </Box>
              </Box>
              <Heading fontSize="2.3vw" lineHeight={1} flex={0}>
                Pittbulls
              </Heading>
              <Flex
                fontSize={"15vw"}
                flex={1}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Box>{data.team2_score}</Box>
              </Flex>
            </Flex>
          </Flex>
        </Flex> */}

        <Flex flex="1" width="100%" flexDir={"column"}>
          <Flex flex="0" alignItems={"center"} justifyContent={"center"}>
            <Box flex="0" fontSize={"10vw"} textAlign={"center"}>
              <Box
                background="black"
                color="white"
                display={"inline-block"}
                // border="4px solid white"
                paddingY={3}
                paddingX={8}
                mr={20}
                borderRadius={20}
              >
                {formatTime(timerValue)}
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
                    // display="inline-block"
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

      {/* <div>
        <h1>Scoreboard</h1>
        <div>
          <h2 style={{ color:   }}>
            Team 1: {data.team1_score}
          </h2>
          <h2 style={{ color: data.team2_color }}>
            Team 2: {data.team2_score}
          </h2>
        </div>
        <h3>Time Elapsed: {formatTime(data.timer)}</h3>
      </div> */}
    </Box>
  );
}
