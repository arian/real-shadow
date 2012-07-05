/*jshint  mootools:true */
/*!
 * Real Shadow v1.0.1
 * https://github.com/Indamix/real-shadow
 *
 * Copyright 2012, Ivan Indamix
 * Licensed under the MIT license
 * https://raw.github.com/Indamix/real-shadow/master/license.txt
 */
(function(window, undefined){
	"use strict";

	// TODO add fn(height) to pass shape form
	var settings = {
			followMouse: true
		},
		pi = Math.PI,
		els = [];

	Element.implement('realshadow', function(options){

		options = Object.merge({}, settings, options);
		if (!els.length && settings.followMouse) $(document.body).addEvent('mousemove', frame);
		$(window).addEvent('resize', updatePositions);

		add(this);

		frame({
			page: {
				x: settings.pageX !== undefined ? settings.pageX : $(window).getWidth() >> 1,
				y: settings.pageY !== undefined ? settings.pageY : 0
			}
		});

	});

	function add(el){
		var offset = el.getPosition(),
			c = el.get('rel'),
			p = {
				dom: el,
				x: offset.x + (el.getWidth () >> 1),
				y: offset.y  + (el.getHeight() >> 1)
			};

		if (c)
			p.c = {
				r: c.indexOf('r') !== -1,
				g: c.indexOf('g') !== -1,
				b: c.indexOf('b') !== -1
			}
		else
			if (settings.c) p.c = settings.c;

		els.push(p);
	}

	function updatePositions(){
		var i = els.length,
			offset,
			el;

		while (i--) {
			el = els[i];
			offset = el.dom.getPosition();
			el.x = offset.x;
			el.y = offset.y;
		}
	}

	function castShadows(el, angle, n, height){
		height = height || 7;
		// n = n || 2;
		var shadows = [],
			cos = Math.cos(angle),
			sin = Math.sin(angle),
			r;
		for (var i = 1; i < height; ++i) {
			r = Math.pow(i, n);
			// TODO      add ---^ + shadow distance
			shadows.push(
				( r * sin >> 0 ) + 'px '  +
				( r * cos >> 0 ) + 'px '  +
				( Math.pow(i, 1.7) >> 0 ) +
				'px rgba(' +
				(el.c ?
					(el.c.r ? 100 : 0) + ',' +
					(el.c.g ? 100 : 0) + ',' +
					(el.c.b ? 100 : 0) + ','
				:
					'0,0,0,'
				) +
				'.05)'
			);
		}

		el.dom.style.boxShadow = shadows.join(',');
	}

	var params = {
		nMax: 2.3,
		pow: 0.8,
		div: 1500
	}

	function frame(e){
		var i = els.length,
			el;

		while (i--) {
			el = els[i];

			var x = e.page.x - els[i].x,
				y = e.page.y - els[i].y,
				n = Math.pow(x * x + y * y, params.pow)
			n = n / params.div + 1; // TODO n = f(obj.size, distance)

			if (n > params.nMax) n = params.nMax;

			castShadows(
				el,
				Math.atan2(x, y) - pi,
				n
			);
		}
	}

})(this);
