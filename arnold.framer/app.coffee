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


stats = new ScrollComponent
	width: all.width
	height: all.height
	scrollHorizontal: false
	
messenger.contentInset =
	top: 100
	right: 0
	bottom: screen_height / 4
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
addMessage = (message, delay = .3) ->
	_delay += delay
	Utils.delay _delay, ->
		if messenger.content.children[0] == undefined
			message.y = s.header.height
		else
			message.y = messenger.content.children.reverse()[0].maxY + 50
		message.x += s.text.x
		message.opacity = 0
		if (message.name[0] == "t")
			message.x = message.x-30
			message.animate
				x:message.x+30
				opacity:1
		else
			message.x = message.x+30
			message.animate
				x:message.x-30
				opacity:1
			
		messenger.content.addChild(message)
		if(message.y > messenger.size.height / 2)
			messenger.content.animate
				y: -message.y + messenger.size.height / 2
		
	if messenger.content.height <= messenger.height
	else
	
addMessage(s.text1)
addMessage(s.text2,.6)
addMessage(s.text3, .6)
addMessage(s.ans4, 1.7)
addMessage(s.text5, 1.7)
addMessage(s.text6, 1.7)
addMessage(s.ans7, 1.7)

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
			options:
				time: .3
	buttons.forEach (it,i) ->
		if it != d
			it[0].animate
				properties:
					opacity: .6
					scale: .8
					options:
						time: .3
			it[1].animate
				properties:
					opacity: 0
					options:
						time: .3
			it[2].animate
				properties:
					opacity: 0
					options:
						time: .3
	d[0].animate
		properties:
			opacity: 1
			scale: 1
			options:
				time: .3
	d[1].animate
		properties:
			opacity: 1
			options:
				time: .3
	d[2].animate
		properties:
			opacity: 1
			options:
				time: .3

buttons.forEach (d,y) ->
	d[0].on 'click', ->
		animateHeader(d)
		
s.message_but.emit 'click'

