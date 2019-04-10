'use strict'

function initMap() {
  // The location of Uluru
  var uluru = {
  	lat: 33.2105595, lng: -117.2797315
  };
  // The map, centered at Uluru
  var map = new google.maps.Map( document.getElementById('map'), {
       zoom: 4, center: uluru
   });
  // The marker, positioned at Uluru
  var marker = new google.maps.Marker({position: uluru, map: map});
}



var globalInfo = {
	navTargetTxt: ['REPLACE OR REPAIR']
}
var _ = function(name){	
	var elem = document.getElementsByClassName(name)
	var classes = []
	for(var i = 0; i < elem.length; i++){
		classes.push(elem[i])
	}
	return classes.length > 1 ? classes : classes[0];

};

var easeInOut = function(progress){
	return (progress *= 2) < 1
	? .5 * Math.pow(progress, 5)
	: .5 * ((progress -= 2) * Math.pow(progress, 4) + 2);
}

function nav(){
	var svg = document.querySelectorAll('.minus-one, circle, .svg-wrap')
	var svgElem = document.querySelectorAll('.transition');
	var remove = []

	svg[0].addEventListener('click',function(e){
		
		svg[2].classList.toggle('stroke-circle')

		for(var i = 0; i < svgElem.length; i++){

			if(i<2) svgElem[i].classList.toggle('rotate-minus')

			if(svg[2].classList.contains('stroke-circle')){

				svg[2].classList.remove('remove-stroke');
				svgElem[i].classList.remove('rotate-minus-back')
	
				remove.push(names = svgElem[i].classList[1])
				svgElem[i].classList.remove(names);
				
			}else{
				svg[2].classList.add('remove-stroke')
				svgElem[i].classList.add(remove[i])
				if(i<2) svgElem[i].classList.add('rotate-minus-back')
				if(i===3) remove = []
			}
		}
	})
}
nav()


function scrollAway(){
	var speed = 0;
	// var rect = _('page-container').getBoundingClientRect().y;
	var transformPos =  parseInt(window.getComputedStyle( _('page-container') ).getPropertyValue('transform').replace(/^(.+)\s(-\d.*)\)/gi, '$2') );

	function offSet(el){
		var speed = window.scrollY/9
		var posY = transformPos + speed

		el.style.transform = 'translate('+0+','+ posY +'px)'
	}
	
	window.addEventListener('scroll', function(e){

		offSet(_('page-container'))

	})
}
if(window.innerWidth > 768 ) scrollAway()



function infoNav(top){
	//On page load active button top pos gets added to prevent double click same button
	var preventDblClick = [top]
	var btnPos = [0,44,86,128]
	
	var infoBtn = _('info-btn')
	var start;
	var isRunning;
	var lastPos = 0;
	var curPos = 0;
	var pos = 0;

	var getPos = function(e){
		//Updates isRunning right away to reset animation below to restart from exact position
		isRunning ? isRunning = false : isRunning = true

		//Filters original array to just the buttons
		var btnArr = Array.prototype.filter.call(e.target.offsetParent.children, function(el, i){
			return i > 0 && el 
		})
		//Gets the path of the li element to match up array position with btnPos. 
		var path = e.path || (e.composedPath && e.composedPath());  //Safari and Firefox safe
		
		var animateTo = btnArr.indexOf( path[1] ) 
	
		//if last position is less than animate too
		if(lastPos < btnPos[ animateTo ] ){
			pos = btnPos[ animateTo ] - lastPos
			curPos = lastPos 
		} else {
			pos =  -lastPos + btnPos[ animateTo ]
			curPos = lastPos
		} 

		function animateIcon(progress){
			
			_('nav-shadow').style.transform = 'translateY('+  ( curPos + (pos * progress) ) + 'px)'

		}

		function draw(timestamp){
			//Able to click again while animation is running, restarts from that exact position without jumping around. 
			if(!isRunning){
				isRunning = true
				start = 0
				return
			} 
			if(!start) start = timestamp
				var runtime = timestamp - start
				var progress = easeInOut( Math.min( runtime / 800, 1) )

				 //Constantly update last position
				lastPos = curPos + (pos * progress)
			
				if(progress < 1){

					//Keeps multiple clicks on buttons while animating 
					isRunning = true
					animateIcon(progress)
				}else{
					isRunning = false
					start = 0 
					lastPos = btnPos[ animateTo ]
					return
				}

			requestAnimationFrame(draw)
		}
		requestAnimationFrame(draw)
	}

	function showBoxOne(e){
		var classNames = []
		var elemActive = []

		//Gets index number of clicked element
		var indexPos = _('info-btn').indexOf(e.target)

		_('box-one').forEach(function(el, i){

			var domStyles = el.style.display;
			var compStyles = window.getComputedStyle(el)
	
			var elem = el.classList[1].split(' ').join(' ')
			classNames.push(elem)
				
			//If element is currently active it pushes to display it to none
			if( domStyles === "block" || compStyles.getPropertyValue('display') === "flex" ) elemActive.push(el)
		});
		
		//Matches clicked button to dom element to make visible
		var targetElem = _(classNames[indexPos])
		var activeElem = elemActive[0]

		targetElem.style.display = "block"
		activeElem.style.display = "none"
	}

	
	_('info-buttons').addEventListener('click', function(e){

		//Clears right before adding, used for modal
		globalInfo.navTargetTxt = []
		//Prevents double clicks because same button clicked with be the same top position
		if( preventDblClick[0] === e.target.getBoundingClientRect().top ){
			return;
		}else{
			preventDblClick = []
			var posTarget =	e.target.getBoundingClientRect().top
			preventDblClick.push(posTarget)
			showBoxOne(e)
			getPos(e)
			globalInfo.navTargetTxt.push(e.target.textContent)
			console.log(globalInfo.navTargetTxt);
	
		} 
	})
}
infoNav( _('info-btn')[0].getBoundingClientRect().top )



