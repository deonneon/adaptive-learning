import React, { useState } from 'react';
import './App.css'; // Make sure to import the CSS file

interface KeyPoint {
  id: number;
  content: string;
}

function App() {
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState<KeyPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState<KeyPoint | null>(null);

  const handleTopicSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/getKeyPoints', { // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      setKeyPoints(data.keyPoints);
    } catch (error) {
      console.error('There was an error fetching the key points:', error);
    }
  };

  const selectKeyPoint = (pointId: number) => {
    const point = keyPoints.find(p => p.id === pointId) || null; // Fallback to null if not found
    setCurrentPoint(point);
  };

  const handleComprehensionResponse = (response: string) => {
    if (!currentPoint) return;

    switch (response) {
      case 'dontUnderstand':
        // Mock simplification of the current point
        setCurrentPoint({ ...currentPoint, content: currentPoint.content + " (Simplified Version)" });
        break;

      case 'kindOfUnderstand':
        // Mock alternative explanation
        setCurrentPoint({ ...currentPoint, content: currentPoint.content + " (Alternative Explanation)" });
        break;

      case 'understand':
        // Move to the next key point
        const currentIndex = keyPoints.findIndex((point) => point.id === currentPoint.id);
        const nextPoint = keyPoints[currentIndex + 1];
        if (nextPoint) {
          setCurrentPoint(nextPoint);
        } else {
          // Maybe show a completion message or reset
          alert("You have completed all key points!");
          setCurrentPoint(null);
        }
        break;

      default:
        console.log('Unknown response');
    }
  };

  return (
    <div className="App">
      <div className="sidebar">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="topic-input"
        />
        <button onClick={handleTopicSubmit} className="submit-button">
          Learn
        </button>
        <div className="keypoints">
          {keyPoints.map((point) => (
            <div
              key={point.id}
              onClick={() => selectKeyPoint(point.id)}
              className="keypoint"
            >
              {point.id} {/* Displaying the key (id) */}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        {currentPoint && (
          <div className="keypoint current-point">
            {currentPoint.content} {/* Displaying the value (content) */}
          </div>
        )}
        <div className="comprehension-buttons">
          <button
            onClick={() => handleComprehensionResponse('dontUnderstand')}
            className="response-button"
          >
            Don't Understand
          </button>
          <button
            onClick={() => handleComprehensionResponse('kindOfUnderstand')}
            className="response-button"
          >
            Kind of Understand
          </button>
          <button
            onClick={() => handleComprehensionResponse('understand')}
            className="response-button"
          >
            Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
