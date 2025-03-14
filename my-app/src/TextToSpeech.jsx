import React, { useEffect, useState } from "react";

const TextToSpeech = ({ text, onEnd }) => {
  const [hasSpoken, setHasSpoken] = useState(false); // Prevents multiple executions

  useEffect(() => {
    if (text && !hasSpoken) {
      setHasSpoken(true); // Ensures it runs only once per step

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        console.log("Speech finished:", text);
        if (onEnd) onEnd(); // Move to the next step
      };

      window.speechSynthesis.cancel(); // Clears any previous speech
      window.speechSynthesis.speak(utterance);
    }
  }, [text, hasSpoken, onEnd]); // Runs only when `text` updates

  return <p>🗣 Speaking: {text}</p>;
};

export default TextToSpeech;
