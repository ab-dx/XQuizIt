//Client side javascript
console.log("Client side JS running!");
let profile;
let name;
let img_url;
let email;
let role;
let level = "Easy"; // SEND AND GET FROM DB

//gapi.load('auth2', function (){
 // gapi.auth2.init();
//});

//Google login: (Called when button clicked)
function onSignIn(googleUser) {
  profile = googleUser.getBasicProfile();
  console.log('Signing in...');
  //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  name = profile.getName();
  img_url = profile.getImageUrl();
  email = profile.getEmail();
  console.log('Name: ' + name);
  console.log('Image URL: ' + img_url);
  console.log('Email: ' + email); // This is null if the 'email' scope is not present.
  document.getElementById('msg').style = "display: none";
  document.getElementById('studentBtn').style = "display: visible";
  document.getElementById('teacherBtn').style = "display: visible";
  document.getElementById('signOutBtn').style = "display: visible";
  document.getElementById('sign-in-btn').style = "display: none";

}

function assignRoleTeacher(){
  role = 'Teacher';
  localStorage.setItem("userEmail", email);
  sendLoginData();
}

function assignRoleStudent(){
  role = 'Student';
  localStorage.setItem("userEmail", email);
  sendLoginData();
}


function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      document.getElementById('msg').style = "display: visible";
      document.getElementById('studentBtn').style = "display: none";
      document.getElementById('teacherBtn').style = "display: none";
      document.getElementById('signOutBtn').style = "display: none";
  document.getElementById('sign-in-btn').style = "display: visible";
    });
  }
let studentAvg = 50;

async function sendLoginData(){
  //Might have ot adjust profile, data to be sent
        const data = {name,img_url,email,role,level};
        const options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                        "Content-Type" : "application/json"
                }
        };
        const response = await fetch('/login-data', options);
        const info = await response.json();
        console.log(info);
        studentAvg = info.score;
        console.log("Student Avg: " + studentAvg)

}
function loadHome(){
  let info;
  let userEmail = localStorage.getItem("userEmail");
  
   async function getUserData(){
         const response = await fetch('/email/' + userEmail);
         info = await response.json();
         console.log(info);
        /* console.log("Response: " + info.msg);
         for(item in info){
                 console.log("Message: " + info[item].msg);
         }*/
             studentAvg = info.score;
            console.log("Student Avg: " + studentAvg)

      document.getElementById('usrName').textContent = info.username;
      document.getElementById('usrIcon').src = info.avatar;
      document.getElementById('usrRole').textContent = info.role;
       if(info.role === "Teacher"){
         document.getElementById('make-quiz').style = "display: visible";
         document.getElementById('previewQuiz').style = "display: visible";  
       }
     else{
       //Need student level
       let studentLevel;
       if(studentAvg > 0 && studentAvg <= 20){
         studentLevel = 1;
       }
       if(studentAvg > 20 && studentAvg <= 40){
         studentLevel = 2;
       }
       if(studentAvg > 40 && studentAvg <= 60){
         studentLevel = 3;
       }
       if(studentAvg > 60 && studentAvg <= 80){
         studentLevel = 4;
       }
       if(studentAvg > 80 && studentAvg <= 100){
         studentLevel = 5;
       }
       document.getElementById('studentArea').style = "display: visible";
       document.getElementById('avgScore').style = "display: visible";
       document.getElementById('avgScore').innerHTML = "Avg: " + studentAvg + "% <hr><div class='textLabel3'> You are a level " + studentLevel + " student!</div>";
     }
      //document.getElementById('usrEmail').textContent = info.id;

 }
  getUserData();
}


