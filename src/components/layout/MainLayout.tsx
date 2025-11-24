import Navbar from "./Navbar" // Assuming Navbar is in the same directory
import { Outlet } from "react-router-dom" // Importing Outlet from react-router-dom

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="h-[calc(100vh-4rem)] bg-background">
        <Outlet />
      </main>
    </div>
  )
}
