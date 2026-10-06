import { Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Predictor from "@/pages/Predictor";
import ScrollManager from "@/components/ScrollManager";
import { Toaster } from "@/components/ui/sonner";

// One <Route> per page in src/pages; BrowserRouter already wraps this in main.tsx.
export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predictor" element={<Predictor />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </>
  );
}