// SECTION 2: Quizzing
let questionSet = []; //Array of questions
let question = {};
let questionValue;
let questionCount = 0; //No.Of questions; Helps determine current question
let difficulty = "";
let answer;
let optionA;
let optionB;
let optionC;
let optionD;
let category;
function addQuestion(){
  //Add components again:
  //document.getElementById('make-quiz').innerHTML += " <br>      <textarea id=\"questionInput\"  rows=\"4\" columns=\"40\" > </textarea>      <br><div id=\"diffLabel\">Difficulty:</div><button id=\"easyBtn\">Easy</button><button id=\"mediumBtn\">Medium</button><button id=\"hardBtn\">Hard</button><button id=\"addBtn\" onclick=\"addQuestion()\">&nbsp;+&nbsp;</button><br>";
  //Ditched add components cuz couldn't scroll, making a new component to display questions
  questionValue = document.getElementById('questionInput').value;
  console.log("Question number " + questionCount + ": " + question.questionValue);
  category = document.getElementById('categoryInfo').value;
  console.log("Category: " + category);
  questionCount++;
  //Check for errors
  
      if(document.getElementById('oA').value === "" || document.getElementById('oB').value === "" 
          || document.getElementById('oC').value === "" || document.getElementById('oD').value === "" || document.getElementById('categoryInfo').value === ""
          || document.getElementById('questionInput').value === ""){
          alert("Please specify all of the inputs!");
      }
      else if( difficulty === ""){
        alert("Please select a difficulty!");
      }
  else if(document.getElementById('checkA').checked === false && document.getElementById('checkB').checked === false &&
        document.getElementById('checkC').checked === false && document.getElementById('checkD').checked === false){
      alert("Please select the correct answer!");
  }
    else{
      optionA = document.getElementById('oA').value;
      optionB = document.getElementById('oB').value;
      optionC = document.getElementById('oC').value;
      optionD = document.getElementById('oD').value;
      //Clear input fields
      document.getElementById('oA').value = "";
      document.getElementById('oB').value = "";
      document.getElementById('oC').value = "";
      document.getElementById('oD').value = "";  
      document.getElementById('categoryInfo').value = "";
      document.getElementById('checkA').checked = false;
      document.getElementById('checkB').checked = false;
      document.getElementById('checkC').checked = false;
      document.getElementById('checkD').checked = false;
      document.getElementById('questionInput').value = "";
      question = {questionValue, difficulty, questionCount, answer, optionA, optionB, optionC, optionD, category};
      document.getElementById('previewArea').innerHTML += "Q." + question.questionCount + "&nbsp; &nbsp; &nbsp; " + question.questionValue + "<br><br>";
      console.log(question);
      questionSet.push(question);
 }
}

//sendQuestionInfo();
function submitQuestions(){
  sendQuestionInfo();
}
function setDifficulty(value, num){
  //value: Easy/Medium/Hard
  //num: current question number, updates accordingly by addQuestion()
  difficulty = value;
  console.log('difficulty set to ' + difficulty);
}

function setAnswer(op){
  //Code for setting answer on teacher's end
  answer = op;
  console.log("Answer set to " + answer);
}

//Send question info
async function sendQuestionInfo(){
        //const msg = document.getElementById('inField').value;
  //Might have ot adjust profile, data to be sent

      //replace question with questionSet below
        //let quizCode = Math.floor(Math.random() * (100000 - 10000)) + 10000;
        let quizCode = Math.floor(Math.random() * (1000000 - 100000)) + 100000;
        let totalNoQuestions = questionCount;
        let data2 = {questionSet, quizCode, totalNoQuestions};
        const options = {
                method: 'POST',
                body: JSON.stringify(data2),
                headers: {
                        "Content-Type" : "application/json"
                }
        };
        const response = await fetch('/question-data', options);
        const info2 = await response.json();
        console.log(info2);
        console.log("Code: " + info2.code);
        alert("The code for your quiz is: " + info2.code);

}
//GET QUIZ STUDENT END

   async function getQuizInfo(inputQuizCode){
        let email = localStorage.getItem("userEmail");
     //add email
         const response = await fetch('/quizCode/' + inputQuizCode.toString() + '/' + email);
         console.log(inputQuizCode.toString());
         const info = await response.json();
         //console.log(info);
         return info;
        /* console.log("Response: " + info.msg);
         for(item in info){
                 console.log("Message: " + info[item].msg);
         }*/
   }
  let code;
  let quiz;
