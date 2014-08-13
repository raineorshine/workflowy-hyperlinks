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
	key '⌘+k, ctrl+k', insertLink

	# when a node changes, re-render the links
	$('.project.selected').on 'input', '.content', (e)->
		$content = $ e.currentTarget
		parseLinks $content

# prompts the user for a url and invokes the callback with the entered value if not blank
# @param cb: () -> String
promptForUrl = (cb)->

	# create the input element
	$urlInput = $ '<input class="addlink-input" placeholder="URL">'

	# when the input element is submitted, make sure the result isn't empty, invoke the callback, and remove the input
	$urlInput.on 'keypress', (e)->
		val = $urlInput.val()

		if e.which is 13
			$urlInput.remove()
			if val
				cb val

	# when focus leaves the input, remvoe it
	$urlInput.on 'blur', ()->
		$urlInput.remove()

	# append the input element to the DOM and focus on it
	$('body').append $urlInput
	$urlInput.focus()

# replace the selection with the given content (string, element, or function of the text)
replaceSelection = (sel, content)->

	contentFunction = if typeof content is 'function' then content else ()->content

	range = sel.getRangeAt(0)
	node = range.createContextualFragment contentFunction sel.toString()
	range.deleteContents()
	range.insertNode node

# replace the selection with a link that to the given url
replaceSelectionWithLink = (sel, url)->
	replaceSelection sel, (content)->
		"<a class=\"contentLink\" href=\"#{url}\">#{content}</a>"

insertLink = ()->
	# if there is some text selected, pop up the link inserter
	if isRange()
		# addLink selectedText
		sel = rangy.getSelection()
		promptForUrl (url)->
			if url
				replaceSelectionWithLink sel, url


# parse the given element to see if there are any embedded links
parseLinks = ($el)->
	console.log('content changed')

$ ()->
	console.log 'domread'
	attachEventHandlers()
