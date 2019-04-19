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

//Slowly move Main picture & Show little Nav Hide little nav
function scrollAway(){

	var toggle = false;
	var speed = 0;
	var nav = new Nav768()

	var transformPos =  parseInt(window.getComputedStyle( _('page-container') ).getPropertyValue('transform').replace(/^(.+)\s(-\d.*)\)/gi, '$2') );
	function showLittleNav(top){

		//Show little nav
		if(top <= 0 && !toggle){
			_('box-open').style.left = '-5px'
			requestAnimationFrame(function(timestamp){

				nav.animateClipPath(timestamp)
		
			})
			document.querySelector('#clipping > rect').classList.add('svg-clip-active')
			toggle = true
		}
		//Hide litle nav
		if(top > 0 && toggle){
			requestAnimationFrame(function(timestamp){

				nav.animateClipPath(timestamp)
		
			})
			document.querySelector('#clipping > rect').classList.remove('svg-clip-active')

			toggle = false
		}
	}
	//Move main photo slowly up or down
	function offSet(el){
		var speed = window.scrollY/9
		var posY = transformPos + speed

		if(!toggle) el.style.transform = 'translate('+0+','+ posY +'px)'
	}
	
	window.addEventListener('scroll', function(e){

		offSet(_('page-container'))

		showLittleNav(_('projects')[0].getBoundingClientRect().top) 
	})
}

 if(window.innerWidth > 768)  scrollAway()




