// Components
Vue.component('profile-card', {
  props: ['card', 'isCardOpen'],
  template: `
    <div class="profile-card" :class="{ 'profile-card-open': isCardOpen }">
      <div :style="{ backgroundImage: 'url(' + card.collage[0] + ')' }"
        class="profile-pic"
        :class="{ 'profile-pic-open': isCardOpen }"
      >
        <div v-if="!isCardOpen" class="profile-caption">
          <h1>{{ card.name }}, {{ card.age }}</h1>
          <h2>{{ card.title }}</h2>
        </div>
      </div>
      <div v-if="isCardOpen" class="profile-content">
        <div class="profile-basic-info profile-content-item">
          <h1>{{ card.name }}<span class="font-lighter">, {{ card.age }}</span></h1>
          <div class="profile-basic-info-item">
            <div v-if="card.class === 'work'" class="profile-icon"><i class="icon-briefcase" aria-hidden="true" /></div>
            <div v-else-if="card.class === 'education'" class="profile-icon"><i class="icon-graduation" aria-hidden="true" /></div>
            <div class="profile-title"><h2>{{ card.title }}<span v-if="card.position">, {{ card.position }}</span></h2></div>
          </div>
          <div v-if="card.class === 'eductaion' && card.gpa" class="profile-basic-info-item">
            GPA
          </div>
          <div class="profile-basic-info-item">
            <div class="profile-icon"><i class="icon-calendar" aria-hidden="true" /></div>
            <div><h2> {{ card.date }}</h2></div>
          </div>
        </div>
        <hr class="divider-full">
        <div class="profile-content-item">
          <p v-if="card.message">{{ card.message }}</p>
          <ul v-if="card.bullets" class="profile-bullets">
            <li v-for="item in card.bullets">
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,
})

Vue.component('profile', {
  props: ['cards', 'cardIndex', 'isCardOpen'],
  template: `
    <div id="profile" :style="profileModalToggle">
      <profile-card v-if="cardIndex + 1 < cards.length" :card="cards[cardIndex + 1]" :is-card-open="false" id="next-card"></profile-card>
      <profile-card v-if="cardIndex < cards.length" :card="cards[cardIndex]" :is-card-open=isCardOpen id="current-card"></profile-card>
      <div v-if="cardIndex === cards.length">There is no more card. It's a match? ;)</div>
    </div>
  `,
  computed: {
    profileModalToggle: function () {
      // return  this.isCardOpen ? { position: 'static' } : { position: 'relative' };
      return this.isCardOpen ? { marginLeft : 0, marginRight: 0, top: 0, width: '100%', height: '100%' } : {}
    }
  }
})

Vue.component('bot-nav', {
  props: ['links'],
  template: `
    <div id="bot-nav">
      <button class="button button-circle button-large bot-nav-item" style="color: #11B1F1" @click="open(links.linkedin)"><i class="fa fa-linkedin"></i></button>
      <button class="button button-circle button-jumbo bot-nav-item" style="color: #FF5268" @click="nope"><i class="fa fa-times"></i></button>
      <button class="button button-circle button-large bot-nav-item" style="color: #FFBA03" @click="undo"><i class="fa fa-undo"></i></button>
      <button class="button button-circle button-jumbo bot-nav-item" style="color: #41E9C1" @click="like"><i class="fa fa-heart"></i></button>
      <button class="button button-circle button-large bot-nav-item" style="color: #AA51E4" @click="open(links.github)"><i class="fa fa-git"></i></button>
    </div>
  `,
  methods: {
    open: function (url) {
      window.open(url)
    },
    nope: function () {
      console.log('nope')
    },
    undo: function () {
      console.log('undo')
    },
    like: function () {
      console.log('like')
    }
  }
})

Vue.component('match-notice', {
  props: ['isMatch'],
  template: `
    <div id="match-notice" v-bind:class="{ 'hide-match': !isMatch }">
      <h1>It's a Match?</h1>
      <p>You seemd to have liked Po-Chen.</p>
      <div class="match-avatar">
        <div class="avatar"></div>
      </div>
      <div class="match-button-group">
        <button class="my-button">
          <i class="fa fa-comment" aria-hidden="true"></i>
          <span class="my-button-text">Send Message</span>
        </button>
        <button class="my-button">
          <i class="fa fa-refresh" aria-hidden="true"></i>
          <span class="my-button-text">Play Again</span>
        </button>
      </div>
    </div>
  `
})

// Main app logics
window.addEventListener('load', function() {
  var isCardOpen = false;
  var app = new Vue({
    el: '#app',
    template: `
      <div id="app">
        <div id="main-view"  :class="{ 'blur': isMatch }">
          <div id="top-nav">
            <button class="button button-plain button-borderless button-large top-nav-item" style="color: #DADFE6"><i class="fa fa-user"></i></button>
            <i class="fa fa-google-wallet" style="color: #FD5068; font-size: 2em"></i>
            <button class="button button-plain button-borderless button-large top-nav-item" style="color: #DADFE6"><i class="fa fa-comments"></i></button>
          </div>
          <div id="shadow-profile"></div>
          <profile :cards="cards" :card-index="cardIndex" :is-card-open="isCardOpen"></profile>
          <bot-nav :links="links"></bot-nav>
        </div>

        <match-notice :isMatch="isMatch"></match-notice>
      </div>
    `,
    data: {
      isCardOpen: isCardOpen,
      isMatch: false,
      cardIndex: 0,
      cards: data.cards,
      links: data.links
    },
    methods: {
      showNextCard: function () {
        this.cardIndex++;
        if (this.cardIndex === this.cards.length) {
          this.showMatchNotice()
        }
        // console.log('Show next card', this.cardIndex);
      },
      openCard: function () {
        isCardOpen = true;
        this.isCardOpen = isCardOpen;
        // console.log('Card is now', this.isCardOpen)
      },
      closeCard: function () {
        isCardOpen = false;
        this.isCardOpen = isCardOpen;
        // console.log('Card is now', this.isCardOpen)
      },
      showMatchNotice: function () {
        this.isMatch = true
        console.log('It\'s a match!')
      }
    }
  })

  // DOM references
  var mainView = document.getElementById('main-view')
  var profile = document.getElementById('profile')
  var currentCard = document.getElementById('current-card');
  var nextCard = document.getElementById('next-card');
  var profilePic = currentCard.children[0]

  // Touch and Animation Control
  var profilePicTM = new Hammer.Manager(profilePic, {recognizers: [
      // RecognizerClass, [options], [recognizeWith, ...], [requireFailure, ...]
      [ Hammer.Tap ],
      [ Hammer.Swipe ],
      [ Hammer.Pan, {threshold: 1.5} ]
    ]
  });

  profilePicTM.on("tap", function() {
    // Snapshots
    var appDimentionSnapshot = app.$el.getClientRects()[0]
    var profileDimentionSnapshot = profile.getClientRects()[0]
    // Animation
    // BUG: card open vraibable no changing.
    profilePic.addEventListener('transitionend', function(e) {
      // console.log('Callback', isCardOpen)
      if (isCardOpen) {
        // Zoom In Responsive Resets
        profilePic.style.transition = 'unset';
        profilePic.style.height = 'auto';
        profilePic.style.paddingTop = '100%';
        console.log('Zoom in callback completed.')
      } else {
        // Zoom Out Responsive Resets
        // BUG this not beign fired and hieght becomes not responsive
        profilePic.style.transition = 'unset';
        profilePic.style.height = null;
        currentCard.style.boxShadow = null;
        console.log('Zoom out callback completed.', profilePic.style.height)
      }
    })
    var zoomIn = {
      play: function () {
        console.log('Zooming in.')
        // Resets
        profilePic.style.transition = null;
        // Obejectives
        profilePic.style.height = appDimentionSnapshot.width + 'px';
        currentCard.style.borderRadius = 0;
        currentCard.style.boxShadow = 'none';
      }
    }
    var zoomOut = {
      play: function () {
        console.log('Zooming out.')
        // Initial state
        profilePic.style.height = appDimentionSnapshot.width + 'px';
        profilePic.style.paddingTop = null;
        // Resets
        profilePic.style.transition = null;
        // Obejectives
        currentCard.style.borderRadius = null;
        profilePic.style.height = appDimentionSnapshot.height * .79 + 'px';
      }
    }

    if (!isCardOpen) {
      app.openCard()
      zoomIn.play()
    } else {
      app.closeCard()
      zoomOut.play()
    }
  });

  profilePicTM.on("panmove", function(e) {
    if (!isCardOpen) {
      // Adjust the degree so we have 0deg pointing South.
      // Convert to radians and use the Sine function to neutralize
      // negative degrees as well as manage magnitude
      var angle = Math.sin((e.angle - 90) * Math.PI / 180) * 2;
      // currentCard.style.transition = "rotate 200ms ease-in";
      currentCard.style.transform = "rotate(" + angle + "deg) translate(" + e.deltaX + "px," + e.deltaY + "px)";
      currentCard.style.boxShadow = 'none';

      nextCard.style.visibility = "visible";
    }
  });

  profilePicTM.on("panend", function(e) {
    if (!isCardOpen) {
      var angle = Math.sin((e.angle - 90) * Math.PI / 180) * 2;
      // TODO: use edge coordinates instead of arbitrary values.
      // TODO: change duration based on velocity.
      var swipeOutAnime = anime({
        targets: currentCard,
        translateX: [
          { value: e.deltaX, duration: 0, delay: 0, elasticity: 0 },
          { value: e.deltaX * 5, duration: 250, delay: 0, elasticity: 0 }
        ],
        translateY: [
          { value: e.deltaY, duration: 0, delay: 0, elasticity: 0 },
          { value: e.deltaY * 5, duration: 250, delay: 0, elasticity: 0 }
        ],
        rotate: angle,
        duration: 250,
        elasticity: 0,
        autoplay: false,
        complete: function() {
          app.closeCard()
          app.showNextCard()
          // TODO make this a animition
          profilePic.style.boxShadow = null;

          currentCard.style.transform = null;
          nextCard.style.visibility = null;
          // console.log('Swipe Out Complete')
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
          currentCard.style.boxShadow = null;
          nextCard.style.visibility = null;
        }
      });

      // console.log('velocity', e.velocity)
      // console.log('destance', e.distance)
      // console.log('angle', angle)
      if ((e.velocity > 1 && e.distance > 100) || (angle < 0 && e.distance > 250)) {
        // console.log('Swipe Right');
        swipeOutAnime.play();
      } else if ((e.velocity < -1 && e.distance > 100) || (angle > 0 && e.distance > 250)) {
        // console.log('Swipe Left');
        swipeOutAnime.play();
      } else {
        resetPositionAnime.play();
      }
    }
  })

  // Preview Animation Event Listener
  // TODO: make the event specific
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
      var transformValue = mutationRecord.target.style.transform
      var translateX = getComputedTranslate('X', mutationRecord.target);
      var translateY = getComputedTranslate('Y', mutationRecord.target);
      var dist = Math.sqrt( translateX * translateX + translateY * translateY);
      previewAnimation(nextCard, dist)
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

function arrayToList(array) {
  var list = '';
  if (array.length > 0) {
    list = document.createElement('ul');
    for (var i in array) {
      var il = document.createElement('il')
      var t = document.createTextNode(array[i]);
      il.appendChild(t)
      list.appendChild(il)
    }
  }
  return list;
}
