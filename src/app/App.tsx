import { RouterProvider } from "react-router";
import { router } from "./routes";
import { Toaster } from "sonner";
import { BarangayProvider } from "./components/BarangayContext";

export default function App() {
  return (
    <BarangayProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </BarangayProvider>
  );
}
