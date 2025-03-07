import { Outlet } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <main className="flex-grow">
          <div className="max-w-10xl mx-auto px-4 py-2">
            <Outlet />
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
