import * as d3 from 'd3'
import resignationscsv from 'raw-loader!./../data/resignations.csv'


var resignations = d3.csvParse(resignationscsv)

resignations = resignations.map(r => {
    r.days = Number(r.DaysFromAssumption)
    r.total = Number(r.Cumulative)
    return r
})

const width = 500
const height = 200
const pms = ['Thatcher','Major','Blair','Brown','Cameron','May']

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

