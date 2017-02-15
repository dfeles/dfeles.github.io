s = Framer.Importer.load("imported/logo@2x")
screen_width = Framer.Device.screen.width
screen_height = Framer.Device.screen.height
s.assets.visible = false

default_w = 750
default_h = 1334

ratio = screen_width / default_w

Framer.Defaults.Layer.force2d = true
Framer.Device.contentScale = ratio

header = s.header
sel = s.selector
buttons = [[s.stats_but,s.stats_active, s.sel_stat], [s.message_but,s.mess_active, s.sel_mes], [s.gym_but,s.gym_but_active, s.sel_gym]]

Framer.Extras.Hints.disable()

##usefull stuff

hide = (obj) ->
	obj.animate
		opacity:0
	obj.onAnimationEnd ->
		if obj.opacity == 0
			obj.visible = false

show = (obj, delay = 0) ->
	obj.opacity = 0
	obj.visible = true
	obj.animate
		opacity:1
		options:
			delay: delay



slowdown = 1.2
slow = (ms) ->
	return ms * slowdown
Framer.Defaults.Animation =
	time: slow 0.3

all = new Layer
	width: default_w, height: default_h
	scale: ratio
	backgroundColor: "#FFFFFF"
all.center()

pageScroller = new PageComponent
	width: all.width
	height: all.height
	scrollVertical: false
	backgroundColor: "black"
	clip:true
	parent: all

messenger = new ScrollComponent
	size: all.size
	scrollHorizontal: false
	backgroundColor: 'white'

bgLayer = new Layer
	width: all.width
	height: 10000
	backgroundColor: 'white'
	parent: messenger.content

stats = new ScrollComponent
	width: all.width
	height: all.height
	scrollHorizontal: false
	
messenger.contentInset =
	top: 100
	right: 0
	bottom: 1000
	left: 0	
	
stats.contentInset =
	top: 100
	right: 0
	bottom: screen_height / 4
	left: 0


s.stats.parent = stats.content
s.stats.x = 0
s.stats.y = 0
pageScroller.addPage(stats, "right")
pageScroller.addPage(messenger, "right")
pageScroller.addPage(s.goal, "right")
pageScroller.snapToPage(messenger, false)

pageScroller.content = pageScroller.width
s.stats_but.onClick ->
	pageScroller.snapToPage(stats)
s.message_but.onClick ->
	pageScroller.snapToPage(messenger)
s.gym_but.onClick ->
	pageScroller.snapToPage(s.goal)


_delay = 0
staty = s.staty
staty.x = 10
staty.y = 0
staty.opacity = 0
staty.parent = messenger.content


coach = s.coach
coach.maxX = screen_width - 10
coach.y = 0
coach.opacity = 0
coach.parent = messenger.content
addMessage = (message, delay = .3) ->
	_delay += delay
	Utils.delay slow(_delay), ->
		if messenger.content.children[0] == undefined
			message.y = s.header.height
		else
			lastItem = messenger.content.children.reverse()[0]
			message.y = lastItem.maxY + 6
			if lastItem.name[0] != message.name[0]
				message.y += 30
		message.x += s.text.x
		message.opacity = 0
		if (message.name[0] == "t")
			message.x = message.x-30
			message.animate
				x:message.x+30
				opacity:1
			staty.animate
				y:message.maxY-45*2
				opacity: 1
		else if (message.name[0] == "c")
			message.x = message.x+30
			message.animate
				x:message.x-30
				opacity:1
			coach.animate
				y:message.maxY-45*2
				opacity: 1
		else
			message.centerX
			message.y += 150
			message.animate
				y:message.y-150
				opacity:1
		
		messenger.content.addChild(message)
		Utils.delay slow(.3), ->
			if(message.y > messenger.size.height / 2)
				messenger.content.animate
					y: -message.y + messenger.size.height / 2
		
	if messenger.content.height <= messenger.height
	else
	
	
##### HEADER part

header.parent = pageScroller
header.x = -8
header.y = -8

pageScroller.on "change:currentPage", ->
	current = pageScroller.horizontalPageIndex(pageScroller.currentPage)
	animateHeader(buttons[current])

animateHeader = (d) ->
	sel.animate
		properties:
			x:d[0].x - (sel.width - d[0].width) / 2
	buttons.forEach (it,i) ->
		if it != d
			it[0].animate
				properties:
					opacity: .6
					scale: .8
			it[1].animate
				properties:
					opacity: 0
			it[2].animate
				properties:
					opacity: 0
	d[0].animate
		properties:
			opacity: 1
			scale: 1
	d[1].animate
		properties:
			opacity: 1
	d[2].animate
		properties:
			opacity: 1

