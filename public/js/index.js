$(function(){
	var $registerbox = $('#registerbox');
	var $loginbox = $('#loginbox');
        var $rightbox = $('#rightbox');
        var $logout = $('#logout');

	$loginbox.find('a').on('click',function(){
                $registerbox.show();
                $loginbox.hide();
	});
	$registerbox.find('a').on('click',function(){
                $loginbox.show();
                $registerbox.hide();
	});

	$registerbox.find('button').on('click',function(){
                $.ajax({
                	type:'post',
                	url:'/api/user/register',
                	data:{
        		  username:$registerbox.find('[name="username"]').val(),
        		  password:$registerbox.find('[name="password"]').val(),
        		  repassword:$registerbox.find('[name="repassword"]').val()
                	},
                	dataType:'json',
                	success:function(result){
                	      $registerbox.find('.colWarning').html(result.message);
                              if(!result.code){
                                setTimeout(function(){
                                  $loginbox.show();
                                  $registerbox.hide();
                                },1000);
                              };
                             
                	}
                })
	});
        $loginbox.find('button').on('click',function(){
                $.ajax({
                        type:'post',
                        url:'/api/user/login',
                        data:{
                          username:$loginbox.find('[name="username"]').val(),
                          password:$loginbox.find('[name="password"]').val()  
                        },
                        dataType:'json',
                        success:function(result){
                          $loginbox.find('.colWarning').html(result.message);
                           if(!result.code){
                               /* setTimeout(function(){
                                  $rightbox.show();
                                  $loginbox.hide();
                                },1000);
                                $rightbox.find('.who').html(result.userInfo.username+',id:'+result.userInfo._id);
                                $rightbox.find('.welcome').html('你好，欢迎光临我的博客');*/
                                window.location.reload();
                              };
                             
                        }

                })
        });
        $logout.on('click',function(){
                $.ajax({
                        type:'get',
                        url:'/api/user/logout',
                        success:function(result){
                                if(!result.code){
                                    window.location.reload();    
                                }

                        }
 

                })

        });




})