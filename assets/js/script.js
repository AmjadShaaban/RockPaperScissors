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
    .text("Join Game")
    .appendTo(".users-list");

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
  var player1Ref = database.ref("/players/player1");
  var player2Ref = database.ref("/players/player2");

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

  function checkPlayerChoice() {
    var playersRef = database.ref("/players");
    playersRef.on("value", function(snaps) {
      var data = snaps.val();
      p1Choice = data.player1.choice;
      p2Choice = data.player2.choice;
      console.log(p1Choice);
      console.log(p2Choice);
      switch (p1Choice + p2Choice) {
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
          }
          break;
        //P2 Wins
        case "sr":
        case "rp":
        case "ps":
          {
            console.log("P2 WINS");
          }
          break;
      }
    });
  }

  $(".choice").on("click", function() {
    console.log("NUMBER: " + playerNum);
    var selectedChoice = $(this).attr("id");
    console.log("Player(" + playerNum + ") picked: " + selectedChoice);
    switch (playerNum) {
      case "1":
        {
          player1Ref.update({ choice: selectedChoice });
        }
        break;
      case "2":
        {
          player2Ref.update({ choice: selectedChoice });
        }
        break;
    }
    checkPlayerChoice();
  });
  messageField.on("keypress", function(e) {
    if (e.keyCode === 13) {
      var username = nameField.val();
      var message = messageField.val();

      database.ref("/chat").push({ name: username, text: message });
      messageField.val("");
    }
  });
  database.ref("/chat").on("child_added", function(snapshot) {
    var data = snapshot.val();
    var username = data.name || "anonymous";
    var message = data.text;

    if (username && message) {
      var text = "says";
      var messageElement = $("<li>");
      var nameElement = $("<strong class='name'></strong>");
      nameElement.text(username.concat(" " + text + " "));
      messageElement.text(message).prepend(nameElement);

      messageList.append(messageElement);

      messageList[0].scrollTop = messageList[0].scrollHeight;
    }
  });
  var listRef = database.ref("/presence");
  var userRef = listRef.push();

  var presenceRef = database.ref("/.info/connected");
  presenceRef.on("value", function(snap) {
    if (snap.val()) {
      userRef.set(true);
      userRef.onDisconnect().remove();
    }
  });

  listRef.on("value", function(snap) {
    onlineList.text("[" + snap.numChildren() + "].");
  });
});
// {
//   if (inGame) {
//     database.ref("/players/player" + playerNum).set({
//       name: null,
//       inGame: false
//     });
//   }
// }
