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

    // Crossfilter instance
    var ndx = crossfilter(methodOfDeath);

    // Dimensions
    var deathSeasonDim = ndx.dimension(function (d) {
        return d["SEASON"];
    });
    /*var deathTypeDim = ndx.dimension(function (d) {
        return d["method"];
    });
    var quoteDim = ndx.dimension(function (d) {
        return d["quote"];
    });
    var episodeDim = ndx.dimension(function (d) {
        return d["episode"];
    });*/

    // Metrics
    var numDeathsBySeason = deathSeasonDim.group();
    /*var numDeathTypes = deathTypeDim.group();
    var numQuoteUse = quoteDim.group();
    var numEpisode = episodeDim.group();*/

    // Values to be used in charts
    var minSeason = deathSeasonDim.bottom(1)[0]["SEASON"];
    var maxSeason = deathSeasonDim.top(1)[0]["SEASON"];

    // Chart types and linking to HTML
    var seasonsChart = dc.lineChart("#seasonsChart");
    /*var deathsChart = dc.pieChart("#deathsChart");
    var quotesChart = dc.barChart("#quotesChart");
    var deathSelect = dc.selectMenu("#deathSelect");*/

    seasonsChart
        .ordinalColors(["#C96A23"])
        .width(seasonChartWidth)
        .height(seasonChartHeight)
        .dimension(deathSeasonDim)
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


    dc.renderAll();
}