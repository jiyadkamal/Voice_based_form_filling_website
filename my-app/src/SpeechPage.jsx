import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextToSpeech from "./TextToSpeech";
import SpeechToText from "./SpeechToText";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import "./SpeechPage.css";  // Add this import for styling

const SpeechPage = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]); // Store transcriptions
  const [isElaborating, setIsElaborating] = useState(false); // Track elaboration state
  const [elaboratedAnswer, setElaboratedAnswer] = useState(""); // Store elaborated answer
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSpeechResult = (text) => {
    setAnswers((prev) => [...prev, text]); // Append new response
  };

  const elaborateAnswer = async (thirdAnswer) => {
    try {
      const API_KEY = 'AIzaSyDVa_x2Yy43FgR6o9Whg8COJm947tQCPog';  // Replace with your actual API key

      const genAI = new GoogleGenerativeAI(API_KEY);

      const contents = [
        {
          role: 'user',
          parts: [{ text: `${thirdAnswer}, can you explain this and elaborate into a big paragraph` }]
        }
      ];

      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });

      const result = await model.generateContentStream({ contents });
      let elaboratedContent = '';
      for await (let response of result.stream) {
        elaboratedContent += response.text();
      }

      setElaboratedAnswer(elaboratedContent);
    } catch (error) {
      console.error("❌ Error generating elaboration:", error);
    } finally {
      setIsElaborating(false);
      setStep(8); // Move to final step after elaboration
    }
  };

  useEffect(() => {
    if (answers.length >= 3 && step === 6) {
      setIsElaborating(true);
      const thirdAnswer = answers[2]; // Get third answer
      elaborateAnswer(thirdAnswer);
    }
  }, [answers, step]);

  useEffect(() => {
    if (!isElaborating && elaboratedAnswer) {
      setAnswers((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[2] = elaboratedAnswer;
        return updatedAnswers;
      });
    }
  }, [isElaborating, elaboratedAnswer]);

  const saveToDatabase = async () => {
    try {
      const response = await fetch("http://localhost:8000/save-responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await response.json();
      console.log("✅ Saved to MongoDB:", data);

      navigate("/");
    } catch (error) {
      console.error("❌ Error saving data:", error);
    }
  };

  return (
    <div className="speech-page-container">
      <h2 className="form-title">Voice Form</h2>

      {step === 0 && (
        <div className="step-container">
          <button className="action-button" onClick={() => setStep(1)}>
            Start
          </button>
        </div>
      )}

      {step === 1 && <TextToSpeech text="What is your name?" onEnd={() => setStep(2)} />}
      {step === 2 && <SpeechToText onEnd={() => setStep(3)} onResult={handleSpeechResult} />}

      {step === 3 && <TextToSpeech text="What is your age?" onEnd={() => setStep(4)} />}
      {step === 4 && <SpeechToText onEnd={() => setStep(5)} onResult={handleSpeechResult} />}

      {step === 5 && <TextToSpeech text="What is your disease?" onEnd={() => setStep(6)} />}
      {step === 6 && <SpeechToText onEnd={() => setStep(7)} onResult={handleSpeechResult} />}

      {step === 7 && isElaborating && (
        <div className="loading-state">
          <p>Elaborating...</p>
        </div>
      )}

      {step === 8 && !isElaborating && (
        <div className="final-results">
          <p>✅ Form completed!</p>
          <h3>Responses:</h3>
          <ul>
            {answers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
          <button className="action-button" onClick={saveToDatabase}>
            Save Responses
          </button>
          <br />
          <button className="action-button" onClick={() => navigate("/")}>
            Go to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default SpeechPage;
