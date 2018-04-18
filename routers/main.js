var express = require('express');
var router =express.Router();
var Category = require('../models/category');
var Content = require('../models/content');
var Picture = require('../models/picture');
var PicCategory =  require('../models/picCategory');
var marked = require('marked');
var hljs = require('highlight.js');


marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  highlight: function (code) {
  return hljs.highlightAuto(code).value;}
});

/*处理通用数据 这一步也很精髓*/
var data;

router.use(function(req,res,next){

     
        data = {
    	categories: [],
    	userInfo: req.userInfo,
    };

    Category.find().then(function(categories){
		data.categories = categories;
	});
    next();
})

router.get('/',function(req,res){
  
        data.page = Number(req.query.page || 1);
		data.limit=8 ;
		data.pages=0 ;
		data.category= req.query.category || '';
		data.count= 0;		
      /*这一步也很精髓*/
	    let where = {};

	    if(data.category){
	    	where.category = data.category
	    };

        Content.where(where).count()
		.then(function(count){
        data.count = count;
		data.pages = Math.ceil(data.count/data.limit);
		data.page = Math.min(data.page,data.pages);
		data.page = Math.max(data.page,1);
		let skip = ( data.page - 1 ) * data.limit ;

		return Content.where(where).find().limit(data.limit).skip(skip)
		.populate(['category','user']).sort({addTime: -1})

	}).then(function(contents){
		data.contents = contents;
		res.render('main/index',data);
	})
    
});

router.get('/view',function(req,res){
	var contentId = req.query.contentId || '';
	Content.findById({_id: contentId}).populate(['category','user'])
	.then(function(content){
				
        content.views++;
        /*content.save();*/
        content.content = marked(content.content);
        data.content = content;      
		res.render('main/view',data);




       return Content.update({
    	_id: content._id
       },
       {   
    	views: content.views

        })

	})

});
var albData = {};
router.use(function(req,res,next){

     
        albData = {
    	picCategories: [],
    	userInfo: req.userInfo,
    };

    PicCategory.find().then(function(categories){
		albData.picCategories = categories;
	});
    next();
})
router.get('/picture',function(req,res){

    
    albData.page = Number(req.query.page || 1);
	albData.limit= 5;
	albData.pages= 0;
	albData.count= 0;	



	PicCategory.count().then(function(count){

        albData.count = count;
		albData.pages = Math.ceil(albData.count/albData.limit);
		albData.page = Math.min(albData.page,albData.pages);
		albData.page = Math.max(albData.page,1);
		let skip = ( albData.page - 1 ) * albData.limit ;




    	return  PicCategory.aggregate([

           { 
           	$lookup: {
	       		      from:'pictures',
	       		      localField: "_id",
                      foreignField: "picCategory",
	       		      as:'Picture'
	       	          }
	        }

        ]).skip(skip).limit(albData.limit).sort({addTime: -1})
         
	}).then(function(categories){
           albData.categories = categories;

	       res.render('main/picture',albData);

        })

  
        
    
});
 var picData={};
 router.use(function(req,res,next){

     
        picData = {
    	categories: [],
    	userInfo: req.userInfo,
    };

    PicCategory.find().then(function(categories){
		picData.categories = categories;
	});
    next();
})
router.get('/picture/view',function(req,res){

    picData.page = Number(req.query.page || 1);
	picData.limit=12 ;
	picData.pages=0 ;
	picData.categoryId= req.query.picCategoryId || '';
	picData.count= 0;		
      /*这一步也很精髓*/ 
    let where = {};

	where.picCategory = picData.categoryId

      
    Picture.where(where).count()
	.then(function(count){
        picData.count = count;
		picData.pages = Math.ceil(picData.count/picData.limit);
		picData.page = Math.min(picData.page,picData.pages);
		picData.page = Math.max(picData.page,1);
		let skip = ( picData.page - 1 ) * picData.limit ;

		return Picture.where(where).find().limit(picData.limit).skip(skip)
		.populate(['picCategory','user']).sort({addTime: -1})

	}).then(function(contents){
		    picData.contents = contents;
		res.render('main/picture_category',picData);
	})





});
router.get('/about',function(req,res){
	   res.render('main/about');

});
router.get('/test',function(req,res){
	   res.render('test/input');

});

module.exports = router;