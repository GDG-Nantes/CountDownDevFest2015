'use strict';

var DevFestCountDown = DevFestCountDown || function(){
	
	// Const
	var SIZE_LOGO_ORI = 240,
		SIZE_LOGO_DEST = 100, 
		TIME_ANIMATION = 5000,
		TIME_ANIMATION_SPACESHIP = 500,
		TIME_SHOOT = 200,
		MARGIN = 20,
        SHOOT_HEIGHT = 20,
        SHOOT_SPACE = 25;

	var canvas = null,
		context = null,
		images = [],
		audioElt = null,
		currentTime = new Date().getTime(),
        indexPlaylist = 0,
        directionLogos = -1,
        directionSpaceShip = -1,
        stars = [],
        collision = null,
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
        	y : -1
        },
        mapLogos = [
        	[
        		{id:'photos',pos:{x:2,y:0},index:{row:0,col:0}, visible:true},
        		{id:'gplus',pos:{x:3,y:0}, index: {row:0,col:1}, visible:true},
        		{id:'music',pos:{x:4,y:0}, index: {row:0,col:2}, visible:true},
        		{id:'maps',pos:{x:5,y:0}, index: {row:0,col:3}, visible:true},
        		{id:'calendar',pos:{x:6,y:0}, index: {row:0,col:4}, visible:true},
        		{id:'keep',pos:{x:7,y:0}, index: {row:0,col:5}, visible:true},
        		{id:'glass',pos:{x:8,y:0}, index: {row:0,col:6}, visible:true},
        		{id:'android',pos:{x:9,y:0}, index: {row:0,col:7}, visible:true},
        	],
        	[
        		{id:'compute',pos:{x:2,y:1}, index: {row:1,col:0}, visible:true},
        		{id:'play',pos:{x:3,y:1}, index: {row:1,col:1}, visible:true},
        		{id:'docs',pos:{x:4,y:1}, index: {row:1,col:2}, visible:true},
        		{id:'sheets',pos:{x:5,y:1}, index: {row:1,col:3}, visible:true},
        		{id:'draw',pos:{x:6,y:1}, index: {row:1,col:4}, visible:true},
        		{id:'youtube',pos:{x:7,y:1}, index: {row:1,col:5}, visible:true},
        		{id:'contacts',pos:{x:8,y:1}, index: {row:1,col:6}, visible:true},
        		{id:'chrome',pos:{x:9,y:1}, index: {row:1,col:7}, visible:true},
        	],
        	[
        		{id:'gmail',pos:{x:2,y:2}, index: {row:2,col:0}, visible:true},
        		{id:'playstore',pos:{x:3,y:2}, index: {row:2,col:1}, visible:true},
        		{id:'movies',pos:{x:4,y:2}, index: {row:2,col:2}, visible:true},
        		{id:'hangout',pos:{x:5,y:2}, index: {row:2,col:3}, visible:true},
        		{id:'drive',pos:{x:6,y:2}, index: {row:2,col:4}, visible:true},
        		{id:'news',pos:{x:7,y:2}, index: {row:2,col:5}, visible:true},
        		{id:'wallet',pos:{x:8,y:2}, index: {row:2,col:6}, visible:true},
        		{id:'devs',pos:{x:9,y:2}, index: {row:2,col:7}, visible:true},
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

    function removeStars() {
	    for(var l = stars.length-1, i = l; i >= 0; i--) {
	        if(stars[i].life < 0) {
	            stars[i] = stars[stars.length-1];
	            stars.length--;
	        }
	    }
	    if (stars.length <= 0){
	    	collision = null;
	    }
	}

	function makeStars(coordX, coordY) {    
	    var starAmt = Math.random()*20 + 50;	    
	    for(var i = 0; i < starAmt; i++) {	        
	        var dir = Math.random()*2*Math.PI;
	        var speed = Math.random()*3 + 2;
	        var life = Math.random()*10 + 10;	        
	        stars[stars.length] = new Star(coordX, coordY, speed, dir, life);	        
	    }
	}

	function Star(x, y, speed, dir, life) {
	    var _this = this;
	    
	    this.x = x;
	    this.y = y;
	    
	    var xInc = Math.cos(dir) * speed;
	    var yInc = Math.sin(dir) * speed;
	    
	    this.life = life;

	    this.update = function() {
	        this.x += xInc;
	        this.y += yInc;
	        this.life--;
	    }
	}


    function checkCollision(){
        if (positionShoot.y < 0){
            return;
        }
        let flatArray = [];
        mapLogos.forEach(function(cols){
            Array.prototype.push.apply(flatArray, cols);
        });
        let shootYEnd = positionShoot.y + SHOOT_HEIGHT + SHOOT_SPACE;
        collision = flatArray.find(function(cel){
            let celY = cel.pos.y * (SIZE_LOGO_DEST + MARGIN);
            let celX = cel.pos.x * (SIZE_LOGO_DEST + MARGIN);
            return cel.visible && ((celY <= positionShoot.y
                && celY + SIZE_LOGO_DEST > positionShoot.y
                && cel.pos.x <= positionShoot.x
                && cel.pos.x +1 > positionShoot.x)
            || (positionShoot.y <= celY
                && (shootYEnd < celY + SIZE_LOGO_DEST || shootYEnd > celY + SIZE_LOGO_DEST)
                && cel.pos.x <= positionShoot.x
                && cel.pos.x +1 > positionShoot.x));
        });
        if (collision){
            positionShoot.x = -1;
            positionShoot.y = -1;
            makeStars(
                collision.pos.x * (SIZE_LOGO_DEST + MARGIN) + ((SIZE_LOGO_DEST + MARGIN) / 2), 
                collision.pos.y * (SIZE_LOGO_DEST + MARGIN) + ((SIZE_LOGO_DEST + MARGIN) / 2)
                );
            mapLogos[collision.index.row][collision.index.col].visible = false;;

            // TODO
            setTimeout(function(){
                positionShoot.x =  positionSpaceShip.x;
                positionShoot.y = positionSpaceShip.y+1;
                processMoveShoot();
            },2000)
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
        checkCollision();
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
    	positionShoot.y-= (SIZE_LOGO_DEST + MARGIN);
    	checkCollision();
    	if (positionShoot.y >= 0){
    		setTimeout(processMoveShoot, TIME_SHOOT);
    	}
    }

    function runAnimation(){
    	context.clearRect(0, 0, canvas.width, canvas.height);
    	mapLogos.forEach(function(cols){
    		cols.forEach(function(cel){
                if (cel.visible){                    
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
                }
    		});
    	}); 

    	var imgSpaceShip = images['spaceship']
    	context.drawImage(imgSpaceShip
			, 0 //sx clipping de l'image originale
			, 0 //sy clipping de l'image originale
			, imgSpaceShip.width // swidth clipping de l'image originale
			, imgSpaceShip.height // sheight clipping de l'image originale
			, positionSpaceShip.x * (SIZE_LOGO_DEST + MARGIN) // x Coordonnées dans le dessin du Model.ui.canvas
			, positionSpaceShip.y// y Coordonnées dans le dessin du Model.ui.canvas
			, SIZE_LOGO_DEST // width taille du dessin
			, SIZE_LOGO_DEST * (imgSpaceShip.height / imgSpaceShip.width) // height taille du dessin
			);

    	if (positionShoot.y >= 0){
    		context.fillStyle = "white";
    		context.fillRect(
    			positionShoot.x * (SIZE_LOGO_DEST + MARGIN) + 20, // X d'origine
    			positionShoot.y, //Y d'origine
    			5, // width
    			SHOOT_HEIGHT // height
    		);

    		context.fillRect(
    			positionShoot.x * (SIZE_LOGO_DEST + MARGIN) + 20, // X d'origine
    			positionShoot.y + SHOOT_SPACE, //Y d'origine
    			5, // width
    			SHOOT_HEIGHT // height
    		);
    	}

    	// Stars
    	removeStars();
        for(var i = 0; i < stars.length; i++) {
        	var s = stars[i];
	        context.fillRect(s.x-1, s.y-1, 2, 2);
	        s.update();
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

		positionSpaceShip.y = canvas.height - SIZE_LOGO_DEST;

		audioElt = document.getElementById('playlist');
		loadSprites([
			{title:'logos', url: 'imgs/logos.svg'},
			{title:'spaceship', url: 'imgs/spaceship.png'}
		]).then(function(){
			nextSong();
			runAnimation();
			processMoveLogos();
			processMoveSpaceShip();

			// TODO
			setTimeout(function(){
				positionShoot.x =  positionSpaceShip.x;
				positionShoot.y = positionSpaceShip.y;
				processMoveShoot();
			},2000);
		});
	}

	function init(){
		window.addEventListener('load', pageLoad);
	}

	init();

	return{
	
	}
}();