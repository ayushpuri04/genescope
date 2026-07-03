import { useState } from "react";
import "./SearchBar.css";

function SearchBar({
  setGeneData,
  setLoading,
  setError,
  setGeneName,
}) {
  const [gene, setGene] = useState("");
  const [history, setHistory] = useState([]);

  const fetchGene = async (geneQuery) => {
    try {
      setError("");
      setLoading(true);
      setGeneData(null);

      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=${geneQuery}[Gene]+AND+human[Organism]&retmode=json`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      const geneId = searchData.esearchresult.idlist[0];

      if (!geneId) {
        setError("No Gene Found");
        setLoading(false);
        return;
      }

      const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=${geneId}&retmode=json`;

      const summaryResponse = await fetch(summaryUrl);
      const summaryData = await summaryResponse.json();

      setGeneData(summaryData.result[geneId]);
      setGeneName(geneQuery);

      setHistory((prev) => {
        const updated = [
          geneQuery,
          ...prev.filter((item) => item !== geneQuery),
        ];
        return updated.slice(0, 5);
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Network Error. Please try again.");
      setGeneData(null);
      setLoading(false);
    }
  };

  const searchGene = () => {
    if (!gene.trim()) {
      setError("Please enter a gene name");
      return;
    }

    fetchGene(gene.trim());
  };

  const quickSearch = (geneName) => {
    setGene(geneName);
    fetchGene(geneName);
  };

  return (
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        placeholder="Search a Gene..."
        value={gene}
        onChange={(e) => setGene(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchGene();
          }
        }}
      />

      <button
        className="search-btn"
        onClick={searchGene}
      >
        Search
      </button>

      <div className="popular-searches">
        <h3>Popular Searches</h3>

        <div className="popular-buttons">
          <button onClick={() => quickSearch("BRCA1")}>BRCA1</button>
          <button onClick={() => quickSearch("TP53")}>TP53</button>
          <button onClick={() => quickSearch("EGFR")}>EGFR</button>
          <button onClick={() => quickSearch("APOE")}>APOE</button>
          <button onClick={() => quickSearch("CFTR")}>CFTR</button>
        </div>
      </div>

      {history.length > 0 && (
        <div className="search-history">
          <h3>Recent Searches</h3>

          <div className="popular-buttons">
            {history.map((item, index) => (
              <button
                key={index}
                onClick={() => quickSearch(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;