$(document).ready(function() {
    var firebaseConfig = {
      apiKey: "AIzaSyBQsf3G2IkFi4MeOtDEyMv7mEHAGz37MY4",
      authDomain: "rock-paper-scissors-with-chat.firebaseapp.com",
      databaseURL: "https://rock-paper-scissors-with-chat.firebaseio.com",
      projectId: "rock-paper-scissors-with-chat",
      storageBucket: "",
      messagingSenderId: "960996149541",
      appId: "1:960996149541:web:ecfc2e8970aa293b6bf2cc"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();
    var playerNum = "0";
    var inGame = false;
    var p1Choice = "0";
    var p2Choice = "0";
    var joinBtn = $("<button>")
      .attr("class", "join")
      .text("Join Game");
      var nameBox = $("<input>").attr({
        type: "text",
        id: "nameInput",
        class: "form-control",
        placeholder: "enter a username"
      }),
      chatBox = $("<ul>").attr({
        id: "messages",
        class: "chat-messages"
      }),
      msgBox = $("<input>").attr({
        type: "text",
        id: "messageInput",
        class: "form-control",
        placeholder: "type a message ... press [ENTER] to send"
      }),
      usersOnline = $("<div>")
        .attr("class", "online-users")
        .text("Online users: "),
      spanIcon = $("<span>").attr({
        class: "glyphicon glyphicon-user",
        id: "online-users"
      });
  
    nameBox.appendTo(".username"),
      chatBox.appendTo(".msg-box"),
      msgBox.appendTo(".msg-input"),
      usersOnline.appendTo(".users-list"),
      spanIcon.appendTo(usersOnline);
  
    var messageField = $("#messageInput"),
      nameField = $("#nameInput"),
      messageList = $("#messages"),
      onlineList = $("#online-users");
      var playersRef = database.ref("/players");
      var player1Ref = database.ref("/players/player1");
      var player2Ref = database.ref("/players/player2");
      var readyRef = database.ref("/players/ready");
      var chatRef = database.ref("/chat");
      database.ref().on("value",function(snapshot){
        

      })
      
      function joinGame() {
        joinBtn.appendTo(".users-list");
        joinBtn.on("click", function() {
          var playerName = nameField.val();
          inGame = true;
          joinBtn.detach();
          player1Ref.once("value").then(function(ss) {
            if (ss.child("name").val() === null) {
              player1Ref.set({
                name: playerName,
                inGame: inGame,
                choice: "0"
              });
              playerNum = "1";
              player1Ref.onDisconnect().remove();
            } else {
              player2Ref.set({
                name: playerName,
                inGame: inGame,
                choice: "0"
              });
              playerNum = "2";
              player2Ref.onDisconnect().remove();
            }
            
            console.log("Player: " + playerNum);
            console.log("Joined!");
          });
        });
      }
      function checkPlayerChoice() {
        playersRef.on("value", function(snaps) {
          var data = snaps.val();
          p1Choice = data.player1.choice;
          p2Choice = data.player2.choice;
          console.log(p1Choice);
          console.log(p2Choice);
          switch (p1Choice + p2Choice) {
            case "00":
              {
                console.log("No one picked yet");
              }
              break;
            //P1 Picked & P2 Didnt
            case "r0":
            case "p0":
            case "s0":
              {
                console.log("P1 picked | P2 didnt");
              }
              break;
            //P2 Picked & P1 Didnt
            case "0r":
            case "0p":
            case "0s":
              {
                console.log("P1 didnt | P2 picked");
              }
              break;
            default: {
              readyCheck.set(true);
            }
          }
        });
      }
      function checkWinner() {
        switch (p1Choice + p2Choice) {
          //TIE
          case "rr":
          case "pp":
          case "ss":
            {
              console.log("TIE!");
            }
            break;
          //P1 Wins
          case "rs":
          case "pr":
          case "sp":
            {
              console.log("P1 WINS");
              if(playerNum === "1"){
                player1Ref.update({ choice: "0" });
                }else{
                player2Ref.update({ choice: "0" });
              }
          }
            break;
          //P2 Wins
          case "sr":
          case "rp":
          case "ps":
            {
              console.log("P2 WINS");
              if(playerNum === "1"){
                player1Ref.update({ choice: "0" });
                }else{
                player2Ref.update({ choice: "0" });
              }
              }
            break;
        }
      }
    