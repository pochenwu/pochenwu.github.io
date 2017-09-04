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
window.addEventListener('load', function() {
  // Hide address bar; timeout required on iPhone
	setTimeout(function() {
		window.scrollTo(0, 1);
	}, 0);

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
      [ Hammer.Pan, {threshold: 1.5} ]
    ]
  });

  currentCardTM.on("tap", function() {
    console.log('Tapped.')
  });

  var moveAnime;

  currentCardTM.on("panmove", function(e) {
    // Adjust the degree so we have 0deg pointing South.
    // Convert to radians and use the Sine function to neutralize
    // negative degrees as well as manage magnitude
    var rotate = Math.sin((e.angle - 90) * Math.PI / 180) * 2;
    console.log('angle', e.angle - 90, rotate)
    currentCard.style.transitionDuration = '0ms';
    currentCard.style.transform = "rotate(" + rotate + "deg)";
    currentCard.style.transform += "translate(" + e.deltaX + "px," + e.deltaY + "px)";
  });

  currentCardTM.on("panend", function(e) {

    console.log('velocity', e.velocity)
    console.log('destance', e.distance)
    if (e.velocity > 1.75 && e.distance > 100 || e.distance > 200) {

    } else if (e.velocity < -1.75 && e.distance > 100  || e.distance > 200) {
      console.log('swipe out')
    } else {
      currentCard.style.transition= "all 350ms cubic-bezier(0.6, 0.2, 0.6, 1.6)";
      currentCard.style.transform = "translate(0, 0)";
    }
  })
})
