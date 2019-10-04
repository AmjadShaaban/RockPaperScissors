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
  var ready = false;
  var picked = false;
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
  var readyCheck = database.ref("/players/ready");
  function joinGame() {
    joinBtn.appendTo(".users-list");
    joinBtn.on("click", function() {
      var playerName = nameField.val();
      joinBtn.detach();
      player1Ref.once("value").then(function(ss) {
        if (ss.child("name").val() === null) {
          player1Ref.set({
            name: playerName,
            ready: false,
            picked: false,
            choice: "0"
          });
          playerNum = "1";
          player1Ref.onDisconnect().remove();
        } else {
          player2Ref.set({
            name: playerName,
            ready: false,
            picked: false,
            choice: "0"
          });
          playerNum = "2";
          player2Ref.onDisconnect().remove();
        }
        if (playerNum === "1" && !picked) {
          $(".p1-scoreboard").css("background", "orange");
        } else if (playerNum === "2" && !picked) {
          $(".p2-scoreboard").css("background", "orange");
        }
        console.log("Player: " + playerNum);
        console.log("Joined!");
      });
    });
  }
  function checkPlayerChoice() {
    if (playerNum === 1) {
      playersRef.on("value", function(snaps) {
        var data = snaps.val();
        p1rdy = data.player1.ready;
        p2rdy = data.player2.ready;
        p1Choice = data.player1.choice;
        p2Choice = data.player2.choice;
        p1Picked = data.player1.picked;
        p2Picked = data.player2.picked;
        console.log("1r " + p1rdy);
        console.log("2r " + p2rdy);
        console.log("1c " + p1Choice);
        console.log("2c " + p2Choice);
        console.log("1p " + p1Picked);
        console.log("2p " + p2Picked);

        if (p1rdy.val() + p2rdy.val() === 2) {
          switch (p1Choice + p2Choice) {
            //TIE
            case "rr":
            case "pp":
            case "ss":
              {
                readyCheck.set(false);
                console.log("TIE!");
                player1Ref.update({ picked: false });
                player2Ref.update({ picked: false });
              }
              break;
            //P1 Wins
            case "rs":
            case "pr":
            case "sp":
              {
                readyCheck.set(false);
                console.log("P1 WINS");
                player1Ref.update({ picked: false });
                player2Ref.update({ picked: false });
              }
              break;
            //P2 Wins
            case "sr":
            case "rp":
            case "ps":
              {
                readyCheck.set(false);
                console.log("P2 WINS");
                player1Ref.update({ picked: false });
                player2Ref.update({ picked: false });
              }
              break;
          }
        } else if (p1Picked && !p2Picked) {
          readyCheck.set(false);
          console.log("P1 picked | P2 didnt");
        } else if (!p1Picked && p2Picked) {
          readyCheck.set(false);
          console.log("P1 didnt | P2 picked");
        } else {
          readyCheck.set(false);
          console.log("No one picked yet");
        }
      });
    } else if (playerNum === 2) {
      readyCheck.on("value", function(snaps) {
        p1Picked = data.player1.picked;
        p2Picked = data.player2.picked;
        if (readyCheck.val()) {
          if (winner === "Tie") {
            console.log("TIE!");
          } else if (winner === "P1") {
            console.log("P1 WINS");
          } else if (winner === "P2") {
            console.log("P2 WINS");
          }
        } else {
          if (p1Picked && !p2Picked) {
            console.log("P1 picked | P2 didnt");
          } else if (!p1Picked && p2Picked) {
            console.log("P1 didnt | P2 picked");
          } else {
            console.log("No one picked yet");
          }
        }
      });
    }
    // checkWinner();

    // switch (p1Choice + p2Choice) {
    //   case "00":
    //     {
    //
    //     }
    //     break;
    //   //P1 Picked & P2 Didnt
    //   case "r0":
    //   case "p0":
    //   case "s0":
    //     {
    //       console.log("P1 picked | P2 didnt");
    //     }
    //     break;
    //   //P2 Picked & P1 Didnt
    //   case "0r":
    //   case "0p":
    //   case "0s":
    //     {
    //       console.log("P1 didnt | P2 picked");
    //     }
    //     break;
    //   default: {
    //     readyCheck.set(true);
    //     checkWinner();
    //     break;
    //   }
    // }
  }
  // function checkWinner() {
  //   switch (p1Choice + p2Choice) {
  //     //TIE
  //     case "rr":
  //     case "pp":
  //     case "ss":
  //       {
  //         console.log("TIE!");
  //       }
  //       break;
  //     //P1 Wins
  //     case "rs":
  //     case "pr":
  //     case "sp":
  //       {
  //         console.log("P1 WINS");
  //         if (playerNum === "1") {
  //           player1Ref.update({ picked: false });
  //         } else {
  //           player2Ref.update({ picked: false });
  //         }
  //       }
  //       break;
  //     //P2 Wins
  //     case "sr":
  //     case "rp":
  //     case "ps":
  //       {
  //         console.log("P1 WINS");
  //         if (playerNum === "1") {
  //           player1Ref.update({ picked: false });
  //         } else {
  //           player2Ref.update({ picked: false });
  //         }
  //       }
  //       break;
  //   }
  //   readyCheck.set(false);
  //   checkPlayerChoice();
  // }
  // readyCheck.on("value", function() {
  //   if (v === true) {
  //     checkWinner();
  //   } else {
  //     checkPlayerChoice();
  //   }
  // });
  $(".choice").on("click", function() {
    console.log("NUMBER: " + playerNum);
    var selectedChoice = $(this).attr("id");
    console.log("Player(" + playerNum + ") picked: " + selectedChoice);
    if (playerNum === "1") {
      player1Ref.update({
        picked: true,
        choice: selectedChoice
      });
    } else {
      player2Ref.update({
        picked: true,
        choice: selectedChoice
      });
      readyCheck.set(true);
      readyCheck.onDisconnect().remove();
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
  joinGame();
});
// {
//   if (inGame) {
//     database.ref("/players/player" + playerNum).set({
//       name: null,
//       inGame: false
//     });
//   }
// }