function infoNav(top){
	//On page load active button top pos gets added to prevent double click same button
	var preventDblClick = [top]
	var btnPos = [0,42,82,122]
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
				if(typeof content.servicesSVG !== "undefined"){
					contentElem.innerHTML = content.servicesSVG.join('\n')
				}
			
				

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
			//If section-content section exist in JSON file
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
		var main = document.getElementsByTagName('main')[0]
	
		for(var prop in data){
		
			if(target === prop){

				var sections = Object.keys(data[prop]);
				var targetObj = data[prop]

				//Updates modal header tab with globalInfo object every click

				document.querySelector('.top-tab .modal-title').textContent = globalInfo.navTargetTxt

				if(target === 'contact'){

					//If Element doesn't exist add it. otherwise do nothing
					if(typeof main.getElementsByClassName('content-container')[0] === 'undefined'){

						main.innerHTML = targetObj.formHeader.html.join('\n')
						main.innerHTML += targetObj.form.html.join('\n')
					
					}
				}else{

					//If Element doesn't exist add it. otherwise do nothing
					if(typeof _('company-info') === 'undefined') main.innerHTML = data['box-one'].html.join('\n')
					

					for(var j = 0; j < sections.length; j++){
						var content = targetObj[sections[j]]
					
						if(sections[j] === "section-one"){
							console.log(target);
							//tomorrow one of these has to exist for every section.. add the rest of svg so no error
							if(target === "repair-replace") document.querySelector('.'+sections[j] + '').innerHTML += content.svg.join('\n')

							var header = document.querySelector('.'+sections[j] + ' .header') 
							header.textContent = content.header

							var headerAbout = _('header-about')[0] 
							headerAbout.textContent = content['header-about']

							var modalInfo = _('modal-info')[1]
							createElem(modalInfo, content)
							
						}
						if(sections[j]=== "section-two"){

							//UPDATE HERE TOO

							if(target === "repair-replace") document.querySelector('.'+sections[j] + '').innerHTML += content.svg.join('\n')

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
		}
		_('modal-overlay').style.visibility = "visible"
		_('modal-overlay').style.opacity = "1"
		var pos = this.getScreenPos()
			modal.style.height = pos.height + "px"
			modal.style.width = pos.width + "px"
			modal.style.top = pos.top + "px"
			modal.style.left = pos.left + "px"
			modal.style.transform = "scale(1)"
			//Keeps everything behind from scrolling
			document.body.style.overflow = 'hidden'
		
	}.bind(this)
}
var infoModal = new InfoModal()



InfoModal.prototype.click = function(){
	var start;
	var startPos = 0;
	var btn = this.btn;
	var openModal = this.openModal;
	var fetchJSONFile = this.fetchJSONFile;
	var closeRemoveData = this.removeContent
	var navItems = document.querySelectorAll('.nav-items, .box-open')


	//Navigation scroll page to element
	function scrollTo(timestamp, targetTop){
		if(!start) start = timestamp
		var runtime = timestamp - start
		var progress = Math.min(runtime / 700, 1)

		window.scroll(0, startPos + (targetTop * progress) )
		if(progress >= 1){
			start = null
			return;
		}else {
			requestAnimationFrame(function(timestamp){
				scrollTo(timestamp, targetTop)
			})
		}
	}

	//Open Modal
	for(var i = 0; i < btn.length; i++){
		btn[i].addEventListener('click', function(e){
			var target = this.dataset.name

			fetchJSONFile('/files/data.json', function(data){
				openModal(target,data)
			})
		})
	}

	//Navigation large width 
	for(var j = 0; j < navItems.length; j++) {
		navItems[j].addEventListener('click',function(e){
			e.preventDefault()
			
			var target = e.target.dataset.name

			//Open Contact Modal
			if(target === 'contact') {
			
				fetchJSONFile('/files/data.json', function(data){
					openModal(target,data)
				})
			}
			//Scroll to
			if(typeof target !== 'undefined' && target !== 'contact'){

				//Top position of any element that needs to scroll to
				var targetTop = _(target).getBoundingClientRect().top
				startPos = window.scrollY

				requestAnimationFrame(function(timestamp){
					scrollTo(timestamp, targetTop)
				})
			}
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
		try{
			for(var i = 0; i < content.length; i++){

				content[i].parentNode.removeChild(content[i])
			
			}
		}catch( e ){
			if(e instanceof TypeError){
				return
			} 
		}
	})
}
infoModal.click()




function Nav768(){
	var start;
	//Elements that can be opened 
	var elem = document.querySelectorAll('.nav-btn-container, .right-content, section.projects, section.information, section.map')
	

	this.animateClipPath = function(timestamp){
		if(!start) start = timestamp
			var runtime = timestamp - start
			var progress = Math.min(runtime / 2000, 1)
		
		_('box-open').style.clipPath = 'none'
		_('box-open').style.clipPath = 'url(#clipping)'
		if(progress < 1){

		} else{
			start = null;
			return;
		}
		requestAnimationFrame(animateClipPath)
	}
	

	var animateClipPath = this.animateClipPath
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
if(window.innerWidth < 768 ) var nav768 = new Nav768();




var topCarousel = (function(){
	var containerWidth = _('img-container').getBoundingClientRect().width + 100

	var images = []
	var load = 0

	for(var i = 0; i < 8; i++){

		var img = new Image();
		load++

		try{
			throw i
		}catch(i){

			img.onload = function(){
				
				images.push(this)
		
				var  appended = _('img-container').appendChild(this)
				appended.className += 'slider';
		
				//When images are done loading sort them in order
				if(load === images.length){
					images.sort(function(a,b){
						return a - b
					})
				var sliderImg = _('slider')
				for(var j = 0; j < sliderImg.length; j++){
					var siblingWidth = sliderImg[1].getBoundingClientRect().width + 50  //transform: translate3d(1650px, 0px, -670px) rotateY(37deg);
					sliderImg[0].style.transform = 'translate3d('+ -(containerWidth+siblingWidth)  +'px, 0, -670px) rotateY(-37deg)'
					sliderImg[1].style.transform = 'translate3d('+ -containerWidth  + 'px, 0, -249px) rotateY(-17deg)'
					sliderImg[2].style.transform = 'translate3d(0, 0, 0px) rotateY(0deg)'
					sliderImg[3].style.transform = 'translate3d('+ containerWidth + 'px, 0, -249px) rotateY(17deg)'
					sliderImg[4].style.transform = 'translate3d('+ (containerWidth+siblingWidth) + 'px, 0, -670px) rotateY(37deg)'

					if(j>4) sliderImg[j].style.display = 'none'
							
				}
				//Positions buttons perfectly within image container
				var buttonHeight = _('button-container').clientHeight + 40
				var imgHeight = images[3].clientHeight
				var imgContainer = _('img-container').clientHeight
				var btnPos = ( imgContainer-imgHeight ) - buttonHeight
			
				_('button-container').style.bottom = btnPos + 'px'
	 

					mainPhoto();
				}
			}
			img.src = 'images/slider/hinged-main-'+ i + '.jpg'
		}
	}
	return {
		img: images,
		parentWidth : containerWidth
	}
})();

function mainPhoto(){

		var j = 0
		_('button-container').addEventListener('click', function(e){

			if(e.target.classList[0] === 'img-btn'){
			
				var images = topCarousel.img
				var parentWidth = topCarousel.parentWidth
				var last = images.length - 1;

				var btn = e.target.classList[1]
			

				var rotate = function(){
				
					for(var i = 0; i < images.length; i++){
			
						 images[0].style.transform = 'translate3d('+ -(parentWidth*2)  +'px, 0, -249px) rotateY(-17deg)'
						 images[1].style.transform = 'translate3d('+ -parentWidth  + 'px, 0, -249px) rotateY(-17deg)'
						 images[2].style.transform = 'translate3d(0, 0, 0px) rotateY(0deg)'
						 images[3].style.transform = 'translate3d('+ parentWidth + 'px, 0, -249px) rotateY(17deg)'
						 images[4].style.transform = 'translate3d('+ (parentWidth*2) + 'px, 0, -249px) rotateY(17deg)'
			
						i > 4 ? images[i].style.display = 'none' : images[i].style.display = 'block'
					}
				}
				if(btn === 'btn-left'){
				
					var first = images.shift()
					images.push(first)
				
					rotate()
					
				}
				if(btn === 'btn-right'){
			
					var last = images.pop()
					images.unshift(last)

					rotate()
				}
			}
		})
	};


	
	window.onresize = function(e){
if(window.innerWidth < 768){
 	  // scrollAway()
 		

	}
}


