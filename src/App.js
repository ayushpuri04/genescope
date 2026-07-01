import { useState } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import GeneCard from "./components/GeneCard";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Stats from "./components/Stats";
import "./App.css";

function App() {
  const [geneData, setGeneData] = useState(null);
  const [geneName, setGeneName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
  <div className="App">
      <Navbar />
<Home />
<Stats />
       <SearchBar
setGeneData={setGeneData}
setLoading={setLoading}
setError={setError}
setGeneName={setGeneName}
/>
{loading && (
  <div className="loader-container">
    <div className="loader"></div>
    <p>Searching...</p>
  </div>
)}
      {error && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffe5e5",
              color: "#d32f2f",
              padding: "15px 25px",
              borderRadius: "10px",
              fontSize: "22px",
              fontWeight: "bold",
              boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
            }}
          >
            ❌ {error}
          </div>
        </div>
      )}

      {geneData && <GeneCard
geneData={geneData}
geneName={geneName}
/>}
      <Footer />
    </div>
  );
}

export default App;
