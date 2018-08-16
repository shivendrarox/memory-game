/******************code for animate css library functions***********************/
$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: "animationend",
        OAnimation: "oAnimationEnd",
        MozAnimation: "mozAnimationEnd",
        WebkitAnimation: "webkitAnimationEnd"
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement("div"));

    this.addClass("animated " + animationName).one(animationEnd, function() {
      $(this).removeClass("animated " + animationName);

      if (typeof callback === "function") callback();
    });

    return this;
  }
});

/////////////////////////////////////////////////////////////////////////

/*
 * Create a list that holds all of your cards - DONE
 */
var cardList = [
  "fa fa-diamond",
  "fa fa-paper-plane-o",
  "fa fa-anchor",
  "fa fa-bolt",
  "fa fa-cube",
  "fa fa-anchor",
  "fa fa-leaf",
  "fa fa-bicycle",
  "fa fa-diamond",
  "fa fa-bomb",
  "fa fa-leaf",
  "fa fa-bomb",
  "fa fa-bolt",
  "fa fa-bicycle",
  "fa fa-paper-plane-o",
  "fa fa-cube"
];

var openCards = [];
let animationDone = true;
let clicks = 0;
let time = 1;
let gameStarted = false;
let timerP;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below - DONE
 *   - loop through each card and create its HTML - DONE
 *   - add each card's HTML to the page - DONE
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
cardList = shuffle(cardList);
let output = "";
for (let i = 0; i < cardList.length; i++) {
  output += `<li class="card">
                <i class="${cardList[i]}"></i>
                </li>`;
}
document.getElementById("deck").innerHTML = output;

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)-DONE
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)-DONE
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//starts game timer
function startTimer() {
  $(".time").text(time + " Seconds");
  time++;
  timerP = setTimeout(startTimer, 1000);
}

//updates the stars depending on performance
function updateStars() {
  let numberOfStars = $(".fa.fa-star").length;
  if (clicks >= 20 && clicks <= 25 && numberOfStars === 3) {
    $(".fa.fa-star")[2].remove();
  } else if (clicks >= 26 && clicks <= 30 && numberOfStars === 2) {
    $(".fa.fa-star")[1].remove();
  } else if (clicks > 30 && numberOfStars === 1) {
    $(".fa.fa-star")[0].remove();
  }
}

//updates the moves
function updateMoves() {
  clicks++;
  $(".moves").text(clicks);
  updateStars();
}

//whenever you click the redo icon, the resets
$(".restart").click(function() {
  location.reload();
});

$(document).ready(function() {
  showCardSymbol();
});

function showCardSymbol() {
  $("ul.deck li").click(function() {
    if (!gameStarted) {
      gameStarted = true;
      time = 1;
      timerP = setTimeout(startTimer, 1000);
    }
    if (
      !$(this)
        .attr("class")
        .includes("open show") &&
      animationDone
    ) {
      $(this).addClass("open show");
      $(this).animateCss("bounce");
      addCardToList(this);
    }
  });
}

function lockTheCardsOpen(i) {
  animationDone = false;
  $(".fa." + openCards[i - 2].slice(3))
    .parent()
    .addClass("match");
  $(".fa." + openCards[i - 2].slice(3))
    .parent()
    .animateCss("shake");
  animationDone = true;
}

function removeCards(i) {
  animationDone = false;
  window.setTimeout(function() {
    $(".fa." + openCards[i - 2].slice(3))
      .parent()
      .removeClass("open show");
    $(".fa." + openCards[i - 1].slice(3))
      .parent()
      .removeClass("open show");
    openCards.splice(i - 2);
    animationDone = true;
  }, 1000);
}
//add the open card to the list of opened up cards
function addCardToList(openCard) {
  openCards.push(
    $(openCard)
      .children()
      .attr("class")
  );
  let i = openCards.length;
  if (openCards[i - 1] == openCards[i - 2]) {
    lockTheCardsOpen(i);
    updateMoves();
  } else if (i % 2 === 0 && !(openCards[i - 1] == openCards[i - 2])) {
    removeCards(i);
    updateMoves();
  }
  if ($(".match").length === 16) {
    // || true){
    congratulate();
  }
}

//congratulate upon winning
function congratulate() {
  clearTimeout(timerP);
  window.setTimeout(function() {
    $(".fa.fa-star")
      .clone()
      .appendTo("#modal-rating");
    $(".moves")
      .clone()
      .appendTo("#modal-moves");
    $(".time")
      .clone()
      .appendTo("#modal-time");

    modal.style.display = "block";
  }, 500);
}

///
var modal = document.getElementById("myModal");

// Get the button that opens the modalvar btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};