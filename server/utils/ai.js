const axios = require("axios");

const generateQuestions = async (role) => {

    const response = await axios.post(

        "https://openrouter.ai/api/v1/chat/completions",

        {
          model: "openrouter/free",

            messages: [
                {
                    role: "user",
                    content: `Generate 10 interview questions for ${role}.
                    Return only a json array.
                    example:
                    ["question1"
                    "question 2"]
                    Do not add markdown.
                    Do not add explaination`
                }
            ]
        },

        {
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            }
        }
    );

    const content= response.data.choices[0].message.content;
    return JSON.parse(content);
};

const evaluateAnswers=async(questions,answers)=>{
    const response= await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
            model:"openrouter/free",
            messages :[
                {
                    role:"user",
                    content:`
                    You are a strict technical interviewer.
                    evaluate these interview answers honestly.
                    Questions:
                    ${JSON.stringify(questions)},
                    answers:
                    ${JSON.stringify(answers)}
                    Give:
                    1. score out of 10
                    2. short feedback
                    return only JSON
                    
                    Rules:
                    1. If answers are weak, incomplete or "i dont know" ,"no idea" ,give very low score.
                    2. Be strict.
                    3.give realistic feedback no suger coating. 
                    4.Mention strengths and weaknessess briefly
                    
                    example:{
                    "score":8,
                    "feedback": "good knowledge but improve this concept"
                
                    }
                    note: the example given above is a example format how you will return answer do not copy paste this ..this is just an example .for every interview you have to evaluate the answers and give score and feedback by you own `
                }
            ]
        },
          {
            headers:{
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type":"application/json"
            }
          }

    );
    const content= response.data.choices[0].message.content;
    return JSON.parse(content);
}

module.exports = { 
    generateQuestions,
    evaluateAnswers

};