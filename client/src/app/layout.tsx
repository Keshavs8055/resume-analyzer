import { FloatingButton } from "@/components/FloatingButton";
import "../styles/globals.css";
import { ResumeProvider } from "@/context/ResumeContext";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "AI Resume Analyzer",
  description: "Analyze resumes with Gemini API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/favicon.png"
        />
      </head>
      <body>
        <ResumeProvider>
          <Toaster />
          {children}
        </ResumeProvider>
        <div className="text-center mx-auto p-2 text-gray-500 ">
          <p>
            {" "}
            Made by <b>Keshav Sharma</b> Powered by <b>Gemini</b>
          </p>
          <FloatingButton />
        </div>
      </body>
    </html>
  );
}
