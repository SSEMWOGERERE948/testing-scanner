// import React, { useEffect } from "react";

// // ScanComponent
// const ScanComponent = () => {
//   useEffect(() => {
//     // In your React component, before including scanner.js
//     window.scannerjs_config = {
//       eager_init: true,
//       display_install_func: function (show) {
//         const installDialog = document.getElementById("install-dialog");
//         installDialog.style.display = show ? "block" : "none";
//       },
//       display_scan_ready_func: function () {
//         console.log("Scanner is ready to use.");
//         alert("Scanner is ready to use!");
//       },
//       scan_app_download_url: "http://cdn.asprise.com/scanapp/scan-setup.exe", // Link to download the scan app
//     };

//     // Load the scanner.js script dynamically
//     const script = document.createElement("script");
//     script.src = "//cdn.asprise.com/scannerjs/scanner.js";
//     script.type = "text/javascript";
//     script.async = true; // Load asynchronously
//     document.body.appendChild(script);

//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   const startScan = () => {
//     // Ensure scanner is defined after script is loaded
//     if (window.scanner) {
//       window.scanner.scan(displayImagesOnPage, {
//         output_settings: [{ type: "return-base64", format: "jpg" }],
//       });
//     } else {
//       console.error("Scanner is not initialized.");
//     }
//   };

//   const displayImagesOnPage = (successful, mesg, response) => {
//     if (!successful) {
//       console.error("Scan failed:", mesg);
//       return;
//     }
//     if (successful && response) {
//       const scannedImages = response.images;
//       scannedImages.forEach((image) => {
//         const img = document.createElement("img");
//         img.src = "data:image/jpg;base64," + image;
//         img.style.maxWidth = "100%"; // Ensure images fit in the container
//         img.style.margin = "10px"; // Add some margin for better visuals
//         document.body.appendChild(img);
//       });
//     }
//   };

//   return (
//     <div>
//       <h1>Scanner.js in React</h1>
//       <button onClick={startScan}>Start Scanning</button>
//       {/* Optional Installation Dialog */}
//       <div
//         id="install-dialog"
//         style={{
//           display: "none",
//           position: "fixed",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           backgroundColor: "white",
//           border: "1px solid black",
//           padding: "20px",
//           zIndex: 1000,
//         }}
//       >
//         <h2>Install Asprise Scanner App</h2>
//         <p>You need to install the Asprise Scanner app to proceed.</p>
//         <a
//           href="http://cdn.asprise.com/scanapp/scan-setup.exe"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Download Asprise Scanner App
//         </a>
//         <button
//           onClick={() => {
//             document.getElementById("install-dialog").style.display = "none";
//           }}
//         >
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ScanComponent;

import React, { useState } from "react";

function ScanDocument() {
  const [scanStatus, setScanStatus] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);

  const startScan = async () => {
    setScanStatus("Scanning...");

    try {
      const response = await fetch("http://localhost:8080/documents/start", {
        method: "POST",
      });

      const result = await response.text();
      setScanStatus(result);

      if (response.ok) {
        setDownloadUrl("http://localhost:8080/documents/document");
      }
    } catch (error) {
      setScanStatus("Error during scanning: " + error.message);
    }
  };

  return (
    <div>
      <h1>Document Scanner</h1>
      <button onClick={startScan}>Start Scan</button>
      <p>{scanStatus}</p>

      {downloadUrl && (
        <a href={downloadUrl} download="ScannedDocument.pdf">
          Download Scanned Document
        </a>
      )}
    </div>
  );
}

export default ScanDocument;
