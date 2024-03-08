import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import paper from './assets/img/paper.jpg';
import dragonRest from './assets/img/dragon-rest.png';
import dragonDead from './assets/img/dragon-dead.png';
import dragonFire from './assets/img/dragon-fire.png';
import font from './assets/fonts/BLKCHCRY.TTF';
//StAuth10244: I Henri Saing, 000132162 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

function App() {
  const [info, setInfo] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [logged, setLogged] = useState(false);
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [answered, setAnswered] = useState(false);
  const [leaders, setLeaders] = useState([]);
  const [correct, setCorrect] = useState(false);

  useEffect(fetchLeaderboard, []);

  const usernameChange = (event) =>{
    setUsername(event.target.value);
  }
  const passwordChange = (event) =>{
    setPassword(event.target.value);
  }
  const cChange = (event) =>{
    setC(event.target.value);
  }

  function signOut(){
    setError(true);
    setErrorMsg("Farewell, adventurer!");
    setLogged(false);
    setUser("");
  }

  function fetchTest(){
    fetch('http://localhost:3000/test')
    .then(res => res.json())
    .then((result) => {
      console.log(result.status);
      setInfo(result.status);
    });
  }

  function fetchQuest(){
    setC("");
    fetch('http://localhost:3000/question')
    .then(res => res.json())
    .then((result) => {
      console.log(result);
      if(result.status == 'success'){
        setA(result.a);
        setB(result.b);
        setAnswered(false);
        setError(false);
      }
    });
  }

  function fetchLeaderboard(){
    fetch('http://localhost:3000/leaders')
    .then(res => res.json())
    .then((result) => {
      console.log(result);
      setLeaders(result);
      console.log(leaders);
    });
    console.log(paper);
    // console.log(leaders);
  }

  function postAnswer(){
    setAnswered(true);
    fetch("http://localhost:3000/answer",{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        a: a,
        b: b,
        c: c,
        user: user,
      })})
      .then(res => res.json())
      .then((result) => {
        console.log("RESULT");
        console.log(result);
        if(result.status == "correct"){
          setError(true);
          setErrorMsg("Thous't answer is correct!");
          setCorrect(true);
        }else if(result.status == "incorrect"){
          setError(true);
          setErrorMsg("Thous't answer is folly.");
          setCorrect(false);
        }else{
          setError(true);
          setErrorMsg("ERROR");
        }
        fetchLeaderboard();
      });
  }

  function postLogin(){
    fetch("http://localhost:3000/login",{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })})
      .then(res => res.json())
      .then((result) => {
        console.log("RESULT");
        console.log(result);
        if(result.status == "failure"){
          setError(true);
          setErrorMsg("Thous't aren't recognized!(Invalid username/password)");
        }else if(result.status == "success"){
          setError(false);
          setErrorMsg("");
          setLogged(true);
          setUser(result.user);
          fetchQuest();
        }
      });
  }

  function postSignup(){
    fetch("http://localhost:3000/signup",{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password,
      })})
      .then(res => res.json())
      .then((result) => {
        console.log(result);
        if(result.status == "success"){
          setError(false);
          setErrorMsg("");
          setLogged(true);
          setUser(result.user);
          fetchQuest();
        }else{
          setError(true);
          setErrorMsg(result.status);
        }
      });
  }

  return (
    <View style={styles.container}>
      {logged &&
        <div>
          <h3 style={styles.center}>Welcome {user}!</h3>
          {answered == false &&
            <img src={dragonRest} />
          }
          {answered && correct &&
            <img src={dragonDead} />
          }
          {answered && correct == false &&
            <img src={dragonFire} />
          }
        </div>
      }
      {error &&
        <h3>{errorMsg}</h3>
      }
      {logged == false &&
        <div className="auth" style={styles.auth}>
          <p style={styles.big}>Begin your adventure, young Mathmagician...{info}</p><br/>
          <label>They call me </label><br/><input type="text" style={styles.subtleInput} onChange={usernameChange} placeholder=" Username" /><br/>
          <label>This is proof of my identity </label><br/>
          <input type="password" style={styles.subtleInput}  onChange={passwordChange} placeholder=" Password" />
          <br/> <br/>
          <button style={styles.waxSeal} onClick={postSignup} >Start my adventure</button>
          <button style={styles.waxSeal} onClick={postLogin} >Continue my adventure</button>
        </div>
      }
      {logged &&
        <div className="quest">
          <p>Thy dragon asks, "what is {a} + {b}?"</p>
          <label>You respond, </label><input type="number" onChange={cChange} placeholder='Thy answer' value={c}/>
          {answered == false && <button style={styles.BnW} onClick={postAnswer}>Answer.</button>}
          {answered && <button style={styles.BnW} onClick={fetchQuest}>New Quest.</button>}
          <br/><br/>
          <button style={styles.BnW} onClick={signOut}>Leave Adventure</button>
        </div>
      }
      
      <ol>
        
      </ol>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Adventurer</th>
            <th>Quests Completed</th>
            </tr>
        </thead>
        <tbody>
          {leaders.map((person, id) =>
            <tr key={id}>
              <td>{id+1}</td>
              <td>{person.username}</td>
              <td style={styles.right}>{person.score}</td>
            </tr>
          )}
        </tbody>
      </table>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid black',
    width: '90%',
    height: '100%',
    backgroundImage: `url(${paper})`,
    backgroundSize: 'cover',
    textShadow: "1px 1px 0 white,-1px 1px 0 white,-1px -1px 0 white,1px -1px 0 white",
    color: "black",
    fontSize: "1.5em",
  },
  auth:{
    textAlign: 'center',
  },
  subtleInput:{
    outlineStyle: "none",
    borderBottomWidth: "2px",
    borderTopWidth: "0px",
    borderLeftWidth: "0px",
    borderRightWidth: "0px",
    borderColor: "black",
    backgroundColor: "rgba(250,250,250,0.0)",
    textShadow: "1px 1px 0 #000,-1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000",
    color: "green",
    fontSize: "1.5em",
    textAlign: "center",
  },
  center: {
    textAlign: "center",
  },
  big:{
    fontSize: "2em",
    fontWeight: "bold",
  },
  right: {
    textAlign: "right",
  },
  waxSeal:{
    border: "4px solid rgb(100, 50, 50)",
    backgroundColor: "rgb(200, 100, 100)",
    margin: "4px",
    padding: "10px",
    borderRadius: "50px",
    color: "rgb(50, 20, 20)",
  },
  BnW:{
    backgroundColor: "black",
    color: "white",
    border: "2px solid black"
  }
});


export default App;