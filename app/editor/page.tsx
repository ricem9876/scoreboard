"use client";

import { Input } from "@chakra-ui/react";
import { useState, useEffect } from "react";

type DataTypes = {
  team1_score?: number;
  team2_score?: number;
  team1_color?: string;
  team2_color?: string;
  team1_name?: string;
  team2_name?: string;
  timer?: number;
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
  });
  const [previousData, setPreviousData] = useState<DataTypes>({});

  useEffect(() => {
    fetch("/api/scoreboard", { method: "PUT" })
      .then((res) => {
        console.log({ res });
        return res.json();
      })
      .then((data) => setData(data));
  }, []);

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = (event) => {
      const updatedData = JSON.parse(event.data);
      setPreviousData(updatedData);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const handleUpdate = async () => {
    await fetch("/api/scoreboard", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  return (
    <div>
      <h1>Edit Scoreboard</h1>
      <div>
        <label>
          Team 1 Name:
          <Input
            type="text"
            value={data.team1_name}
            onChange={(e) => setData({ ...data, team1_name: e.target.value })}
            defaultValue={
              previousData.team1_name ? previousData.team1_name : ""
            }
          />
        </label>
        <label>
          Team 1 Score:
          <input
            type="number"
            value={data.team1_score}
            onChange={(e) => setData({ ...data, team1_score: +e.target.value })}
            defaultValue={
              previousData.team1_score ? previousData.team1_score : 0
            }
          />
        </label>
        <label>
          Team 1 Color:
          <input
            type="color"
            value={data.team1_color}
            onChange={(e) => setData({ ...data, team1_color: e.target.value })}
            defaultValue={
              previousData.team1_color ? previousData.team1_color : ""
            }
          />
        </label>
      </div>
      <div>
        <label>
          Team 2 Name:
          <Input
            type="text"
            value={data.team2_name}
            onChange={(e) => setData({ ...data, team2_name: e.target.value })}
            defaultValue={
              previousData.team2_name ? previousData.team2_name : ""
            }
          />
        </label>
        <label>
          Team 2 Score:
          <input
            type="number"
            value={data.team2_score}
            onChange={(e) => setData({ ...data, team2_score: +e.target.value })}
          />
        </label>
        <label>
          Team 2 Color:
          <input
            type="color"
            value={data.team2_color}
            onChange={(e) => setData({ ...data, team2_color: e.target.value })}
          />
        </label>
      </div>
      <div>
        <label>
          Timer (Seconds):
          <input
            type="number"
            value={data.timer}
            onChange={(e) => setData({ ...data, timer: +e.target.value })}
          />
        </label>
      </div>
      <button onClick={handleUpdate}>Update Scoreboard</button>
    </div>
  );
}
