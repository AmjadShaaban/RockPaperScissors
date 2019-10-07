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

  var p1Choice = "r";
  var p2Choice = "s";

  function result() {
    $(".p1").css("border", "0px solid black");
    $(".p2").css("border", "0px solid black");

    anime({
      targets: [".p1", ".p2"],
      translateY: [{ value: 200, duration: 300 }],
      direction: "alternate",
      loop: 5,
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
  }
  database.ref().on("value", function(snab) {
    var data = snab.val();
    if (data.players === undefined) {
      console.log("off");
    } else if (data.players.ready === null) {
      console.log("no db");
    } else if (data.players.ready) {
      console.log("animate");
      result();
      setTimeout(show, 2000);
    }
  });
});