function InfoModal(){
	this.btn = _('item-content')
	this.targetText = 'hey'
	var modal = _('info-modal')
	var screenWidth = window.innerWidth;
	var screenHeight = window.innerHeight;

	this.getScreenPos = function(){
		var paddingHoriz = 150;
		var paddingVert = 100;
		
		if(screenWidth <= 1100 && screenWidth > 768){
			return {
				width: screenWidth - paddingHoriz,
				height: screenHeight - paddingVert,
				left: paddingHoriz / 2,
				top: paddingVert / 2
			}
		}if(screenWidth > 1100){
			return {
				width: 1050,
				height: screenHeight - paddingVert,
				left: (screenWidth - 1050) / 2,
				top: paddingVert / 2
			}
		}if(screenWidth < 768){
			paddingHoriz = 30
			return {
				width: screenWidth - paddingHoriz,
				height: screenHeight - paddingVert,
				left: paddingHoriz / 2,
				top: paddingVert / 2
			}
		}
	}
	//Fetches JSON file
	this.fetchJSONFile = function(path, callback){
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function(){
			if(httpRequest.readyState === 4){
				if(httpRequest.status === 200){
					var data = JSON.parse(httpRequest.responseText)

					if(callback) callback(data)
				}
			}
		};
		httpRequest.open('GET', path);
		httpRequest.send()
	}

		 function createElem(modalInfo,content){
		
			function createContentElem(text){
				var contentElem = document.createElement('div')
				contentElem.className = 'content'

				var infoHeader = document.createElement('h6')
				infoHeader.className = 'info-header'
				infoHeader.textContent = text.infoHeader

				var textArea = document.createElement('div')
				textArea.className = 'text-area'

				var textAreaAbout = document.createElement('p')
				textAreaAbout.className = 'about'
				textAreaAbout.textContent = text.about

				contentElem.appendChild(infoHeader)
				//Nested elements inside another
				modalInfo.appendChild(contentElem).appendChild(textArea).appendChild(textAreaAbout)

				//If list array or list-header exist in JSON file
				if(typeof text.listHeader !== 'undefined'){
					var h5 = document.createElement('h5')
					textArea.appendChild(h5)
					h5.textContent = text.listHeader

					var ul = '<ul> ';
					for(var i = 0; i < text.list.length; i++){
						ul += '<li>'+text.list[i]+'</li>'
					}
					ul += '</ul>'
					textArea.innerHTML += ul
				}
			}
			//If content section exist in JSON file
			if(content['section-content']){

				var sectionContent = content['section-content']
				//Adds elements based on how many section-content array index there is
				for(var i = 0; i < sectionContent.length; i++) {
					var text = {
						infoHeader: sectionContent[i]['info-header'],
						about: sectionContent[i].about,
						listHeader: sectionContent[i]['list-header'],
						list: sectionContent[i].list
					}
					createContentElem(text)
				}
			}
		}
	this.openModal = function(target,data){
	
		for(var prop in data){
		
			if(target === prop){
				var sections = Object.keys(data[prop]);
				var targetObj = data[prop]

				document.querySelector('.top-tab .modal-title').textContent = globalInfo.navTargetTxt

				

				for(var j = 0; j < sections.length; j++){
					var content = targetObj[sections[j]]
					console.log(content);
					if(sections[j] === "section-one"){
					
						var header = document.querySelector('.'+sections[j] + ' .header') 
						header.textContent = content.header

						var headerAbout = _('header-about')[0] 
						headerAbout.textContent = content['header-about']

						var modalInfo = _('modal-info')[1]
						createElem(modalInfo, content)
						
					}
					if(sections[j]=== "section-two"){

						var header = document.querySelector('.'+sections[j] + ' .header') 
						header.textContent = content.header

						var headerAbout = _('header-about')[1] 
						headerAbout.textContent = content['header-about']

						var modalInfo = _('modal-info')[2]
						createElem(modalInfo, content)
					}
				}
			}
		}
		_('modal-overlay').style.visibility = "visible"
		_('modal-overlay').style.opacity = "1"
		var pos = this.getScreenPos()
			modal.style.height = pos.height + "px"
			modal.style.width = pos.width + "px"
			modal.style.top = pos.top + "px"
			modal.style.left = pos.left + "px"
			modal.style.transform = "scale(1)"
			document.body.style.overflow = 'hidden'
		
	}.bind(this)

	console.log('hey');

}
var infoModal = new InfoModal()



