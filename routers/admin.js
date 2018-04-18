var express = require('express');
var router =express.Router();

var User = require("../models/user");
var Category = require('../models/category');
var Content = require('../models/content');

var PicCategory = require('../models/picCategory');
var Picture = require('../models/picture');

var multer  = require('multer');
var fs = require('fs');



router.use(function(req,res,next){
	if(!req.userInfo.isAdmin){
		res.send('对不起，只有管理员才能进入后台管理');
		return
	};
	next();
});
/*首页*/
router.get('/',function(req,res,next){
   res.render('admin/index',{userInfo: req.userInfo});
});
/*用户管理*/
router.get('/user',function(req,res){
	/*从数据库中读取所有数据*/
	/*limit(Number)数据库限制条数*/
	/*skip()忽略数据的条数*/
	/*
	 
    *1 1-2 -> （当前页-1）*skip
    *2 3-4
    *3 5-6
	 */
	

	User.count().then(function(count){
        let page = Number(req.query.page || 1) ;
		let limit = 4 ;
		let pages = 0 ;

		pages = Math.ceil(count/limit);
		page = Math.min(page,pages);
		page = Math.max(page,1);
		let skip = ( page - 1 ) * limit ;
   //通过_id排序 1 升序 -1 降序 
      User.find().sort({_id: -1}).limit(limit).skip(skip).then(function(users){
         res.render('admin/user_index',{
         	userInfo: req.userInfo,
         	users: users,
         	page: page,
         	count:count,
         	pages: pages,
         	limit: limit
         });
	  });
	})

	
   
});
router.get('/category',function(req,res,next){

    Category.count().then(function(count){
        let page = Number(req.query.page || 1) ;
		let limit = 4 ;
		let pages = 0 ;

		pages = Math.ceil(count/limit);
		page = Math.min(page,pages);
		page = Math.max(page,1);
		let skip = ( page - 1 ) * limit ;

      Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories){
         res.render('admin/category_index',{
         	userInfo: req.userInfo,
         	categories: categories,
         	page: page,
         	count:count,
         	pages: pages,
         	limit: limit
         });
	  });
	})

});
router.get('/category/add',function(req,res,next){
    
	res.render('admin/category_add',{
         userInfo: req.userInfo,
	});
});
router.post('/category/add',function(req,res){
	let name = req.body.name || '';

	if(name == ''){
		res.render('admin/error',{
		 userInfo: req.userInfo,
		 message: '名称不能为空'
		});
		return
	}

	Category.findOne({name:name}).then(function(rs){
		if(rs){
			 res.render('admin/error',{
			 userInfo: req.userInfo,
			 message: '分类已经存在了'
		     });
		     return Promise.reject();
		}else{
			return new Category({
				name: name
			}).save();
		}
	}).then(function(newCategory){
        res.render('admin/success',{
			 userInfo: req.userInfo,
			 message: '分类保存成功',
			 url:'/admin/category'
		     }); 
	})

	

});

router.get('/category/edit',function(req,res){
    var id = req.query.id || '';


    Category.findOne({_id:id}).then(function(category){
    	if(!category){
    	res.render('admin/error',{
    		userInfo: req.userInfo,
			message: '该分类不存在',
    	});
    	return Promise.reject();
	    }else{
	    	res.render('admin/category_edit',{
               userInfo: req.userInfo,
               category: category
	    	})
	    }
    })
    
});

router.post('/category/edit',function(req,res){

	let id = req.query.id || '';
	let name = req.body.name || '';


	Category.findOne({_id:id}).then(function(category){
		console.log(category);
    	if(!category){
	    	res.render('admin/error',{
	    		userInfo: req.userInfo,
				message: '该分类不存在',
	    	});
    		return Promise.reject();
	    }else{
	    	//当用户没有做任何修改 用一个等号没用 直接判断正常if
	    	if(name == category.name){
	    		res.render('admin/success',{
		    		userInfo: req.userInfo,
					message: '用户名相同，其实不用修改',
					url:'/admin/category'
				});
				return Promise.reject();
	    	}else{
	    		//要修改的分类名称是否已经在数据库中存在
	    		return	Category.findOne({
	    			_id: {$ne: id},
	    			name: name
	    		});
	    	}
	    }
    }).then(function(sameCategory){
        if(sameCategory){
        	res.render('admin/error',{
		    		userInfo: req.userInfo,
					message: '数据库中已存在同名分类',
				});
        	return Promise.reject();
        }else{
        	return Category.update({
        		_id: id
        	},{
        		name: name
        	});
        }
    }).then(function(){
    	res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '修改成功',
			url:'/admin/category'
		});

    })

});

