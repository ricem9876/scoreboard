/* eslint-disable @next/next/no-img-element */
"use client";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useTimeClock from "../../hooks/useTimeClock";
import { useWakeLock } from "../../hooks/useWakeLock";
import "./style.css";
import { Saira_Stencil_One } from "next/font/google";
import axios from "axios";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
const saira_Stencil_One = Saira_Stencil_One({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: "400",
});
const queryClient = new QueryClient();

const retrieveBoard = async () => {
  const response = await axios.get(
    process.env.BACKEND_URL + "/.netlify/functions/scoreboard" || ""
  );
  return response.data;
};
// interface BoardType {
//   team1_score: number;
//   team2_score: number;
//   team1_color: string;
//   team2_color: string;
//   team1_name: string;
//   team2_name: string;
//   timer: boolean;
//   period: number;
//   resetcount: number;
//   team1_fouls: number;
//   team2_fouls: number;
// }

const TeamCard = ({
  name,
  color,
  score,
  fouls,
}: {
  name: string | number;
  color: string;
  score: string | number;
  fouls: number;
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
        paddingX={20}
        paddingY={10}
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
          <Box opacity={0.5}>{fouls}</Box>
        </Box>
      </Box>
    </Box>
  );
};

function ScoreboardContent() {
  // const [dataHolder, setDataHolder] = useState<BoardType>({
  //   team1_score: 0,
  //   team2_score: 0,
  //   team1_color: "#FF0000",
  //   team2_color: "#0000FF",
  //   team1_name: "test",
  //   team2_name: "test",
  //   timer: false,
  //   period: 1,
  //   resetcount: 0,
  //   team1_fouls: 0,
  //   team2_fouls: 0,
  // });
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [scoreColor, setScoreColor] = useState<string>("");
  const { time, start, pause, isRunning, reset } = useTimeClock();
  useWakeLock();
  const [lastResetCount, setLastResetCount] = useState<number | null>(null); // Track the last reset count

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultData, setResultData] = useState<any>({});

  const scoreEventHandler = function (color: string) {
    setScoreAnimation(true);
    setScoreColor(color);
    setTimeout(() => {
      setScoreAnimation(false);
    }, 1000);
  };

  // useEffect(() => {
  //   const eventSource = new EventSource("/api/sse");

  //   eventSource.onmessage = (event) => {
  //     const updatedData = JSON.parse(event.data);
  //     setData(updatedData);
  //   };

  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data: scoreboardData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["scoreboardResponse"], // Query key
    queryFn: retrieveBoard, // Fetch function
    refetchInterval: 1500,
  });
  useEffect(() => {
    setResultData(scoreboardData);
  }, [scoreboardData]);

  useEffect(() => {
    if (resultData?.timer) {
      console.log("Timer started");
      start(); // Start the clock if `timer` is true
    } else {
      console.log("Timer paused");
      pause(); // Pause the clock if `timer` is false
    }
  }, [resultData?.timer, start, pause]);

  // Monitor `resultData?.resetcount` and trigger reset
  useEffect(() => {
    if (
      resultData?.resetcount !== undefined &&
      resultData?.resetcount !== lastResetCount
    ) {
      console.log("Reset detected");
      reset();
      setLastResetCount(resultData?.resetcount); // Update the last reset count
    }
  }, [resultData?.resetcount, lastResetCount, reset]);

  useEffect(() => {
    console.log("TEAM 1 SCORE CHANGED");
    scoreEventHandler(resultData?.team1_color);
  }, [resultData?.team1_color, resultData?.team1_score]);

  useEffect(() => {
    console.log("TEAM 2 SCORE CHANGED");
    scoreEventHandler(resultData?.team2_color);
  }, [resultData?.team2_color, resultData?.team2_score]);

  // useEffect(() => {
  //   if (resultData?.timer) {
  //     start();
  //   } else {
  //     pause();
  //   }
  //   return () => {};
  // }, [resultData?.timer, pause, start]);

  if (isLoading) return <div>Fetching Data...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  console.log(resultData);

  return (
    <Box
      backgroundColor="black"
      p={8}
      w={"100vw"}
      h={"100vh"}
      className={`${saira_Stencil_One.className}`}
      // transition={}
      boxShadow={`${isRunning ? "inset 0 0 0 20px rgba(6, 251, 6, 0.5)" : " inset 0 0 0 10px rgba(250,156,28,0.8)"}`}
    >
      <Box
        w={"300px"}
        height="300px"
        // background="red"
        position="fixed"
        top="40px"
        left={"40px"}
        // backgroundImage={sponsorImage.src}
        borderRadius={"100px"}
        overflow="hidden"
        boxShadow={"0 0 20px #888"}
        className={"rotating-3d-pause sponsorImage"}
      >
        {/* <Image
          src={sponsorImage.src}
          alt="Sponsor"
          w={"200px"}
          height="200px"
        /> */}
      </Box>
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
                pos={"relative"}
                // boxShadow={`${isRunning ? "0 0 20px green" : " 0 0 0px black"}`}
                transition="0.5s ease all"
              >
                {/* <Box
                  w={10}
                  h={10}
                  background={isRunning ? "green" : "orange"}
                  position="absolute"
                  left={2}
                  top={2}
                  borderRadius={20}
                ></Box> */}
                {time}
              </Box>
            </Box>
            <Box flex="0" fontSize={"5vw"}>
              {Array.from({ length: 4 }).map((item, index) => {
                return (
                  <Box
                    key={index * 0.244}
                    // display="inline-block"
                    width={10}
                    height={10}
                    background={index < resultData?.period ? "yellow" : "white"}
                    transition={"0.5s ease all"}
                    boxShadow={
                      index < resultData?.period
                        ? "0 0 10px yellow"
                        : "0 0 10px transparent"
                    }
                    borderRadius={40}
                    mb={8}
                  />
                );
              })}{" "}
              {/* {Array.from({ length: resultData?.period }).map((item, index) => {
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
              {Array.from({ length: 4 - resultData?.period }).map((item, index) => {
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
              })} */}
            </Box>
          </Flex>{" "}
          <Flex fontSize={"4vw"} flex="1">
            <TeamCard
              name={resultData?.team1_name}
              color={resultData?.team1_color}
              score={resultData?.team1_score}
              fouls={resultData?.team1_fouls}
            />
            <TeamCard
              name={resultData?.team2_name}
              color={resultData?.team2_color}
              score={resultData?.team2_score}
              fouls={resultData?.team2_fouls}
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
            `${scoreAnimation ? "scale(1)" : "scale(0)"} ` +
            `${scoreAnimation ? "rotate(0deg)" : "rotate(45deg)"}`,
          fontSize: "20vw",
          transition: "0.3s ease all",
          opacity: scoreAnimation ? "1" : "0",
          background: scoreColor,
          borderRadius: 20,
          lineHeight: 1,
          padding: "16px",
          color: "white",
        }}
      >
        SCORE!
      </Box>
    </Box>
  );
}

export default function Scoreboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScoreboardContent />
    </QueryClientProvider>
  );
}
