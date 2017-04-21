# Import file "currentUX" (sizes and positions are scaled 1:2)

screen_width = Framer.Device.screen.width
screen_height = Framer.Device.screen.height
default_w = 750
default_h = 1334
ratio = screen_width / default_w
Framer.Device.contentScale = ratio
Framer.Extras.Hints.disable()

s = Framer.Importer.load("imported/currentUX@2x")
s.statusBar.visible = false


contacts = s.contactList
message = s.messenger

root = new PageComponent
	width: s.messenger.width
	height: s.messenger.height
	scrollVertical: false
	clip: false
	index: 1
	ignoreEvents: true

root.content.draggable = false
root.addPage(contacts)
root.addPage(message)


#send message
s.messageSent.parent = root
s.messageSent.animationOptions = time:.3
s.messageSent.states = 
	show:
		y:s.messageSent.y
		opacity: 1
		scale: 1
	hide:
		y: screen_height
		opacity: 0
		scale: .5
	hide2:
		y:s.messageSent.y - 100
		opacity: 0
		scale: .3
s.messageSent.states.switchInstant("hide")

s.CTA.parent = root
s.CTA.index = root.index

s.recordingBg.opacity = 0
s.recording.scale = 0
s.send.scale = 0
s.sendBg.opacity = 0


maxWaveH2 = 1.5
startDance2 = (layer) ->
	layer.animationOptions = 
		curve: "linear",
		time: .2
	layer.animate
		scaleY:Utils.randomNumber(0,maxWaveH2)
	layer.onAnimationEnd ->
		number = Utils.randomNumber(0,maxWaveH2*(layer.index-30)/20)
		layer.animate
			scaleY:number

secondWaves = s.soundWave.copy()
secondWaves.parent = s.recordingBg
secondWaves.y = screen_height - secondWaves.height/2
for wave in secondWaves.subLayers
	startDance2(wave)

s.recordBtn.onClick ->
	s.recordBtn.animate
		properties:
			scale:.5
	s.recordingBg.animate
		properties:
			opacity:1
		time:.6
	s.recording.animate
		properties:
			scale:1
		time: .3
s.recording.onClick ->
	if root.currentPage.name == "contactList"
		s.sendTo.visible = true
	else
		s.sendTo.visible = false
	s.recordingBg.animate
		properties:
			opacity:0
		time: .6
	s.recording.animate
		properties:
			scale:0
	s.sendBg.animate
		properties:
			opacity:1
		time:.6
	s.send.animate
		properties:
			scale:1
		time: .3
s.send.onClick ->
	s.send.animate
		properties:
			scale:0
	s.sendBg.animate
		properties:
			opacity: 0
	s.recordBtn.animate
		properties:
			scale:1
		time:.3
	s.messageSent.states.switchInstant("hide")
	s.messageSent.states.switch("show")
	Utils.delay 2, ->
		s.messageSent.states.switch("hide2")
	


##onbaording
onboarding = new PageComponent
	width: s.messenger.width
	height: s.messenger.height
	scrollVertical: false
	clip: false
	index: 1
	ignoreEvents: true

onboarding.states = 
	hide:
		x:-s.onb1.width
	show:
		x:0
onboarding.content.draggable = false
onboarding.addPage(s.onb1)
onboarding.addPage(s.onb2)
onboarding.addPage(s.onb3)
onboarding.onClick ->
	next = onboarding.snapToNextPage("right", true)
	if next == undefined
		s.CTA.visible = true
		onboarding.states.switch("hide")



##settings
s.settingsPop.parent = contacts
s.settingsPop.animationOptions = time:.3
s.settingsPop.states = 
	hide:
		y:s.settingsPop.y-10
		opacity: 0
	show:
		y:s.settingsPop.y
		opacity: 1
showPopoup = (bool) ->
	s.settingsPop.states.switch(if bool then "show" else "hide")
	s.popBg.ignoreEvents = !bool
	s.settings.ignoreEvents = !bool
	s.logout.ignoreEvents = !bool
s.avatar.onClick ->
	showPopoup(true)
s.popBg.onClick ->
	showPopoup(false)
s.settings.onClick ->
	s.settingsScreen.states.switch("show")
	showPopoup(false)
s.update.onClick ->
	s.photoScreen.states.switch("show")
	showPopoup(false)
s.logout.onClick ->
	onboarding.states.switch("show")
	onboarding.content.x = 0
	showPopoup(false)
s.updatePhoto.onClick ->
	s.photoScreen.states.switch("show")
	showPopoup(false)
showPopoup(false)

screenState = 
	hide:
		x:root.width
	show:
		x:0
s.photoScreen.states = screenState
s.settingsScreen.states = screenState
s.settingsScreen.animationOptions = time:.3
s.photoScreen.animationOptions = time:.3
s.photoScreen.onClick ->
	s.photoScreen.states.switch("hide")

s.settingsScreen.onClick ->
	s.settingsScreen.states.switch("hide")
	
s.backToContacts.onClick ->
	root.snapToNextPage("left", true)
	
s.mrtContact.onClick ->
	root.snapToNextPage("right", true)
	s.norman.opacity = 0
s.normanContact.onClick ->
	root.snapToNextPage("right", true)
	s.norman.opacity = 1

