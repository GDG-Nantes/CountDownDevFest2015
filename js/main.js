'use strict';

var DevFestCountDown = DevFestCountDown || function(){
	
	// Const
	var SIZE_LOGO_ORI = 240,
		SIZE_LOGO_DEST = 100, 
		TIME_ANIMATION = 1000,
		TIME_ANIMATION_SPACESHIP = 500,
		TIME_SHOOT = 500,
		MARGIN = 20,
		NB_ROW = -1;

	var canvas = null,
		context = null,
		images = [],
		audioElt = null,
		currentTime = new Date().getTime(),
        indexPlaylist = 0,
        directionLogos = -1,
        directionSpaceShip = -1,
        positionShoot =  {
        	x : -1,
        	y : -1
        },
        playListSongs = [
        ],
        positionLogos = {
        	'photos' : {x : 400, y :430},
        	'gplus' : {x : 720, y :440},
        	'music' : {x : 1010, y :440},
        	'maps' : {x : 1320, y :440},
        	'calendar' : {x : 400, y :730},
        	'keep' : {x : 720, y :730},
        	'glass' : {x : 1010, y :730},
        	'android' : {x : 1320, y :720},
        	'compute' : {x : 400, y :1000},
        	'play' : {x : 720, y :1000},
        	'docs' : {x : 1010, y :1000},
        	'sheets' : {x : 1320, y :1020},
        	'draw' : {x : 400, y :1280},
        	'youtube' : {x : 700, y :1280},
        	'contacts' : {x : 1010, y :1280},
        	'chrome' : {x : 1320, y :1280},
        	'gmail' : {x : 400, y :1570},
        	'playstore' : {x : 720, y :1570},
        	'movies' : {x : 1010, y :1570},
        	'hangout' : {x : 1320, y :1570},
        	'drive' : {x : 400, y :1840},
        	'news' : {x : 720, y :1840},
        	'wallet' : {x : 1010, y :1840},
        	'devs' : {x : 1320, y :1840}
        },
        positionSpaceShip = {
        	x : 0,
        	y : NB_ROW
        },
        mapLogos = [
        	[
        		{id:'photos',pos:{x:2,y:0}},
        		{id:'gplus',pos:{x:3,y:0}},
        		{id:'music',pos:{x:4,y:0}},
        		{id:'maps',pos:{x:5,y:0}},
        		{id:'calendar',pos:{x:6,y:0}},
        		{id:'keep',pos:{x:7,y:0}},
        		{id:'glass',pos:{x:8,y:0}},
        		{id:'android',pos:{x:9,y:0}},
        	],
        	[
        		{id:'compute',pos:{x:2,y:1}},
        		{id:'play',pos:{x:3,y:1}},
        		{id:'docs',pos:{x:4,y:1}},
        		{id:'sheets',pos:{x:5,y:1}},
        		{id:'draw',pos:{x:6,y:1}},
        		{id:'youtube',pos:{x:7,y:1}},
        		{id:'contacts',pos:{x:8,y:1}},
        		{id:'chrome',pos:{x:9,y:1}},
        	],
        	[
        		{id:'gmail',pos:{x:2,y:2}},
        		{id:'playstore',pos:{x:3,y:2}},
        		{id:'movies',pos:{x:4,y:2}},
        		{id:'hangout',pos:{x:5,y:2}},
        		{id:'drive',pos:{x:6,y:2}},
        		{id:'news',pos:{x:7,y:2}},
        		{id:'wallet',pos:{x:8,y:2}},
        		{id:'devs',pos:{x:9,y:2}},
        	]
        ];

	function loadSprite(sprite) {

		var p = new Promise(function(resolve, reject) {
			var image = new Image();
			image.src = sprite.url;
			image.onload = function() {
				images[sprite.title] = image;
				resolve(sprite);
			}.bind(this);
			image.onerror = function() {
				reject(sprite);
			};
		}.bind(this));

		return p;
	};

	function loadSprites(spriteList) {

		var promises = [];
		spriteList.forEach(function(element) {
			promises.push(loadSprite(element));
		}.bind(this));
		return Promise.all(promises);
	};


    function playSound(url){            
        audioElt.pause();
        audioElt.src = url;
        audioElt.play();
    }
    function nextSong(){
        try{
            playSound("assets/songs/"+playListSongs[indexPlaylist]);
            indexPlaylist = (indexPlaylist + 1) % playListSongs.length;
            
        }catch(err){
            console.error(err);
        }
    }

    function processMoveLogos(){
    	if (directionLogos < 0 ){
    		if (mapLogos[0][0].pos.x > 0){
    			mapLogos.forEach(function(cols){
    				cols.forEach(function(cel){
    					cel.pos.x--;
    				});
    			});
    		}else{
    			directionLogos = 1;
    			let rowNum = mapLogos[0][0].pos.y;
    			mapLogos.forEach(function(cols){
    				cols.forEach(function(cel){
    					cel.pos.y+= rowNum === 0 ? 1 : -1;
    				});
    			});
    		}
    	}else{
    		if (mapLogos[0][0].pos.x < 4){
    			mapLogos.forEach(function(cols){
    				cols.forEach(function(cel){
    					cel.pos.x++;
    				});
    			});
    		}else{
    			directionLogos = -1;
    			let rowNum = mapLogos[0][0].pos.y;
    			mapLogos.forEach(function(cols){
    				cols.forEach(function(cel){
    					cel.pos.y+= rowNum === 0 ? 1 : -1;
    				});
    			});
    		}
    	}
    	setTimeout(processMoveLogos, TIME_ANIMATION);
    }

    function processMoveSpaceShip(){
    	if (directionSpaceShip < 0){
    		if (positionSpaceShip.x > 0){
    			positionSpaceShip.x--;
    		}else{
    			positionSpaceShip.x++;
    			directionSpaceShip = 1;
    		}
    	}else{
    		if (positionSpaceShip.x < 11){
    			positionSpaceShip.x++;
    		}else{
    			positionSpaceShip.x--;
    			directionSpaceShip = -1;
    		}
    	}
    	setTimeout(processMoveSpaceShip, TIME_ANIMATION_SPACESHIP);
    }

    function processMoveShoot(){
    	positionShoot.y--;
    	if (processMoveShoot > 0){
    		setTimeout(processMoveShoot, TIME_SHOOT);
    	}
    }

    function runAnimation(){
    	context.clearRect(0, 0, canvas.width, canvas.height);
    	mapLogos.forEach(function(cols){
    		cols.forEach(function(cel){
    			context.drawImage(images['logos']
					, positionLogos[cel.id].x //sx clipping de l'image originale
					, positionLogos[cel.id].y //sy clipping de l'image originale
					, SIZE_LOGO_ORI // swidth clipping de l'image originale
					, SIZE_LOGO_ORI // sheight clipping de l'image originale
					, cel.pos.x * (SIZE_LOGO_DEST + MARGIN) // x Coordonnées dans le dessin du Model.ui.canvas
					, cel.pos.y * (SIZE_LOGO_DEST + MARGIN)// y Coordonnées dans le dessin du Model.ui.canvas
					, SIZE_LOGO_DEST // width taille du dessin
					, SIZE_LOGO_DEST // height taille du dessin
					);
    		});
    	}); 

    	var imgSpaceShip = images['spaceship']
    	context.drawImage(imgSpaceShip
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, imgSpaceShip.width // swidth clipping de l'image originale
			, imgSpaceShip.height // sheight clipping de l'image originale
			, positionSpaceShip.x * (SIZE_LOGO_DEST + MARGIN) // x Coordonnées dans le dessin du Model.ui.canvas
			, NB_ROW  * (SIZE_LOGO_DEST + MARGIN)// y Coordonnées dans le dessin du Model.ui.canvas
			, SIZE_LOGO_DEST // width taille du dessin
			, SIZE_LOGO_DEST * (imgSpaceShip.height / imgSpaceShip.width) // height taille du dessin
			);

    	if (positionShoot.x >= 0){
    		context.fillStyle = "white";
    		context.fillRect(
    			positionShoot.x * (SIZE_LOGO_DEST + MARGIN) + 20, // X d'origine
    			(positionShoot.y - 1) * (SIZE_LOGO_DEST + MARGIN), //Y d'origine
    			5, // width
    			20 // height
    		);

    		context.fillRect(
    			positionShoot.x * (SIZE_LOGO_DEST + MARGIN) + 20, // X d'origine
    			(positionShoot.y - 1) * (SIZE_LOGO_DEST + MARGIN) - 25, //Y d'origine
    			5, // width
    			20 // height
    		);
    	}

    	window.requestAnimationFrame(runAnimation);
    }


	function pageLoad(){
		canvas = document.getElementById('animation');	
		context = canvas.getContext('2d');
		let headerRect = document.querySelector('header').getBoundingClientRect();
		let footerRect = document.querySelector('footer').getBoundingClientRect();

		canvas.height = footerRect.top - headerRect.bottom;
		canvas.width = (SIZE_LOGO_DEST + MARGIN) * 12;

		NB_ROW = Math.floor(canvas.height / (SIZE_LOGO_DEST + MARGIN));

		audioElt = document.getElementById('playlist');
		loadSprites([
			{title:'logos', url: 'imgs/logos.svg'},
			{title:'spaceship', url: 'imgs/spaceship.png'}
		]).then(function(){
			nextSong();
			runAnimation();
			processMoveLogos();
			processMoveSpaceShip();

			setTimeout(function(){
				positionShoot.x =  positionSpaceShip.x;
				positionShoot.y = positionSpaceShip.y;
				processMoveShoot();
			},2000)
		});
	}

	function init(){
		window.addEventListener('load', pageLoad);
	}

	init();

	return{
	
	}
}();