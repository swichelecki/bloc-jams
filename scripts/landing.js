var pointsArray = document.getElementsByClassName('point');

// callback function below

var revealPoint = function(point) {                   
    point.style.opacity = 1;
    point.style.transform = "scaleX(1) translateY(0)";
    point.style.msTransform = "scaleX(1) translateY(0)";
    point.style.WebkitTransform = "scaleX(1) translateY(0)"; 
};
    

var animatePoints = function(points) {
    forEach(points, revealPoint);
 
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