import Head from 'next/head';
import { useState } from 'react';
import { RxCopy } from 'react-icons/rx';

const Home = () => {
  const [userInput, setUserInput] = useState('');
  const [apiOutput, setApiOutput] = useState('')
  const [question, setQuestion] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  const style = { color: "white", fontSize: "1.5em" }

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
  const { result, question } = data;


  setApiOutput(`${result.text} 

  But now, it's your time to answer
  `);
  setIsGenerating(false);
  setQuestion(`${question.text}`)
}
const handleCopy=()=>{
  navigator.clipboard.writeText(question)
}

  const onUserChangedText = (event) => {
    setUserInput(event.target.value);
  };

  return (
    <div className="root">
      <Head>
        <title>GPT-3 Writer | Seth Godin AI helper</title>
      </Head>
      <div className="container">
        <div className="header">
          <div className="header-title">
            <h1>Ask Seth Godin</h1>
          </div>
          <div className="header-subtitle">
            <h2>Ask a marketing question and see what Seth will answer.</h2>
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
                <div>
                  {question ?
                  <div className='copy-button-wrapper'>
                  <input className='question' value={question}/>
                  <button className='copy-button' onClick={handleCopy}> <RxCopy style={style}/></button>
              </div>: <div></div> }
                
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
