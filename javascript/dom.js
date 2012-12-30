var doms, domOpts;
$(function () {
    $(document).ready(function () {
        domOpts = {
            chart: {
                renderTo: 'loading-dom',
                type: 'bar'
            },
            title: {
                text: 'DOM Elements'
            },
            xAxis: {
                categories: [''],
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                },
                labels: {
                    overflow: 'justify'
                }
            },
            tooltip: {
                formatter: function () {
                    return '' +
                        this.series.name + ': ' + this.y + ' loading time';
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    },
                    events: {
                        click: function () {
                            //goSAP();
                            goTo(this.name);
                        }
                    }
                }
            },
            legend: {
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            }
        };

    });

});

function rendeDoms() {
    jQuery.ajax({
        url: 'http://10.26.181.181:8080/labs/API/getElements?' + timeParams + '&' + boundParams + '&callback=?',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        type: 'GET'
    }).done(function (data, type, xhr) {
            domOpts.series = data;
            console.log(domOpts)
            doms = new Highcharts.Chart(domOpts);

        }).fail(function () {
            console.log('fail', arguments)
        });
}