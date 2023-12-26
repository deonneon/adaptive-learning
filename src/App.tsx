import React, { useState } from 'react';
import './App.css'; // Make sure to import the CSS file

interface KeyPoint {
  id: number;
  content: string;
  simplifiedContent?: string;
  rewordedContent?: string;
}

function App() {
  const [topic, setTopic] = useState('');
  const [keyPoints, setKeyPoints] = useState<KeyPoint[]>([]);
  const [currentPoint, setCurrentPoint] = useState<KeyPoint | null>(null);

  const handleTopicSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3001/test', {
        //const response = await fetch('http://localhost:3001/getKeyPoints', {
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

      // Check if there are keypoints and set the first one as the current point
      if (data.keyPoints && data.keyPoints.length > 0) {
        setCurrentPoint(data.keyPoints[0]);
      } else {
        setCurrentPoint(null); // Reset to null if there are no keypoints
      }
    } catch (error) {
      console.error('There was an error fetching the key points:', error);
    }
  };

  const handleSimplifyText = async () => {
    if (!currentPoint) return;

    try {
      const response = await fetch('http://localhost:3001/simplifyText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: currentPoint.content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCurrentPoint({ ...currentPoint, simplifiedContent: data.simplifiedText });
    } catch (error) {
      console.error('There was an error simplifying the text:', error);
    }
  };

  const handleRewordText = async () => {
    if (!currentPoint) return;

    try {
      const response = await fetch('http://localhost:3001/rewordText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: currentPoint.content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCurrentPoint({ ...currentPoint, rewordedContent: data.rewordText });
    } catch (error) {
      console.error('There was an error rewording the text:', error);
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
        handleSimplifyText();
        break;

      case 'kindOfUnderstand':
        handleRewordText();
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
          placeholder='Topic to learn?'
        />
        <button onClick={handleTopicSubmit} className="submit-button">
          Learn
        </button>
        <div className="keypoints keypoints-container">
          {keyPoints.map((point) => (
            <div
              key={point.id}
              onClick={() => selectKeyPoint(point.id)}
              className={`keypoint ${currentPoint && point.id === currentPoint.id ? 'current' : ''}`}
            >
              {point.id}
            </div>
          ))}
        </div>
      </div>

      <div className="main-content">
        {currentPoint && (
          <div>
            <div className="keypoint current-point original-content">
              {currentPoint.content}
            </div>
            {currentPoint.simplifiedContent && (
              <div className="keypoint current-point">
                {currentPoint.simplifiedContent}
                <h3>Simplified</h3>
              </div>
            )}
            {currentPoint.rewordedContent && (
              <div className="keypoint current-point">
                {currentPoint.rewordedContent}  
                <h3>Reworded</h3>
              </div>
            )}
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
