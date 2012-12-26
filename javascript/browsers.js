var browserChart, browserChartOpts;

$(function () {
    $(document).ready(function() {

        // Radialize the colors
        Highcharts.getOptions().colors = $.map(Highcharts.getOptions().colors, function(color) {
            return {
                radialGradient: { cx: 0.5, cy: 0.3, r: 0.7 },
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        });

        // Build the chart
        browserChartOpts = {
            chart: {
                renderTo: 'total',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Browser distribution'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage) +' %';
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                name: 'Browser share'
            }]
        };

    });

});

function renderBrowsers() {
    jQuery.ajax({
        url: 'http://10.26.181.181:8080/labs/API/getBrowsers?'+timeParams+'&' + boundParams + '&callback=?',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        type: 'GET'
    }).done(function (data, type, xhr) {
            browserChartOpts.series[0].data = data;
            console.log(browserChartOpts)
            browserChart = new Highcharts.Chart(browserChartOpts);

        }).fail(function () {
            console.log('fail', arguments)
        });
}