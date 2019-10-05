let p1Choice = "r";
let p2Choice = "s";

const timeline = anime.timeline();
const timeline2 = anime.timeline();

// timeline
//   .add({
//     targets: ".p1",
//     translateY: [0, 200],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   })
//   .add({
//     targets: ".p1",
//     translateY: [200, 0],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   })
//   .add({
//     targets: ".p1",
//     translateY: [0, 200],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   })
//   .add({
//     targets: ".p1",
//     translateY: [200, 0],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   })
//   .add({
//     targets: ".p1",
//     translateY: [0, 200],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   })
//   .add({
//     targets: ".p1",
//     translateY: [200, 0],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   });
// timeline2
//   .add({
//     targets: ".p2",
//     translateY: [0, 500],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   })
//   .add({
//     targets: ".p2",
//     translateY: [500, 0],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   })
//   .add({
//     targets: ".p2",
//     translateY: [0, 500],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   })
//   .add({
//     targets: ".p2",
//     translateY: [500, 0],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   })
//   .add({
//     targets: ".p2",
//     translateY: [0, 500],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   })
//   .add({
//     targets: ".p2",
//     translateY: [500, 0],
//     direction: "alternate",
//     easing: "spring(1, 80, 10, 0)",
//     duration: 100
//   });

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
result();
setTimeout(show, 2000);
// show();
//   $(animation).once();
// }
// $(document)
//   .once(result())
//   .then(() => {
//
//   });
