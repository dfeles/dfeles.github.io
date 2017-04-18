# Import file "currentUX" (sizes and positions are scaled 1:2)

screen_width = Framer.Device.screen.width
screen_height = Framer.Device.screen.height

default_w = 750
default_h = 1334

ratio = screen_width / default_w

Framer.Device.contentScale = ratio


s = Framer.Importer.load("imported/currentUX@2x")
s.statusBar.parent = null


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

s.CTA.parent = root
s.CTA.index = root.index
s.CTA.visible = false

s.recordingBg.opacity = 0
s.recording.scale = 0
s.send.scale = 0
s.sendBg.opacity = 0
s.recordBtn.onClick ->
	s.recordBtn.animate
		properties:
			scale:.5
	s.recordingBg.animate
		properties:
			opacity:1
		time:2
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
		time: 2
	s.recording.animate
		properties:
			scale:0
	s.sendBg.animate
		properties:
			opacity:1
		time:1
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
#onboarding.visible = false


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
	
## WAVES
maxWaveH = 0.01
startDance = (layer) ->
	layer.animationOptions = 
		curve: "linear",
		time: .2
	layer.animate
		scaleY:Utils.randomNumber(0,maxWaveH)
	layer.onAnimationEnd ->
		number = Utils.randomNumber(0,maxWaveH*(layer.index-30)/20)
		layer.animate
			scaleY:number

waves = s.soundWave.subLayers
for wave in waves
	startDance(wave)
s.controllerPause.visible = false
s.controllerPlay.onClick ->
	maxWaveH = 1.5
	s.controllerPause.visible = true
	s.controllerPlay.visible = false
s.controllerPause.onClick ->
	maxWaveH = 0.01
	s.controllerPause.visible = false
	s.controllerPlay.visible = true
	