# Import file "logo" (sizes and positions are scaled 1:2)
s = Framer.Importer.load("imported/logo@2x")
screen_width = Framer.Device.screen.width
screen_height = Framer.Device.screen.height
s.assets.visible = false

default_w = 750
default_h = 1334

ratio = screen_width / default_w

Framer.Defaults.Layer.force2d = true
Framer.Device.contentScale = ratio

all = new Layer
	width: default_w, height: default_h
	backgroundColor: "#FFFFFF"

scroll = new ScrollComponent
	size: all.size
	scrollHorizontal: false
	padding: 500
	
scroll.contentInset =
	top: 20
	right: 0
	bottom: Screen.size.height/2
	left: 0
	


# Create PageComponent
pageScroller = new PageComponent
	point: Align.center
	width: all.width
	height: all.height
	scrollVertical: false
	clip: false
	parent: all
	
scroll.parent = pageScroller.content

_delay = 0
addMessage = (message, delay = .3) ->
	_delay += delay
	Utils.delay _delay, ->
		if scroll.content.children[0] == undefined
			message.y = s.header.height
		else
			message.y = scroll.content.children.reverse()[0].maxY + 50
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
			
		scroll.content.addChild(message)
		if(message.y > scroll.size.height/2)
			scroll.content.animate
				y: -message.y + scroll.size.height/2
		
	if scroll.content.height <= scroll.height
	else
	
addMessage(s.text1)
addMessage(s.text2,.6)
addMessage(s.text3, .6)
addMessage(s.ans4, 1.7)
addMessage(s.text5, 1.7)
addMessage(s.text6, 1.7)
addMessage(s.ans7, 1.7)

##### HEADER part
header = s.header
sel = s.selector
buttons = [[s.gym_but,s.gym_but_active], [s.stats_but,s.stats_active], [s.message_but,s.mess_active]]

header.parent = all
header.x = -8
header.y = -8

buttons.forEach (d,y) ->
	d[0].on 'click', ->
		sel.animate
			properties:
				x:d[0].x - (sel.width - d[0].width)/2
				hueRotate: 120
		buttons.forEach (it,i) ->
			if it != d
				it[0].animate
					properties:
						opacity: .6
						scale: .8
				it[1].animate
					properties:
						opacity: 0
		d[0].animate
			properties:
				opacity: 1
				scale: 1
		d[1].animate
			properties:
				opacity: 1
s.message_but.emit 'click'
