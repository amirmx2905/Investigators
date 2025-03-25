import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
