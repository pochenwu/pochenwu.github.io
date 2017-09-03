var drag = function() {
  return {
    move : function(divid, xpos, ypos) {
        divid.style.left = xpos + 'px';
        divid.style.top = ypos + 'px';
    },
    // For non-touch devices
    onmousedown : function(divid, container, e) {
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
      var a = document.createElement('script');
      document.getElementById(container).style.cursor='default';
      document.onmousemove = function() {}
    },

    // For touch devices
    ontouchstart : function(divid, container, e) {
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
        // e.preventDefault();
        e.stopPropagation()
        e = e || window.event;
        var touch = e.changedTouches[0];
        var posX = touch.clientX,
            posY = touch.clientY,
            aX = posX - diffX,
            aY = posY - diffY;
        drag.move(divid,aX,aY);
      }
    },
    ontouchend : function(container) {
      var a = document.createElement('script');
      document.getElementById(container).style.cursor='default';
      document.ontouchmove = function() {}
    },
  }
} ();
