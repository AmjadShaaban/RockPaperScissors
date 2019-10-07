// $(document).ready(function() {
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
choiceBox.detach();
const P1SRC = [
  {
    id: "r",
    src: "./assets/img/rock-l.png"
  },
  {
    id: "p",
    src: "./assets/img/paper-l.png"
  },
  {
    id: "s",
    src: "./assets/img/scis-l.png"
  }
];
const P2SRC = [
  {
    id: "r",
    src: "./assets/img/rock-r.png"
  },
  {
    id: "p",
    src: "./assets/img/paper-r.png"
  },
  {
    id: "s",
    src: "./assets/img/scis-r.png"
  }
];
var localP1Choice;
var localP2Choice;
var localWinner;
function result() {
  anime({
    targets: [".p1", ".p2"],
    translateY: [{ value: 200, duration: 300 }],
    direction: "alternate",
    loop: 6,
    easing: "linear"
  });
}
function resetResults() {
  $(".p1").css({
    border: "0px solid black",
    background: "none"
  });
  $(".p2").css({
    border: "0px solid black",
    background: "none"
  });
  $(".l").attr("src", "./assets/img/rock-l.png");
  $(".r").attr("src", "./assets/img/rock-r.png");
}
playersRef.remove();
playerNum = "0";
function show() {
  for (var i = 0; i < P1SRC.length; i++) {
    if (localP1Choice === P1SRC[i].id) {
      $(".l").attr("src", P1SRC[i].src);
    }
  }
  for (var i = 0; i < P2SRC.length; i++) {
    if (localP2Choice === P2SRC[i].id) {
      $(".r").attr("src", P2SRC[i].src);
    }
  }
  if (localWinner === "TIE") {
    $(".p1").css({
      border: "5px solid black",
      background: "orange"
    });
    $(".p2").css({
      border: "5px solid black",
      background: "orange"
    });
  } else if (localWinner === "P1") {
    $(".p1").css({
      border: "5px solid black",
      background: "lime"
    });
    $(".p2").css({
      border: "5px solid black",
      background: "red"
    });
  } else if (localWinner === "P2") {
    $(".p1").css({
      border: "5px solid black",
      background: "red"
    });
    $(".p2").css({
      border: "5px solid black",
      background: "lime"
    });
  }
}

function joinGame() {
  if (playerNum === "0") {
    joinBtn.appendTo(".users-list");
  }
  joinBtn.on("click", function() {
    resetResults();
    var playerName = nameField.val();
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
        readyRef.onDisconnect().remove();
      }
      console.log("Player: " + playerNum);
      console.log("Joined!");
      $("#p-c").text("1");
      joinBtn.detach();
      choiceBox.appendTo(".choices");
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
        choiceBox.detach();
        if (data.player2 === undefined) {
        } else if (data.player2.ready === true) {
          $("#p-c").text("2");
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
        choiceBox.detach();
        if (data.player1 === undefined) {
        } else if (data.player1.ready === true) {
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
  if (playerNum === 0) {
    resetResults();
  }

  if (data.players === undefined) {
    console.log("DB UD");
  } else if (data.players.ready === null) {
    console.log("null");
  } else if (
    data.players.ready === true &&
    data.players.player1 !== undefined &&
    data.players.player2 !== undefined
  ) {
    localP1Choice = data.players.player1.choice;
    localP2Choice = data.players.player2.choice;
    switch (data.players.player1.choice + data.players.player2.choice) {
      //TIE
      case "rr":
      case "pp":
      case "ss":
        {
          console.log("TIE!");
          localWinner = "TIE";
          playerNum = "0";
          playersRef.remove();
          result();
          setTimeout(show, 2300);
        }
        break;
      //P1 Wins
      case "rs":
      case "pr":
      case "sp":
        {
          console.log("P1 WINS");
          localWinner = "P1";
          playerNum = "0";
          playersRef.remove();
          result();
          setTimeout(show, 2300);
        }
        break;
      //P2 Wins
      case "sr":
      case "rp":
      case "ps":
        {
          console.log("P2 WINS");
          localWinner = "P2";
          playerNum = "0";
          playersRef.remove();
          result();
          setTimeout(show, 2300);
        }
        break;
      // case "00":
      //   {
      //     console.log("No one picked yet");
      //   }
      //   break;
      // //P1 Picked & P2 Didnt
      // case "r0":
      // case "p0":
      // case "s0":
      //   {
      //     console.log("P1 picked | P2 didnt");
      //   }
      //   break;
      // //P2 Picked & P1 Didnt
      // case "0r":
      // case "0p":
      // case "0s":
      //   {
      //     console.log("P1 didnt | P2 picked");
      //   }
      //   break;
    }
  }
});
// });
