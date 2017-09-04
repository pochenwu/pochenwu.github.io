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
    currentCard.style.transform = "rotate(" + angle + "deg) translate(" + e.deltaX + "px," + e.deltaY + "px)";
  });

  currentCardTM.on("panend", function(e) {
    var angle = Math.sin((e.angle - 90) * Math.PI / 180) * 2;
    var swipeOutAnimation = anime({
      targets: currentCard,
      translateX: [
        { value: e.deltaX, duration: 0, delay: 0, elasticity: 0 },
        { value: e.deltaX * 5, duration: 500, delay: 0, elasticity: 0 }
      ],
      translateY: [
        { value: e.deltaY, duration: 0, delay: 0, elasticity: 0 },
        { value: e.deltaY * 5, duration: 500, delay: 0, elasticity: 0 }
      ],
      rotate: angle,
      duration: 500,
      elasticity: 0,
      autoplay: false,
      complete: function() {
        app.showNextCard()
        currentCard.style.transition = "translate 0ms linear"
        currentCard.style.transform = "translate(0, 0)";
        console.log('Swipe Out Complete')
      }
    });

    var resetAnimation = anime({
      targets: currentCard,
      translateX: [
        { value: e.deltaX, duration: 0, delay: 0, elasticity: 0 },
        { value: 0, duration: 500, delay: 0, elasticity: 0 }
      ],
      translateY: [
        { value: e.deltaY, duration: 0, delay: 0, elasticity: 0 },
        { value: 0, duration: 500, delay: 0, elasticity: 0 }
      ],
      rotate: { value: 0, duration: 5 },
      duration: 500,
      elasticity: 10,
      autoplay: false
    });

    console.log('velocity', e.velocity)
    console.log('destance', e.distance)
    console.log('angle', angle)
    if ((e.velocity > 1.75 && e.distance > 100) || (angle < 0 && e.distance > 250)) {
      console.log('Swipe Right');
      swipeOutAnimation.play();
    } else if ((e.velocity < -1.75 && e.distance > 100) || (angle > 0 && e.distance > 250)) {
      console.log('Swipe Left');
      swipeOutAnimation.play();
    } else {
      resetAnimation.play();
    }
  })
})

var swipeOutAnimation = function(angle, x, y, target) {
  // target.style.transition = "all 500ms ease-out";
  // target.style.transform = "angle(" + angle + "deg)";
  // // TODO: use the edges instead of arbitrary cordinates
  // target.style.transform += "translate(" + x * 5 + "px," + y * 5 + "px)";
}
