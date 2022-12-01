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
      prompt: `${basePromptPrefix} ${req.body.userInput}`,
      temperature: 0.8,
      max_tokens: 150,
    });
    
    const basePromptOutput = baseCompletion.data.choices.pop();

    res.status(200).json({result: basePromptOutput });
  };
  
  export default generateAction; 