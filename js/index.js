// Components
Vue.component('profile-card', {
  props: ['card', 'isCardOpen'],
  template: `
    <div class="profile-card">
      <div :style="{ backgroundImage: url }"
        class="profile-pic"
      >
        <div class="stamp">
          LIKE
        </div>
        <div v-if="card && isCardOpen" class="profile-control-group">
          <div class="collage-scroll"></div>
          <button class="button button-circle button-medium bot-nav-item" style="box-shadow: 0px 1px 1px #333333; color: #FF5268" >
            <i class="fa fa-arrow-down" aria-hidden="true" />
          </button>
        </div>
        <div v-if="card && !isCardOpen" class="profile-caption">
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
  computed: {
    url: function () {
      return this.card ? 'url(' + this.card.collage[0] + ')' : ''
    }
  }
})

Vue.component('profile', {
  props: ['cards', 'cardIndex', 'isCardOpen'],
  template: `
    <div id="profile" :style="profileModalToggle">
      <profile-card :class="{ 'hidden': !(cardIndex + 1 < cards.length) }" :card="cards[cardIndex + 1]" :is-card-open="false" id="next-card"></profile-card>
      <profile-card :class="{ 'hidden': !(cardIndex < cards.length) }" :card="cards[cardIndex]" :is-card-open=isCardOpen id="current-card"></profile-card>
    </div>
  `,
  computed: {
    profileModalToggle: function () {
      return this.isCardOpen ? { marginLeft : 0, marginRight: 0, top: 0, width: '100%', height: '100%' } : {}
    }
  },
  methods: {
  }
})

Vue.component('bot-nav', {
  props: ['links', 'participants', 'closeCard', 'showNextCard', 'showMatchNotice'],
  data: function () {
    return {
      inAction: false
    }
  },
  template: `
    <div id="bot-nav">
      <button class="button button-circle button-large bot-nav-item" style="color: #11B1F1" @click="open(links.linkedin)"><i class="fa fa-linkedin" /></button>
      <button class="button button-circle button-jumbo bot-nav-item" style="color: #FF5268" @click="next"><i class="fa fa-times" /></button>
      <button class="button button-circle button-large bot-nav-item" style="color: #FFBA03" @click="undo"><i class="fa fa-undo" /></button>
      <button class="button button-circle button-jumbo bot-nav-item" style="color: #41E9C1" @click="like"><i class="fa fa-heart" /></button>
      <button class="button button-circle button-large bot-nav-item" style="color: #AA51E4" @click="open(links.github)"><i class="fa fa-git" /></button>
    </div>
  `,
  methods: {
    open: function (url) {
      window.open(url)
    },
    next: function () {
      console.log('next')
      if (!this.inAction) {
        this.inAction = true;
        this.closeCard()
        swipeOutAnime(this.participants, -85, 0, 5, () => {
          this.showNextCard()
          this.inAction = false
        });
      }
    },
    undo: function () {
      console.log('undo')
    },
    like: function () {
      console.log('like')
      if (!this.inAction) {
        this.inAction = true;
        this.closeCard()
        // TODO: delta x needs to commodate responsive sizes
        swipeOutAnime(this.participants, 85, 0, 5, () => {
          this.showNextCard()
          this.showMatchNotice()
          this.inAction = false;
        });
      }
    }
  }
})

Vue.component('match-notice', {
  props: ['profileImgSrc', 'isMatch', 'resetApp', 'sendMessage', 'closeMatchNotice', 'isEnd'],
  template: `
    <div id="match-notice" v-bind:class="{ 'hide-match': !isMatch }">
      <h1>It's a Match?</h1>
      <p>You seemd to have liked Po-Chen.</p>
      <div class="match-avatar">
        <div class="avatar" :style="{ backgroundImage: 'url(' + profileImgSrc + ')' }"></div>
      </div>
      <div class="match-button-group">
        <button class="my-button" @click="sendMessage">
          <i class="fa fa-comment" aria-hidden="true"></i>
          <span class="my-button-text">Send Message</span>
        </button>
        <button class="my-button" @click="closeMatchNotice" :class="{ 'hidden' : isEnd }">
          <i class="fa fa-address-book-o" aria-hidden="true"></i>
          <span class="my-button-text">Keep Playing</span>
        </button>
      </div>
      <button class="my-button" @click="resetApp" style="width: 75%; border: none; margin: 5%; margin-top: auto;">
        <i class="fa fa-repeat" aria-hidden="true"></i>
        <span class="my-button-text">Replay</span>
      </button>
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
        <match-notice
          :isMatch="isMatch"
          :resetApp="resetApp"
          :sendMessage="sendMessage"
          :closeMatchNotice="closeMatchNotice"
          :profileImgSrc="lastProfileImgSrc"
          :isEnd="isEnd">
        </match-notice>
        <div id="main-view"  :class="{ 'blur': isMatch }">
          <div id="top-nav">
            <button class="button button-plain button-borderless button-large top-nav-item" style="color: #DADFE6">
              <i class="fa fa-user"></i>
            </button>
            <i class="fa fa-google-wallet" style="color: #FD5068; font-size: 2em"></i>
            <button class="button button-plain button-borderless button-large top-nav-item" style="color: #DADFE6" @click="sendMessage">
              <i class="fa fa-comments"></i>
            </button>
          </div>
          <div id="shadow-profile"></div>
          <profile :cards="cards" :card-index="cardIndex" :is-card-open="isCardOpen"></profile>
          <bot-nav :links="links" :participants="participants" :closeCard="closeCard" :showNextCard="showNextCard" :showMatchNotice="showMatchNotice"></bot-nav>
        </div>
      </div>
    `,
    data: {
      participants: {},
      lastProfileImgSrc: '',
      isCardOpen: isCardOpen,
      isMatch: false,
      cardIndex: 0,
      cards: data.cards,
      links: data.links
    },
    methods: {
      showNextCard: function () {
        // TODO check if target exists.
        this.lastProfileImgSrc = this.cards[this.cardIndex].collage[0]
        this.cardIndex++;
        if (this.cardIndex === this.cards.length) {
          this.showMatchNotice()
        }
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
      },
      closeMatchNotice: function () {
        this.isMatch = false
      },
      resetApp: function () {
        isCardOpen = false;
        this.isCardOpen = isCardOpen;
        this.cardIndex = 0;
        this.isMatch = 0;
      },
      sendMessage: function () {
        window.location.href = 'mailto:' + this.links.email
      }
    },
    computed: {
      isEnd: function () {
        return this.cardIndex === this.cards.length
      }
    },
    mounted: function () {
      // Make sure all children are rendered before we try to get the referenes
      this.$nextTick(function () {
        // DOM references
        var profile = document.getElementById('profile')
        var currentCard = document.getElementById('current-card');
        var nextCard = document.getElementById('next-card');
        var profilePic = currentCard.children[0]
        this.participants = { currentCard, nextCard, profilePic }
        registerProfileAnimation(app, this.participants)
      })
    },
  })
})

var registerProfileAnimation = function (app, participants) {
  var profilePic = participants.profilePic
  var currentCard = participants.currentCard
  var nextCard = participants.nextCard
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
    var snapshots = { appDimentionSnapshot, profileDimentionSnapshot }
    if (!app.isCardOpen) {
      app.openCard()
      zoomInAnime(participants, snapshots)
    } else {
      app.closeCard()
      zoomOutAnime(participants, snapshots)
    }
  });

  profilePicTM.on("panmove", function(e) {
    if (!app.isCardOpen) {
      // Adjust the degree so we have 0deg pointing South.
      // Convert to radians and use the Sine function to neutralize
      // negative degrees as well as manage magnitude
      var appDimentionSnapshot = app.$el.getClientRects()[0]
      var percentageDelta = Math.abs(e.deltaX / appDimentionSnapshot.width + e.deltaY / appDimentionSnapshot.height);
      var angle = -Math.sin((e.angle - 90) * Math.PI / 180) * percentageDelta * 8;
      console.log(e.angle, angle, percentageDelta)
      // This is the rotate and follow animation. Using pure CSS ensure the
      // most responsive user experience
      currentCard.style.transform = "rotate(" + angle + "deg) translate(" + e.deltaX + "px," + e.deltaY + "px)";
      currentCard.style.boxShadow = 'none';

      // To prevent last card showing
      if (!(app.cardIndex + 1 < app.cards.length)) {
        nextCard.style.visibility = "hidden";
      }
    }
  });

  profilePicTM.on("panend", function(e) {
    if (!app.isCardOpen) {
      var appDimentionSnapshot = app.$el.getClientRects()[0]
      var percentageDelta = Math.abs(e.deltaX / appDimentionSnapshot.width + e.deltaY / appDimentionSnapshot.height);
      var angle = Math.sin((e.angle - 90) * Math.PI / 180) * 2;
      // console.log('velocity', e.velocity)
      console.log('destance', e.distance)
      // console.log('angle', angle)
      console.log('percentage delta', percentageDelta)
      if ((e.velocity > 1 && e.distance > 100) || (angle < 0 && e.distance > 250)) {
        // console.log('Swipe Right');
        swipeOutAnime(participants, e.deltaX, e.deltaY, angle, () => {
          app.showNextCard()
          app.showMatchNotice()
        });
      } else if ((e.velocity < -1 && e.distance > 100) || (angle > 0 && e.distance > 250)) {
        swipeOutAnime(participants, e.deltaX, e.deltaY, angle, () => {
          app.showNextCard()
        });
      } else {
        resetCardAnime(participants, e.deltaX, e.deltaY);
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
      previewAnimation(nextCard, dist);

      // TODO: might need a better way to reach the element
      var appDimentionSnapshot = app.$el.getClientRects()[0]
      var stamp = currentCard.children[0].children[0]
      var percentageDelta = Math.abs(translateX / appDimentionSnapshot.width + translateY / appDimentionSnapshot.height);
      stamp.style.opacity = percentageDelta * 2;
    });
  });

  observer.observe(currentCard, { attributes : true, attributeFilter : ['style'] });
}

// Animation
var zoomInAnime = function (participants, snapshots, callback = function () {}) {
  console.log('Zooming in.')
  // Initial state
  participants.nextCard.style.visibility = "hidden";
  participants.currentCard.style.borderRadius = 0;
  participants.currentCard.style.boxShadow = 'none';
  anime({
    targets: participants.profilePic,
    height: { value: snapshots.appDimentionSnapshot.width, duration: 350, delay: 0, elasticity: 0 },
    duration: 350,
    elasticity: 0,
    easing: 'easeOutQuart',
    complete: function () {
      // Resets to responsive
      participants.profilePic.style.boxShadow = null;
      participants.currentCard.style.transform = null;
      participants.nextCard.style.visibility = null;

      participants.profilePic.style.height = 'auto';
      participants.profilePic.style.paddingTop = '100%';
      callback()
      console.log('Zooming in completed.')
    }
  })
}

var zoomOutAnime = function (participants, snapshots, callback = function () {}) {
  console.log('Zooming out.')
  // Initial States
  participants.profilePic.style.height = snapshots.appDimentionSnapshot.width + 'px';
  participants.profilePic.style.paddingTop = '0';
  participants.nextCard.style.visibility = "hidden";
  participants.currentCard.style.boxShadow = 'none';
  participants.currentCard.style.borderRadius = null;
  anime({
    targets: participants.profilePic,
    height: [
      { value: snapshots.appDimentionSnapshot.width, duration: 0, delay: 0, elasticity: 0 },
      { value: snapshots.appDimentionSnapshot.height * .79, duration: 350, delay: 0, elasticity: 0 }
    ],
    duration: 350,
    elasticity: 0,
    easing: 'easeOutQuart',
    complete: function () {
      // Resets to responsive
      participants.currentCard.style.boxShadow = null;
      participants.currentCard.style.transform = null;
      participants.nextCard.style.visibility = null;
      participants.profilePic.style.height = '100%';
      console.log('Zooming out completed.')
      callback()
    }
  })
}

var swipeOutAnime = function (participants, deltaX, deltaY, angle, callback) {
  // TODO: use edge coordinates instead of arbitrary values.
  // TODO: change duration based on velocity.
  anime({
    targets: participants.currentCard,
    translateX: [
      { value: deltaX, duration: 0, delay: 0, elasticity: 0 },
      { value: deltaX * 5, duration: 350, delay: 0, elasticity: 0 }
    ],
    translateY: [
      { value: deltaY, duration: 0, delay: 0, elasticity: 0 },
      { value: deltaY * 5, duration: 350, delay: 0, elasticity: 0 }
    ],
    rotate: angle,
    duration: 350,
    elasticity: 0,
    // autoplay: false,
    complete: function() {
      participants.currentCard.style.boxShadow = null;
      participants.currentCard.style.transform = null;
      participants.nextCard.style.visibility = null;
      callback()
    }
  })
};

var resetCardAnime = function (participants, deltaX, deltaY, callback) {
  anime({
    targets: participants.currentCard,
    translateX: [
      { value: deltaX, duration: 0, delay: 0, elasticity: 0 },
      { value: 0, duration: 300, delay: 0, elasticity: 0 }
    ],
    translateY: [
      { value: deltaY, duration: 0, delay: 0, elasticity: 0 },
      { value: 0, duration: 300, delay: 0, elasticity: 0 }
    ],
    rotate: { value: 0, duration: 5 },
    duration: 300,
    elasticity: 10,
    complete: function() {
      participants.currentCard.style.boxShadow = null;
      participants.nextCard.style.visibility = null;
    }
  })
}

var previewAnimation = function (target, dist, reverse) {
  // Preview animation of the next card
  var dynamicSize = Math.max('.95', Math.min(1, .95 + dist / 1000));
  if (dynamicSize !== 1) {
    target.style.transform = "scale(" + dynamicSize + ")"
  } else {
    target.style.transform = null;
  }
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
