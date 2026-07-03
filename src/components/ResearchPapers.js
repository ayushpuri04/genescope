import { useEffect, useState } from "react";
import "./ResearchPapers.css";

function ResearchPapers({ geneName }) {
  const [worldwidePapers, setWorldwidePapers] = useState([]);
  const [indianPapers, setIndianPapers] = useState([]);
  const [loadingWorldwide, setLoadingWorldwide] = useState(false);
  const [loadingIndian, setLoadingIndian] = useState(false);
  const [errorWorldwide, setErrorWorldwide] = useState(false);
  const [errorIndian, setErrorIndian] = useState(false);

  useEffect(() => {
    if (!geneName) {
      setWorldwidePapers([]);
      setIndianPapers([]);
      setLoadingWorldwide(false);
      setLoadingIndian(false);
      setErrorWorldwide(false);
      setErrorIndian(false);
      return;
    }

    const fetchSection = async (query, setPapers, setLoading, setError) => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(
            query
          )}&format=json&pageSize=5`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setPapers(data?.resultList?.result || []);
      } catch (error) {
        setPapers([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchSection(geneName, setWorldwidePapers, setLoadingWorldwide, setErrorWorldwide);
    fetchSection(
      `${geneName} AND AFF:"India"`,
      setIndianPapers,
      setLoadingIndian,
      setErrorIndian
    );
  }, [geneName]);

  const renderPaperCard = (paper, index) => (
    <div
      key={`${paper.pmid || paper.doi || index}`}
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: "10px",
        padding: "15px",
        marginBottom: "15px",
        backgroundColor: "#fff",
      }}
    >
      <h4 style={{ marginTop: 0, marginBottom: "8px" }}>{paper.title || "Untitled"}</h4>

      <p style={{ margin: "4px 0" }}>
        <strong>Authors:</strong> {paper.authorString || "Not available"}
      </p>

      <p style={{ margin: "4px 0" }}>
        <strong>Journal:</strong> {paper.journalTitle || "Unknown"}
      </p>

      <p style={{ margin: "4px 0" }}>
        <strong>Year:</strong> {paper.pubYear || "Unknown"}
      </p>

      {paper.doi ? (
        <p style={{ margin: "4px 0" }}>
          <strong>DOI:</strong> {paper.doi}
        </p>
      ) : null}

      {paper.pmid ? (
        <a
          href={`https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "inline-block", marginTop: "10px" }}
        >
          Read on PubMed
        </a>
      ) : null}
    </div>
  );

  return (
    <div className="gene-card">
      <h2>📚 Latest Research Papers</h2>

      <div style={{ marginTop: "1.5rem" }}>
        <h3>🌍 Latest Worldwide Research</h3>

        {loadingWorldwide && <p>Loading Worldwide Research...</p>}

        {!loadingWorldwide && errorWorldwide && (
          <p>Unable to fetch research papers.</p>
        )}

        {!loadingWorldwide && !errorWorldwide && worldwidePapers.length === 0 && (
          <p>No Worldwide Papers Found</p>
        )}

        {!loadingWorldwide && !errorWorldwide && worldwidePapers.length > 0 && (
          <div>{worldwidePapers.map((paper, index) => renderPaperCard(paper, index))}</div>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h3>🇮🇳 Latest Indian Research</h3>

        {loadingIndian && <p>Loading Indian Research...</p>}

        {!loadingIndian && errorIndian && (
          <p>Unable to fetch research papers.</p>
        )}

        {!loadingIndian && !errorIndian && indianPapers.length === 0 && (
          <p>No Indian Papers Found</p>
        )}

        {!loadingIndian && !errorIndian && indianPapers.length > 0 && (
          <div>{indianPapers.map((paper, index) => renderPaperCard(paper, index))}</div>
        )}
      </div>
    </div>
  );
}

export default ResearchPapers;