let num;
//studentAvg = 50; //FROM DB
let newAvg; //SEND TO DB (DONE)
let score = 0;
let isAnswerCorrect = false;
let practiceCategories = [];
let practiceString = "";
let improvement;
//let level = "Easy";
//let quizQuestions = new Array();
async function takeQuiz(){
  code = document.getElementById('enterQuizCode').value;
  quiz = await getQuizInfo(code);
  //quiz contains quiz.questionSet[]
  //console.log(quiz);
  document.getElementById('studentArea').style = "display: none";
  document.getElementById('studentQuizArea').style = "display: visible";
  num = quiz.totalNoQuestions;
  /*
    quizQuestions.size = num;
    for(let j = 0; j < num; ++j){
      //Sorting quizzes into levels
      //console.log(quiz.questionSet[j]);
      if(quiz.questionSet[j].difficulty === level){
         quizQuestions[j] = questionSet[j];
        console.log(quizQuestions);
        console.log("In loop");
      }else{
        console.log("Question not of right caliber");
      }
      console.log(quizQuestions);
    }
  console.log("Quiz questions:");
  console.log(quizQuestions);
  */
  for(let i = 0; i < num; ++i){
    document.getElementById('studentQuizArea').innerHTML += "<div class='textLabel3'> <div class='questionLabel'>Q." + (i + 1) + "&nbsp; &nbsp;&nbsp;" + quiz.questionSet[i].questionValue +
     "</div>" + "<br><div class='optionLabel'>&nbsp; &nbsp;&nbsp; &nbsp;A &nbsp;<input id='opA"+i+"' type='radio' name='radio"+i+"' onclick=\"checkAnswer('A',"+i+")\"/>&nbsp;"+ quiz.questionSet[i].optionA + "</div><br>" + 
     "<div class='optionLabel'>&nbsp; &nbsp;&nbsp; &nbsp;B &nbsp;<input id='opB"+i+"' type='radio' name='radio"+i+"' onclick=\"checkAnswer('B',"+i+")\"/>&nbsp;"+ quiz.questionSet[i].optionB + "</div><br>" +
     "<div class='optionLabel'>&nbsp; &nbsp;&nbsp; &nbsp;C &nbsp;<input id='opC"+i+"' type='radio' name='radio"+i+"' onclick=\"checkAnswer('C',"+i+")\"/>&nbsp;"+ quiz.questionSet[i].optionC + "</div><br>" + 
     "<div class='optionLabel'>&nbsp; &nbsp;&nbsp; &nbsp;D &nbsp;<input id='opD"+i+"' type='radio' name='radio"+i+"' onclick=\"checkAnswer('D',"+i+")\"/>&nbsp;"+ quiz.questionSet[i].optionD + "</div><br>" +"</div>";
  }
  document.getElementById('studentQuizArea').innerHTML +=  "<button id='submitAnswersBtn' onclick=\"submitAnswers()\">Submit Answers</button>";
}
function checkAnswer(option,num){
  console.log('Checking answer...');
  if(quiz.questionSet[num].answer === option){
   //console.log("Correct!!!");
    isAnswerCorrect = true;
  }
  else{
  //  console.log("Wrong...");
    isAnswerCorrect = false;
  }
  
}
function submitAnswers(){
    console.log("Submitting answers");
    for(let k = 0; k < num; ++k){
      //Check answers
      console.log("Iteration " + k);
      if(document.getElementById('opA'+k).checked === true){
        checkAnswer('A',k);
      }
      if(document.getElementById('opB'+k).checked === true){
      checkAnswer('B',k);
      }
      if(document.getElementById('opC'+k).checked === true){
      checkAnswer('C',k);
      }
      if(document.getElementById('opD'+k).checked === true){
      checkAnswer('D',k);
      }
      if(isAnswerCorrect === true){
        score++;
        console.log("Answer correct, score incremented to " + score);
        isAnswerCorrect = false; //Changin the value to default
      }
      else{
        isAnswerCorrect = false;
        practiceCategories.push(quiz.questionSet[k].category);
      }
    }
  //Algorithm to remove repeated elemnts from array practiceCategories;
  //a.ignoreCasee
  let y = 0;
  practiceCategories.forEach((a)=>{
    
    practiceCategories[y] =  a.toUpperCase();
    ++y;
    
  });
  
  function removeDuplicateData(data){
     return data.filter((value, index) => data.indexOf(value) === index);
  }
  
  practiceCategories = removeDuplicateData(practiceCategories);
  
  
  let count =0;
  
 
    for(let x = 0; x < practiceCategories.length; ++x){
      console.log("Practice");
      console.log("Categories to practice: " + practiceCategories[x]);
      practiceString += "<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + practiceCategories[x];
    }
  console.log("Topics to practice: " + practiceString);
  //Send info to server
  //Render report card
  //console.log(parseint())
  let percentage = parseInt((score/num) * 100);
  improvement = parseInt(percentage - studentAvg);
  if(improvement >= 0){
  if(percentage === 100){
    document.getElementById('studentQuizArea').innerHTML = "Report <br> &nbsp;&nbsp;&nbsp;<div class='questionLabel'>Score: &nbsp;&nbsp;" + score + "/" + num + 
      "<br> Percentage: "+ percentage + "% <br>Improved by: " + improvement + "%" + "<br>Well Done!"+"</div";
  }
  else{
      document.getElementById('studentQuizArea').innerHTML = "Report <br> &nbsp;&nbsp;&nbsp;<div class='questionLabel'>Score: &nbsp;&nbsp;" + score + "/" + num + 
      "<br> Percentage: "+ percentage + "% <br>Topics to practice: &nbsp;&nbsp; " + practiceString + "<br>Improved by: " + improvement + "%" + "</div";
    }
  }
  else{ //Didn't improve, worsened
    if(percentage === 100){
    document.getElementById('studentQuizArea').innerHTML = "Report <br> &nbsp;&nbsp;&nbsp;<div class='questionLabel'>Score: &nbsp;&nbsp;" + score + "/" + num + 
      "<br> Percentage: "+ percentage + "% <br>Dropped by: " + (improvement * (-1)) + "%" + "<br>Well Done!"+"</div";
  }
  else{
      document.getElementById('studentQuizArea').innerHTML = "Report <br> &nbsp;&nbsp;&nbsp;<div class='questionLabel'>Score: &nbsp;&nbsp;" + score + "/" + num + 
      "<br> Percentage: "+ percentage + "% <br>Topics to practice: &nbsp;&nbsp; " + practiceString + "<br>Dropped by: " + (improvement * (-1)) + "%" + "</div";
    }
  }
  newAvg = parseInt((percentage + studentAvg) / 2);
    console.log("The student average was :" + studentAvg);
      console.log("The student average is :" + newAvg);

  submitQuizToDB();
  }

async function submitQuizToDB(){
      if(newAvg > 0 && newAvg <= 40){
        level = "Easy";
      }
      if(newAvg > 40 && newAvg <= 75){
        level = "Medium";
      }
      if(newAvg > 75 && newAvg <= 100){
        level = "Hard";
      }
    let userEmail = localStorage.getItem("userEmail");

        let data2 = {newAvg,level,userEmail};
        const options = {
                method: 'POST',
                body: JSON.stringify(data2),
                headers: {
                        "Content-Type" : "application/json"
                }
        };
        const response = await fetch('/finished-quiz', options);
        const info2 = await response.json();
        console.log("From server below");
        console.log(info2);
       

}