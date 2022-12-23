import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Answer the following question like you were Seth Godin from the website https://seths.blog/. Show some wisdom and passion in your answer. All answers must be written in first person plural. Always take a stand for the user and be user focus.
question:`;

const generateAction = async (req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)
  
    const baseCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${basePromptPrefix} ${req.body.userInput}`,
      temperature: 0.8,
      max_tokens: 150,
    });
    
    const basePromptOutput = baseCompletion.data.choices.pop();

    const secondPrompt = 
  `
  from the following content, ask 1 question to reflect or go deeper on the topic?

  question: ${req.body.userInput}

  answer: ${basePromptOutput.text}

  following questions:
  `
  
  // I call the OpenAI API a second time with Prompt #2
  const secondPromptCompletion = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${secondPrompt}`,
    // I set a higher temperature for this one. Up to you!
    temperature: 0.85,
		// I also increase max_tokens.
    max_tokens: 1250,
  });
  
  // Get the output
  const secondPromptOutput = secondPromptCompletion.data.choices.pop();


    res.status(200).json({result: basePromptOutput, question: secondPromptOutput });
  };
  
  export default generateAction; 