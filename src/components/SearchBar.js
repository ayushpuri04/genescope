import { useState } from "react";
import "./SearchBar.css";

function SearchBar({
  setGeneData,
  setLoading,
  setError,
  setGeneName
}) {

    const [gene, setGene] = useState("");
    const [history, setHistory] = useState([]);

    const searchGene = async () => {

        try {

            setError("");
            setLoading(true);
            setGeneData(null);

            console.log("Searching...");

            const url =
                `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=${gene}[Gene]+AND+human[Organism]&retmode=json`;

            const response = await fetch(url);
            const data = await response.json();

            const geneId = data.esearchresult.idlist[0];

            if (!geneId) {
                setGeneData(null);
                setError("No Gene Found");
                setLoading(false);
                return;
            }

            const summaryUrl =
                `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=${geneId}&retmode=json`;

            const summaryResponse = await fetch(summaryUrl);
            const summaryData = await summaryResponse.json();

            setGeneData(summaryData.result[geneId]);
            setGeneName(gene);
            setHistory((prev) => {
    const updated = [gene, ...prev.filter(item => item !== gene)];
    return updated.slice(0, 5);
});

            setLoading(false);

        } catch (error) {

            console.log(error);

            setError("Network Error. Please try again.");

            setLoading(false);

            setGeneData(null);

        }
    };

    const quickSearch = async (geneName) => {

    setGene(geneName);

    try {

        setError("");
        setLoading(true);
        setGeneData(null);

        const url =
`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=${geneName}[Gene]+AND+human[Organism]&retmode=json`;

        const response = await fetch(url);
        const data = await response.json();

        const geneId = data.esearchresult.idlist[0];

        if (!geneId) {
            setError("No Gene Found");
            setLoading(false);
            return;
        }

        const summaryUrl =
`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=${geneId}&retmode=json`;

        const summaryResponse = await fetch(summaryUrl);
        const summaryData = await summaryResponse.json();

        setGeneData(summaryData.result[geneId]);
        setLoading(false);

    } catch {

        setError("Network Error");
        setLoading(false);

    }

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