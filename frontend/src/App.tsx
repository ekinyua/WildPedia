import { Outlet } from "react-router-dom";
import { AuthProvider } from "./store/AuthContext";
import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
