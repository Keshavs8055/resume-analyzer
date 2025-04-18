// export const rootApi = (process.env.NEXT_PUBLIC_API_URL || "").trim();
const rawApi = process.env.NEXT_PUBLIC_API_URL || "";
const rootApi = rawApi.startsWith("=") ? rawApi.slice(1).trim() : rawApi.trim();

export const FeedbackResume = async (
  file: File
): Promise<{ analysis?: string; error?: string }> => {
  const formData = new FormData();
  formData.append("resume", file);
  console.log(
    "Raw API URL string:",
    JSON.stringify(process.env.NEXT_PUBLIC_API_URL)
  );

  try {
    const res = await fetch(`${rootApi}/api/feedback`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Analysis failed");
    }

    return { analysis: data.analysis };
  } catch (error: any) {
    console.error("Error in analyzeResume:", error);
    return { error };
  }
};
export async function analyzeResume(file: File) {
  const formData = new FormData();
  formData.append("resume", file);
  const sessionId =
    typeof window !== "undefined"
      ? localStorage.getItem("sessionId") || crypto.randomUUID()
      : "server-session";

  localStorage.setItem("sessionId", sessionId);
  try {
    const res = await fetch(`${rootApi}/api/analyze`, {
      method: "POST",
      headers: {
        "x-session-id": sessionId,
      },
      body: formData,
    });

    const data = await res.json();
    return { analysis: data.analysis, error: null };
  } catch (err) {
    console.error("Error in analyzeResume:", err);
    const errorMessage =
      err instanceof Error ? err.message : "Something went wrong";
    return { analysis: null, error: errorMessage };
  }
}

export const chatWithResume = async (message: string) => {
  const sessionId = localStorage.getItem("sessionId");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (sessionId) {
    headers["x-session-id"] = sessionId;
  }

  const res = await fetch(`${rootApi}/api/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({ message }),
  });

  const rawText = await res.text();
  try {
    const data = JSON.parse(rawText);

    return data.response;
  } catch (err) {
    console.error("❌ Failed to parse JSON:", err);
    return { reply: null, error: "Invalid server response" };
  }
};
