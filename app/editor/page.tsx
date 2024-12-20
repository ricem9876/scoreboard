"use client";

import {
  Box,
  Button,
  Input,
  Grid,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

type DataTypes = {
  team1_score?: number;
  team2_score?: number;
  team1_color?: string;
  team2_color?: string;
  team1_name?: string;
  team2_name?: string;
  timer?: number;
  period?: number;
  resetcount?: number;
};

export default function Edit() {
  const [data, setData] = useState<DataTypes>({
    team1_score: 0,
    team2_score: 0,
    team1_color: "#FF0000",
    team2_color: "#0000FF",
    team1_name: "test",
    team2_name: "test",
    timer: 0,
    period: 0,
    resetcount: 0,
  });

  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    fetch("/api/scoreboard", { method: "GET" })
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  // useEffect(() => {
  //   const eventSource = new EventSource("/api/sse");
  //   eventSource.onmessage = (event) => {
  //     const updatedData = JSON.parse(event.data);
  //     const newData = { ...data, resetcount: updatedData.resetcount };
  //     setData(newData);
  //   };
  //   return () => {
  //     eventSource.close();
  //   };
  // }, []);

  const handleUpdate = async () => {
    await fetch("/api/scoreboard", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const handleReset = async () => {
    await fetch("/api/timerreset", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ previouscount: data.resetcount }),
    });
  };

  useEffect(() => {
    const handleStopTimer = async () => {
      await fetch("/api/stoptimer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timerActive: timerActive }),
      });
    };
    handleStopTimer();
  }, [timerActive]);

  useEffect(() => {
    if (timerActive) {
      setData((prevData) => ({
        ...prevData,
        timer: prevData.timer ? prevData.timer + 1 : 1,
      }));
    } else {
      setData((prevData) => ({ ...prevData, timer: 0 }));
    }
  }, [timerActive]);

  // Chakra's responsive breakpoints
  const gridTemplateColumns = useBreakpointValue({
    base: "1fr", // Stack items vertically on mobile (base)
    md: "1fr 1fr", // Two columns on medium devices and up (md)
  });

  return (
    <Box p={5}>
      <Text fontSize="2xl" mb={4}>
        Edit Scoreboard
      </Text>

      <Grid templateColumns={gridTemplateColumns} gap={6}>
        {/* Team 1 Controls */}
        <Box>
          <Text fontSize="lg" mb={2}>
            Team 1
          </Text>
          <Stack>
            <Box>
              <Text>Team 1 Name:</Text>
              <Input
                type="text"
                value={data.team1_name}
                onChange={(e) =>
                  setData({ ...data, team1_name: e.target.value })
                }
                size="sm"
              />
            </Box>
            <Box>
              <Text>Team 1 Score:</Text>
              <Input
                type="number"
                value={data.team1_score}
                onChange={(e) =>
                  setData({ ...data, team1_score: +e.target.value })
                }
                size="sm"
              />
            </Box>
            <Box>
              <Text>Team 1 Color:</Text>
              <Input
                type="color"
                value={data.team1_color}
                onChange={(e) =>
                  setData({ ...data, team1_color: e.target.value })
                }
                size="sm"
              />
            </Box>
          </Stack>
        </Box>

        {/* Team 2 Controls */}
        <Box>
          <Text fontSize="lg" mb={2}>
            Team 2
          </Text>
          <Stack>
            <Box>
              <Text>Team 2 Name:</Text>
              <Input
                type="text"
                value={data.team2_name}
                onChange={(e) =>
                  setData({ ...data, team2_name: e.target.value })
                }
                size="sm"
              />
            </Box>
            <Box>
              <Text>Team 2 Score:</Text>
              <Input
                type="number"
                value={data.team2_score}
                onChange={(e) =>
                  setData({ ...data, team2_score: +e.target.value })
                }
                size="sm"
              />
            </Box>
            <Box>
              <Text>Team 2 Color:</Text>
              <Input
                type="color"
                value={data.team2_color}
                onChange={(e) =>
                  setData({ ...data, team2_color: e.target.value })
                }
                size="sm"
              />
            </Box>
          </Stack>
        </Box>
      </Grid>

      {/* Timer Controls */}
      <Box mt={6}>
        <Text mb={2}>Timer (Seconds):</Text>
        <Box display="flex" alignItems="center" mb={4}>
          <Box
            width={10}
            height={10}
            background={timerActive ? "green" : "red"}
            borderRadius="full"
            mr={2}
          ></Box>
          <Button onClick={() => setTimerActive(!timerActive)} size="sm">
            {timerActive ? "Stop Timer" : "Start Timer"}
          </Button>

          <Button
            onClick={() => {
              console.log("resetting timer");
              handleReset();
            }}
            size="sm"
          >
            Reset Timer
          </Button>
        </Box>
      </Box>

      {/* Period Controls */}
      <Box>
        <Text mb={2}>Period:</Text>
        <Input
          type="number"
          value={data.period ?? 0}
          max={4}
          onChange={(e) => setData({ ...data, period: +e.target.value })}
          size="sm"
        />
      </Box>

      <Button
        colorScheme="blue"
        mt={6}
        onClick={handleUpdate}
        size="md"
        width="full"
      >
        Update Scoreboard
      </Button>
    </Box>
  );
}
