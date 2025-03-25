import { useMutation, useQueryClient } from "@tanstack/react-query";

const useUpdateScoreboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updateData: object) => {
      const response = await fetch("/api/scoreboard", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

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
