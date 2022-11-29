import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const basePromptPrefix = `Answer the following question like you were Seth Godin from the website https://seths.blog/. Show some wisdom and passion in your answer.
question:`;

const generateAction = async (req, res) => {
    console.log(`API: ${basePromptPrefix}${req.body.userInput}`)
  
    const baseCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${basePromptPrefix}${req.body.userInput}`,
      temperature: 0.8,
      max_tokens: 250,
    });
    
    const basePromptOutput = baseCompletion.data.choices.pop();
  
    // I build Prompt #2.
    const secondPrompt = 
    `
    Take the question and the answer below and generate 2-3 questions Seth Godin will ask the reader to challenge his thinking.
    question: ${req.body.userInput}
  
    answer: ${basePromptOutput.text}
  
    Questions to go further:
    `
    
    // I call the OpenAI API a second time with Prompt #2
    const secondPromptCompletion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `${secondPrompt}`,
      // I set a higher temperature for this one. Up to you!
      temperature: 0.75,
          // I also increase max_tokens.
      max_tokens: 500,
    });
    
    // Get the output
    const secondPromptOutput = secondPromptCompletion.data.choices.pop() ;
  
    // Send over the Prompt #2's output to our UI instead of Prompt #1's.
    res.status(200).json({ output: secondPromptOutput, result: basePromptOutput });
  };
  
  export default generateAction; 