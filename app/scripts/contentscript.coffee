'use strict';

console.log 'content script loaded'

dbObject = {}

db =

	load: ()->
		loadedDbObject = localStorage.getItem('hyperlink')
		if loadedDbObject
			dbObject = JSON.parse(loadedDbObject)

	save: ()->
		localStorage.setItem 'hyperlink', JSON.stringify(dbObject)

	saveLink: (projectid, content, url)->
		dbObject[projectid] = dbObject[projectid] or {}
		dbObject[projectid][content] = url
		db.save()

	getProjectLinks: (projectid)->
		dbObject[projectid]

	getLink: (projectid, content)->
		dbObject[projectid][content]


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
		restoreLinks $content

# returns the promise of a url entered by the user
promptForUrl = ()->

	# append the input element to the DOM and focus on it
	$urlInput = $ '<input class="addlink-input" placeholder="URL">'
	$('body').append $urlInput
	$urlInput.focus()

	new Promise (resolve, reject)->

		# when the input element is submitted, make sure the result isn't empty, invoke the callback, and remove the input
		$urlInput.on 'keypress', (e)->
			val = $urlInput.val()

			if e.which is 13
				$urlInput.remove()
				resolve val

		# when focus leaves the input, remvoe it
		$urlInput.on 'blur', ()->
			$urlInput.remove()
			reject()

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

		# get the node's project id
		$parent = $ sel.focusNode.parentElement
		projectid = $parent.closest('.project').attr('projectid')

		# save the url to localStorage
		db.saveLink projectid, content, url

		# pass the link HTML to replaceSelection
		createLinkHtml content, url

createLinkHtml = (content, url)->
	"<a class=\"contentLink\" href=\"#{url}\">#{content}</a>"

insertLink = ()->

	# if there is some text selected, pop up the link inserter
	if isRange()

		# addLink selectedText
		sel = rangy.getSelection()

		promptForUrl()
			.then (url)->
				if url
					replaceSelectionWithLink sel, validateUrl url
			.catch ()->
				return

# adds http:// if needed
validateUrl = (url)->

	if url.indexOf ':' > -1
		url = 'http://' + url

	url

# gets the project id of the closest .project ancestor of the given element
getClosestProjectId = ($el)->
	$el.closest('.project').attr('projectid')

# parse the given element to see if there are any embedded links that need to be restored
restoreLinks = ($el)->

	setTimeout ()->

		sel = rangy.getSelection()
		offset = sel.focusOffset
		range = sel.getRangeAt(0)
		console.log sel

		links = db.getProjectLinks getClosestProjectId $el
		for content,url of links
			$el.html $el.html().replace new RegExp(content, 'g'), createLinkHtml content, url
			# sel.collapse($el[0], sel.focusOffset)
			range = rangy.createRange()
			range.setStart $el[0].firstChild, offset
			range.collapse true
			sel = rangy.getSelection()
			sel.setSingleRange(range)

	, 50

# main
db.load()
$ ()->
	attachEventHandlers()
