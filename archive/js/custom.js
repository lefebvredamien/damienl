$(document).ready(function () {
	$('#fullpage').fullpage({
		'verticalCentered': false,
		'scrollingSpeed': 600,
		'autoScrolling': false,
		'css3': true,
		'navigation': true,
		'navigationPosition': 'right',
	});
});

// wow
$(function () {
	new WOW().init();
	$(".rotate").textrotator();
})

function getYearsDiff(date1, date2) {
	var diff = Math.floor(date1.getTime() - date2.getTime());
	var day = 1000 * 60 * 60 * 24;

	var days = diff / day;
	var months = days / 31;
	var years = Math.round(months / 6) / 2;

	return years
}

var element = document.getElementById("years_working");
element.setAttribute("data-count", getYearsDiff(new Date(), new Date(2019, 4, 6)));

var counter_flag = 0;
$(window).scroll(function () {

	var oTop = $('#counter').offset().top - window.innerHeight;
	if (counter_flag == 0 && $(window).scrollTop() > oTop) {
		$('.counter-value').each(function () {
			var $this = $(this),
				countTo = $this.attr('data-count');
			$({
				countNum: $this.text()
			}).animate({
				countNum: countTo
			},

				{

					duration: 3000,
					easing: 'swing',
					step: function () {
						$this.text(Math.floor(this.countNum));
					},
					complete: function () {
						$this.text(this.countNum);
						//alert('finished');
					}

				});
		});
		counter_flag = 1;
	}

});

$('#phone_tooltip').tooltip({ delay: { hide: 200 } });

const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {        document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
    }    
}

toggleSwitch.addEventListener('change', switchTheme, false);
