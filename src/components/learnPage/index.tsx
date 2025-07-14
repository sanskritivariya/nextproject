'use client';
import React, { useEffect } from 'react';

const LearnMainPage = () => {
  useEffect(() => {
    const handleMessage = (event: { data: { type: string; path: any; }; }) => {
      console.log("📨 Message received from iframe:", event.data);

      if (event.data?.type === "iframeDialogOpen") {
        console.log("✅ iframeDialogOpen received. Path:", event.data.path);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className="side-bar">
          <p>Learn</p>
          <ul>
            <li>Introduction</li>
            <li>Getting Started</li>
            <li>Advanced Topics changes</li>
          </ul>
        </div>

        <div className="right-section">
          <div className="header">Header Title</div>

          <div className="content">
            <h1>Parent Window</h1>
            <iframe
              id="react-frame"
              src="http://localhost:3000/rms"
              width="800"
              height="600"
              title="React Iframe"
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};

export default LearnMainPage;
