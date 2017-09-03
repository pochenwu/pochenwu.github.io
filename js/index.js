// Components
Vue.component('profile-card', {
  props: ['card'],
  template: `
    <div class="profile-card-wrapper">
      <div :style="{ backgroundImage: 'url(' + card.imgSrc + ')' }"
        class="profile-card"
        ontouchstart='drag.ontouchstart(this, "profile", event);'
        ontouchend='drag.ontouchend("profile");'
        onmousedown='drag.onmousedown(this, "profile", event);'
        onmouseup='drag.onmouseup("profile");'
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
})




// Libraries
var drag = function() {
  return {
    move : function(divid, xpos, ypos) {
        divid.style.left = xpos + 'px';
        divid.style.top = ypos + 'px';
    },
    // For non-touch devices
    onmousedown : function(divid, container, e) {
      console.log('OnMouseDown')
      e = e || window.event;
      var posX = e.clientX,
          posY = e.clientY,
      divTop = divid.style.top,
      divLeft = divid.style.left,
      eWi = parseInt(divid.style.width),
      eHe = parseInt(divid.style.height),
      cWi = parseInt(document.getElementById(container).style.width),
      cHe = parseInt(document.getElementById(container).style.height);
      document.getElementById(container).style.cursor='move';
      divTop = divTop.replace('px','');
      divLeft = divLeft.replace('px','');
      var diffX = posX - divLeft,
          diffY = posY - divTop;
      document.onmousemove = function(e) {
        console.log('OnMouseMove')
        e = e || window.event;
        var posX = e.clientX,
            posY = e.clientY,
            aX = posX - diffX,
            aY = posY - diffY;
            // if (aX < 0) aX = 0;
            // if (aY < 0) aY = 0;
            // if (aX + eWi > cWi) aX = cWi - eWi;
            // if (aY + eHe > cHe) aY = cHe -eHe;
        drag.move(divid,aX,aY);
      }
    },
    onmouseup : function(container) {
      console.log('OnMouseUp')
      var a = document.createElement('script');
      document.getElementById(container).style.cursor='default';
      document.onmousemove = function() {}
    },

    // For touch devices
    ontouchstart : function(divid, container, e) {
      console.log('OnTouchStart')
      e = e || window.event
      var touch = e.changedTouches[0];
      var posX = touch.clientX,
          posY = touch.clientY,
      divTop = divid.style.top,
      divLeft = divid.style.left,
      eWi = parseInt(divid.style.width),
      eHe = parseInt(divid.style.height),
      cWi = parseInt(document.getElementById(container).style.width),
      cHe = parseInt(document.getElementById(container).style.height);
      document.getElementById(container).style.cursor='move';
      divTop = divTop.replace('px','');
      divLeft = divLeft.replace('px','');
      var diffX = posX - divLeft,
          diffY = posY - divTop;
      document.ontouchmove = function(e) {
        console.log('OnTouchMove')
        // e.preventDefault();
        // Stop this touch from affecting other elements
        // e.stopPropagation()
        e = e || window.event;
        var touch = e.changedTouches[0];
        var posX = touch.clientX,
            posY = touch.clientY,
            aX = posX - diffX,
            aY = posY - diffY;
        console.log(posX, posY)
        drag.move(divid,aX,aY);
      }
    },
    ontouchend : function(container) {
      console.log('OnTouchEnd')
      var a = document.createElement('script');
      document.getElementById(container).style.cursor='default';
      document.ontouchmove = function() {}
    },
  }
} ();
