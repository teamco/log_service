var userCountries, userCountriesOpts;
$(function () {
    $(document).ready(function() {
        userCountriesOpts = {
            chart: {
                renderTo: 'user-countries',
                type: 'bar'
            },
            title: {
                text: 'Users Distribution by Country'
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
                formatter: function() {
                    return ''+
                        this.series.name +': '+ this.y +' users';
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true
                    },
                    events: {
                        click: function() {
                            //goSAP();
                            goTo(this.name);
                        }
                    }
                }
            },
            legend: {
//                layout: 'horizontal',
//                align: 'center',
//                verticalAlign: 'bottom',
//                x: 100,
//                y: 100,
//                floating: true,
                borderWidth: 1,
                backgroundColor: '#FFFFFF',
                shadow: true
            }
        };

    });

});

function renderUserCountries() {
    jQuery.ajax({
        url: 'http://10.26.181.181:8080/labs/API/getTotalUsers?'+timeParams+'&' + boundParams + '&callback=?',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        type: 'GET'
    }).done(function (data, type, xhr) {
            userCountriesOpts.series = data;
            console.log(userCountriesOpts)
            userCountries = new Highcharts.Chart(userCountriesOpts);

        }).fail(function () {
            console.log('fail', arguments)
        });
}
