/**
 * Created by licanming on 14-9-24.
 */
$(function(){
    adaHeight();
    //banner
    var mainslider;
    var options = {
        slides: '.slide', // The name of a slide in the slidesContainer
        swipe: true,    // Add possibility to Swipe > note that you have to include touchSwipe for this
        slideTracker: true, // Add a UL with list items to track the current slide
        slideTrackerID: 'slideposition', // The name of the UL that tracks the slides
        slideOnInterval: false, // Slide on interval
        interval: 9000, // Interval to slide on if slideOnInterval is enabled
        animateDuration: 1000, // Duration of an animation
        animationEasing: 'ease', // Accepts: linear ease in out in-out snap easeOutCubic easeInOutCubic easeInCirc easeOutCirc easeInOutCirc easeInExpo easeOutExpo easeInOutExpo easeInQuad easeOutQuad easeInOutQuad easeInQuart easeOutQuart easeInOutQuart easeInQuint easeOutQuint easeInOutQuint easeInSine easeOutSine easeInOutSine easeInBack easeOutBack easeInOutBack
        pauseOnHover: false // Pause when user hovers the slide container
    };

    $(".slider").simpleSlider(options);
    mainslider = $(".slider").data("simpleslider");
    /* yes, that's all! */

    $(".slider").on("beforeSliding", function(event){
        var prevSlide = event.prevSlide;
        var newSlide = event.newSlide;
        $(".slider .slide[data-index='"+prevSlide+"'] .slidecontent").fadeOut();
        $(".slider .slide[data-index='"+newSlide+"'] .slidecontent").hide();
    });

    $(".slider").on("afterSliding", function(event){
        var prevSlide = event.prevSlide;
        var newSlide = event.newSlide;
        $(".slider .slide[data-index='"+newSlide+"'] .slidecontent").fadeIn();
    });
    $(".slide").each(function(){
        var _img_url = $(this).attr("data-src");
        $(this).backstretch(_img_url);
    });
    //banner
    tabsel(".user_title ul",".user_con  > div",function(){
        adaHeight();
    });
    tabsel(".new_title",".new_con  > div",function(){
        adaHeight();
    });
    adaHeight();
    $(window).scroll(function(){

        adaHeight();
    });
});
var isfirst = 0
function adaHeight(){
    $(".leftbar").removeAttr("style");
    $(".rightbar").removeAttr("style");
    if(!isfirst){
        var _left = $(".leftbar").height()+235;
        isfirst = 1
    }else{
        var _left = $(".leftbar").height()
    }

    var _right = $(".rightbar").height();

    if (_left > _right){
        $(".rightbar").height(_left);
    }else{
        $(".leftbar").height(_right);
    }
}
function tabsel($tab,$con,$fn,$eq){
    var index=null;
    if(!$eq){$eq=0}
    if($eq){
        $($con).hide().eq($eq).show();
        $($tab).children("li").eq($eq).addClass("cur").siblings().removeClass("cur");
        $($tab).children("li").eq($eq).find("a").addClass("cur").end().siblings().find("a").removeClass("cur")
    }else{
        $($con).hide().eq(0).show();
        $($tab).children("li").eq(0).addClass("cur").siblings().removeClass("cur");
        $($tab).children("li").eq(0).find("a").addClass("cur").end().siblings().find("a").removeClass("cur" )
    }

    $($tab).children("li").on("click",function(){
        $(this).addClass("cur").siblings().removeClass("cur");
        $(this).find("a").addClass("cur").end().siblings().find("a").removeClass("cur")
        index=$(this).index();
        $($con).hide();
        $($con).eq(index).show();
        if($fn){$fn()};
    });
    //if($fn){$fn()};
}