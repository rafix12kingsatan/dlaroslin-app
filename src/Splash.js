import React, { useEffect, useState } from "react";

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Splash znika po 2,5 sekundy (możesz zmienić czas)
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: "fixed",
      zIndex: 9999,
      left: 0, top: 0, width: "100vw", height: "100vh",
      background: "#fff",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
    }}>
      <img src="/logo.png" alt="Logo" style={{ width: 160, marginBottom: 20 }} />
      <h1 style={{
        margin: 0,
        fontSize: 24,
        fontFamily: "'Poppins', sans-serif",
        fontWeight: 700,
        color: "#0072CE"
      }}>dlaroslin.pl</h1>
      <div style={{
        width: 150, height: 6, background: "#DDDDDD", borderRadius: 5, margin: "30px 0"
      }}>
        <div style={{
          width: "100%", height: "100%",
          background: "#6BC239",
          animation: "loading-bar 2.2s linear"
        }} />
      </div>
      <div style={{
        fontSize: 16, color: "#0072CE", marginBottom: 30, lineHeight: 1.4, textAlign: "center"
      }}>
        Zamów łatwo tutaj.<br />Dostarczymy skutecznie.
      </div>
      <div style={{
        color: "#0072CE", fontSize: 14, position: "absolute", bottom: 25
      }}>dlaroslin.pl</div>
      <style>
        {`
          @keyframes loading-bar {
            from { width: 0% }
            to { width: 100% }
          }
        `}
      </style>
    </div>
  );
};

export default SplashScreen;
