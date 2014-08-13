'use strict';

getSelectionHtml = ->
	html = ""
	sel = window.getSelection()
	if sel.rangeCount
		container = document.createElement("div")
		i = 0
		len = sel.rangeCount

		while i < len
			container.appendChild sel.getRangeAt(i).cloneContents()
			++i
		html = container.innerHTML
	html

# attach all event handlers to the page
attachEventHandlers = ()->

	# when the user presses Cmd + K, enable link edit
	key '⌘+k, ctrl+k', ()->

		# if there is some text selected, pop up the link inserter
		selectedText = getSelectionHtml()
		if selectedText > 0
			# addLink selectedText
			replaceSelect 'test'

	# when a node changes, re-render the links
	$('.project.selected').on 'input', '.content', (e)->
		$content = $ e.currentTarget
		parseLinks $content

replaceSelection (content)->
	sel = rangy.getSelection()
	range = sel.getRangeAt(0)
	range.deleteContents()
	node = range.createContextualFragment("<span><font color=\"red\">hoho</font></span>")
	range.insertNode node

addLink = ()->
	return

# parse the given element to see if there are any embedded links
parseLinks = ($el)->
	console.log('content changed')

$ ()->
	attachEventHandlers()
