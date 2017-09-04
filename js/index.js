// Components
Vue.component('profile-card', {
  props: ['card'],
  template: `
    <div class="profile-card-wrapper">
      <div :style="{ backgroundImage: 'url(' + card.imgSrc + ')' }"
        class="profile-card"
      >
        <div class="profile-caption">
          <h4>{{ card.name }}</h4>
          <h5>{{ card.subtitle }}</h5>
        </div>
      </div>
    </div>
  `
})

Vue.component('profile', {
  props: ['cards', 'cardIndex'],
  template: `
    <div id="profile">
      <profile-card v-if="cardIndex + 1 < cards.length" :card="cards[cardIndex + 1]" id="next-card"></profile-card>
      <profile-card :card="cards[cardIndex]" id="current-card"></profile-card>
    </div>
  `
})

// Main app logics
window.addEventListener('load', function() {
  var app = new Vue({
    el: '#app',
    data: {
      cardIndex: 0,
      cards: [
        { imgSrc: './assets/imgs/p1.jpg', name: 'Po-Chen, 23', subtitle: 'University of Texas at Austin' },
        { imgSrc: './assets/imgs/p2.jpg', name: 'Po-Chen, 23', subtitle: 'WizeHire Inc.' },
        { imgSrc: './assets/imgs/p3.jpg', name: 'Po-Chen, 23', subtitle: 'Studnet Conduct Board, Member.' }
      ]
    },
    methods: {
      showNextCard: function () {
        this.cardIndex++;
        console.log('Show next card', this.cardIndex);
      }
    }
  })

  // Touch Control
  var currentCard = document.getElementById('current-card');
  var currentCardTM = new Hammer.Manager(currentCard, {recognizers: [
      // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
      [ Hammer.Tap ],
      [ Hammer.Swipe ],
      [ Hammer.Pan, {threshold: 1.5} ]
    ]
  });

  currentCardTM.on("tap", function() {
    console.log('Tapped.')
  });

  currentCardTM.on("panmove", function(e) {
    // Adjust the degree so we have 0deg pointing South.
    // Convert to radians and use the Sine function to neutralize
    // negative degrees as well as manage magnitude
    var angle = Math.sin((e.angle - 90) * Math.PI / 180) * 2;
    currentCard.style.transitionDuration = '0ms';
    currentCard.style.transform = "rotate(" + angle + "deg)";
    currentCard.style.transform += "translate(" + e.deltaX + "px," + e.deltaY + "px)";
  });

  currentCardTM.on("panend", function(e) {
    var angle = Math.sin((e.angle - 90) * Math.PI / 180) * 2;
    console.log('velocity', e.velocity)
    console.log('destance', e.distance)
    console.log('angle', angle)
    if ((e.velocity > 1.75 && e.distance > 100) || (angle < 0 && e.distance > 200)) {
      console.log('Swipe Right');
      swipeOutAnimation(angle, e.deltaX, e.deltaY, currentCard);
      app.showNextCard()
      currentCard.style.transition = "all 0ms linear"
      currentCard.style.transform = "translate(0, 0)";
    } else if ((e.velocity < -1.75 && e.distance > 100) || (angle > 0 && e.distance > 200)) {
      console.log('Swipe Left')
      app.showNextCard()
      currentCard.style.transition = "all 0ms linear"
      currentCard.style.transform = "translate(0, 0)";
    } else {
      currentCard.style.transition = "all 350ms cubic-bezier(0.6, 0.2, 0.6, 1.6)";
      currentCard.style.transform = "translate(0, 0)";
    }
  })
})

var swipeOutAnimation = function(angle, x, y, target) {
  target.style.transition = "all 500ms ease-out";
  target.style.transform = "angle(" + angle + "deg)";
  // TODO: use the edges instead of arbitrary cordinates
  target.style.transform += "translate(" + x * 5 + "px," + y * 5 + "px)";
}
