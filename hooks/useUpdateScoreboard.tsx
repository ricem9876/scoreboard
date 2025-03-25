import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateScoreboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: object) => {
      console.log("updating with: ", updateData);
      const response = await fetch(
        process.env.BACKEND_URL + "/.netlify/functions/updateScoreboard" || "",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update scoreboard");
      }

      return response.json(); // Assuming API returns updated data
    },
    onSuccess: () => {
      // Refetch scoreboard data after update (adjust query key as needed)
      queryClient.invalidateQueries({ queryKey: ["scoreboard"] });
    },
  });
};

export default useUpdateScoreboard;
