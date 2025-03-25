import { useMutation, useQueryClient } from "@tanstack/react-query";

const useResetTimer = (resetCount?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch(process.env.BACKEND_URL + "/timerreset", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ previouscount: resetCount }),
      });

      if (!response.ok) {
        throw new Error("Failed to reset timer");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timer"] }); // Adjust key if necessary
    },
  });
};

export default useResetTimer;
