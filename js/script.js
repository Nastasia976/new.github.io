
$(document).ready(function() {
	$('.name').click(function(event) {
		$('.myname').toggleClass('active');
		$('.mypost,.mynumber').removeClass('active');
	});
	$('.numberin').click(function(event) {
		$('.myname,.mypost').removeClass('active');
		$('.mynumber').toggleClass('active');
	});
	$('.post').click(function(event) {
		$('.mypost').toggleClass('active');
		$('.myname,.mynumber').removeClass('active');
	});
	$('.but1').click(function(event) {
		$('.block8__column2__row4').toggleClass('active');
		$('.forlid,.foruser,.but2,.but3,.but1').removeClass('active');
	});
	$('.but2').click(function(event) {
		$('.forlid,.but2,.but1').toggleClass('active');
		$('.block8__column2__row4,.foruser,.but3').removeClass('active');
	});
	$('.but3').click(function(event) {
		$('.foruser,.but3,.but1').toggleClass('active');
		$('.block8__column2__row4,.forlid,.but2').removeClass('active');
	});
	$('.burger').click(function(event) {
		$('.burger,.block-menu,.menu').toggleClass('active');
		$('body').toggleClass('lock');
	});
	$('.close').click(function(event) {
		$('.burger,.block-menu,.menu').removeClass('active');
		$('body').removeClass('lock');
	});
});


$(window).on("scroll", function () {
    var scrolled = $(this).scrollTop();
    if( scrolled > 10 ) {
        $('header').addClass('scrolled');
    }   
    if( scrolled <= 10 ) {     
        $('header').removeClass('scrolled');
    }
});


const animItems = document.querySelectorAll('._anim-items');

if (animItems.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll() {
		for (let index = 0; index < animItems.length; index++) {
			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 10;

			let animItemPoint = window.innerHeight - animItemHeight / animStart;
			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
				animItem.classList.add('_active');
			} else {
				if (!animItem.classList.contains('_anim-no-hide')){
					animItem.classList.remove('_active');
				}
			}
		}
	}
	function offset(el) {
		const rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}
	setTimeout(() => {
		animOnScroll();
	}, 300);
}

const hed = document.querySelectorAll('._hed');
if (hed.length > 0) {
	window.addEventListener('scroll', animOnScroll);
	function animOnScroll() {
		for (let index = 0; index < hed.length; index++) {
			const animItem = animItems[index];
			const animItemHeight = animItem.offsetHeight;
			const animItemOffset = offset(animItem).top;
			const animStart = 4;

			let animItemPoint = window.innerHeight - animItemHeight / animStart;
			if (animItemHeight > window.innerHeight) {
				animItemPoint = window.innerHeight - window.innerHeight / animStart;
			}

			if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)) {
				animItem.classList.add('_passive');
			} else {
				animItem.classList.remove('_passive');
			}
		}
	}
	function offset(el) {
		const rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}
	setTimeout(() => {
	}, 0);
	
}

////////////////////////////////////////////////////////
 
$(document).ready(function () {
	let original_positions = [];
	let da_elements = document.querySelectorAll('[data-da]');
	let da_elements_array = [];
	let da_match_media = [];

	if (da_elements.length > 0) {
		let number = 0;
		for (let index = 0; index < da_elements.length; index++) {
			const da_element = da_elements[index];
			const da_move = da_element.getAttribute('data-da');
			const da_array = da_move.split(',');
			if (da_array.length == 3) {
				da_element.setAttribute('data-da-index', number);
				original_positions[number] = {
					"parent": da_element.parentNode,
					"index": index_in_parent(da_element)
				};
				da_elements_array[number] = {
					"element": da_element,
					"destination": document.querySelector('.' + da_array[0].trim()),
					"place": da_array[1].trim(),
					"breakpoint": da_array[2].trim()
				}
				number++;
			}
		}
		dynamic_adapt_sort(da_elements_array);
		for (let index = 0; index < da_elements_array.length; index++) {
			const el = da_elements_array[index];
			const da_breakpoint = el.breakpoint;
			const da_type = "max";

			da_match_media.push(window.matchMedia("(" + da_type + "-width: " + da_breakpoint + "px)"));
			da_match_media[index].addListener(dynamic_adapt);
		}
	}

	function dynamic_adapt(e) {
		for (let index = 0; index < da_elements_array.length; index++) {
			const el = da_elements_array[index];
			const da_element = el.element;
			const da_destination = el.destination;
			const da_place = el.place;
			const da_breakpoint = el.breakpoint;
			const da_classname = "_dynamic_adapt_" + da_breakpoint;

			if (da_match_media[index].matches) {
				if (!da_element.classList.contains(da_classname)) {
					let actual_index;
					if (da_place == 'first') {
						actual_index = index_of_elements(da_destination)[0];
					} else if (da_place == 'last') {
						actual_index = index_of_elements(da_destination)[index_of_elements(da_destination).length];
					} else {
						actual_index = index_of_elements(da_destination)[da_place];
					}
					da_destination.insertBefore(da_element, da_destination.children[actual_index]);
					da_element.classList.add(da_classname);
				}
			} else {
				if (da_element.classList.contains(da_classname)) {
					dynamic_adapt_back(da_element);
					da_element.classList.remove(da_classname);
				}
			}
		}
		custom_adapt();
	}

	function dynamic_adapt_back(el) {
		const da_index = el.getAttribute('data-da-index');
		const original_place = original_positions[da_index];
		const parent_place = original_place['parent'];
		const index_place = original_place['index'];
		const actual_index = index_of_elements(parent_place, true)[index_place];
		parent_place.insertBefore(el, parent_place.children[actual_index]);
	}

	function index_in_parent(el) {
		var children = Array.prototype.slice.call(el.parentNode.children);
		return children.indexOf(el);
	}

	function index_of_elements(parent, back) {
		const children = parent.children;
		const children_array = [];
		for (let i = 0; i < children.length; i++) {
			const children_element = children[i];
			if (back) {
				children_array.push(i);
			} else {
				if (children_element.getAttribute('data-da') == null) {
					children_array.push(i);
				}
			}
		}
		return children_array;
	}
	function dynamic_adapt_sort(arr) {
		arr.sort(function (a, b) {
			if (a.breakpoint > b.breakpoint) { return -1 } else { return 1 }
		});
		arr.sort(function(a, b) {
			if (a.place > b.place) { return 1 } else { return -1 }
		});
	}
	function custom_adapt() {
		const viewport_width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	}
	window.addEventListener('resize', function (event) {

	});
});