router.get('/category/delete',function(req,res){

	let id = req.query.id || '';

	Category.remove({
		_id: id
	}).then(function(){
        res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '删除成功',
			url:'/admin/category'
	    });

	})

});

router.get('/content',function(req,res){

	Content.count().then(function(count){
        let page = Number(req.query.page || 1) ;
		let limit = 5 ;
		let pages = 0 ;

		pages = Math.ceil(count/limit);
		page = Math.min(page,pages);
		page = Math.max(page,1);
		let skip = ( page - 1 ) * limit ;

	    Content.find().sort({addTime: -1}).limit(limit).skip(skip).populate(['category','user'])
	    .then(function(contents){
	        res.render('admin/content_index',{
	         	userInfo: req.userInfo,
	         	contents: contents,
	         	page: page,
	         	count:count,
	         	pages: pages,
	         	limit: limit
	        });
		});
	})
});

router.get('/content/add',function(req,res){

	Category.find().sort({id: -1}).then(function(categories){
         res.render('admin/content_add',{
		   userInfo: req.userInfo,
		   categories:categories
	     })
	})

    

});

var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = 'public/img';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now()+'.jpg');  
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage });






router.post('/content/add', upload.single('contentImg'),function(req,res){
/*  
  console.log('文件类型：%s', req.file.mimetype);
  console.log('原始文件名：%s', req.file.originalname);
  console.log('文件大小：%s', req.file.size);
  console.log('文件保存路径：%s', req.file.path);*/

	let category = req.body.category;
	let title = req.body.title;
	let description = req.body.description;
	let content = req.body.content;
	let src = req.file.filename;
    
    if( category == ''){
    	res.render('admin/error',{
    		userInfo: req.userInfo,
			message: '分类不能为空',
		});
		return
    };
    if( title == ''){
    	res.render('admin/error',{
    		userInfo: req.userInfo,
			message: '标题不能为空',
		});
		return
    };
    if( src == ''){
    	res.render('admin/error',{
    		userInfo: req.userInfo,
			message: '没有上传图片',
		});
		return
    };

    new Content({
	 category: category,
	 title: title,
	 description: description,
	 content: content,
	 user: req.userInfo._id.toString(),
	 src:src,
         addTime:new Date()
     
    }).save().then(function(rs){
    	res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '内容保存成功',
			url:'/admin/content'
	    });
    })
});

router.get('/content/edit',function(req,res){

    let id = req.query.id || '';
    //这里很经典 必须研究下 295 297 301
    let categories = [];

    Category.find().sort({id: -1}).then(function(rs){

	        categories = rs;
	    	return Content.findOne({
	    		_id:id}).populate("category")
    	.then(function(content){
	    	if(!content){
		    	res.render('admin/error',{
		    		userInfo: req.userInfo,
					message: '指定内容不存在',
		    	});
		    	return Promise.reject();
		    }else{
		    	res.render('admin/content_edit',{
	               userInfo: req.userInfo,
	               content: content,
	               categories: categories
		    	})
		    }
        })
         
	})
       
});

