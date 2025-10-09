/* eslint-disable @next/next/no-img-element */
// Directive to use client-side rendering in Next.js (required for hooks and interactivity)
"use client";

// Import Chakra UI components for layout and styling
import { Box, Flex, Heading } from "@chakra-ui/react";
// Import React hooks for state management and side effects
import { useEffect, useState } from "react";
// Import custom hook for managing the game timer
import useTimeClock from "../../hooks/useTimeClock";
// Import custom hook to prevent screen from sleeping during the game
import { useWakeLock } from "../../hooks/useWakeLock";
// Import component-specific CSS styles
import "./style.css";
// Import Google Font for the scoreboard text styling
import { Saira_Stencil_One } from "next/font/google";
// Import axios for making HTTP requests to the backend
import axios from "axios";
// Import React Query utilities for data fetching and caching
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

// Configure the Saira Stencil One font with specific settings
const saira_Stencil_One = Saira_Stencil_One({
  subsets: ["latin"], // Use Latin character subset
  display: "swap", // Show fallback font until custom font loads
  variable: "--font-poppins", // CSS variable name for the font
  weight: "400", // Font weight (regular)
});

// Create a new React Query client instance for managing server state
const queryClient = new QueryClient();

// Async function to fetch scoreboard data from the backend API
const retrieveBoard = async () => {
  // Make GET request to the serverless function endpoint
  const response = await axios.get(
    process.env.BACKEND_URL + "/.netlify/functions/scoreboard" || ""
  );
  // Return the data portion of the response
  return response.data;
};

// Commented out TypeScript interface - defines the shape of board data
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

// Component to display individual team information (name, color, score, fouls)
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
    // Outer container: takes up half the width, centers content
    <Box
      flex="1" // Grow to fill available space
      textAlign="center" // Center text horizontally
      display="flex" // Use flexbox layout
      alignItems={"center"} // Center content vertically
      justifyContent={"center"} // Center content horizontally
      position={"relative"} // Allow absolute positioning of children
    >
      {/* Inner card with team information */}
      <Box
        display="inline-block" // Display as inline block element
        paddingX={15} // Horizontal padding - REDUCE THIS (try 12-15)
        paddingY={6} // Vertical padding - REDUCE THIS (try 6-8)
        boxShadow={`inset 0 16px 0 0 ${color}`} // Colored top border effect - REDUCE 24px (try 16-20)
        borderRadius={20} // Rounded corners
        color="white" // White text color
        background="rgba(0,0,0,0.5)" // Semi-transparent black background
        backdropFilter={"blur(10px)"} // Apply blur effect to background
      >
        {/* Team name heading */}
        <Heading
          fontSize={"7vw"} // Responsive font size - REDUCE THIS (try 5-6vw)
          lineHeight={1} // Tight line spacing
          textTransform={"capitalize"} // Capitalize first letter of each word
          color="white" // White text color
          mb={10} // Margin bottom - REDUCE THIS (try 6-8)
        >
          {name}
        </Heading>
        
        {/* Score and fouls container */}
        <Box>
          {/* Team score display */}
          <Box
            fontSize={"12vw"} // Large responsive font size - REDUCE THIS (try 8-10vw)
            color="white" // White text color
            lineHeight={1} // Tight line spacing
          >
            {score}
          </Box>
          {/* Team fouls display (dimmed) */}
          <Box opacity={0.5}>{fouls}</Box>
        </Box>
      </Box>
    </Box>
  );
};

