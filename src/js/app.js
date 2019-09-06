import * as d3 from 'd3'
import resignationscsv from 'raw-loader!./../data/resignations.csv'
import axios from 'axios'

// var resignations = d3.csvParse(resignationscsv)

// var resignations = (await axios.get("https://docs.google.com/spreadsheets/d/e/2PACX-1vRmNSKe6eCguv47eC5AwUla8VYl6g-Vn8tpNcpStfRS7n5THbKL1-N18mB3M7mtPZ4du1_rSkeYoWy_/pub?gid=103350681&single=true&output=csv")).data;

d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vRmNSKe6eCguv47eC5AwUla8VYl6g-Vn8tpNcpStfRS7n5THbKL1-N18mB3M7mtPZ4du1_rSkeYoWy_/pub?gid=103350681&single=true&output=csv").then(resignations =>{

    console.log(resignations)

    resignations = resignations.map(r => {
        r.days = Number(r.DaysFromAssumption)
        r.total = Number(r.Cumulative)
        return r
    })
    
    const width = 500
    const height = 200
    const pms = ['Thatcher','Major','Blair','Brown','Cameron','May','Johnson']
    
    var chart = d3.select('.interactive-wrapper').append('svg').attr('width',width).attr('height',height);
    
    var xscale = d3.scaleLinear().range([0,width]).domain([0,5000])
    var yscale = d3.scaleLinear().range([height,0]).domain([0,30])
    
    var line = d3.line()
        .x(function(d) { return xscale(d.days); })
        .y(function(d) { return yscale(d.calculated); });
    
    var xaxis =  d3.axisBottom()
    .scale(xscale);   
    
    var yaxis =  d3.axisLeft()
    .scale(yscale);   
    
    chart.append('g').call(xaxis)
    .attr("transform", `translate(0,${height})`)
    
    chart.append('g').call(yaxis)
    
    
    pms.forEach(pm => {
        let series = resignations.filter(r => r.PM == pm);
        series.sort((a,b) => {
            if (a.days > b.days) {return 1}
            else if (a.days < b.days) {return -1}
            else if (a.days == b.days) {return 0}
        })
        series = series.map((s,i) => {
            s.calculated = i+1;
            return s;
        })
        var pmline = chart
        .append("path")
        .datum(series)
        .attr("d",line)
        .attr("id",pm)
    
    })
    
    
    
})

