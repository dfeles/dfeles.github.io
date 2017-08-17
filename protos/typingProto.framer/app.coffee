# Show Hints
Framer.Extras.Hints.disable()

screen_width = Framer.Device.screen.width
screen_height = Framer.Device.screen.height
default_w = 750
default_h = 1334
ratio = screen_width / default_w
Framer.Device.contentScale = ratio
Framer.Extras.Hints.disable()
## PUT EVERYTHING IN ALL
all = new Layer
	width: default_w, height: default_h
	scale: ratio
	backgroundColor: "transparent"


contacts = [["Enda","images/avatars/enda.jpg",undefined, "#A8253D"], ["Mike","images/avatars/mike.jpg",undefined, "#C9C7AF"], ["Christine","images/avatars/christine.jpg",undefined, "#E6D400"],["Robert","images/avatars/robert.jpg",undefined, "#DB9F98"], ["Vista","images/avatars/vista.jpg",undefined, "#F3521A"]]

inputIncome.text = ""
input.text = ""

rita = new VideoLayer
    video: "images/rita.MP4"
    width: myimage.width
    height: myimage.height
dani = new VideoLayer
    video: "images/dani.mp4"
    width: myimage.width
    height: myimage.height
    
bg = new BackgroundLayer
	backgroundColor: "rgba(30,30,30,1)"

hideLayer = (layer) ->
	layer.animate
		opacity: 0
		options:
			curve: Spring(damping: 0.5)
			time: 0.5
showLayer = (layer) ->
	layer.opacity = 0
	layer.visible = true
	layer.animate
		opacity: 1
		options:
			curve: Spring(damping: 0.5)
			time: 0.5

##setup scroll
inputScroll = new ScrollComponent
	width: content.width
	height: 100
	y: input.y - 50
	parent: content
	contentInset:
		left: 25
		right: 110 
input.parent = inputScroll.content
input.y = 50
inputScroll.scrollVertical = false
inputScroll.updateContent()
inputScroll.scrollToLayer(input)
inputScroll.sendToBack()

incomeScroll = new ScrollComponent
	width: content.width
	height: 100
	y: inputIncome.y - 50
	parent: content
	scrollVertical: false
	contentInset:
		left: 25
		right: 110
incomeScroll.sendToBack()
inputIncome.parent = incomeScroll.content
inputIncome.y = 50
incomeScroll.updateContent()
incomeScroll.scrollToLayer(inputIncome)

lastX = 55
selected = 0
tapable = true
starttime = 0
design.parent = all
name = new TextLayer
	textAlign: Align.center
	y: 223
	x: 283
	width: 100
	fontSize: 14
	fontWeight: 300
	color: 'white'
	parent: all
contacts.forEach (con, i) ->
	newContact = contact.copy()
	newContact.parent = all
	newContact.id2 = i
	
	newContact.x = lastX
	lastX += contact.width + 8
	newContact.nameLabel = newContact.childrenWithName('textLabel')[0]
	newContact.avatar = newContact.childrenWithName('avatar')[0]
	newContact.unread = newContact.childrenWithName('unread')[0]
	newContact.noti = newContact.childrenWithName('noti')[0]
	newContact.avatar.image = con[1]
	newContact.nameLabel.text = con[0]
	con[2] = newContact
	newContact.makeUndread = (unread) ->
		newContact.isUnread = unread
		if unread
			showLayer(newContact.unread)
			showLayer(newContact.noti)
			newContact.nameLabel.fontWeight = 700
		else
			hideLayer(newContact.unread)
			hideLayer(newContact.noti)
			newContact.nameLabel.fontWeight = 300
			
	newContact.hideStuff = (hide) ->
		if hide || selected == newContact.id2
			hideLayer(newContact.nameLabel)
			hideLayer(newContact.unread)
			hideLayer(newContact.noti)
		else
			showLayer(newContact.nameLabel)
			newContact.makeUndread(newContact.isUnread)
			
	
	newContact.draggable = true
	newContact.draggable.overdrag = false
	newContact.draggable.bounce = false
	newContact.draggable.momentum = false

	newContact.avatar.origx = newContact.avatar.x
	newContact.avatar.origy = newContact.avatar.y
	newContact.origx = newContact.x
	newContact.origy = newContact.y
	newContact.avatar.animationOptions = time: .3
	newContact.animationOptions = time: .3
	newContact.onTapStart ->
		starttime = Utils.getTime()
		newContact.hideStuff(true)
		newContact.bringToFront()
		newContact.avatar.animate
			properties:
				width: 80
				height: 80
				x: newContact.avatar.origx - 17
				y: newContact.avatar.origy - 17
	
	newContact.on Events.TapEnd, (event, layer) ->
		touch = Events.touchEvent(event)
		activate = touch.clientY > header.maxY || Utils.getTime() - starttime < .1
		if activate
			select(newContact.id2)
			if newContact.isUnread
				incomingMessage('Hey Bob, how are you today? Do you wanna meet tonight? ')
			else
				stopIncoming()
		sortArray()

