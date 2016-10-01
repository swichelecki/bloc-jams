var animatePoints = function() {
    var revealPoint = function() {
        $(this).css({
            opacity: 1,
            transform: 'scaleX(1) translateY(0)'
        });
    };
    
    $.each($('.point'), revealPoint);
};

/* var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {
    var revealPoint = function(index) {            
            points[index].style.opacity = 1;
            points[index].style.transform = "scaleX(1) translateY(0)";
            points[index].style.msTransform = "scaleX(1) translateY(0)";
            points[index].style.WebkitTransform = "scaleX(1) translateY(0)"; 
        };
    
    for (i = 0; i < points.length; i++) {
        revealPoint(i);
    }
   
}; */

//window.onload = function() 
$(window).load(function(){
    // automatically animate points on tall screens on page load
   // if (window.innerHeight > 950) { 
       // animatePoints(pointsArray);
       if ($(window).height() > 950) {
           animatePoint();
        }
    
   // var sellingPoints = document.getElementsByClassName('selling-points')[0];
   // var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    
    var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;
    
 //   window.addEventListener('scroll', function(event){
      $(window).scroll(function(event) {
     // if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) { //animatePoints(pointsArray);
        if ($(window).scrollTop() >= scrollDistance) {
            animatePoints();
        }
    });       
    
});