buttons.forEach (d,y) ->
	d[0].on 'click', ->
		animateHeader(d)
		
s.message_but.emit 'click'

s.footer.parent = messenger
s.footer.x = 0
s.footer.y = screen_height-s.footer.height

s.suggestions.opacity = 0
messenger.content.height = 10000

addHowOften = () ->
	s.sug_often.parent = s.footer
	s.sug_often.opacity = 0
	s.sug_often.y = 0
	s.sug_often.x = -135
	s.sug_often.animate
		opacity: 1
	s.sug_often.onClick ->
		s.sug_often.destroy()
		_delay = 0
		addMessage(s.ans7,0)
		addMessage(s.text8,1)
		addMessage(s.coach1,2)
		addMessage(s.coach2,2)
		addMessage(s.coach3,1)
		addMessage(s.coach4,1)
		Utils.delay 7, ->
			s.sug_gym_time.y = 0
			s.sug_gym_time.x = 100
			s.sug_gym_time.parent = s.footer
			show(s.sug_gym_time)
			_delay = 0
			s.sug_gym_time.onClick ->
				addMessage(s.ans8,0)
				s.sug_gym_time.destroy()
				addMessage(s.coach5,1)
				addMessage(s.coach6,1)
				addMessage(s.coach7,2)
		
		
		s.coach7.onClick ->
			s.gym_but.emit 'click'
			pageScroller.snapToPage(s.goal)
			

addGymLocation = () ->
	_delay = 0
	addMessage(s.ans4,0)
	addMessage(s.text5, 1)
	addMessage(s.text6, 2)
	Utils.delay slow(3), ->
		addHowOften()

addSuggestions = () ->
	sug = s.suggestions
	sug.parent = s.footer
	sug.y = 0
	sug.maxX = screen_width/2+180
	sug.animate
		opacity: 1
		
	sug.onClick ->
		s.suggestions.destroy()
		s.map_okay.opacity = 0
		s.mapScreen.x = 0
		s.mapScreen.y = 0
		s.mapScreen.opacity = 0
		s.mapScreen.index = 100
		s.mapScreen.animate
			opacity: 1
		s.map_autoCorrect.onClick ->
			s.map_okay.animate
				opacity: 1
			s.map_autoCorrect.visible = false
			s.map_okay.onClick ->
				s.mapScreen.animate
					opacity: 0
				s.mapScreen.on Events.AnimationEnd, (animation, layer) ->
					s.mapScreen.visible = false
					addGymLocation()


#### Onboarding

s.avatar.onClick ->



addMessage(s.text1)
addMessage(s.text2,1)
addMessage(s.text3, 2)
Utils.delay slow(4), ->
	addSuggestions()
	



#### Select program
s.streetGym.opacity = 0
s.bacsi.opacity = 0
s.selectProgram.onClick ->
	s.startProgram.parent = all
	s.startProgram.x = 0
	s.startProgram.y = 0
	s.startProgram.index = 100
	show(s.startProgram)
	programPager = new PageComponent
		width: all.width
		height: s.street.height+s.street.y
		parent: s.startProgram
		scrollVertical: false
	programs = [s.street, s.muscle, s.fat, s.cardio]
	programs.forEach (it) ->
		programPager.addPage(it)
	programPager.snapToPage(s.street)
	
	origDotX = s.selectedDot.x
	programPager.on "change:currentPage", ->
		current = programPager.currentPage
		i = programPager.horizontalPageIndex(current)
		s.selectedDot.animate
			x:origDotX + i*40
		programs.forEach (it,b) ->
			if it == current
				current.animate
					scale: 1
					opacity:1
					rotation: 0
			else
				it.animate
					scale: .8
					opacity:.8
					rotation: 3
	s.cancel.onClick ->
		hide(s.startProgram)
	
	s.streetGym.y = 0
	s.streetGym.x = 0
	s.streetGym.parent = s.goal
	s.start.onClick ->
		hide(s.startProgram)
		hide(s.selectProgram)
		show(s.bacsi,.3)
		show(s.streetGym, .3)
		show(s.streetMessage, .8)
		show(s.streetProgress, 1.5)
		show(s.timeline, 2)
		
	s.timelineCover.opacity = 0
	timelineScroll = new ScrollComponent
		size:all.size
		parent:s.goal
		backgroundColor: "transparent"
	timelineScroll.onMove ->
		delta = timelineScroll.content.y
		s.timelineCover.opacity = -delta/200
		
		if delta > 0
			s.streetGym.opacity = 1 - delta/100
	s.timeline.parent = timelineScroll.content