'use strict';

console.log 'content script loaded'

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

# returns true if some text is selected
isRange = ()->
	window.getSelection().type is 'Range'

# attach all event handlers to the page
attachEventHandlers = ()->

	# when the user presses Cmd + K, enable link edit
	key '⌘+k, ctrl+k', ()->

		# if there is some text selected, pop up the link inserter
		if isRange()
			# addLink selectedText
			replaceSelectionWithLink 'http://google.com'

	# when a node changes, re-render the links
	$('.project.selected').on 'input', '.content', (e)->
		$content = $ e.currentTarget
		parseLinks $content

# replace the selection with the given content (string, element, or function of the text)
replaceSelection = (content)->

	contentFunction = if typeof content is 'function' then content else ()->content

	sel = rangy.getSelection()
	range = sel.getRangeAt(0)
	node = range.createContextualFragment contentFunction sel.toString()
	range.deleteContents()
	range.insertNode node

# replace the selection with a link that to the given url
replaceSelectionWithLink = (url)->
	replaceSelection (content)->
		"<a class=\"contentLink\" href=\"#{url}\">#{content}</a>"

addLink = ()->
	return

# parse the given element to see if there are any embedded links
parseLinks = ($el)->
	console.log('content changed')

$ ()->
	console.log 'domread'
	attachEventHandlers()
