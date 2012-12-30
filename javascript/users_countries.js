var userCountries, userCountriesOpts;
$(function () {
    $(document).ready(function () {
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
                formatter: function () {
                    return '' +
                        this.series.name + ': ' + this.y + ' users';
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

function renderUserCountries() {
    jQuery.ajax({
        url: 'http://10.26.181.181:8080/labs/API/getTotalUsers?' + timeParams + '&' + boundParams + '&callback=?',
        async: false,
        contentType: "application/json",
        dataType: 'jsonp',
        type: 'GET'
    }).done(function (data, type, xhr) {
            userCountriesOpts.series = data;
            console.log(userCountriesOpts)
            userCountries = new Highcharts.Chart(userCountriesOpts);

            var totalUsers = 0, i = 0, l = userCountriesOpts.series.length;

            for (i; i < l; i += 1) {
                var users = userCountriesOpts.series[i];
                totalUsers += users.data[0];
            }

            $('.users span.count').text(totalUsers);

        }).fail(function () {
            console.log('fail', arguments)
        });
}

function addNote(country, short, type, jumpTo, altitude) {

    var text = '';

    if (type === 'off') {
        text = 'Service is not available to ' + country + ' residents.<br /><br /><a href=\'javascript:goTo("' + jumpTo + '", ' + altitude + ')\'>Fly to ' + country + '</a>';
    } else if (type === 'slow') {
        text = 'Traffic rate stunted for ' + country + ' residents.<br /><br /><a href=\'javascript:goTo("' + jumpTo + '", ' + altitude + ')\'>Fly to ' + country + '</a>';
    } else if (type === 'peak') {
        text = 'Record number of visitors from ' + country + ' detected.<br /><br /><a href=\'javascript:goTo("' + jumpTo + '", ' + altitude + ')\'>Fly to ' + country + '</a>';
    }

    $.gritter.add({
        // (string | mandatory) the heading of the notification
        title: 'Warning',
        // (string | mandatory) the text inside the notification
        text: text,
        // (string | optional) the image to display on the left
        image: 'http://dl.dropbox.com/u/9268245/flags/' + short + '.png',
        // (bool | optional) if you want it to fade out on its own or just sit there
        sticky: true,
        // (int | optional) the time you want it to be alive for before fading out
        time: '',
        // (string | optional) the class name you want to apply to that specific message
        class_name: 'my-sticky-class'
    });
}
