var chartUsers, chartUsersOpts;
$(function () {
    $(document).ready(function () {
        chartUsersOpts = {
            chart: {
                renderTo: 'container',
                zoomType: 'x',
                spacingRight: 20
            },
            title: {
                text: 'Concurrent users'
            },
//            subtitle: {
//                text: document.ontouchstart === undefined ?
//                    'Click and drag in the plot area to zoom in' :
//                    'Drag your finger over the plot to zoom in'
//            },
            xAxis: {
//                type: 'datetime',
//                maxZoom: 14 * 24 * 3600000, // fourteen days
//                title: {
//                    text: null
//                }
            },
            yAxis: {
                title: {
                    text: 'Active Users'
                },
                showFirstLabel: false
            },
            tooltip: {
                shared: true
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1},
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, 'rgba(2,0,0,0)']
                        ]
                    },
                    lineWidth: 1,
                    marker: {
                        enabled: false,
                        states: {
                            hover: {
                                enabled: true,
                                radius: 5
                            }
                        }
                    },
                    shadow: false,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },

            series: [
                {
                    type: 'area',
                    name: 'Users'
                }
            ]
        };


    });

});

function renderChartUsers() {
    jQuery.ajax({
        url: 'http://10.26.181.181:8080/labs/API/getConcurrentUsers?' + timeParams + '&' + boundParams + '&callback=?',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        type: 'GET'
    }).done(function (data, type, xhr) {
            chartUsersOpts.series[0].data = data;
            console.log(chartUsersOpts)
            chartUsers = new Highcharts.Chart(chartUsersOpts);

        }).fail(function () {
            console.log('fail', arguments)
        });
}