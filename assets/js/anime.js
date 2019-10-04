let p1Choice = "r";
let p2Choice = "s";

function result() {
  $(".p1").css("border", "0px solid black");
  $(".p2").css("border", "0px solid black");

  anime({
    targets: [".p1", ".p2"],
    translateY: [{ value: 200, duration: 500 }],
    direction: "alternate",
    loop: 5,
    easing: "linear"
  });
}

function show() {
  $(".l").attr("src", "./assets/img/paper-l.png");
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
result();
setTimeout(show, 2700);
// show();
//   $(animation).once();
// }
// $(document)
//   .once(result())
//   .then(() => {
//
//   });
