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

  currentCardTM.on("panmove", function(e) {
    console.log('Pan moving')
    anime({
      targets: currentCard,
      translateX: e.deltaX,
      translateY: e.deltaY,
      duration: 100,
    });
  });

  currentCardTM.on("panend", function(e) {
    anime({
      targets: currentCard,
      translateX: 0,
      translateY: 0,
    });
  })
})
