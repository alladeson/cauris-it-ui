let statsPayload = {
    "mois": null,
    "debut": null,
    "fin": null,
    "debutAt": null,
    "finAt": null,
};
let statsMonths = [];
let numberOfMonths = 12;
let numberOfMonths1 = 12;
let bilanPayload = [];
let bilanData = null;
let apexchartsData = [];
let echartsData = [];
let myChart;
var dashboard = {
    saSucces: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "success",
            confirmButtonColor: "#5156be",
        })
    },
    saError: function(title, text) {
        Swal.fire({
            title: title,
            text: text,
            icon: "error",
            confirmButtonColor: "#5156be",
        })
    },
    saParams: function(title, text, confirmButtonText, cancelButtonText, oktitle, oktext, notitle, notext) {
        Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: !0,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            confirmButtonClass: "btn btn-success mt-2",
            cancelButtonClass: "btn btn-danger ms-2 mt-2",
            buttonsStyling: !1,
        }).then(function(e) {
            e.value ?
                entretien.saSucces(oktitle, oktext) :
                e.dismiss === Swal.DismissReason.cancel &&
                entretien.saError(notitle, notext);
        });
    },
    getChartColorsArray: function(e) {
        e = $(e).attr('data-colors')
        return (e = JSON.parse(e)).map(function(e) {
            e = e.replace(' ', '')
            if (-1 == e.indexOf('--')) return e
            e = getComputedStyle(document.documentElement).getPropertyValue(e)
            return e || void 0
        })
    },
    echartInit: function() {
        dom = document.getElementById('pie-chart'),
            myChart = echarts.init(dom),
            app = {};
        dashboard.echartSetOption();
    },
    echartSetOption: function() {
        var pieColors = dashboard.getChartColorsArray('#pie-chart');
        (option = null);
        (option = {
            tooltip: { trigger: 'item', formatter: '{a} <br/>{b} : {c}' },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['Facture de vente', 'Facture d\'avoir', 'Récapitulatif'],
                textStyle: { color: '#858d98' },
            },
            color: pieColors,
            series: [{
                name: 'Montant Total',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: echartsData[0], name: 'Facture de vente' },
                    { value: echartsData[1], name: 'Facture d\'avoir' },
                    { value: echartsData[2], name: 'Récapitulatif' },
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            }, ],
        }),
        option && 'object' == typeof option && myChart.setOption(option, !0)
    },
    apexcharts: function() {
        var columnColors = dashboard.getChartColorsArray('#column_chart'),
            options = {
                chart: { height: 350, type: 'bar', toolbar: { show: !1 } },
                plotOptions: { bar: { horizontal: !1, columnWidth: '45%' } },
                dataLabels: { enabled: !1 },
                stroke: { show: !0, width: 2, colors: ['transparent'] },
                series: [{
                        name: 'Factures de vente',
                        data: apexchartsData[0]
                    },
                    { name: 'Factures d\'avoir', data: apexchartsData[1] },
                    { name: 'Récapitulatif', data: apexchartsData[2] },
                ],
                colors: columnColors,
                xaxis: {
                    categories: statsMonths,
                },
                yaxis: { title: { text: 'Nombre de facture', style: { fontWeight: '500' } } },
                grid: { borderColor: '#f1f1f1' },
                fill: { opacity: 1 },
                tooltip: {
                    y: {
                        formatter: function(e) {
                            return e
                        },
                    },
                },
            };
        (chart = new ApexCharts(
            document.querySelector('#column_chart'),
            options,
        )).render()
    },
    /**
     * 
     * @param {Date} date 
     * @returns {Object}
     */
    setBilanPayload: function(date) {
        var payload = {
            keyword: null,
            debut: null,
            fin: null
        };
        payload.keyword = GlobalScript.statsMonthFormat(date);
        statsMonths[--numberOfMonths] = payload.keyword;
        payload.debut = date.toISOString().slice(0, 19);
        payload.fin = GlobalScript.endOfMonth(date).toISOString().slice(0, 19);
        bilanPayload[--numberOfMonths1] = payload;
        return payload;
    },
    getBilanData: function() {
        GlobalScript.request(URL_BILAN_DASHBOARD, 'GET', JSON.stringify(bilanPayload)).then(function(data) {
            // Run this when your request was successful
            bilanData = data;
            console.log(bilanData);
            // Mise à jour des données des charts
            dashboard.apexchartsDataFormatter();
            dashboard.echartsDataFormatter(0);
            // formatage du select des mois
            var selectOptions = ``;
            statsMonths.forEach((month, index) => {
                selectOptions += `<option value="${index}" ${index == 0 ? "selected": "" }>${month}</option>`;
            });
            $("#date-select-wrapper").find("select").html(selectOptions);
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            GlobalScript.ajxRqtErrHandler(err, "alertify", "la récupération des données du tableau de bord");
        });
    },
    apexchartsDataFormatter: function() {
        // Pour le nombre des facture
        var data = [];
        // Facture de vente
        statsMonths.forEach(month => {
            var bilan = bilanData[month];
            data.push(bilan[0]);
        });
        console.log("bilan fv : " + data);
        apexchartsData.push(data);
        // Facture d'avoir
        data = [];
        statsMonths.forEach(month => {
            var bilan = bilanData[month];
            data.push(bilan[1]);
        });
        console.log("bilan fa : " + data);
        apexchartsData.push(data);
        // Récapitulatif
        data = [];
        statsMonths.forEach(month => {
            var bilan = bilanData[month];
            data.push(bilan[2]);
        });
        console.log("bilan recap : " + data);
        apexchartsData.push(data);

        // initialize charts
        dashboard.apexcharts();;
    },
    echartsDataFormatter: function(index = null) {
        if (!index)
            index = $("#date-select-wrapper").find("select").val();
        // Pour les montant (uniquement pour un mois)
        var bilan = bilanData[statsMonths[index]];
        echartsData[0] = bilan[3];
        echartsData[1] = bilan[4];
        echartsData[2] = bilan[5];
        // initialize charts
        dashboard.echartSetOption();
    },
};
document.addEventListener("DOMContentLoaded", function() {
    // Mise à jour de waitMe element
    waitMe_zone = $("div.dashboard-data");
    // var date = new Date();
    var date = GlobalScript.beginningOfMonth(new Date());
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);

    date.setMonth(date.getMonth() - 1);
    payload = dashboard.setBilanPayload(date);


    dashboard.getBilanData();

    // Echart init
    dashboard.echartInit();

    // 
    $("#date-select-wrapper").find("select").change(function(event) {
        event.preventDefault();
        dashboard.echartsDataFormatter();
    })
});