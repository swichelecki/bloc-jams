var pointsArray = document.getElementsByClassName('point');

var revealPoint = function(point) {                   
    point.style.opacity = 1;
    point.style.transform = "scaleX(1) translateY(0)";
    point.style.msTransform = "scaleX(1) translateY(0)";
    point.style.WebkitTransform = "scaleX(1) translateY(0)"; 
};
    

var animatePoints = function(points) {
    forEach(points, revealPoint);
                
     //   var revealSecondPoint = function() {
         // points[1].style.opacity = 1;
         // points[1].style.transform = "scaleX(1) translateY(0)";
         // points[1].style.msTransform = "scaleX(1) translateY(0)";
         // points[1].style.WebkitTransform = "scaleX(1) translateY(0)";     
       // };
                
    //    var revealThirdPoint = function() {
        // points[2].style.opacity = 1;
        // points[2].style.transform = "scaleX(1) translateY(0)";
        // points[2].style.msTransform = "scaleX(1) translateY(0)";
        // points[2].style.WebkitTransform = "scaleX(1) translateY(0)";  
       // };
                
            //revealFirstPoint();
            //revealSecondPoint();
            //revealThirdPoint();
};

window.onload = function() {
    // automatically animate points on tall screens on page load
    if (window.innerHeight > 950) { 
        animatePoints(pointsArray);
        }
    
    var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    
    window.addEventListener('scroll', function(event){
      if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) { animatePoints(pointsArray);
        }
    });       
    
}