router.post('/content/edit',function(req,res){

	let id = req.query.id || '';
	console.log(req.body.category);

    if( req.body.category == ''){
    	res.render('admin/error',{
    		userInfo: req.userInfo,
			message: '分类不能为空',
		})
		return;
    };
    if( req.body.title == ''){
    	res.render('admin/error',{
    		userInfo: req.userInfo,
			message: '标题不能为空',
		})
		return;
    };

      
    Content.update({
    	_id: id
    },
    {   
    	category: req.body.category,
		title: req.body.title,
		description: req.body.description,
		content: req.body.content,

    }).then(function(rs){
    	res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '内容修改成功',
			url:'/admin/content'
	    });
    })

});
router.get('/content/delete',function(req,res){

	let id = req.query.id || '';

	Content.remove({
		_id: id
	}).then(function(){
        res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '删除成功',
			url:'/admin/content'
	    });

	})

});

router.get('/picture/category',function(req,res,next){

    PicCategory.count().then(function(count){
        let page = Number(req.query.page || 1) ;
		let limit = 4 ;
		let pages = 0 ;

		pages = Math.ceil(count/limit);
		page = Math.min(page,pages);
		page = Math.max(page,1);
		let skip = ( page - 1 ) * limit ;

      PicCategory.find().sort({_id: -1}).limit(limit).skip(skip).then(function(categories){
         res.render('admin/pic_category_index',{
         	userInfo: req.userInfo,
         	categories: categories,
         	page: page,
         	count:count,
         	pages: pages,
         	limit: limit
         });
	  });
	})

});
router.get('/picture/category/add',function(req,res,next){
    
	res.render('admin/pic_category_add',{
         userInfo: req.userInfo,
	});
});
router.post('/picture/category/add',function(req,res){
	let name = req.body.name || '';
	let description = req.body.description || '';

	if(name == ''){
		res.render('admin/error',{
		 userInfo: req.userInfo,
		 message: '图片分类名称不能为空'
		});
		return
	}

	PicCategory.findOne({name:name}).then(function(rs){
		if(rs){
			 res.render('admin/error',{
			 userInfo: req.userInfo,
			 message: '图片分类已经存在了'
		     });
		     return Promise.reject();
		}else{
			return new PicCategory({
				name: name,
				description: description,
				addTime: new Date(),
				src: "picture-1498799682203.jpg"
			}).save();
		}
	}).then(function(newCategory){
        res.render('admin/success',{
			 userInfo: req.userInfo,
			 message: '图片分类保存成功',
			 url:'/admin/picture/category'
		     }); 
	})

	

});

router.get('/picture/category/edit',function(req,res){
    var id = req.query.id || '';


    PicCategory.findOne({_id:id}).then(function(category){
    	if(!category){
    	res.render('admin/error',{
    		userInfo: req.userInfo,
			message: '该图片分类不存在',
    	});
    	return Promise.reject();
	    }else{
	    	res.render('admin/pic_category_edit',{
               userInfo: req.userInfo,
               category: category
	    	})
	    }
    })
    
});

router.post('/picture/category/edit',function(req,res){

	let id = req.query.id || '';
	let name = req.body.name || '';
	let description = req.body.description || '';

	PicCategory.findOne({_id:id}).then(function(category){
    	if(!category){
	    	res.render('admin/error',{
	    		userInfo: req.userInfo,
				message: '该图片分类不存在',
	    	});
    		return Promise.reject();
	    }else{
	    	//当用户没有做任何修改 用一个等号没用 直接判断正常if
	    	if(name == category.name && description == category.description){
	    		res.render('admin/success',{
		    		userInfo: req.userInfo,
					message: '数据相同，其实不用修改',
					url:'/admin/category'
				});
				return Promise.reject();
	    	}else{
	    		//要修改的分类名称是否已经在数据库中存在
	    		return	Category.findOne({
	    			_id: {$ne: id},
	    			name: name
	    		});
	    	}
	    }
    }).then(function(sameCategory){
        if(sameCategory){
        	res.render('admin/error',{
		    		userInfo: req.userInfo,
					message: '数据库中已存在同名图片分类',
				});
        	return Promise.reject();
        }else{
        	return PicCategory.update({
        		_id: id
        	},{
        		name: name,
        		description: description
        	});
        }
    }).then(function(){
    	res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '相册信息修改成功',
			url:'/admin/picture/category'
		});

    })

});

