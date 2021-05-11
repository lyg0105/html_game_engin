exports.getDegree=function(x1,y1,x2,y2) {
    //목표 x2,y2 주체x1,y1으로부터의 각도
    var dgr = Math.atan((-(y2 - y1)) / (x2 - x1)) * (180 / Math.PI);

    dgr = parseFloat(dgr);

    if (x1 < x2 && y1 > y2) {
        dgr = 360 - dgr;
    } else if (x1 < x2 && y1 < y2) {
        dgr = (-dgr);
    } else if (x1 > x2 && y1 < y2) {
        dgr = 180 - dgr;
    } else if (x1 > x2 && y1 > y2) {
        dgr = 180 + (-dgr);
    }
    dgr = parseInt(dgr);
    return dgr;
}
exports.getDistance=function(x1,y1,x2,y2){
    //목표x2,y2와 주체x1,y1과의 거리구하기
    var distance=Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
    distance=parseInt(distance);
    return distance;
}