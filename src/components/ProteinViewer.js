import { useEffect, useRef, useState } from "react";

function ProteinViewer({ geneName }) {
  const viewerRef = useRef(null);
  const viewerInstanceRef = useRef(null);
  const [status, setStatus] = useState({ loading: false, error: "" });

  useEffect(() => {
    const clearViewer = () => {
      if (viewerRef.current) {
        viewerRef.current.innerHTML = "";
      }
    };

    const fetchAccession = async () => {
      if (!geneName) return null;

      const query = `gene_exact:${geneName} AND organism_id:9606`;
      const url = `https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(
        query
      )}&fields=accession&format=json&size=1`;

      try {
        const response = await fetch(url);
        if (!response.ok) return null;
        const data = await response.json();
        return data?.results?.[0]?.primaryAccession || null;
      } catch (error) {
        console.warn("UniProt lookup failed", error);
        return null;
      }
    };

    const initViewer = async () => {
      setStatus({ loading: true, error: "" });

      if (viewerInstanceRef.current?.dispose) {
        viewerInstanceRef.current.dispose();
        viewerInstanceRef.current = null;
      }

      clearViewer();

      if (!geneName) {
        setStatus({ loading: false, error: "No Protein Structure Available" });
        return;
      }

      const accession = await fetchAccession();
      if (!accession) {
        setStatus({ loading: false, error: "No Protein Structure Available" });
        return;
      }

      if (!window.molstar?.Viewer) {
        setStatus({ loading: false, error: "No Protein Structure Available" });
        return;
      }

      try {
        viewerInstanceRef.current = await window.molstar.Viewer.create(viewerRef.current, {
          layoutIsExpanded: false,
          layoutShowControls: false,
          layoutShowToolbar: false,
          layoutShowSequence: false,
          layoutShowLog: false,
          layoutShowLeftPanel: false,
          layoutShowRightPanel: false,
          viewportShowExpand: false,
          viewportShowFullscreen: false,
          collapseLeftPanel: true,
          collapseRightPanel: true,
        });

        await viewerInstanceRef.current.loadAlphaFoldDb(accession);

        const container = viewerRef.current;
        if (container) {
          const buttons = container.querySelectorAll("button");
          buttons.forEach((button) => {
            const label = (button.title || button.getAttribute("aria-label") || "").toLowerCase();
            if (label.includes("full") || label.includes("fullscreen")) {
              button.style.display = "none";
            }
          });
        }

        setStatus({ loading: false, error: "" });
      } catch (error) {
        console.error("Mol* loadAlphaFold failed", error);
        setStatus({ loading: false, error: "No Protein Structure Available" });
      }
    };

    initViewer();

    return () => {
      if (viewerInstanceRef.current?.dispose) {
        viewerInstanceRef.current.dispose();
        viewerInstanceRef.current = null;
      }
    };
  }, [geneName]);

  return (
    <div
      style={{
        width: "100%",
        marginTop: "30px",
        background: "#fff",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 0 15px rgba(0,0,0,.15)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        🧬 Protein Structure Viewer
      </h2>

      {status.loading && (
        <h3
          style={{
            textAlign: "center",
          }}
        >
          Loading Protein...
        </h3>
      )}

      {!status.loading && status.error && (
        <h3
          style={{
            textAlign: "center",
            color: "red",
          }}
        >
          {status.error}
        </h3>
      )}

      <div
  ref={viewerRef}
  style={{
    width: "100%",
maxWidth: "900px",
margin: "0 auto",
    height: "500px",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    overflow: "hidden",
    position: "relative"
  }}
/>
    </div>
  );
}

export default ProteinViewer;
