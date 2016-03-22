$(document).ready(function() {
	init();
});


function init(){
    vph = $(window).height();
    $('.full-page').css('height',vph);
	setInfoButton();
	
	$('.infoblock').click(
		showActualInfo
	);
	
	$('.fastfood').click(
		showHamburgerMenu
	);
	$('.navigator').click(
		showHamburgerMenu
	);
	
	
	
	whoToWelcome = window.location.href.split('#')[1];
	if(typeof whoToWelcome != 'undefined' && whoToWelcome != 'prezi' && whoToWelcome != 'nomnomnom' && whoToWelcome != 'welcomeScreen' && whoToWelcome != 'refreqProject' && whoToWelcome != 'otherProjects' && whoToWelcome != 'contactMe'  ){
		$('#hello').text("Hello "+whoToWelcome+".");
	}
}

$(window).resize(function(){
    vpw = $(window).width();
    vph = $(window).height();

    $('.full-page').css('height',vph);
    
});

var intervalKey = setInterval(setInfoButton, 500);


var actualScreen = 0;

function showActualInfo(){
	$('.moreinfotext').fadeOut("slow");
	if($('.moreinfoblock').css('display') == 'none'){
		$('#tellMeMore').attr("src", 'exit.png');
		$('.moreinfoblock').fadeIn("slow");
		
		$('html, body').css({'overflow':'hidden'});
    }else{
		$('#tellMeMore').attr("src", 'tellMeMore.png');
		$('.moreinfoblock').fadeOut("slow");
		$('html, body').css({'overflow':'auto'});
    }
    setupInfoTexts (actualScreen)
}

function showHamburgerMenu(){
	if($('.navigator').css('display') == 'none'){
		$('.navigator').fadeIn("fast");
		$('.hamburger').css('height', '100%');
    }else{
		$('.navigator').fadeOut("fast");
		$('.hamburger').css('height', 'Auto');
    }
}

function setInfoButton(){
	if($('.moreinfoblock').css('display') == 'none'){
	    if(isScrolledIntoView('.danihead')){
			actualScreen=0
			$('.tellmemore').css( "opacity", "1" );
			//$('.tellmemore').css( "background-color", "#00ff00" );
		} else if(isScrolledIntoView('.firstproject')){
			$('.tellmemore').css( "opacity", "1" );
			if($('.prezislide4').css("visibility")=="visible"){
	    	
				actualScreen=5
				//$('.tellmemore').css( "background-color", "#000044" );
	    	}
			
			if($('.prezislide3').css("visibility")=="visible"){
	    	
				actualScreen=4
				//$('.tellmemore').css( "background-color", "#000044" );
	    	}
			if($('.prezislide2').css("visibility")=="visible"){
	    	
				actualScreen=3
				//$('.tellmemore').css( "background-color", "#000044" );
	    	}else if($('.prezislide1').css("visibility")=="visible"){
	    	
				actualScreen=2
				//$('.tellmemore').css( "background-color", "#000099" );
	    	
	    	}else if($('.prezislide0').css("visibility")=="visible"){
	    	
				actualScreen=1
				//$('.tellmemore').css( "background-color", "#0000FF" );
	    	
	    	}else{
	    		
				//$('.tellmemore').css( "background-color", "#0000ff" );
			}
		}
		else if(isScrolledIntoView('.secondproject')){
		
			actualScreen=6
			$('.tellmemore').css( "opacity", "1" );
			//$('.tellmemore').css( "background-color", "#ff0000" );
		}
		else if(isScrolledIntoView('.refreqproject')){
		
			actualScreen=7
			$('.tellmemore').css( "opacity", "1" );
			//$('.tellmemore').css( "background-color", "#ff0000" );
		}
		else if(isScrolledIntoView('.reonion')){
		
			actualScreen=8
			$('.tellmemore').css( "opacity", "1" );
			//$('.tellmemore').css( "background-color", "#ff0000" );
		}
		else if(isScrolledIntoView('.otherprojects')){
		
			actualScreen=9
			$('.tellmemore').css( "opacity", "1" );
			//$('.tellmemore').css( "background-color", "#ff0000" );
		}
		else if(isScrolledIntoView('#contactMe')){
		
			actualScreen=10
			$('.tellmemore').css( "opacity", "1" );
			//$('.tellmemore').css( "background-color", "#ff0000" );
		}else{
			$('.tellmemore').css( "opacity", ".1" );
		}
			
		setupInfoTexts (actualScreen)
	}
}