InfoModal.prototype.click = function(){

	var btn = this.btn;
	var openModal = this.openModal;
	var fetchJSONFile = this.fetchJSONFile;
	var closeRemoveData = this.removeContent
	//Open Modal
	for(var i = 0; i < btn.length; i++){
		btn[i].addEventListener('click', function(e){
			var target = this.dataset.name

			fetchJSONFile('/files/data.json', function(data){
				openModal(target,data)
			})
		})
	}

	//Close Modal
	_('close-modal').addEventListener('click', function(e){

		//Removes style transform only, to transform once again when opening modal
		_('info-modal').style.transform = null
		_('modal-overlay').style.opacity = 0
		_('modal-overlay').style.visibility = 'hidden'
		document.body.style.overflow = 'auto'

		//Remove Content
		var content = _('content')
		for(var i = 0; i < content.length; i++){
			content[i].parentNode.removeChild(content[i])
			
		}
	})
}
infoModal.click()




function nav768(){
	var start;
	//Elements that can be opened 
	var elem = document.querySelectorAll('.nav-btn-container, .right-content, section.projects, section.information, section.map')

	var animateClipPath = function(timestamp){
		if(!start) start = timestamp
			var runtime = timestamp - start
			var progress = Math.min(runtime / 2000, 1)
			console.log(progress);
		_('box-open').style.clipPath = 'none'
		_('box-open').style.clipPath = 'url(#clipping)'
		if(progress < 1){

		} else return
		requestAnimationFrame(animateClipPath)
	}
	
	//Opens or closes nav & elements
	_('nav-button').addEventListener('click', function(e){
	
		if(navigator.userAgent.indexOf("Safari") != -1. && navigator.userAgent.indexOf("Chrome") === -1 ){
		       requestAnimationFrame(animateClipPath);
		}

		var removeElem = function(remove){
			document.querySelector('#clipping > rect').classList.remove('svg-clip-active')
			remove.classList.remove('open-nav')
			_('btn-line')[0].classList.remove('lineOneFade')
			_('btn-line')[1].classList.remove('lineTwoFade')
			_('nav-btn-wrapper').style.transform = null
			
		}

		var addElem = function(i){
			//Requestanimation frame run again
			start = null;

			document.querySelector('#clipping > rect').classList.add('svg-clip-active')
			_('btn-line')[0].classList.add('lineOneFade')
			_('btn-line')[1].classList.add('lineTwoFade')
			elem[i].classList.add('open-nav')
			
			window.setTimeout(function(){

				_('nav-btn-wrapper').style.transform = 'rotate(45deg)'
			
			}, 1100)
		}

		var removeClassOnClick = function(){
			for(var i = 0; i < elem.length; i++){
			
				if( elem[i].classList.contains('open-nav') ){

					removeElem(elem[i])
					
				}else {
					addElem(i)
				}
			}
		}
		removeClassOnClick()

		//Closes nav when clicked anywhere
		document.addEventListener('click', function(e){

			if(!e.target.closest('.nav-button') && _('nav-btn-wrapper').style.transform === 'rotate(45deg)' ){
				removeClassOnClick()
			}
		})
	});
	//Change X color
	var changeBtnColor = function(){
		var infoInView = _('information').getBoundingClientRect().top
	
		if(infoInView <= 0){
			_('btn-line')[0].style.backgroundColor = '#232323'
			_('btn-line')[1].style.backgroundColor = '#232323'
		}else {
			_('btn-line')[0].style.backgroundColor = '#fff'
			_('btn-line')[1].style.backgroundColor = '#fff'
		}
	}
	//Nav button reaches white element X changes to black
	window.onscroll = function(){
		changeBtnColor()
	}
}
if(window.innerWidth < 768 ) nav768()


