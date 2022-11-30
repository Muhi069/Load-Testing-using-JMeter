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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8655555555555555, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9826666666666667, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html"], "isController": false}, {"data": [0.9813333333333333, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/newCustomer.html"], "isController": false}, {"data": [0.9793333333333333, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/openAccount.html"], "isController": false}, {"data": [0.9836666666666667, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html"], "isController": false}, {"data": [0.9823333333333333, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.9856666666666667, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/withdrawlTx.html"], "isController": false}, {"data": [0.9086666666666666, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/managerView.html"], "isController": false}, {"data": [0.9863333333333333, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/listTx.html"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 12000, 0, 0.0, 332.4106666666658, 245, 3161, 287.0, 406.0, 496.0, 999.9299999999985, 265.02937408896156, 476.9167352246124, 101.6506705795309], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html", 1500, 0, 0.0, 320.1346666666664, 246, 1460, 283.0, 396.9000000000001, 457.9000000000001, 923.7400000000002, 36.029976940814755, 70.91407863842717, 13.72235449894312], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/newCustomer.html", 1500, 0, 0.0, 321.08666666666653, 247, 1889, 284.0, 382.0, 449.7000000000003, 927.98, 36.00835393811364, 50.398942554672686, 13.854776808219508], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/openAccount.html", 1500, 0, 0.0, 320.4746666666662, 245, 2191, 283.0, 374.0, 454.6500000000003, 955.97, 36.02045962106477, 60.19647284657685, 13.859434658886247], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html", 1500, 0, 0.0, 317.7086666666667, 245, 2022, 283.0, 380.9000000000001, 442.95000000000005, 891.7300000000002, 36.02478505211586, 98.83775037225611, 13.896279390220473], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html", 1500, 0, 0.0, 316.59799999999984, 247, 1243, 282.0, 395.9000000000001, 460.8000000000002, 793.98, 35.77390889577868, 41.02014331922251, 13.694699499165276], "isController": false}, {"data": ["Test", 1500, 0, 0.0, 2659.2853333333355, 2140, 5981, 2463.5, 3362.5000000000014, 3844.9, 4700.83, 33.02728053372085, 475.457118204637, 101.33956585639739], "isController": true}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/withdrawlTx.html", 1500, 0, 0.0, 311.3053333333329, 247, 1004, 281.0, 382.0, 431.0, 783.9000000000001, 35.77902871863372, 41.207285057484974, 13.766540346818052], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/managerView.html", 1500, 0, 0.0, 439.254, 268, 3161, 325.0, 780.9000000000001, 1004.8500000000001, 2098.6000000000004, 34.874799469903046, 47.31334171781637, 13.418624014786914], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/listTx.html", 1500, 0, 0.0, 312.7233333333327, 249, 1338, 283.0, 369.0, 430.0, 798.8100000000002, 35.78841886765443, 105.87076391871258, 13.59540521437263], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 12000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
