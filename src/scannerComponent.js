import React, { useEffect, useState } from 'react';
import Dynamsoft from 'dwt';

const ScannerComponent = () => {
  const [scannerInstance, setScannerInstance] = useState(null);
  const [scannedImage, setScannedImage] = useState(null);
  const [scanners, setScanners] = useState([]);

  useEffect(() => {
    Dynamsoft.DWT.RegisterEvent('OnWebTwainReady', () => {
      const scanner = Dynamsoft.DWT.GetWebTwain('dwtcontrolContainer');
      setScannerInstance(scanner);
      loadScanners(scanner);
    });

    Dynamsoft.DWT.Load();
  }, []);

  const loadScanners = (scanner) => {
    const sourceNames = scanner.GetSourceNames();
    setScanners(sourceNames);
  };

  const handleScannerSelection = (event) => {
    const selectedScanner = event.target.value;
    if (scannerInstance) {
      scannerInstance.SelectSourceByIndex(scanners.indexOf(selectedScanner));
    }
  };

  const handleScan = () => {
    if (scannerInstance) {
      scannerInstance.OpenSource();
      scannerInstance.AcquireImage({
        IfShowUI: false,
        OnPostTransfer: () => {
          const scannedImg = scannerInstance.GetImage(0);
          setScannedImage(scannedImg);
        },
        OnFailure: (errorCode, errorString) => {
          console.error('Scan failed:', errorString);
        }
      });
    }
  };

  const handleUpload = async () => {
    if (!scannedImage) {
      alert('No scanned image to upload');
      return;
    }
    const base64Image = scannedImage.GetBase64String();
    try {
      const response = await fetch('http://localhost:8080/documents/uploadScanned', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Failed to upload the scanned document:', error);
    }
  };

  return (
    <div>
      <h1>Scanner Interface</h1>
      <div id="dwtcontrolContainer"></div>
      {scanners.length > 0 && (
        <select onChange={handleScannerSelection}>
          {scanners.map((scanner, index) => (
            <option key={index} value={scanner}>
              {scanner}
            </option>
          ))}
        </select>
      )}
      <button onClick={handleScan}>Scan Document</button>
      {scannedImage && (
        <div>
          <img src={`data:image/png;base64,${scannedImage.GetBase64String()}`} alt="Scanned Document" />
          <button onClick={handleUpload}>Upload Scanned Document</button>
        </div>
      )}
    </div>
  );
};

export default ScannerComponent;
