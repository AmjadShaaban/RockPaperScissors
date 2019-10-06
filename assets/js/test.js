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
  var choiceBox = $("#c-box");
  function result() {
    choiceBox.detach();
    readyRef.set(false);
    $(".p1").css("border", "0px solid black");
    $(".p2").css("border", "0px solid black");

    anime({
      targets: [".p1", ".p2"],
      translateY: [{ value: 200, duration: 300 }],
      direction: "alternate",
      loop: 6,
      easing: "linear"
    });
  }

  function show() {
    $(".l").attr("src", "./assets/img/scis-l.png");
    $(".p1").css({
      border: "5px solid black",
      background: "lime"
    });
    $(".r").attr("src", "./assets/img/paper-r.png");
    $(".p2").css({
      border: "5px solid black",
      background: "red"
    });
    choiceBox.appendTo(".choices");
  }

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
          $(".p1-scoreboard").css("background", "orange");
          player1Ref.onDisconnect().remove();
          readyRef.onDisconnect().remove();
        } else {
          player2Ref.set({
            name: playerName,
            ready: false,
            picked: false,
            choice: "0"
          });
          playerNum = "2";
          $(".p2-scoreboard").css("background", "orange");
          player2Ref.onDisconnect().remove();
          readyRef.onDisconnect().remove();
        }
        console.log("Player: " + playerNum);
        console.log("Joined!");
        choice();
      });
    });
  }
  function choice() {
    playersRef.on("value", function(ss) {
      var data = ss.val();
      console.log(data);
      $(".choice").on("click", function() {
        console.log("NUMBER: " + playerNum);
        var selectedChoice = $(this).attr("id");
        console.log("Player(" + playerNum + ") picked: " + selectedChoice);
        if (playerNum === "1") {
          player1Ref.update({
            picked: true,
            choice: selectedChoice,
            ready: true
          });
          if (data.player2 === undefined) {
          } else if (data.player2.ready === true) {
            readyRef.set(true);
          } else {
            console.log("P2 !rdy");
          }
        } else {
          player2Ref.update({
            picked: true,
            choice: selectedChoice,
            ready: true
          });
          if (data.player1.ready === true) {
            readyRef.set(true);
          } else {
            console.log("P1 !rdy");
          }
        }
      });
    });
  }

  database.ref().on("value", function(snapshot) {
    var data = snapshot.val();
    console.log(data);
    joinGame();

    if (data.players === undefined) {
      console.log("DB UD");
    } else if (data.players.ready === null) {
      choice();
    } else if (data.players.ready) {
      player1Ref.update({ picked: false, ready: false });
      player2Ref.update({ picked: false, ready: false });
      data.players.ready = false;
      data.players.player1.ready = false;
      data.players.player2.ready = false;
      switch (data.players.player1.choice + data.players.player2.choice) {
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
      }

      player1Ref.update({ choice: "0" });
      player2Ref.update({ choice: "0" });
      result();
      setTimeout(show, 2300);
    }
  });
});
