$(function(){
    var perpage = 5;
    var page = 0;
    var pages = 0;
    var comments = [];



	$('#messageBtn').on('click',function(){
	   $.ajax({
	      type:'POST',
	      url:'/api/comment/post',
	      data:{
	      	contentId:$('#contentId').val(),
	      	content: $('#messageContent').val()
	      },
	      success: function(responseData){
	      	$('#messageContent').val('');
	      	comments = responseData.data.comments.reverse();
            renderComment(comments)
	      }
	   })

    });
    //每次页面重载的时候获取一下该页面的所有评论
    $.ajax({
	      url:'/api/comment',
	      data:{
	      	contentId:$('#contentId').val(),
	      },
	      success: function(responseData){
            comments = responseData.data.comments.reverse();
            renderComment(comments)
	      }
	});
     $('.pager').delegate('a','click',function(){


		if($(this).parent().hasClass('prev')){
		   page --;
			
		}
		if($(this).parent().hasClass('next')){
		   page ++;
		}
        renderComment();

    });







    function renderComment(){
        $('#messageCount').html(comments.length);
    	var html = "";
        
         
        var pages = Math.max(Math.ceil(comments.length/perpage),1);
    	var $lis = $('.pager li');
    	var start = Math.max(0,(page -1) * perpage);
    	var end = Math.min(comments.length,start + perpage);
    	

    	if(page <= 1){
    		page = 1;
    		
    		$lis.eq(0).html('<span style="color: #38b3d4;">没有上一页</span>');
    	}else{
    		$lis.eq(0).html('<a href="javascript:;">上一页</a>')
    	};
    	if(page >= pages){
    		page = pages;
    		$lis.eq(2).html('<span style="color: #38b3d4;">没有下一页</span>');
    	}else{
    		$lis.eq(2).html('<a href="javascript:;">下一页</a>')
    	};
    	$lis.eq(1).html(page +'/'+pages);


        if(comments.length == 0){
            $('.messageList').html('<div class="messagedetail" style="margin:20px"><p>还没有留言<p></div>');

        }else{
            for(let i=start;i<end; i++){

            html += '<div class="messagebox"><p class="messagedetail"><span>'
            +comments[i].username+
            '</span><span>'
            +formatDate(comments[i].postTime)+
            '</span></p><p style="text-indent: 2em; line-height: 28px;">'
            +comments[i].content
            +'</p></div>'
            };
            $('.messageList').html(html);


        };

    }


    	
    	

    function formatDate(d){

    	var date1 =new Date(d);

        return date1.getFullYear()+'年'+(date1.getMonth()+1)+'月'+date1.getDate()+'日'+
        date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds();

    }
})

	
