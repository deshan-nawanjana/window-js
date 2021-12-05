/*

    WindowJS Windows Handling DNJS Library
        by Deshan Nawanjana
        https://dnjs.info/

*/

let WindowJS = function(window, holder, posX, posY, width, height) {

    // elements
    this.window = window;
    this.holder = holder;
    window.WindowJS = this;
    WindowJS.data.allWindows.push(window);

    //position and size
    if(posX && posY && width && height) {
        window.style.left   = posX + 'px';
        window.style.top    = posY + 'px';
        window.style.width  = width + 'px';
        window.style.height = height + 'px';
    };

    // titlebar hold
    holder.addEventListener('mousedown', function(e) {
        WindowJS.data.mouseDown = true;
        WindowJS.data.mouseX = e.clientX;
        WindowJS.data.mouseY = e.clientY;
    });

    let _this = this;

    // window focus
    window.addEventListener('mousedown', function(e) {
        WindowJS.data.currentElement = this;
        WindowJS.data.elementX = parseInt(this.style.left);
        WindowJS.data.elementY = parseInt(this.style.top);
        _this.bringToTop();
    });

    this.bringToTop = function() {
        console.log(1);
        let currentZIndex = 0;
        // get current larger z index
        WindowJS.data.allWindows.forEach(function(win) {
            if(win.hasAttribute('selected')) {
                currentZIndex = parseInt(win.style.zIndex);
                win.removeAttribute('selected');
            }
        });
        // set this window up to it
        this.window.style.zIndex = currentZIndex + 1;
        this.window.setAttribute('selected', 'true');

        var zrr = [];
        var wrr = WindowJS.data.allWindows;
        wrr.forEach(function(w) { zrr.push(parseInt(w.style.zIndex)); });
        // re-order z indexes
        for(var i = 0; i < zrr.length; i++) {
            for(var j = 0; j < zrr.length; j++) {
                if(zrr[i] < zrr[j]) {
                    var tmp = zrr[i];
                    zrr[i] = zrr[j];
                    zrr[j] = tmp;
    
                    var tmp = wrr[i];
                    wrr[i] = wrr[j];
                    wrr[j] = tmp;
                }
            }
        }
        wrr.forEach(function(w, i) { w.style.zIndex = i + 1; });
        this.checkBounds();
    };

    this.checkBounds = function() {
        let win = this.window;
        let box = this.window.parentElement.getBoundingClientRect();
		var a = parseInt(win.style.left);
		var b = parseInt(win.style.top);
		var r = win.getBoundingClientRect();
		var w = r.width;
		var h = r.height;
		if(a < 10) { win.style.left = 10 + 'px'; }
		if(b < 10) { win.style.top  = 10 + 'px'; }
		if(a + w > (box.right  - 10)) { win.style.left = (box.right  - 10 - w) + 'px'; }
		if(b + h > (box.bottom - 10)) { win.style.top  = (box.bottom - 10 - h) + 'px'; }
    };

    this.blur = function() {
        this.window.removeAttribute('selected');
    };

    this.bringToTop();
};

WindowJS._auth = {
    creator: "Deshan Nawanjana",
    library: "WindowJS Windows Handling DNJS Library",
    website: "https://dnjs.info/"
};


WindowJS.data = {
    mouseDown : false, mouseX : 0, mouseY : 0,
    currentElement : null,  elementX : 0, elementY : 0,
    allWindows : []
};

window.addEventListener('mouseup', function() {
    WindowJS.data.mouseDown = false;
    WindowJS.data.currentElement = null;

    WindowJS.checkBoundsAll();
});

window.addEventListener('mousemove', function(e) {
    if(WindowJS.data.mouseDown === false) { return; }
    if(WindowJS.data.currentElement === null) { return; }

    let x = parseInt(e.clientX - WindowJS.data.mouseX) + WindowJS.data.elementX;
    let y = parseInt(e.clientY - WindowJS.data.mouseY) + WindowJS.data.elementY;

    WindowJS.data.currentElement.style.left = x + 'px';
    WindowJS.data.currentElement.style.top  = y + 'px';
});

window.addEventListener('resize', function() { WindowJS.checkBoundsAll(); });

WindowJS.checkBoundsAll = function() {
    WindowJS.data.allWindows.forEach(function(win) {
        win.WindowJS.checkBounds();
    });
};

WindowJS.blurAll = function() {
    WindowJS.data.allWindows.forEach(function(win) {
        win.WindowJS.blur();
    });
};