voiceState = 
	open:
		scale: 1
	close:
		scale: 0
		originY: 1
s.voiceOpen.states = voiceState
s.voiceOpen.animationOptions = time:.3
s.voiceClose.states = voiceState
s.voiceClose.animationOptions = time:.3
s.voiceOpen.states.switchInstant("close")
voiceOpened = false
switchVoice = () ->
	voiceOpened = !voiceOpened
	open = if voiceOpened then "open" else "close"
	close = if !voiceOpened then "open" else "close"
	s.voiceOpen.states.switch(open)
	s.voiceClose.states.switch(close)
s.voiceClose.onClick -> switchVoice()
s.voiceOpen.onClick -> switchVoice()


##contact

contactList = ScrollComponent.wrap(s.contacts)
contactList.content.draggable.horizontal = false




#baszok

s.isTalking.parent = s.messenger
s.isTalking.states =
	hide:
		scale: 0
		opacity: 0
	show:
		scale: 1
		opacity: 1
s.isTalking.states.switchInstant("hide")

actIndex = 5
timeline = new ScrollComponent
	y:s.baszok.y - 15
	height: 80
	width: screen_width
	backgroundColor: "transparent"
	contentInset: 
		right:200
		left: 10
timeline.content.draggable.vertical = false

switchSong = (right) ->
	if right
		s.controllerPause.emit "click"
		s.timestamp.states.switch("swipeLeft")
		Utils.delay .3, ->
			s.controllerPlay.emit "click"
			s.timestamp.states.switchInstant("swipeRight")
			s.timestamp.states.switch("center")
	else
		s.controllerPause.emit "click"
		s.timestamp.states.switch("swipeRight")
		Utils.delay .3, ->
			s.controllerPlay.emit "click"
			s.timestamp.states.switchInstant("swipeLeft")
			s.timestamp.states.switch("center")

timeline.parent = message
baszStates = 
	opened:
		originX:0
		width:200
		saturate: 100
		opacity: 1
	closed:
		originX:0
		width:70
		saturate: 0
		opacity: .3
	new:
		originX:0
		width:70
		saturate: 0
		opacity: 1

adjustBaszok = () ->
	for basz in baszok
		if lastBasz == undefined
			lastBasz = basz
		else
			basz.x = lastBasz.maxX + 10
			lastBasz = basz
	timeline.updateContent()

addNew = () ->
	s.isTalking.states.switch("show")
	Utils.delay 3, ->
		s.isTalking.states.switch("hide")
		createBasz("new")

selectBaszIndex = (index) ->
	selectBasz(baszok[index])
	if index >= baszok.length-1
		s.controllerNext.opacity = .5
		Utils.delay 4, -> addNew()
	else
		s.controllerNext.opacity = 1
	if index <= 0
		s.controllerPrev.opacity = .5
	else
		s.controllerPrev.opacity = 1
	
selectBasz = (layer) ->
	timeline.scrollToLayer(layer, 0.5, 0)
	layer.isRead = true
	for basz in baszok
		state = "closed"
		if basz == layer
			state = "opened"
		else if !basz.isRead
			state = "new"
		basz.states.switch(state)
				
	
baszok = []
createBasz = (state) ->
	basz2 = new Layer
		backgroundColor: "#006ECB"
		borderRadius: 40
		height: 20
		clip:false
		y: 15
	lastItem = baszok[..].pop()
	basz2.parent = timeline.content
	basz2.states = baszStates
	basz2.states.switchInstant(state)
	basz2.isRead = state != "new"
	if lastItem != undefined
		basz2.x = lastItem.x + lastItem.width + 10
	toX = basz2.x
	basz2.x += 100
	basz2.opacity = 0
	basz2.animate
		properties:
			opacity: 1
			x:toX
	basz2.onClick ->
		if actIndex != basz2.index
			switchSong(actIndex < basz2.index)
			actIndex = basz2.index
			selectBasz(basz2)
	basz2.on "change:width", ->
		if basz2.states.current.name == "opened"
			adjustBaszok()
	adjustBaszok()
	if !basz2.isRead
		text = new Layer
			html: "<b>NEW</b>"
			superLayer: basz2
			y: 22
			opacity: 0
			backgroundColor: "transparent"
		text.style["color"] = "#333333"
		text.animate properties: opacity: 1
		Utils.delay 3, ->
			text.animate properties: opacity: 0

	adjustBaszok()
	baszok = timeline.content.subLayers
	
for i in [1..7]
	if i == 7
		createBasz("new")
		selectBaszIndex(actIndex)
	else
		createBasz("closed")

s.timestamp.animationOptions = time:.3
s.timestamp.states =
	swipeRight:
		x:screen_width
	swipeLeft:
		x:-s.timestamp.width
	center:
		x:s.timestamp.x

s.controllerNext.onClick ->
	if actIndex+1 < baszok.length
		actIndex++
		selectBaszIndex(actIndex)
		switchSong(true)
s.controllerPrev.onClick ->
	if actIndex-1 >= 0
		actIndex--
		selectBaszIndex(actIndex)
		switchSong(false)
		
#add new message if message sent
s.messageSent.onAnimationEnd ->
	if s.messageSent.opacity == 0
		Utils.delay 1, -> addNew()


testing = () ->
	root.snapToNextPage("right", false)
	onboarding.visible = false
testing()