// Components
Vue.component('profile-card', {
  props: ['card', 'isCardOpen'],
  template: `
    <div class="profile-card" :class="{ 'profile-card-open': isCardOpen }">
      <div :style="{ backgroundImage: 'url(' + card.imgSrc + ')' }"
        class="profile-pic"
        :class="{ 'profile-pic-open': isCardOpen }"
      >
        <div v-if="!isCardOpen" class="profile-caption">
          <h4>{{ card.name }}</h4>
          <h5>{{ card.subtitle }}</h5>
        </div>
      </div>
      <div v-if="isCardOpen" class="profile-content"">
        Content goes here.
      </div>
    </div>
  `
})

Vue.component('profile', {
  props: ['cards', 'cardIndex', 'isCardOpen'],
  template: `
    <div id="profile">
      <profile-card v-if="cardIndex + 1 < cards.length" :card="cards[cardIndex + 1]" :is-card-open="false" id="next-card"></profile-card>
      <profile-card v-if="cardIndex < cards.length" :card="cards[cardIndex]" :is-card-open=isCardOpen id="current-card"></profile-card>
      <div v-if="cardIndex === cards.length">There is no more card. It's a match? ;)</div>
    </div>
  `
})

// Main app logics
window.addEventListener('load', function() {
  var app = new Vue({
    el: '#app',
    data: {
      isCardOpen: false,
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
      },
      openCard: function () {
        this.isCardOpen = true;
        console.log('Card is now', this.isCardOpen)
      },
      closeCard: function () {
        this.isCardOpen = false;
        console.log('Card is now', this.isCardOpen)
      },
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

  var toggle = false;

  currentCardTM.on("tap", function() {

      var pic = currentCard.children[0];
      var appDimentionSnapshot = app.$el.getClientRects()[0]
      var profileDimentionSnapshot = document.getElementById('profile'). getClientRects()[0]
      var expandAnime = anime({
        targets: pic,
        height: appDimentionSnapshot.width,
        borderRadius: { value: 0, duration: 1 },
        easing: 'easeInOutCubic',
        duration: 200,
        autoplay: false,
        // boxShadow: 'none',
        complete: function () {
          pic.style.height = 'auto';
          pic.style.paddingTop = '100%';
            // margin: 0,
            // height: 'auto',
            // paddingTop: '100%',
            // borderRadius: 0,
            // fontSize: 0,
            // boxShadow: 'none',
        },
        update: function () {
          console.log('UPDATING HEIGHT', pic.style.height)
          console.log('UPDATING MARGIN', pic.style.margin)
        },
        before: function () {
          console.log('BEFORE HEIGHT', pic.style.height)
          console.log('BEFORE MARGIN', pic.style.margin)

          // pic.style.height = appDimentionSnapshot.width + 'px';
        },
        // complete: function () {
        //   pic.style.height = '100%';
        // }
      });

      console.log(profileDimentionSnapshot.height)

      var retractAnime = anime({
        margin: { value:0, duration: 0 },
        targets: pic,
        height: [
          { value: appDimentionSnapshot.width, duration: 0, delay: 0, elasticity: 0 },
          { value: profileDimentionSnapshot.height, delay: 0, elasticity: 0 }

        ],
        borderRadius: { value: 20, duration: 1 },
        easing: 'easeInOutCubic',
        duration: 200,
        autoplay: false,
        // boxShadow: 'none',
        update: function () {
          console.log('UPDATING HEIGHT', pic.style.height)
          console.log('UPDATING MARGIN', pic.style.margin)
        },
        before: function () {
          console.log('BEFORE HEIGHT', pic.style.height)
          console.log('BEFORE MARGIN', pic.style.margin)

          // pic.style.height = appDimentionSnapshot.width + 'px';
        },
        complete: function () {
          pic.style.height = '100%';
        }
      });
    if (!toggle) {
      app.openCard()
      expandAnime.play()
      toggle = !toggle;
    } else {
      console.log('before close', pic.style.height)
      pic.style.height = appDimentionSnapshot.width + 'px';
      pic.style.margin = 0;
      pic.style.padding = 0;
      app.closeCard()
      // console.log('close card', pic.style.height)
      // pic.style.height = appDimentionSnapshot.width + 'px';
      // pic.style.paddingTop = '0';
      // console.log('before animation call', pic.style.height)
      retractAnime.play()
      toggle = !toggle;
    }
  });

  currentCardTM.on("panmove", function(e) {
    // Adjust the degree so we have 0deg pointing South.
    // Convert to radians and use the Sine function to neutralize
    // negative degrees as well as manage magnitude
    var angle = Math.sin((e.angle - 90) * Math.PI / 180) * 2;
    currentCard.style.transition = "rotate 200ms ease-in";
    currentCard.style.transform = "rotate(" + angle + "deg) translate(" + e.deltaX + "px," + e.deltaY + "px)";

    nextCard.style.visibility = "visible";
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
        app.closeCard()
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
      autoplay: false,
      complete: function() {
        nextCard.style.visibility = "hidden";
      }
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
  var dynamicSize = Math.max('.95', Math.min(1, .95 + dist / 1000));
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