router.get('/picture/category/delete',function(req,res){

	let id = req.query.id || '';

	PicCategory.remove({
		_id: id
	}).then(function(){
        res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '图片删除成功',
			url:'/admin/picture/category'
	    });

	})

});




router.get('/picture',function(req,res){

	Picture.count().then(function(count){
        let page = Number(req.query.page || 1) ;
		let limit = 4 ;
		let pages = 0 ;

		pages = Math.ceil(count/limit);
		page = Math.min(page,pages);
		page = Math.max(page,1);
		let skip = ( page - 1 ) * limit ;

      Picture.find().sort({_id: -1}).limit(limit).skip(skip).populate(['picCategory','user']).
      then(function(contents){
         res.render('admin/picture_index',{
         	userInfo: req.userInfo,
         	contents: contents,
         	page: page,
         	count:count,
         	pages: pages,
         	limit: limit
         });
	  });
	})

	
   
});



router.get('/picture/add',function(req,res){

	PicCategory.find().sort({id: -1}).then(function(categories){
         res.render('admin/picture_add',{
		   userInfo: req.userInfo,
		   categories:categories
	     })
	}) 

    

});


var uploadPictureFolder = 'public/picture';

createFolder(uploadPictureFolder);

// 通过 filename 属性定制
var picstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPictureFolder);    
        // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now()+'.jpg');  
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var uppictureload = multer({ storage: picstorage });






router.post('/picture/add', uppictureload.single('picture'),function(req,res){

  
	let category = req.body.category;
	let src = req.file.filename;
	let title = req.body.title;
    let description = req.body.description;

    if( category == ''){ 
    	res.render('admin/error',{
    		userInfo: req.userInfo,
			message: '分类不能为空',
		});
		return
    };
    if( title == ""){
    	title = src;
    };
    

    new Picture({
	 picCategory: category,
	 title:title,
	 description :description,
	 user: req.userInfo._id.toString(),
	 src:src,
	 addTime: new Date()
     
    }).save().then(function(rs){
    	res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '图片保存成功',
			url:'/admin/picture/add'
	    });
    })
});

router.get('/picture/edit',function(req,res){

    let id = req.query.id || '';
    
    let picCategories = [];

    PicCategory.find().sort({id: -1}).then(function(rs){

	    picCategories = rs;
	    
	   
	    return Picture.findOne({
	    		_id:id}).
	    	populate("picCategory")
    	.then(function(content){
	    	if(!content){
		    	res.render('admin/error',{
		    		userInfo: req.userInfo,
					message: '指定内容不存在',
		    	});
		    	return Promise.reject();
		    }else{
		    	res.render('admin/picture_edit',{
	               userInfo: req.userInfo,
	               content: content,
	               categories: picCategories
		    	})
		    }
        });
    });    

});
       
router.post('/picture/edit',function(req,res){

	let id = req.query.id || '';
     console.log(req.body.category);
     console.log(req.body.title);
     console.log(req.body.description);

    if( req.body.category == ''){
    	res.render('admin/error',{
    		userInfo: req.userInfo,
			message: '分类不能为空',
		})
		return;
    };


      
    Picture.update({
    	_id: id
    },
    {   
    	picCategory: req.body.category,
		title: req.body.title,
		description: req.body.description
    }).then(function(rs){
    	res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '图片信息修改成功',
			url:'/admin/picture'
	    });
    })

});
router.get('/picture/set',function(req,res){

    src = req.query.src;
    id = req.query.id;


    PicCategory.update({
    	_id: id
    },
    {   
		src: src.toString()
    }).then(function(rs){
    	
    	res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '封面设置成功',
			url:'/admin/picture'
	    });
    });



});
router.get('/picture/delete',function(req,res){

	let id = req.query.id || '';
	let src = req.query.src ;
	let path = "../public/picture/"+src;
	console.log(path);

	Picture.remove({
		_id: id
	}).then(function(){


		fs.unlink(path,function(){
            res.render('admin/success',{
    		userInfo: req.userInfo,
			message: '图片删除成功',
			url:'/admin/picture'
	    });

		})
        

	})

});

module.exports = router;