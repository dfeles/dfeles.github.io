# Import file "logo" (sizes and positions are scaled 1:2)
s = Framer.Importer.load("imported/logo@2x")
screen_width = Framer.Device.screen.width
screen_height = Framer.Device.screen.height

default_w = 750
default_h = 1334

ratio = screen_width / default_w

Framer.Defaults.Layer.force2d = true

all = new Layer
	width: default_w, height: default_h
	backgroundColor: "white"
	scale: ratio
	originY: 0
	y: 0
all.centerX()

scroll = new ScrollComponent
	size: Screen.size
	scrollHorizontal: false
	padding: 500
	
scroll.contentInset =
	top: 20
	right: 0
	bottom: Screen.size.height/2
	left: 0
s.cover.parent = scroll

_delay = 0
s.assets.parent = all
s.iPhone_7_Copy_22.parent = all
addMessage = (message, delay = .3) ->
	_delay += delay
	Utils.delay _delay, ->
		if scroll.content.children[0] == undefined
			message.y = s.cover.height
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

s.arno.onClick ->
	_delay = 0
	newAns = s.ans7.copy()
	addMessage(newAns, 0)


# Variables
pageCount = 8
gutter = 60

# Create PageComponent
pageScroller = new PageComponent
	point: Align.center
	width: default_w
	height: default_h
	scale: ratio
	scrollVertical: false
	clip: false
	parent: all
	
scroll.parent = pageScroller.content
