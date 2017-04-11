# Import file "controllers" (sizes and positions are scaled 1:2)
s = Framer.Importer.load("imported/controllers@2x")


startShake = (layer, max) ->
	layer.animationOptions = 
		curve: "linear",
		time:.2
	layer.animate
		scale:Utils.randomNumber(.5,max)
	layer.onAnimationEnd ->
		number = Utils.randomNumber(.5,max)
		layer.animate
			scale:number
			opacity: 1.8-number

startAnim = (layer) ->
	bg = layer.childrenWithName("bg")[0]
	bg.animationOptions = time:.3
	play = layer.childrenWithName("play")[0]
	avatar = layer.childrenWithName("avatar")[0]
	smallAura = layer.childrenWithName("small_aura")[0]
	bigAura = layer.childrenWithName("big_aura")[0]
	startShake(smallAura,1.2)
	startShake(bigAura,1)
	play.opacity = 0
	animateState = 
		off:
			opacity:.5
			scale:.8
		on:
			opacity:1
			scale:1
	avatar.states = animateState
	avatar.states.animationOptions = time:.3
	avatar.onClick ->
		switched = avatar.states.current.name == "off"
		if switched
			avatar.states.switch("on")
			smallAura.animate scale:1
			bigAura.animate scale:1
			play.animate opacity:0
			bg.animate scale:1
		else
			avatar.states.switch("off")
			smallAura.animateStop()
			bigAura.animateStop()
			play.animate opacity:1
			bg.animate scale:.8



newMessage = s.message.copy()
newMessage2 = s.message.copy()
newMessage3 = s.message.copy()

startAnim(s.message)
startAnim(newMessage)
startAnim(newMessage2)
startAnim(newMessage3)


# Create PageComponent
pageScroller = new PageComponent
	width: s.message.width
	height: s.message.height
	scrollVertical: false
	clip: false
	index: 1
	superLayer: s.iPhone_7_Copy
	
pageScroller.addPage(s.image)
pageScroller.addPage(s.message, "right")
pageScroller.addPage(newMessage, "right")
pageScroller.addPage(newMessage2, "right")
pageScroller.addPage(newMessage3, "right")

origX = pageScroller.content.x
pageScroller.snapToPage(newMessage3,false)


hide =
	hide:
		scale: 0
	show:
		scale: 1
	animationOptions:
		time: 0.25
s.photo.states = hide
s.sound.states = hide
s.next.states = hide
s.prev.states = hide

s.photo.states.switchInstant("hide")


updateBaszok = () ->
	s.baszok.x = (pageScroller.content.x - origX)/750 * 45  + 140
	
updateBaszok()
pageScroller.onMove ->
	updateBaszok()

pageScroller.on "change:currentPage", ->
	if pageScroller.currentPage == s.image
		s.photo.states.switch("show")
		s.sound.states.switch("hide")
		s.prev.states.switch("hide")
		s.next.states.switch("hide")
	else
		s.photo.states.switch("hide")
		s.sound.states.switch("show")
		s.prev.states.switch("show")
		s.next.states.switch("show")
			

s.next.onClick ->
	pageScroller.snapToNextPage("right", true)
s.prev.onClick ->
	pageScroller.snapToNextPage("left", true)