// Components
Vue.component('profile-card', {
  props: ['card'],
  data: function () {
    return {
      open: false,
    }
  },
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
      <profile-card v-if="cardIndex < cards.length" :card="cards[cardIndex]" id="current-card"></profile-card>
      <div v-if="cardIndex === cards.length">There is no more card. It's a match? ;)</div>
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

  // Touch and Animation Control
  var currentCard = document.getElementById('current-card');
  var nextCard = document.getElementById('next-card');

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
    currentCard.style.transition = "rotate 200ms ease-in";
    currentCard.style.transform = "rotate(" + angle + "deg) translate(" + e.deltaX + "px," + e.deltaY + "px)";
  });

  currentCardTM.on("panend", function(e) {
    var angle = Math.sin((e.angle - 90) * Math.PI / 180) * 2;
    // TODO: use edge coordinates instead of arbitrary values.
    // TODO: change duration based on velocity.
    var swipeOutAnime = anime({
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

    var resetPositionAnime = anime({
      targets: currentCard,
      translateX: [
        { value: e.deltaX, duration: 0, delay: 0, elasticity: 0 },
        { value: 0, duration: 300, delay: 0, elasticity: 0 }
      ],
      translateY: [
        { value: e.deltaY, duration: 0, delay: 0, elasticity: 0 },
        { value: 0, duration: 300, delay: 0, elasticity: 0 }
      ],
      rotate: { value: 0, duration: 5 },
      duration: 300,
      elasticity: 10,
      autoplay: false
    });

    console.log('velocity', e.velocity)
    console.log('destance', e.distance)
    console.log('angle', angle)
    if ((e.velocity > 1 && e.distance > 100) || (angle < 0 && e.distance > 250)) {
      console.log('Swipe Right');
      swipeOutAnime.play();
    } else if ((e.velocity < -1 && e.distance > 100) || (angle > 0 && e.distance > 250)) {
      console.log('Swipe Left');
      swipeOutAnime.play();
    } else {
      resetPositionAnime.play();
    }
  })

  // Preview Animation Event Listener
  // TODO: make the evengt specific
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
      var transformValue = mutationRecord.target.style.transform
      var translateX = getComputedTranslate('X', mutationRecord.target);
      var translateY = getComputedTranslate('Y', mutationRecord.target);
      var dist = Math.sqrt( translateX * translateX + translateY * translateY);
      previewAnimation(nextCard.children[0], dist)
    });
  });

  observer.observe(currentCard, { attributes : true, attributeFilter : ['style'] });
})


var previewAnimation = function(target, dist, reverse) {
  // Preview animation of the next card
  var dynamicSize = Math.max('.975', Math.min(1, .975 + dist / 1000));
  target.style.transform = "scale(" + dynamicSize + ")"
}

function getComputedTranslate(coordinate, obj) {
  // Credit: https://stackoverflow.com/questions/21912684/how-to-get-value-of-translatex-and-translatey
  var index3D, index;
  switch (coordinate) {
    case 'X':
      index3D = 12;
      index = 4;
      break;
    case 'Y':
      index3D = 13;
      index = 5;
    break;
    default:
      return 0;
  }
  if(!window.getComputedStyle) return;
  var style = getComputedStyle(obj),
      transform = style.transform || style.webkitTransform || style.mozTransform;
  var mat = transform.match(/^matrix3d\((.+)\)$/);
  if(mat) return parseFloat(mat[1].split(', ')[index3D]);
  mat = transform.match(/^matrix\((.+)\)$/);
  return mat ? parseFloat(mat[1].split(', ')[index]) : 0;
}
