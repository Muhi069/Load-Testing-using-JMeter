/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.882, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.998, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html"], "isController": false}, {"data": [0.9935, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/newCustomer.html"], "isController": false}, {"data": [0.9935, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/openAccount.html"], "isController": false}, {"data": [0.9975, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html"], "isController": false}, {"data": [0.998, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.9975, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/withdrawlTx.html"], "isController": false}, {"data": [0.961, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/managerView.html"], "isController": false}, {"data": [0.999, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/listTx.html"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8000, 0, 0.0, 293.78400000000113, 242, 1882, 268.0, 335.0, 353.0, 750.9899999999998, 187.08198868153968, 336.661163825359, 71.75434673308077], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html", 1000, 0, 0.0, 282.2279999999998, 243, 743, 263.0, 327.9, 339.94999999999993, 417.84000000000015, 25.35754133279237, 49.90725677363323, 9.65765734354397], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/newCustomer.html", 1000, 0, 0.0, 289.0380000000002, 242, 1010, 265.0, 330.0, 343.94999999999993, 733.99, 25.38135485672225, 35.525618115307495, 9.765872864793522], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/openAccount.html", 1000, 0, 0.0, 288.67899999999963, 245, 978, 264.0, 331.0, 344.0, 738.98, 25.425237090335866, 42.49416212720246, 9.782757239836261], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html", 1000, 0, 0.0, 282.6790000000004, 244, 917, 264.0, 326.0, 335.94999999999993, 393.8900000000001, 25.39811545983288, 69.67784474766972, 9.797124615853503], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html", 1000, 0, 0.0, 282.5039999999998, 243, 971, 263.0, 327.0, 335.0, 407.8700000000001, 25.31837861103375, 29.038944017900093, 9.692191812036357], "isController": false}, {"data": ["Test", 1000, 0, 0.0, 2350.272, 2056, 4989, 2274.5, 2594.5, 2838.549999999998, 3691.1600000000008, 23.31165349558244, 335.6016664918293, 71.52853054992191], "isController": true}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/withdrawlTx.html", 1000, 0, 0.0, 282.47299999999984, 243, 908, 264.0, 326.0, 334.0, 406.99, 25.325431798612165, 29.167032698298133, 9.744355594387885], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/managerView.html", 1000, 0, 0.0, 361.68500000000023, 264, 1882, 300.0, 388.0, 778.8499999999998, 1468.0800000000008, 24.553735850909714, 33.309444594495055, 9.447433520760184], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/listTx.html", 1000, 0, 0.0, 280.986, 244, 969, 263.0, 326.0, 337.0, 398.9000000000001, 25.326073192351526, 74.92694021463848, 9.620939913891352], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
