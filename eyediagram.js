function eyeDiagram() {


    //
    // options accessible to caller
    //
    var w = 500;
    var h = 500;
    var animationTime = 500;
    
    var gridData = [];
    var waveformData = [];  
    
    var updateWidth;
    var updateHeight;
    var updateGridData;
    var updateWaveformData;
    var animateData;
    
    function chart(selection){
        selection.each(function () {
            var svg = d3.select(this).append("svg")
                        .attr("width",  w)
                         .attr("height", h);
                         
            var circles = svg.selectAll("circle").data(gridData);
        
            console.log("We made it");
        
            //setup our scales
            var xScale = d3.scale.linear()
                        .domain([-9, 9])
                        .range([0, w]);
            var yScale = d3.scale.linear()
                        .domain([-9,9])
                        .range([0, h]);
            
            // Enter
            circles.enter().append("circle")
            .attr("r", 3);
            // Update
            circles = circles
            .attr("cx", function (d){ return xScale(d.x); })
            .attr("cy", function (d){ return yScale(d.y); })
            .attr("fill", 'transparent')
            .attr("stroke", 'red');
            // Exit
            circles.exit().remove();                                     
            
            //run annimation with waveform data
            for( var i=0; i<waveformData.length; i++)        
                doSetTimeout(i, waveformData);   
            
            function doSetTimeout(i, data) { 
                setTimeout(function() {
                    var subdata = [];
                    var currentLine = [];
                    var obj = {x: data[0].x,y: data[0].y};
                    var dataSize = data.length;
                    
                    //
                    // Log our entire data set
                    console.log("setTimeOut: " + i);
                    //console.log("data: ");
                    //console.log(data);
                    
                    //
                    // Construct subset with only 2
                    obj.x = data[i].x;
                    obj.y = data[i].y;
                    subdata.push(obj);
                    
                
                    //remove any previous circles
                    d3.selectAll(".red").remove();
                
                
                    // Bind data
                    var circles2 = svg.selectAll("circle2").data(subdata);
                    //var circles = svg.append("circle")
                    //setup our scales
                    var xScale = d3.scale.linear()
                                .domain([-9, 9])
                                .range([0, w]);
                    var yScale = d3.scale.linear()
                                .domain([-9,9])
                                .range([0, h]);
                    
                    // Enter
                    circles2.enter().append("circle")
                    .attr("r", 3);
                    // Update
                    circles2
                    .attr("cx", function (d){ return xScale(d.x); })
                    .attr("cy", function (d){ return yScale(d.y); })
                    .attr("class", "red")
                    .attr("fill", "Red")
                    .attr("stroke", "Red");
                    // Exit
                    // circles2.exit().remove();

                    if(i<dataSize-1) 
                    { 
                        // Place the next element as point for our line
                        currentLine[0] = data[i];
                        currentLine[1] = data[i+1];
                        console.log("Current Line: " + currentLine);
                        var linelength = Math.sqrt(
                                            Math.pow(xScale(currentLine[0].x)-xScale(currentLine[1].x),2)+
                                            Math.pow(yScale(currentLine[0].y)-yScale(currentLine[1].y),2)
                        );
                                        
                        console.log("linelength: " + linelength);
                        //remove any previous lines
                        d3.selectAll(".blueline").remove();
                        
                        //Bind our data
                        var lines = svg.selectAll("path").data(currentLine);
                        
                        //Draw Line Between 2 data points
                        var lineFunction = d3.svg.line()
                                    .x(function(d) { return xScale(d.x); })
                                    .y(function(d) {return yScale(d.y); })
                                    .interpolate("linear");
                        var lineGraph = svg.append("path")
                                    .attr("d", lineFunction(currentLine))
                                    .attr("stroke", "blue")
                                    .attr("class", "blueline")
                                    .attr("stroke-width", 2)
                                    .attr("fill", "none")
                                    .attr("stroke-dasharray", "78.5 78.5")
                                    .attr("stroke-dashoffset", 78.5)
                                    .transition().duration(500).attr("stroke-dashoffset",0); 
                    }
                                
                    subdata.shift(); 
                    
                },i*animationTime);
            }
            
            //
            // Update functions
            //
            updateWidth = function(){
                console.log("width: " + w)
                xScale.range([0,w]);
                yScale.range([0,h]);
                svg.transition().attr("width", w);
                circles.attr("cx", function (d){ return xScale(d.x); })
                        .attr("cy", function (d){ return yScale(d.y); });              
            }
            
            animateData = function(){
                console.log("Animate Data " + animationStartTime);
                //run annimation with waveform data
                 for( var i=0; i<waveformData.length; i++)        
                    doSetTimeout(i, waveformData);               
            }
                       
            
            });
            
    }
    
    chart.width = function(value) {
        if (!arguments.length) return w;
        w = value;
        if (typeof updateWidth === 'function') updateWidth();
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return h;
        h = value;
        if (typeof updateHeight === 'function') updateHeight();
        return chart;
    };

    chart.gridData = function(value) {
        if (!arguments.length) return gridData;
        gridData = value;
        if (typeof updateGridData === 'function') updateGridData();
        return chart;
    };
    
    chart.waveformData = function(value) {
        if (!arguments.length) return waveformData;
        waveformData = value;
        if (typeof updateWaveformData === 'function') updateWaveformData();
        return chart;
    };

    chart.animateData = function(value) {
        if (!arguments.length) return animationTime;
        animationTime = value;
        if (typeof animateData === 'function') animateData();
        return chart;
    };

    return chart;
    

}

//
// return x,y data for QAM64 symbol
//

function qam64Type(d){
    console.log(d);  
    var msb = d.Symbol.slice(0,3);
    var lsb = d.Symbol.slice(3,6);
    //msb = msb.toString(10);
    //lsb = lsb.toString(10);
        
    console.log("msb: " + msb + " lsb: " + lsb);
    //d.x = msb;
    //d.y = lsb;
    switch(msb){
        case '000':
            d.x = -7;
            break;
        case '001':
            d.x = -5;
            break;
        case '011':
            d.x = -3;
            break;    
        case '010':
            d.x = -1;
            break;
        case '110':
            d.x = 1;
            break;
        case '111':
            d.x = 3;
            break;
        case '101':
            d.x = 5;
            break;
        case '100':
            d.x = 7;
            break; 
        default:
            d.x = 0;                 
    }
    switch(lsb){
        case '000':
            d.y = -7;
            break;
        case '001':
            d.y = -5;
            break;
        case '011':
            d.y = -3;
            break;    
        case '010':
            d.y = -1;
            break;
        case '110':
            d.y = 1;
            break;
        case '111':
            d.y = 3;
            break;
        case '101':
            d.y = 5;
            break;
        case '100':
            d.y = 7;
            break; 
        default:
            d.y = 0;                 
    }          
    d.fill = "Transparent";
    //console.log("x: " + d.x + " y: " + d.y);      
    return d;
}

function type(d){
        d.x = +d.x;
        d.y = +d.y;
        console.log(d.x);
        //d.color=+d.color;
        return d;
}
      