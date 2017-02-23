# Set device background 
Framer.Device.background.backgroundColor = "#172353"

# Set custom device
Framer.Device.deviceType = "apple-iphone-6s-space-gray"

# Set background
bg = new BackgroundLayer backgroundColor: "#000000"
bg.bringToFront()


basicAnim = "spring(200,30,0)"

# Create ScrollComponent
w = Framer.Device.screen.width
h = Framer.Device.screen.height


# Import file "BookingPanelProto" (sizes and positions are scaled 1:2)
s = Framer.Importer.load("imported/BookingPanelProto@2x")

# Scale all content by 50%
#Framer.Device.contentScale = w/s.header.width

s.home.backgroundColor = "#E6E6E6"
s.footer.superLayer = s.home
s.footer.y = h-s.footer.height



#scrollLeg = new ScrollComponent
#	width: s.header.width
#	height: s.inboundStops.height
#	y: s.inboundStops.y
#	scrollVertical: false
#	backgroundColor: "#FFFFFF"
#	contentInset:
#		right: 20
#		left: 0
#	borderRadius: 8
#	superLayer: s.inbound
#	propagateEvents: false

scroll = new ScrollComponent
	width: w
	height: h
	scrollHorizontal: false
	directionLock: true
	backgroundColor: "#F4F4F4"
	contentInset:
		top: 0
		bottom: 200
	superLayer: s.home
scroll.sendToBack()

#s.inboundStops.superLayer = scrollLeg.content
#s.inboundStops.y = 0

s.list.superLayer = scroll.content

s.outboundOpened.backgroundColor = "rgba(255,255,255,.5)"
s.outboundOpened.x = 0
s.outboundOpened.visible = false

scaleTo = (what,scale,delay) ->
	what.animate
		properties:
			scale:scale
		delay:delay
		curve:basicAnim
alphaTo = (what,alpha,delay) ->
	if(!what.visible)
		what.visible = true
		what.opacity = 0
	what.animate
		properties:
			opacity:alpha
		delay:delay
		curve:"ease-in-out"
		time:.3
	what.on Events.AnimationEnd, ->
		if what.opacity == 0
			what.visible = false

s.outboundTitle.states.add
	"closed":
		y:s.outboundTitle.y
	"opened":
		y:0
s.outboundTitle.states.animationOptions=
	curve: basicAnim

s.inboundTitle.states.add
	"closed":
		y:s.inboundTitle.y
	"opened":
		y:0
s.inboundTitle.states.animationOptions=
	curve: basicAnim


outboundScroll = new ScrollComponent
	width: w
	height: h
	scrollHorizontal: false
	directionLock: true
	contentInset:
		top: 0
		bottom: 0
	superLayer: s.outboundOpened
outboundScroll.sendToBack()
s.outboundList.superLayer = outboundScroll.content


inboundScroll = new ScrollComponent
	width: w
	height: h
	y:h
	scrollHorizontal: false
	directionLock: true
	contentInset:
		top: 0
		bottom: 200
	superLayer: s.outboundOpened
inboundScroll.sendToBack()
s.inboundList.y = 0
s.inboundList.superLayer = inboundScroll.content


inboundWasOpened = false
outboundWasOpened = false
boundActive = 0

openOutbound = () ->
	outboundWasOpened = true
	boundActive = 0
	
	alphaTo(s.departFooter,0,0)
	alphaTo(s.returnHead,1,0)
	
	s.outboundTitleText.opacity = 0
	alphaTo(s.departDetails,1,0)
	s.returnDetails.opacity = 0
	s.returnHead.opacity = 1
	
	outboundScroll.y = 0
	inboundScroll.y = h
	s.outboundTitle.y = s.outboundTitle.screenFrame.y - s.outboundList.y
	s.outboundTitle.superLayer = s.outboundTitleOpened
	s.outboundTitle.states.switch("opened")
	
	outboundScroll.scrollToPoint(
		x: 0, y: 0
		false
	)
	inboundScroll.scrollToPoint(
		x: 0, y: 0
		false
	)
	
	s.outboundOpened.x = 0
	s.headerOutbound.opacity = 0
	s.outboundTime.opacity = 0
	s.timeline.opacity = 0
	
	s.closing.opacity = 0
	s.segment1.scale = 0
	s.segment2.scale = 0
	s.segment3.scale = 0
	s.segment4.scale = 0
	s.segment5.scale = 0
	
	
	s.outboundOpened.opacity = 1
	s.outboundOpened.visible = true
	
	alphaTo(s.headerOutbound,1,0.3)
	alphaTo(s.outboundTime,1,0.5)
	scaleTo(s.segment1,1,0.1)
	alphaTo(s.timeline,1,0.3)
	
	scaleTo(s.segment2,1,0.2)
	scaleTo(s.segment3,1,0.3)
	scaleTo(s.segment4,1,0.4)
	scaleTo(s.segment5,1,0.5)
	
	s.home.animate
		properties: 
			blur: 40
			scaleX: 1.1
			
	
		