function isScrolledIntoView(elem)
{
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top+300;
    var elemBottom = elemTop + $(elem).height() - 600;


    return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
}

function setupInfoTexts (i){

	$('h1','.infotitle').html(infoTexts[i][0]);
	$('p','.infodescription').html(infoTexts[i][1]);
}

var infoTexts = 
	[
		["Welcome screen",
		"Whenever you press the info button, I will tell you more about the current project.<br>For example here, You might wonder, why the hell did I put this ancient Japanese painting here.<br><br>And what is a full stack product designer anyway?<br><br><center><img src=\"fullstackproductdesigner.png\" height=442></center>"],
		["Prezi",
		"In February 2012 I joined Prezi as a UI Designer, which allows me to mix my rapid prototyping skills with design challenges as part of the team.<br><br>During this three years I've learnt incredible amount of things, mainly related to product design, but also a lot about user testing, user experience, programming, clean coding, data-mining. I tried to understand every little aspects of the work happening inside the company.<br><br>Before Prezi, I was working at Kitchen Budapest for almost five years, where we worked on a lots of projects paralelly, so we had to design, implement and iterate really fast, which quite often resulted pretty hacky solutions.<br>At Prezi I had the chance to focus more on a specific task, and try to solve it the best way, but bringing inside the experience I've learnt at Kitchen Budapest just resulted even more exciting outcomes.<br>The hacker way of thinking (trying to understand how things are working in the background) met with the designer mind, which tries to let everyone understand, how things are working."],
		["Prezi for Mac",
		"This was one of my main projects at Prezi in the last two years.<br><br>Working on Prezi Desktop was one of the most challenging project I've ever worked on.<br>In the first year, I needed to follow all the technology dependencies and try to get the most out of it. We used Adobe Air technology, which is by far not the best system for designing in a native environment, still we needed to implement a whole syncing workflow to the existing software.<br><br>A year ago we started designing and implementing Prezi for Mac, which this time was planned to be in a native environment<br>A year ago we started designing and implementing Prezi for Mac.<br>This time we had enough developers to create a native app, which enabled me to start thinking about the vision, how will we create a native experiment in terms of workflows/interactions/design, which fits well with the current Mac OS, but also how will we keep our main brand elements.<br><br>Working on Prezi for Mac involved:<br>• a huge amount of research<br>• enormous* number of prototypes starting from <a href='https://www.youtube.com/watch?v=h78PR1ukVJE' target='_blank'>high level</a> <a href='https://www.youtube.com/watch?v=bkhQ_yz5s4A' target='_blank'>workflows</a> <a href='https://www.youtube.com/watch?v=b-rvJVYnnI4' target='_blank'>going</a> into <a href='https://www.youtube.com/watch?v=HRNGMyb0KY4' target='_blank'>details</a>, <a href='https://www.youtube.com/watch?v=R6AEHv9BmSE' target='_blank'>like</a> <a href='https://www.youtube.com/watch?v=31Wh3aCJDY4' target='_blank'>animations</a><br>• uncountable testing<br><br><br>*the original Johnatan Ive promo word"],
		["Prezi for Windows",
		"This was the other main project of mine at Prezi in the last two years.<br>Basically everything I've said at Prezi for Mac panel applies here, so I will just repeat myself:<br><br>Working on Prezi Desktop was one of the most challenging project I've ever worked on.<br>In the first year, I needed to follow all the technology dependencies and try to get the most out of it. We used Adobe Air technology, which is by far not the best system for designing in a native environment, still we needed to implement a whole syncing workflow to the existing software.<br><br>A year ago we started designing and implementing Prezi for Windows.<br>This time we had enough developers to create a native app, which enabled me to start thinking about the vision, how will we create a native experiment in terms of workflows/interactions/design, which fits well with the current Windows OS, but also how will we keep our main brand elements.<br><br>Working on Prezi for Windows involved:<br>• a huge amount of research<br>• enormous* number of <a href='https://www.youtube.com/watch?v=vpeZIHGNXmA' target='_blank'>prototypes</a> starting from <a href='https://www.youtube.com/watch?v=VLD16srV7Zs' target='_blank'>high</a> level <a href='https://www.youtube.com/watch?v=WDcXHrb97Z0' target='_blank'>workflows</a> going into details, like <a href='https://www.youtube.com/watch?v=c5wAAW2aNBI' target='_blank'>animations</a><br>• uncountable testing<br><br><br>*I'm not sure Balmer was ever using this word..."],
		["PPW",
		"At 2014 Prezi's company wide week long meeting, we decided to build a visual identity for the companies values.<br> This time we wanted to do something entirely new, so we decided to use abstract graphic elements and animations.<br><br><object width=\"594\" height=\"430\" data=\"star2.swf\"></object><br><br>I used code for the animations, allowing us to mockup small details at high speed - things like the length of an explosion. The use of random numbers added a natural feeling to the all the movements while the random color changes create the feeling of a never ending, always changing loop.<br><br><a href='https://github.com/dfeles/PreziPowerWeekAnimation' target='_blank'> the code is available on GitHub</a><br> <br><center><a href='https://www.behance.net/gallery/22019005/Generative-Identity-for-Prezi-Power-Week-2014' target='_blank'>more info</a></center>"],
		["Prezi Collaboration Map",
		"At Prezi, we captured how people are collaborating in three days.<br>https://map.prezi.com/"],
		["Nomnomnom",
		"I believe the most viable ideas come from everyday needs. nomnomnom is a small project I'm doing with my girlfriend. <br>It helps you to find your lunch menu, but unlike every other solutions today (foursquare, yelp etc.), you can focus on the food around you first and check the venue only if you are interested in. <br><br>"],
		["Refreq2",
		"refreq is my diploma project at Moholy-Nagy University of Art and Design - Media Design MA course.<br><br>With refreq, not only can you load music files into the program, but also images. But what does that mean?<br>Well, after you’ve imported an .mp3, the program first analyzes the track. Once the analysis is complete, the program can then draw its frequency spectrum -- or, in other words, the image of the music.<br><br>Once the image has been created, you can play it back with refreq -- and you can actually hear the original music play!<br>But instead of just exploring the image you’ve generated, you can now take that image and create a whole new sound. Just export it as a .png, manipulate it with your preferred image-editing software, like Photoshop, and then import it back into refreq.<br>After you’ve explored your own generated image, try importing a different .png or jpg. See what different patterns sound like, maybe a mandala, the floor plan of your apartment...or even the Mona Lisa! Now you can listen to these images with refreq.<br><br>The original concept comes from a small psychedelic story.<br><i>One day when I woke up, I had a strong feeling that the track I’d just heard while sleeping would be perfect for a documentary that I happened to be working on -- except that it would have to be rotated 90 degrees. Despite having never worked with sound before, I was so inspired by this idea that I started to dig deep into the physics of sound. Through my research, I discovered aspects of the sound world I’d never heard before -- spectrograms, harmonies -- that only generated more curiosity. All of this lead me to build this audio project,  which I’ve called refreq.</i><br><br><center><a href='http://refreq2.com' target='_blank'>Read more, download the software and play!</a></center>"],
		["reOnion"
		,"I have spent more than half a year on this project, an interactive installation, which was exhibited on <b>Burning Man 2011</b><br><br>The interactive installation is a garlic-shape structure reacting the visitor’s resonances with light and projection. The structure is divided into six cabins.<br>The cabins are covered with UTOPLAST of recycled plastic overlay. The output is defined by the entering visitor and generated by her\his heartbeat.<br><br>reOnion installation is an initiation ritual to a special physical and virtual space with its own rules. It is a connecting sphere of inside and outside, me and them, you and I."],
		["Other projects","More stuff are coming here later..."],
		["Contact me","I'm nice."]];