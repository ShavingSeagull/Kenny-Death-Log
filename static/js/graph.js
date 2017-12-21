var windowWidth = ($(window).width());

window.onresize = function() {
    if (windowWidth !== ($(window).width())) {
        location.reload();
    }
};

queue()
    .defer(d3.json, "/kennysDeaths/deaths")
    .await(makeGraphs);

function makeGraphs(error, methodOfDeath) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    // Setting chart size variables to be responsive
    var seasonChartWidth = $("#seasonsChart").width();
    var seasonChartHeight = seasonChartWidth / 2;
    var deathChartWidth = $("#deathsChart").width();
    var deathChartHeight = deathChartWidth;
    var deathChartRadius = deathChartWidth / 2.2;
    var deathChartInnerRadius = deathChartRadius / 2;
    var quoteChartWidth = $("quotesChart").width();
    var quoteChartHeight = quoteChartWidth / 2;

    // Crossfilter instance
    var ndx = crossfilter(methodOfDeath);

    // Dimensions
    var seasonDim = ndx.dimension(function (d) {
        return d["SEASON"];
    });
    var typeDim = ndx.dimension(function (d) {
        return d["METHOD"];
    });
    var quoteDim = ndx.dimension(function (d) {
        return d["SEASON"];
    });
    var selectDim = ndx.dimension(function (d) {
        return d["METHOD"];
    });
    /*var episodeDim = ndx.dimension(function (d) {
        return d["episode"];
    });*/

    function reduceAdd(p, v) {
        if (v["QUOTE"] == "Yes") {
            ++p.count;
        }
        return p;
    }

    function reduceRemove(p, v) {
        if (v["QUOTE"] == "Yes") {
            --p.count;
        }
        return p;
    }

    function reduceInitial() {
        return {count: 0};
    }

    // Metrics
    var numDeathsBySeason = seasonDim.group();
    var numDeathTypes = typeDim.group();
    var numQuoteUse = quoteDim.group().reduce(reduceAdd,
        reduceRemove, reduceInitial);
    var numSelectMethod = selectDim.group().reduceCount(function (d) {
        return d["METHOD"];
    });
    var allDeaths = ndx.groupAll();
    //var numEpisode = episodeDim.group();

    // Values to be used in charts
    var minSeason = seasonDim.bottom(1)[0]["SEASON"];
    var maxSeason = seasonDim.top(1)[0]["SEASON"];

    // Chart types and linking to HTML
    var seasonsChart = dc.lineChart("#seasonsChart");
    var deathsChart = dc.pieChart("#deathsChart");
    var quotesChart = dc.barChart("#quotesChart");
    var deathSelect = dc.selectMenu("#deathSelect");
    var totalDeaths = dc.numberDisplay("#totalDeaths");


    deathSelect
        .dimension(selectDim)
        .group(numSelectMethod);

    deathSelect.render();

    totalDeaths
        .formatNumber(d3.format("d"))
        .valueAccessor(function (d) {
            return d;
        })
        .group(allDeaths);
        //.formatNumber(d3.format(".3s"));

    totalDeaths.render();

    seasonsChart
        .ordinalColors(["#C96A23"])
        .width(seasonChartWidth)
        .height(seasonChartHeight)
        .dimension(seasonDim)
        .group(numDeathsBySeason)
        .renderArea(true)
        .transitionDuration(500)
        .x(d3.scale.linear().domain([minSeason, maxSeason]))
        .elasticY(true)
        .xAxisLabel("Season")
        .yAxisLabel("Number of Deaths")
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .xAxis().ticks(21);

    seasonsChart.render();

    deathsChart
        .width(deathChartWidth)
        .height(deathChartHeight)
        .radius(deathChartRadius)
        .innerRadius(deathChartInnerRadius)
        .transitionDuration(1500)
        .ordinalColors(['#ff751a', '#262626', '#0080ff', '#00ff00', '#ff0000'])
        .renderLabel(true)
        .dimension(typeDim)
        .group(numDeathTypes);

    deathsChart.render();

    //quoteDim.filter(function(d) {return d === "Yes"});
    quotesChart
        .width(quoteChartWidth)
        .height(quoteChartHeight)
        .dimension(quoteDim)
        .group(numQuoteUse)
        .valueAccessor(function (p) {
            return p.value.count > 0 ?
                p.value.count : 0;
        })
        .x(d3.scale.linear().domain([minSeason, maxSeason]))
        .xAxisLabel("Season")
        .yAxisLabel("Number of times")
        .xAxis().ticks(21);

    quotesChart.render();
    //quoteDim.filterAll();
}