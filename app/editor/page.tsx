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
import { useState, useEffect, useCallback } from "react";
import Controller from "./components/Controller";

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
  const [activePanel, setActivePanel] = useState<"controller" | "editor">(
    "editor"
  );
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

  // const handleStopTimer = async (timerActive: number) => {
  //   await fetch("/api/stoptimer", {
  //     method: "PUT",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ timerActive: timerActive }),
  //   });
  // };

  // const handleTimerToggle = () => {
  //   // const timerStatus = timerActive;
  //   // setTimerActive(!timerStatus);
  //   console.log("attempting to trigger timer");

  //   const newTimerStatus = data.timer === 1 ? false : true;

  //   //change timeractive
  //   setTimerActive(newTimerStatus);

  //   //change data

  //   setData((prev: DataTypes) => {
  //     return { ...prev, timer: newTimerStatus ? 1 : 0 };
  //   });

  //   // await fetch("/api/toggletimer", {
  //   //   method: "PUT",
  //   //   headers: { "Content-Type": "application/json" },
  //   //   body: JSON.stringify({ timerActive: true }),
  //   // });
  // };

  const toggleTimerHandler = (status: boolean) => {
    const toSet = status;
    if (toSet) {
      //change timeractive
      setTimerActive(true);
      //change data
      setData((prev: DataTypes) => {
        return { ...prev, timer: 1 };
      });
    } else {
      //change timeractive
      setTimerActive(false);
      //change data
      setData((prev: DataTypes) => {
        return { ...prev, timer: 0 };
      });
    }
  };

  const handleUpdate = useCallback(async () => {
    await fetch("/api/scoreboard", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  }, [data]);

  const incrementScore = (team: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData((prev: any): any => {
      if (team === "team1") {
        const newScore = prev.team1_score + 1;
        return { ...data, team1_score: newScore };
      }
      if (team === "team2") {
        const newScore = prev.team2_score + 1;
        return { ...data, team2_score: newScore };
      }
    });
  };
  const decrementScore = (team: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData((prev: any): any => {
      if (team === "team1") {
        const newScore = prev.team1_score - 1;
        return { ...data, team1_score: newScore };
      }
      if (team === "team2") {
        const newScore = prev.team2_score - 1;
        return { ...data, team2_score: newScore };
      }
    });
  };
  const incrementFoul = (team: string) => {
    console.log({ fouls: team });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData((prev: any): any => {
      if (team === "team1") {
        const newScore = prev.team1_fouls + 1;
        console.log(newScore);
        return { ...data, team1_fouls: newScore };
      }
      if (team === "team2") {
        const newScore = prev.team2_fouls + 1;
        return { ...data, team2_fouls: newScore };
      }
    });
  };
  const decrementFoul = (team: string) => {
    console.log({ fouls: team });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData((prev: any): any => {
      if (team === "team1") {
        const newScore = prev.team1_fouls + 1;
        console.log(newScore);
        return { ...data, team1_fouls: newScore };
      }
      if (team === "team2") {
        const newScore = prev.team2_fouls + 1;
        return { ...data, team2_fouls: newScore };
      }
    });
  };

  const handleReset = async () => {
    await fetch("/api/timerreset", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ previouscount: data.resetcount }),
    });
  };

  const setPeriodHandler = (period: number) => {
    setData({ ...data, period });
  };

  useEffect(() => {}, [timerActive]);

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

  useEffect(() => {
    handleUpdate();
  }, [data, handleUpdate]);

  useEffect(() => {
    handleUpdate();
  }, [data]);

  return (
    <Box p={2}>
      <Box>
        <Button
          size="xs"
          onClick={() => {
            setActivePanel(
              activePanel === "controller" ? "editor" : "controller"
            );
          }}
        >
          {activePanel === "controller"
            ? "Switch to editor"
            : "Switch to controller"}
        </Button>
      </Box>

      {activePanel === "editor" && (
        <Box>
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
      )}
      {activePanel === "controller" && (
        <Controller
          data={data}
          handleReset={handleReset}
          incrementScore={incrementScore}
          decrementScore={decrementScore}
          setPeriodHandler={setPeriodHandler}
          toggleTimerHandler={toggleTimerHandler}
          incrementFoul={incrementFoul}
          decrementFoul={decrementFoul}
        />
      )}
    </Box>
  );
}
