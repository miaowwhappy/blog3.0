;(function($){
	


	var LightBox = function(settings){
		var self = this;


		this.settings = {
			           speed:500 
		               };
		$.extend(this.settings,settings||{});


		this.popupMask = $("<div id='G-lightbox-mask'>");
		this.popupWin = $("<div id='G-lightbox-popup'>");


		this.bodyNode = $(document.body);

		this.renderDOM();

		this.picViewArea = this.popupWin.find("div.lightbox-pic-view");
		this.popupPic    = this.popupWin.find("img.lightbox-image");
		this.picCaptionArea = this.popupWin.find("div.lightbox-pic-caption");
		this.nextBtn = this.popupWin.find("span.lightbox-next-btn");
		this.prevBtn = this.popupWin.find("span.lightbox-prev-btn");

		this.captionText = this.popupWin.find("p.lightbox-pic-desc");
		this.currentIndex = this.popupWin.find("span.lightbox-of-index");
		this.closeBtn = this.popupWin.find("span.lightbox-close-btn");





		this.groupName = null;
		this.groupData = [];
		this.bodyNode.delegate(".js-lightbox,*[data-role=lightbox]","click",function(e){
         //阻止事件冒泡
         e.stopPropagation();
         var currentGroupName = $(this).attr("data-group");
	         if(currentGroupName != self.groupName){
	         	self.groupName = currentGroupName;
	         	self.getGroup();

	         };
	         self.initPopup($(this));    
        

		});
		this.popupMask.click(function(){
			$(this).fadeOut();
			self.popupWin.fadeOut();
			self.clear = false;  
		});
		this.closeBtn.click(function(){
			self.popupMask.fadeOut();
			self.popupWin.fadeOut(); 
			self.clear = false; 
		});
        
        this.flag = true;
        this.nextBtn.hover(function(){

	        	               if(!$(this).hasClass("disabled")&&self.groupData.length>1){
	        	               	$(this).addClass("lightbox-next-btn-show");

        	                    };

                           },function(){
                           	    if(!$(this).hasClass("disabled")&&self.groupData.length>1){
	        	               	$(this).removeClass("lightbox-next-btn-show")
                                }

                           }).click(function(e){

                           	

                           	if(!$(this).hasClass("disabled")&&self.flag){
                           		flag = false;
                           		
                           		e.stopPropagation();
                           		self.goto("next")
                           	}


                           });
        this.prevBtn.hover(function(){

		    	               if(!$(this).hasClass("disabled")&&self.groupData.length>1){
		    	               	$(this).addClass("lightbox-prev-btn-show");

			                    };

		                   },function(){
		                   	    if(!$(this).hasClass("disabled")&&self.groupData.length>1){
		    	               	$(this).removeClass("lightbox-prev-btn-show")
		                        }

		                   }).click(function(e){

		                   	

                           	if(!$(this).hasClass("disabled")&&self.flag){
                           		flag = false;
                           		e.stopPropagation();
                           		self.goto("prev")
                           	}


                           });
        var timer = null;
        this.clear = false;
        $(window).resize(function(){

        	if(self.clear){
        		window.clearTimeout(timer);
        	    timer = window.setTimeout(function(){
        		   self.loadPicSize(self.groupData[self.index- 1].src);
                                         },500);

            };
        

        	

        }).keyup(function(e){

            var keyValue = e.which;
            if(self.clear){

                if(keyValue == 38||keyValue == 37){
                    self.prevBtn.click();
                }else if(keyValue == 40 ||keyValue == 39){
                    self.nextBtn.click();

                }; 

            };
            
        });

        	

       
	};
    
    LightBox.prototype = {

    	goto:function(dir){

    		if(dir==="next"){

    			this.index++;
    			if(this.index>=this.groupData.length){
    				this.nextBtn.addClass("disabled").removeClass("lightbox-next-btn-show");
    			};
    			if(this.index != 1){
    				this.prevBtn.removeClass("disabled");
    			};
    			var src = this.groupData[this.index-1].src;
    			this.loadPicSize(src);

    		}else if(dir === "prev"){
    			this.index--;
    			if(this.index<=1){
    				this.prevBtn.addClass("disabled").removeClass("lightbox-prev-btn-show");
    			};
    			if(this.index != this.groupData.length){
    				this.nextBtn.removeClass("disabled");
    			};
    			var src = this.groupData[this.index-1].src;
    			this.loadPicSize(src);



    		}




    	},

    	loadPicSize:function(sourceSrc){
    		var self = this;

    		self.popupPic.css({width:"auto",height:"auto"}).hide();
    		this.picCaptionArea.hide();

    		this.preLoadImg(sourceSrc,function(){
    			self.popupPic.attr("src",sourceSrc);
    			var picWidth = self.popupPic.width();
    			var picHeight = self.popupPic.height();

    			self.changePic(picWidth,picHeight);
    			

    		});
    	},
    	changePic:function(width,height){

    		var self = this;
    		var winWidth = $(window).width();
    		var winHeight = $(window).height();

    		var scale = Math.min(winWidth/(width+10),winHeight/(height+10),1);

    		width = width*scale;
    		height = height*scale;

    		this.picViewArea.animate({
    			                     width:width-10,
    			                     height:height-10
    		                         },self.settings.speed);
    		this.popupWin.animate({
    			                  width:width,
    			                  height:height,
    			                  marginLeft:-(width/2),
    			                  top:(winHeight-height)/2
    		                      },self.settings.speed,function(){
    		                      	self.popupPic.css({
                                                      width:width-10,
                                                      height:height-10,
    		                      	                  }).fadeIn();
    		                      	self.picCaptionArea.fadeIn();
    		                      	self.flag = true;
    		                      	self.clear = true;
    		                      });
    		this.captionText.text(this.groupData[this.index-1].caption);


    		this.currentIndex.text("当前索引："+this.index+" of "+this.groupData.length)



    	},
        preLoadImg:function(src,callback){

        	var img = new Image();
        	if(!!window.ActiveXObeject){
        		img.onreadystatechange = function(){
        			if(this.readyState == "complete"){
        				callback();
        			}
        		}
        	}else{
        		img.onload = function(){
        			callback();
        		}
        	}
        	img.src = src;

        },
    	showMaskAndPopup : function(sourceSrc,currentId){

    		var self = this;
    		self.popupPic.css({width:"auto",height:"auto"}).hide();
    		this.popupPic.hide();
    		this.picCaptionArea.hide();
    		this.popupMask.fadeIn();

    		var winWidth = $(window).width();
    		var winHeight = $(window).height();
    		this.picViewArea.css({
    			                 width:winWidth/2,
    			                 height:winHeight/2  
    		                    });
    		this.popupWin.fadeIn();


    		var viewHeight = winHeight/2+10;
    		this.popupWin.css({
    			              width:winWidth/2+10,
    			              height:winHeight/2+10,
    			              marginLeft:-(winWidth/2+10)/2,
    			              top:-viewHeight
    		                 }).animate({
                                        top:(winHeight-viewHeight)/2
    		                            },self.settings.speed,
    		                            function(){

                                          self.loadPicSize(sourceSrc);


    		                            });
    		this.index = this.getIndexOf(currentId);


    		var groupDataLength = this.groupData.length;

    		if(groupDataLength > 1){
                if(this.index === 1){
                	this.prevBtn.addClass("disabled");
                	this.nextBtn.removeClass("disabled");
                }else if(this.index === groupDataLength){
                    this.prevBtn.removeClass("disabled");
                	this.nextBtn.addClass("disabled");

                }else{
                    this.prevBtn.removeClass("disabled");
                	this.nextBtn.removeClass("disabled");
                }

    		};


    	},
    	getIndexOf: function(currentId){
    		var index = 0;

    		$(this.groupData).each(function(){

    			index ++;

    			if(this.id === currentId){
    				return false;
    			};

    		});

    		return index;
    	},

    	initPopup:function(currentObj){
    		 var self = this;
    		 var sourceSrc = currentObj.attr("data-source");
    		 var currentId = currentObj.attr("data-id");

    		 this.showMaskAndPopup(sourceSrc,currentId);


    	},

    	getGroup:function(){
    		 var self = this;
    		 var groupList = this.bodyNode.find("*[data-group="+this.groupName+"]");

    		 self.groupData.length = 0;
    		 groupList.each(function(){

    		 	self.groupData.push({
    		 		                  src:$(this).attr("data-source"),
    		 		                  id:$(this).attr("data-id"),
    		 		                  caption:$(this).attr("data-caption")

    		 	                    })

    		 });

    	},

    	renderDOM:function(){
    		var strDom ="<div class='lightbox-pic-view'>"+
						    "<span class='lightbox-btn lightbox-prev-btn '></span>"+
							"<img class='lightbox-image'>"+
							"<span class='lightbox-btn lightbox-next-btn '></span>"+
						"</div>"+
						"<div class='lightbox-pic-caption'>"+
							"<div class='lightbox-caption-area'>"+
								"<p class='lightbox-pic-desc' ></p>"+
								"<span class='lightbox-of-index'>当前索引：0 of 0</span>"+
							"</div>"+
							"<span class='lightbox-close-btn'></span>"+
						"</div>";

		    this.popupWin.html(strDom);
		    this.bodyNode.append(this.popupMask,this.popupWin);
    	}
    	



    };
    window['LightBox'] = LightBox;





})(jQuery);