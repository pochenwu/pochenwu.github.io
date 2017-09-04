// Components
Vue.component('profile-card', {
  props: ['card'],
  template: `
    <div class="profile-card-wrapper">
      <div :style="{ backgroundImage: 'url(' + card.imgSrc + ')' }"
        class="profile-card"
        id="currentCard"
      >
        <div class="profile-caption">
          <h4>{{ card.name }}</h4>
          <h5>{{ card.subtitle }}</h5>
        </div>
      </div>
    </div>
  `
})


// Main app logics
window.addEventListener('load', function () {
  var app = new Vue({
    el: '#app',
    data: {
      cardIndex: 0,
      card: [
        { imgSrc: './assets/imgs/p1.jpg', name: 'Po-Chen, 23', subtitle: 'University of Texas at Austin' },
        { imgSrc: './assets/imgs/p2.jpg', name: 'Po-Chen, 23', subtitle: 'WizeHire Inc.' }
      ]
    }
  })



  // Touch Control
  var currentCard = document.getElementById('currentCard');
  var currentCardTM = new Hammer.Manager(currentCard, {recognizers: [
      // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
      [ Hammer.Tap ],
      [ Hammer.Swipe ],
      [ Hammer.Pan ]
    ]
  });

  currentCardTM.on("tap", function() {
    console.log('Tapped.')
  });

  var moveAnime;

  currentCardTM.on("panmove", function(e) {
    currentCard.style.transitionDuration = '0ms';
    currentCard.style.transform = "translate(" + e.deltaX + "px," + e.deltaY + "px)";
  });

  currentCardTM.on("panend", function(e) {
    console.log('velocity', e.velocity)
    currentCard.style.transitionDuration = '200ms';
    currentCard.style.transitionTimingFunction = 'ease-in-out';
    currentCard.style.transform = "translate(0, 0)";
  })
})
