// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const db = require('quick.db');

// our default array of dreams


// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json({limit: '1mb'}));
//app.get("/home", (request, response) => {
//  response.sendFile(__dirname + "/public/home.html");
//});
app.post('/login-data', (request,response) => {      
        const data = request.body;            
        //console.log(data);                    
        //Insert into database here     
        //E.g: insert(data.name);
        //Code from here
        //level
          
          let email = data.email;
          //console.log(`user_${email}`);
          if(!db.get(`user_${email}`)){
            
            db.set(`user_${email}`, {score:0/*data.score*/, level: data.level , id: email, avatar: data.img_url, username: data.name , role: data.role});
          
          }
  
          //console.log(db.get(`user_${email}`));
          
  
  
        //Till here
        response.json({                       
                status: 'Data recieved' ,
                name: db.get(`user_${email}.name`),
                email: db.get(`user_${email}.email`),
                avatar: db.get(`user_${email}.avatar`),
                role: db.get(`user_${email}.role`),
                score: db.get(`user_${email}.score`)
          
        });
  
  //SOME AMAZING TEST CODE
  
       //Here, we take them to home.html
      // Access this data ^^
      /*app.get("/home", (request, response) => {
        response.sendFile(__dirname + "/public/home.html");
    });*/
  
 //AMAZING TEST CODE ENDS HERE
      
});             



app.get('/email/:email', (request,response) => {
  
  
  //console.log(`${request.params.email}`);
  if(db.has(`user_${request.params.email}`)){
    
    //console.log(db.get(`user_${request.params.email}`));
    response.send(db.get(`user_${request.params.email}`));
    
  }
  
  
});

//Question INFO
app.post('/question-data', (request,response) => {
  
  const data = request.body;
  //questionSet is an array with each question as an index
  console.log(data);
 // data.questionSet.code = Math.random() * 100000
     
  
  db.set(`quiz_${data.quizCode}`, data);
  
  response.json({                       
                status: 'Data recieved',
                info: data,
                code: data.quizCode
        });

});
//End of question INFO

//Search for QUIZ
//TO DO : UPDATE THIS METHOD FOR DIFFICULTY
//quizCode/:quizCode/:email
//quizCode/984739874/Easy
app.get('/quizCode/:quizCode/:email', (request,response) => {
  
  console.log('TEST!!');
  console.log(request.params);  
  // needs totalNoQuestions
  let userLevel = db.get(`user_${request.params.email}.level`); // Corresponds to difficulty
  //let objectToBeReturned = {questionSet,totalNoQuestions};
  let questionSetdb = db.get(`quiz_${request.params.quizCode}.questionSet`);
  
  let questionSet = [];
  
  questionSetdb.forEach((question)=>{
    
    if(question.difficulty === userLevel){
      
      questionSet.push(question);
      
    }
    
  });
  let totalNoQuestions = questionSet.length;
  //request.params.questionSet[i].difficulty === request.params.level
//DIS
  
  response.send({questionSet, totalNoQuestions});
  
  //console.log(db);
});


app.post('/finished-quiz', (request,response) => {
  //data.userEmail
  const data = request.body;
  console.log(data);
  // data = level,newAvg(score)
  db.set(`user_${data.userEmail}.score`, data.newAvg);
  db.set(`user_${data.userEmail}.level`, data.level);
  
  response.json({                       
                status: 'Data recieved',
                info: data
        });

});
//End of question INFO

//Search for QUIZ
//TO DO : UPDATE THIS METHOD FOR DIFFICULTY
app.get('/quizCode/:quizCode', (request,response) => {
  
  console.log('TEST!!');
  console.log(request.params);  
  //request.params.quizCode
  
  response.send(db.get(`quiz_${request.params.quizCode}`));
  
  //console.log(db);
});



// https://expressjs.com/en/starter/basic-routing.html


// send the default array of dreams to the webpage


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

