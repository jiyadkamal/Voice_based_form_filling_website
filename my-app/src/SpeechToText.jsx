import React, { useEffect, useState, useRef } from "react";

const SpeechToText = ({ onEnd, onResult }) => {
  const [text, setText] = useState("Listening...");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);
  const isListening = useRef(false);

  useEffect(() => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      console.error("❌ SpeechRecognition is not supported.");
      return;
    }

    // Prevent multiple instances
    if (recognitionRef.current) return;

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognitionRef.current = recognition;

    recognition.lang = "en-US";
    recognition.continuous = false; // Stop after one result
    recognition.interimResults = false;

    recognition.onstart = () => {
      console.log("🎤 Speech recognition started...");
      setText("Listening...");
      isListening.current = true;
    };

    recognition.onresult = (event) => {
      console.log("✅ Speech recognition event:", event.results);
      if (event.results.length > 0) {
        const transcript = event.results[0][0].transcript;
        console.log("✅ Final transcript:", transcript);
        setText(transcript);

        if (onResult) onResult(transcript);

        setTimeout(() => {
          if (onEnd) onEnd();
        }, 1000);
      } else {
        console.log("⚠️ No speech detected.");
        setText("No speech detected. Try again.");
      }
    };

    recognition.onerror = (event) => {
      console.error("❌ Speech Recognition Error:", event.error);
      setError(`Error: ${event.error}`);
      isListening.current = false;
    };

    recognition.onend = () => {
      console.log("🔄 Speech recognition stopped");
      isListening.current = false;
      recognitionRef.current = null; // Reset reference only if recognition ended naturally
    };

    recognition.start();

    return () => {
      console.log("🛑 Cleaning up recognition...");
      if (recognitionRef.current && isListening.current) {
        recognitionRef.current.stop(); // Stop properly instead of aborting
        isListening.current = false;
      }
    };
  }, [onEnd, onResult]);

  return (
    <div>
      <p>🎤 {text}</p>
      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
    </div>
  );
};

export default SpeechToText;