// Main scoreboard component that manages all game state and display logic
function ScoreboardContent() {
  // Commented out state - would hold all scoreboard data
  // const [dataHolder, setDataHolder] = useState<BoardType>({...});
  
  // State to control the "SCORE!" animation visibility
  const [scoreAnimation, setScoreAnimation] = useState(false);
  // State to store the color of the team that scored (for animation)
  const [scoreColor, setScoreColor] = useState<string>("");
  
  // Destructure timer functions from custom hook
  const { time, start, pause, isRunning, reset } = useTimeClock();
  
  // Activate wake lock to prevent screen from sleeping
  useWakeLock();
  
  // Track the last reset count to detect when timer should be reset
  const [lastResetCount, setLastResetCount] = useState<number | null>(null);

  // State to store the scoreboard data fetched from the server
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [resultData, setResultData] = useState<any>({});

  // Function to trigger the score animation when a team scores
  const scoreEventHandler = function (color: string) {
    setScoreAnimation(true); // Show animation
    setScoreColor(color); // Set animation color to scoring team's color
    // Hide animation after 1 second
    setTimeout(() => {
      setScoreAnimation(false);
    }, 1000);
  };

  // Commented out Server-Sent Events (SSE) implementation
  // Alternative method for real-time updates (not currently used)
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

  // Use React Query to fetch scoreboard data
  const {
    data: scoreboardData, // Fetched data from the API
    isLoading, // Loading state
    error, // Error state
  } = useQuery({
    queryKey: ["scoreboardResponse"], // Unique key for this query
    queryFn: retrieveBoard, // Function to fetch the data
    refetchInterval: 1500, // Automatically refetch every 1.5 seconds
  });

  // Update local state whenever new data is fetched
  useEffect(() => {
    setResultData(scoreboardData);
  }, [scoreboardData]);

  // Control timer based on the `timer` boolean from server data
  useEffect(() => {
    if (resultData?.timer) {
      console.log("Timer started");
      start(); // Start the countdown timer
    } else {
      console.log("Timer paused");
      pause(); // Pause the countdown timer
    }
  }, [resultData?.timer, start, pause]);

  // Monitor reset count and trigger timer reset when it changes
  useEffect(() => {
    // Check if resetcount exists and has changed from last known value
    if (
      resultData?.resetcount !== undefined &&
      resultData?.resetcount !== lastResetCount
    ) {
      console.log("Reset detected");
      reset(); // Reset the timer to initial value
      setLastResetCount(resultData?.resetcount); // Update tracking variable
    }
  }, [resultData?.resetcount, lastResetCount, reset]);

  // Trigger score animation when team 1 scores
  useEffect(() => {
    console.log("TEAM 1 SCORE CHANGED");
    scoreEventHandler(resultData?.team1_color); // Show animation with team 1's color
  }, [resultData?.team1_color, resultData?.team1_score]);

  // Trigger score animation when team 2 scores
  useEffect(() => {
    console.log("TEAM 2 SCORE CHANGED");
    scoreEventHandler(resultData?.team2_color); // Show animation with team 2's color
  }, [resultData?.team2_color, resultData?.team2_score]);

  // Show loading message while data is being fetched
  if (isLoading) return <div>Fetching Data...</div>;
  // Show error message if fetch fails
  if (error) return <div>An error occurred: {error.message}</div>;

  // Log current data for debugging
  console.log(resultData);

  return (
    // Main container: full viewport, black background
    <Box
      backgroundColor="black" // Black background
      p={8} // Padding on all sides
      w={"100vw"} // Full viewport width
      h={"100vh"} // Full viewport height
      className={`${saira_Stencil_One.className}`} // Apply custom font
      // Dynamic border that changes based on timer state:
      // Green when running, orange when paused
      boxShadow={`${isRunning ? "inset 0 0 0 20px rgba(6, 251, 6, 0.5)" : " inset 0 0 0 10px rgba(250,156,28,0.8)"}`}
    >
      {/* Sponsor logo/image container (top left) */}
      <Box
        w={"600px"} // Fixed width
        height="350px" // Fixed height
        position="fixed" // Fixed positioning
        top="20px" // 20px from top
        left={"50px"} // 50px from left
        borderRadius={"10px"} // Rounded corners
        overflow="hidden" // Hide overflow content
        boxShadow={"0 0 10px #000000"} // Drop shadow
        className={"rotating-3d-pause sponsorImage"} // CSS class for 3D rotation animation
      >
        {/* Sponsor image would be inserted here */}
      </Box>

      {/* Background image overlay (low opacity) */}
      <Box
        position="absolute" // Absolute positioning
        className={`backgroundImage`} // CSS class for background image
        top="0" // Align to top
        left="0" // Align to left
        width="100%" // Full width
        height="100%" // Full height
        opacity={"0.9"} // Very transparent (10% opacity)
        zIndex={0} // Behind other content
      ></Box>

      {/* Main scoreboard content container */}
      <Flex
        flexDir={"column"} // Vertical layout
        height={"100%"} // Full height
        borderRadius={12} // Rounded corners
        zIndex={0} // Layer position
        pos={"relative"} // Relative positioning for z-index to work
      >
        {/* Inner flex container for timer, periods, and team cards */}
        <Flex flex="1" width="100%" flexDir={"column"}>
          {/* Timer and period indicators section */}
          <Flex flex="0" alignItems={"center"} justifyContent={"center"}>
            {/* Timer display */}
            <Box flex="0" fontSize={"10vw"} textAlign={"center"}>
              <Box
                background="black" // Black background
                color="white" // White text
                display={"inline-block"} // Inline block display
                paddingY={3} // Vertical padding
                paddingX={8} // Horizontal padding
                mr={20} // Right margin
                borderRadius={20} // Rounded corners
                pos={"relative"} // Relative positioning
                transition="0.5s ease all" // Smooth transitions
              >
                {/* Display the current time */}
                {time}
              </Box>
            </Box>

            {/* Period indicators (4 quarters/periods) */}
            <Box flex="0" fontSize={"5vw"}>
              {/* Create 4 period indicator dots */}
              {Array.from({ length: 4 }).map((item, index) => {
                return (
                  <Box
                    key={index * 0.244} // Unique key for each dot
                    width={10} // Dot width
                    height={10} // Dot height
                    // Yellow if period is active, white if inactive
                    background={index < resultData?.period ? "yellow" : "white"}
                    transition={"0.5s ease all"} // Smooth color transition
                    // Glowing effect for active periods
                    boxShadow={
                      index < resultData?.period
                        ? "0 0 10px yellow"
                        : "0 0 10px transparent"
                    }
                    borderRadius={40} // Make it circular
                    mb={8} // Margin bottom (spacing between dots)
                  />
                );
              })}
            </Box>
          </Flex>

          {/* Team cards section - positioned on opposite sides */}
          <Flex fontSize={"4vw"} flex="1" position="relative">
            {/* Team 1 card - positioned on the left */}
            <Box position="absolute" left="2%" top="50%" transform="translateY(-50%)">
              <TeamCard
                name={resultData?.team1_name}
                color={resultData?.team1_color}
                score={resultData?.team1_score}
                fouls={resultData?.team1_fouls}
              />
            </Box>
            {/* Team 2 card - positioned on the right */}
            <Box position="absolute" right="2%" top="50%" transform="translateY(-50%)">
              <TeamCard
                name={resultData?.team2_name}
                color={resultData?.team2_color}
                score={resultData?.team2_score}
                fouls={resultData?.team2_fouls}
              />
            </Box>
          </Flex>
        </Flex>
      </Flex>

      {/* "SCORE!" animation overlay (center of screen) */}
      <Box
        css={{
          position: "absolute", // Absolute positioning
          top: "50%", // Center vertically
          left: "50%", // Center horizontally
          // Transform for centering and animation (scale and rotate)
          transform:
            "translate(-50%,-50%) " + // Center the element
            `${scoreAnimation ? "scale(1)" : "scale(0)"} ` + // Scale up when visible
            `${scoreAnimation ? "rotate(0deg)" : "rotate(45deg)"}`, // Rotate when hidden
          fontSize: "20vw", // Very large text
          transition: "0.3s ease all", // Smooth animation
          opacity: scoreAnimation ? "1" : "0", // Fade in/out
          background: scoreColor, // Background color matches scoring team
          borderRadius: 20, // Rounded corners
          lineHeight: 1, // Tight line spacing
          padding: "16px", // Padding around text
          color: "white", // White text
        }}
      >
        SCORE!
      </Box>
    </Box>
  );
}

// Main exported component that wraps ScoreboardContent with React Query provider
export default function Scoreboard() {
  return (
    // Provide React Query client to all child components
    <QueryClientProvider client={queryClient}>
      <ScoreboardContent />
    </QueryClientProvider>
  );
}
