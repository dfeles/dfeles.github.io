# Import file "controllers" (sizes and positions are scaled 1:2)
s = Framer.Importer.load("imported/controllers@2x")

# Create PageComponent
pageScroller = new PageComponent
	width: s.message.width
	height: s.message.height
	scrollVertical: false
	clip: false
	index: 0
	superLayer: s.iPhone_7_Copy

	
newMessage = s.message.copy()
newMessage2 = s.message.copy()
newMessage3 = s.message.copy()

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
s.photo.states = hide
s.sound.states = hide
s.photo.states.animationOptions = time: 0.25
s.sound.states.animationOptions = time: 0.25

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
	else
		s.photo.states.switch("hide")
		s.sound.states.switch("show")
			

s.next.onClick ->
	pageScroller.snapToNextPage("right", true)
s.prev.onClick ->
	pageScroller.snapToNextPage("left", true)