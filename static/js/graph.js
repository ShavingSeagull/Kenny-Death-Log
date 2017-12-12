queue()
    .defer(d3.json, "/kennysDeaths/deaths")
    .await(makeGraphs);

function makeGraphs(error, kennysDeathMethods) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    // Crossfilter instance
    var ndx = crossfilter(kennysDeathMethods);

    // Dimensions
    var deathSeasonDim = ndx.dimension(function (d) {
        return d["season"];
    });
    var deathTypeDim = ndx.dimension(function (d) {
        return d["method"];
    });
    var quoteDim = ndx.dimension(function (d) {
        return d["quote"];
    });
    var episodeDim = ndx.dimension(function (d) {
        return d["epsiode"];
    });

    // Metrics
    var numDeathsBySeason = deathSeasonDim.group();
    var numDeathTypes = deathTypeDim.group();
    var numQuoteUse = quoteDim.group();
    var numEpisode = episodeDim.group();

    // Chart types and linking to HTNL
    var seasonsChart = dc.lineChart("#seasonsChart");
    var deathsChart = dc.pieChart("#deathsChart");
    var quotesChart = dc.barChart("#quotesChart");
    var deathSelect = dc.selectMenu("#deathSelect");
}