floatOut = (layer) ->
	if layer.text == ''
		return
	float = layer.copy()
	float.parent = layer.parent
	float.animate
		properties:
			opacity: 0.05
			# y: float.y - 15
		time: 1
		delay: 1
	layer.text = ""
	layer.x = float.maxX + 10

cleanScrolls = () ->
	inputScroll.content.children.forEach (it) ->
		if it.index == 1
			it.text = ""
		else
			it.destroy()
	incomeScroll.content.children.forEach (it) ->
		if it.index == 1
			it.text = ""
		else
			it.destroy()

select = (num) =>
	selected = num
	cleanScrolls()
	con = contacts[num]
	name.text = con[0]
	bg.animate
		properties:
			backgroundColor: con[3]
	
	if(num == 2)
		dani.player.play()
		rita.player.play()
		showLayer(rita)
	else
		rita.player.pause()
		dani.player.play()
		rita.visible = false

sortArray = () => 
	lastX = 55
	contacts.forEach (con, i) ->
		view = con[2]
		isSelected = view.id2 == selected
		scale = if isSelected && i==2 then 1.3 else 1
		view.avatar.animate properties:
			x: view.avatar.origx - if isSelected then 17 else 0
			y: view.avatar.origy - if isSelected then 17 else 0
			width: if isSelected then 60 else 46
			height: if isSelected then 60 else 46
			scale: scale
		view.animate properties:
			x: if isSelected then 310 else lastX
			y: if isSelected then 162 else view.origy
		
		view.hideStuff(false)
		if !isSelected
			lastX += contact.width + 8

contact.destroy()
contacts[0][2].isUnread = true
contacts[1][2].isUnread = false
contacts[2][2].isUnread = true
contacts[3][2].isUnread = false
contacts[4][2].isUnread = false
select(0)
sortArray()


scrollAdjust = (layer) ->
	scroll = layer.parent.parent
	scroll.updateContent()
	scroll.scrollToLayer(
		layer
		0, 0
		true
		curve: Spring(tension: 100, friction: 25)
	)
		
updateText = (char, layer) ->
	if char == 'back' 
		input.text = input.text.slice(0, -1);
	else if char == 'space' || char == ' '
		floatOut (layer)
		layer.text = ""
	else
		layer.text += char
	scrollAdjust(layer)

keyb.children.forEach (key) ->
	key.onClick ->
		updateText(key.name, input)
		
interval = null
textToWrite = ""

pause = 0
clearInterval(interval)

typeMsg = () ->
	lastLetter = textToWrite[0]
	if pause != 0
		pause--
		return
	if (lastLetter != undefined)
		if (textToWrite[1] == ' ')
			pause = inputIncome.text.length
		updateText(lastLetter, inputIncome)
		textToWrite = textToWrite.substring(1);
	else
		clearInterval(interval)

stopIncoming = () ->
	textToWrite = ""
	inputIncome.text = ""
	clearInterval(interval)
	
incomingMessage = (msg) ->
	Utils.delay 1, ->
		stopIncoming()
		textToWrite = msg
		inputIncome.color = contacts[selected][3]
		interval = setInterval(typeMsg, 100)



typing = (event) ->
	keyCode = event.which
	if keyCode == 8
		updateText('back', input)
	else
		key = String.fromCharCode(keyCode)
		updateText(key, input)
		
document.onkeydown = typing

wallscreen.parent = all
wallscreen.x = 0
wallscreen.animationOptions = time: .3
wallscreen.onClick ->
	wallscreen.ignoreEvents = true
	wallscreen.animate
		scale:1.4
		opacity: 0
notifi.scale = .3
notifi.opacity = 0
notifi.animate 
	properties:
		scale: 1
		opacity: 1
	delay: 1
i = 0

setupScroll = (scroll) ->
	scroll.on Events.Move, ->
		scroll.content.children.forEach (it) -> 
			if it.index != 1
				val = 1 - Math.abs((scroll.scrollX - (it.maxX - scroll.width) - 80) / 300)
				#it.opacity = val*val
				#it.scale = val*val / 4 + .75
setupScroll(inputScroll)
setupScroll(incomeScroll)

input.style = 'min-width' : 300

debug = () ->
	wallscreen.destroy()
debug()

rita.parent = contacts[2][2].avatar

rita.player.autoplay = true
rita.player.loop = true
rita.visible = false

dani.parent = myimage

dani.player.autoplay = true
dani.player.loop = true
dani.visible = false

cameraOn = false
myimage.onClick ->
	if !cameraOn
		showLayer(dani)
		rita.player.play()
		dani.player.play()
	else
		dani.visible = false
		dani.player.pause()
		rita.player.play()
	cameraOn = !cameraOn
	scale = if dani.visible then 1.3 else 1
	myimage.animate scale:scale