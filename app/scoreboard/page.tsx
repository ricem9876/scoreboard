"use client";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import { PiSoccerBall } from "react-icons/pi";

// import backgroundImage from "../assets/images/soccer.jpg";
export default function Scoreboard() {
  const [data, setData] = useState({
    team1_score: 0,
    team2_score: 0,
    team1_color: "#FF0000",
    team2_color: "#0000FF",
    team1_name: "test",
    team2_name: "test",
    timer: 0,
  });

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

  // const formatTime = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins}:${secs.toString().padStart(2, "0")}`;
  // };

  return (
    <Box
      // background="#3e5a2c"
      p={8}
      w={"100vw"}
      h={"100vh"}
      backgroundImage={'url("../assets/images/soccer.jpg")'}
      backgroundPosition={"center"}
    >
      <Flex
        background="rgba(255,255,255,0.5)"
        flexDir={"column"}
        height={"100%"}
        borderRadius={12}
      >
        <Box flex={0} color="black" textAlign={"center"} p={6}>
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
        </Box>
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
          <Flex fontSize={"4vw"} flex="1">
            <Box flex="1" textAlign="center">
              <Heading fontSize={"4vw"} lineHeight={1}>
                {data.team1_name}
                <Box
                  display="inline-block"
                  h={10}
                  w={10}
                  backgroundColor={data.team1_color}
                ></Box>
              </Heading>
              <Box>
                <Box
                  background="black"
                  padding="2"
                  color="white"
                  display="inline-block"
                  fontSize={"20vw"}
                  borderRadius={24}
                >
                  {data.team1_score}
                </Box>
              </Box>
            </Box>
            <Box flex="1" textAlign="center">
              <Heading
                backgroundColor={data.team2_color}
                fontSize={"4vw"}
                lineHeight={1}
              >
                {data.team2_name}
              </Heading>
              <Box>
                <Box
                  background="black"
                  padding="4"
                  color="white"
                  display="inline-block"
                  fontSize={"15vw"}
                  borderRadius={24}
                >
                  {data.team2_score}
                </Box>
              </Box>
            </Box>
          </Flex>
          <Flex flex="0">
            <Box flex="1" fontSize={"5vw"}>
              T:
              <Box background="black" color="white" display={"inline-block"}>
                00:00
              </Box>
            </Box>
            <Box flex="1" fontSize={"5vw"}>
              Period:
              <Box background="black" color="white" display={"inline-block"}>
                4
              </Box>
            </Box>
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
