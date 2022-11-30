import Head from 'next/head';
import { useState } from 'react';
import Image from 'next/image';
import buildspaceLogo from '../assets/buildspace-logo.png';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const callGenerateEndpoint = async () => {
  setIsGenerating(true);
  
  console.log("Calling OpenAI...")
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ userInput }),
  });

  const data = await response.json();
  const { output, result } = data;
  console.log("OpenAI replied...", output.text)

  setApiOutput(`${result.text} 

  Here are some question for you:

   ${output.text}`);
  setIsGenerating(false);
}

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | buildspace</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Ask Seth Godin</h1>
          </div>
          <div className="header-subtitle">
            <h2>Ask a marketing question and see what Seth will say.</h2>
          </div>
        </div>
        <div className="prompt-container">
          <textarea 
            placeholder="Hey Seth, what is good Marketing and bad Marketing?" 
            className="prompt-box"
            value={userInput}
            onChange={onUserChangedText} />
            <div className="prompt-buttons">
              <a
                className={isGenerating ? 'generate-button loading' : 'generate-button'}
                onClick={callGenerateEndpoint}
              >
                <div className="generate">
                {isGenerating ? <span className="loader"></span> : <p>Generate</p>}
                </div>
              </a>
            </div>
          {apiOutput && (
            <div className="output">
              <div className="output-header-container">
                <div className="output-header">
                  <h3>Seth AI answer</h3>
                </div>
              </div>
              <div className="output-content">
                <p>{apiOutput}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