openInbound = () ->
	
	boundActive = 1
	
	alphaTo(s.departFooter,1,0)
	alphaTo(s.returnHead,0,0)
	
	s.returnHead.opacity = 0
	inboundWasOpened = true
	s.inboundTitleText.opacity = 0
	
	s.departDetails.opacity = 0
	alphaTo(s.returnDetails,1,0)
	
	outboundScroll.y = -h
	inboundScroll.y = 0
	s.inboundTitle.y = s.inboundTitle.screenFrame.y - s.inboundTitleOpened.y
	s.inboundTitle.superLayer = s.inboundTitleOpened
	s.inboundTitle.states.switch("opened")
	
	outboundScroll.scrollToPoint(
		x: 0, y: 100000
		false
	)
	inboundScroll.scrollToPoint(
		x: 0, y: 0
		false
	)
	
	s.outboundOpened.x = 0
	s.headerOutbound.opacity = 0
	s.outboundTime.opacity = 0
	s.inTimeline.opacity = 0
	
	s.closing.opacity = 0
	s.inSegment1.scale = 0
	s.inSegment2.scale = 0
	s.inSegment3.scale = 0
	s.inSegment4.scale = 0
	s.inSegment5.scale = 0
	
	
	s.outboundOpened.opacity = 1
	s.outboundOpened.visible = true
	
	alphaTo(s.headerOutbound,1,0.3)
	alphaTo(s.outboundTime,1,0.5)
	alphaTo(s.inTimeline,1,0.5)
	
	scaleTo(s.inSegment1,1,0.3)
	scaleTo(s.inSegment2,1,0.4)
	scaleTo(s.inSegment3,1,0.5)
	scaleTo(s.inSegment4,1,0.6)
	scaleTo(s.inSegment5,1,0.7)
	
	s.home.animate
		properties: 
			blur: 40
			scaleX: 1.1

closeOutbound = () ->
	if outboundWasOpened
		s.outboundTitle.states.switch("closed")
		s.outboundTitle.superLayer = s.outboundTitlePlace
	else
		s.inboundTitle.states.switch("closed")
		s.inboundTitle.superLayer = s.inboundTitlePlace
	
	
	s.outboundTitleText.opacity = 1
	s.inboundTitleText.opacity = 1
	inboundWasOpened = false
	outboundWasOpened = false

	alphaTo(s.outboundOpened,0,0)
	
	s.home.animate
		properties: 
			blur: 0
			scaleX: 1
		curve: basicAnim
		
		
s.outbound.on Events.Tap, (event) ->
	if Math.abs(event.offset.x) + Math.abs(event.offset.y)<10
		openOutbound()
s.inbound.on Events.Tap, (event) ->
	if Math.abs(event.offset.x) + Math.abs(event.offset.y)<10
		openInbound()

inboundScrollY = inboundScroll.y

outboundScroll.on Events.Move, ->
	if boundActive == 0
		scY = outboundScroll.scrollY
		if scY < 0
			s.headerOutbound.y =  -scY
			s.closeButton.opacity = scY/100+1
			
			s.closing.opacity = 1-scY/100-2
			s.closing.scale = Math.min(1-scY/100-2,1)
		else
			s.headerOutbound.y =  0
		
		#if outboundScroll.scrollY > 650
		bottomOff = outboundScroll.content.height - outboundScroll.height - scY - 50
		outboundScroll.opacity = Math.max((bottomOff+50)/200+1,.2)
		# Math.max(-((scY-850)-1)/200,.2)
		inboundScroll.y = inboundScrollY + bottomOff
		
outboundScroll.on Events.ScrollEnd, ->
	
	scY = outboundScroll.scrollY
	if scY < -200
		if outboundScroll.velocity.y <5
			closeOutbound()
	bottomOff = outboundScroll.content.height - outboundScroll.height - 50
	
	if outboundScroll.scrollY > bottomOff+200
		outboundScroll.animate
			properties: 
				y:-h
				
		alphaTo(s.returnHead,0,1)
		alphaTo(s.departFooter,1,1)
		alphaTo(outboundScroll,1,1)
		
		alphaTo(s.departDetails,0,0)
		alphaTo(s.returnDetails,1,.8)

		boundActive = 1
		
		inboundScroll.animate
			properties: 
				y:0
				

inboundScroll.on Events.Move, ->
	if boundActive == 1
	
		scY = inboundScroll.scrollY
		if scY < 0
			inboundScroll.opacity = Math.max(scY/100+1,.2)
			
			s.returnDetails.opacity = scY/100+1
			
			outboundScroll.y = -h-scY+80

inboundScroll.on Events.ScrollEnd, ->
	scY = inboundScroll.scrollY
	if scY < -200
		inboundScroll.animate
			properties: 
				y:h
		
		outboundScroll.animate
			properties: 
				y:0
		boundActive = 0
				
		alphaTo(s.returnHead,1,1)
		alphaTo(s.departFooter,0,0)
		alphaTo(inboundScroll,1,1)
		
		alphaTo(s.departDetails,1,0)
		alphaTo(s.returnDetails,0,0)



s.closeButton.on Events.Tap, (event) ->
	if Math.abs(event.offset.x) + Math.abs(event.offset.y)<10
		closeOutbound()
		


# Create layer
overlay = new Layer
	width: w
	height: h
	backgroundColor:  "rgba(20,20,20,0.9)"
overlay.visible = false
s.footer.onTap ->
	s.almostThere.superLayer = overlay
	s.almostThere.y = h
	s.almostThere.animate
		properties:
			y:h-s.almostThere.height
	s.home.animate
		properties:
			scale: 0.95
			y:-40
	alphaTo(overlay,1,0)
overlay.onTap ->
	s.almostThere.animate
		properties:
			y:h
	s.home.animate
		properties:
			scale: 1
			y:0
	alphaTo(overlay,0,0)
