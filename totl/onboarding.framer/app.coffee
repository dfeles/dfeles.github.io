# Import file "onboarding" (sizes and positions are scaled 1:2)
s = Framer.Importer.load("imported/onboarding@3x")
s.hide.opacity = 0

pager = new PageComponent
	x:s.Group_4.x
	y:s.Group_4.y
	width: s.step1.width
	height: s.step1.height
	parent: s.step_1_copy
	index: 4
pager.content.draggable.vertical = false
pager.addPage(s.step1,"right")
pager.addPage(s.step2,"right")
pager.addPage(s.step3,"right")
next = () ->
	pager.snapToNextPage("right", true)
s.button1.onClick ->
	next()
s.button2.onClick ->
	next()
s.button3.onClick ->
	next()
origY = s.Group_3.y
updateContent = () ->
	
	progress = -pager.content.x / s.step1.width
	
	s.hide.opacity = progress
	s.Group_2.scale = 1-progress
	s.Group_2.opacity = 1-progress
	
	toY = Math.min(progress*origY + -s.Group_3.height*(1-progress), origY)
	s.Group_3.y = toY
	s.Group_3.opacity = progress
	
	
	toY = Math.min((progress-1)*origY + -s.Group_3.height*(1-(progress-1)), origY)
	s.safe.scale = 2+(pager.content.x + s.step1.width) / s.step1.width
	s.safe.opacity = -(pager.content.x + s.step1.width) / s.step1.width
	s.step2131.y = toY
pager.content.onMove ->
	updateContent()
updateContent()