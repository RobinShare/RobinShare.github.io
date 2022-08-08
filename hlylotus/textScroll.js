/**
 * LBS textScroll 
 * Date: 2010-09-20
 * ==================================
 * id 文本滚动的对象或者一个ID
 * opts.direction 插滚动方向 默认'top' (bottom left right)
 * opts.speed 滚动速度 默认1 值越大越快
 * opts.delay 滚动延迟时间 默认30(ms) 值越大越慢
 * ==================================
 **/

function textScroll(id, opts) {
	var scroller = typeof id === 'string' ? document.getElementById(id) : id;
	if (!scroller) return;

	var speed = opts.speed || 1,
		delay = opts.delay || 30,
		direction = opts.direction || 'top',
		timer = null;

	if (direction === 'top' || direction === 'bottom') {
		var sH = scroller.scrollHeight,
			sT = 0;
		if (direction === 'bottom') sT = sH;
	}

	scroller.innerHTML += scroller.innerHTML;

	if (direction === 'left' || direction === 'right') {
		var els = scroller.children,
			length = els.length,
			oL = els[length / 2].offsetLeft,
			sL = 0;
		if (direction === 'right') sL = -oL;
	}

	function scroll() {
		! function animate() {
			if (direction === 'top' || direction === 'bottom') {
				scroller.scrollTop = sT;
				if (direction === 'top') {
					sT += speed;
					if (sT >= sH) sT = 0;
				} else if (direction === 'bottom') {
					sT -= speed;
					if (sT <= 0) sT = sH;
				}
			} else if (direction === 'left' || direction === 'right') {
				scroller.style.left = sL + 'px';
				if (direction === 'left') {
					sL -= speed;
					if (sL <= -oL) sL = 0;
				} else if (direction === 'right') {
					sL += speed;
					if (sL >= 0) sL = -oL;
				}
			}
			timer = setTimeout(animate, delay);
		}();
	}
	scroll();
	scroller.onmouseover = function() {
		clearTimeout(timer);
	};
	scroller.onmouseout = function() {
		scroll();
	};
}