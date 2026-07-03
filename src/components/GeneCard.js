import { useState } from "react";
import "./GeneCard.css";

function GeneCard({ geneData }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="gene-card">
      <h2>{geneData.name}</h2>

      <p>
        <strong>Gene ID:</strong> {geneData.uid}{" "}
        <button
          className="copy-btn"
          onClick={() => {
            navigator.clipboard.writeText(geneData.uid);
            setCopied(true);

            setTimeout(() => {
              setCopied(false);
            }, 2000);
          }}
        >
          {copied ? "✅ Copied!" : "📋 Copy Gene ID"}
        </button>
      </p>

      <p>
        <strong>Description:</strong> {geneData.description}
      </p>

      <p>
        <strong>Chromosome:</strong> {geneData.chromosome}
      </p>

      <p>
        <strong>Map Location:</strong> {geneData.maplocation}
      </p>

      <p>
        <strong>Organism:</strong>{" "}
        {geneData.organism?.scientificname || "N/A"}
      </p>

      <p>
        <strong>Official Symbol:</strong>{" "}
        {geneData.nomenclaturesymbol || "N/A"}
      </p>

      <p>
        <strong>Official Name:</strong>{" "}
        {geneData.nomenclaturename || "N/A"}
      </p>

      <p>
        <strong>Other Aliases:</strong>{" "}
        {geneData.otheraliases || "No aliases available"}
      </p>

      <p>
        <strong>Summary:</strong>
        <br />
        {geneData.summary
          ? geneData.summary.substring(0, 350) + "..."
          : "No summary available."}
      </p>

      <p>
        <strong>Gene Type:</strong>{" "}
        {geneData.genetype || "Protein Coding"}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        {geneData.status || "Active"}
      </p>

      <a
        href={`https://www.ncbi.nlm.nih.gov/gene/${geneData.uid}`}
        target="_blank"
        rel="noopener noreferrer"
        className="ncbi-btn"
      >
        🔗 Open in NCBI
      </a>
    </div>
  );
}

export default GeneCard;