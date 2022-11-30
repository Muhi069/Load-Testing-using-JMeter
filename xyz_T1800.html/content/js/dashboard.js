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

    var data = {"OkPercent": 99.97916666666667, "KoPercent": 0.020833333333333332};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8765123456790124, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9908333333333333, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html"], "isController": false}, {"data": [0.99, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/newCustomer.html"], "isController": false}, {"data": [0.9911111111111112, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/openAccount.html"], "isController": false}, {"data": [0.9902777777777778, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html"], "isController": false}, {"data": [0.9944444444444445, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.9952777777777778, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/withdrawlTx.html"], "isController": false}, {"data": [0.9416666666666667, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/managerView.html"], "isController": false}, {"data": [0.995, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/listTx.html"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14400, 3, 0.020833333333333332, 314.40583333333115, 0, 5354, 284.0, 363.0, 407.9499999999989, 832.9599999999991, 311.66132802354775, 560.8336255721907, 119.51124276983595], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html", 1800, 1, 0.05555555555555555, 302.9383333333335, 0, 5316, 280.0, 349.9000000000001, 375.0, 728.0, 42.0816383784542, 82.81831727509702, 16.01828249929864], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/newCustomer.html", 1800, 0, 0.0, 303.99833333333316, 245, 1999, 279.0, 352.0, 382.0, 780.98, 46.26179033128582, 64.75280261314863, 17.799946670436146], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/openAccount.html", 1800, 0, 0.0, 306.62555555555485, 244, 4257, 280.0, 355.0, 390.9499999999998, 770.97, 42.79295342700235, 71.50825101633264, 16.46525747093645], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html", 1800, 1, 0.05555555555555555, 304.66444444444426, 2, 5354, 280.0, 352.0, 377.89999999999964, 770.99, 41.81864646980926, 114.70851096577842, 16.122254380793624], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html", 1800, 1, 0.05555555555555555, 296.62611111111096, 0, 896, 278.0, 349.0, 374.0, 506.8600000000001, 42.1575286319882, 48.36819349866501, 16.129463135583297], "isController": false}, {"data": ["Test", 1800, 3, 0.16666666666666666, 2515.246666666673, 2109, 7268, 2405.0, 2867.7000000000003, 3292.499999999998, 4390.6, 38.841655517672955, 559.1635414081719, 119.15535498980407], "isController": true}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/withdrawlTx.html", 1800, 0, 0.0, 295.946111111111, 244, 877, 278.0, 346.0, 371.0, 495.0, 42.15357954146273, 48.54851906278542, 16.21924837825812], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/managerView.html", 1800, 0, 0.0, 405.47611111111127, 264, 2113, 336.0, 503.0, 870.7499999999991, 1649.99, 44.58756502353233, 60.496123745974735, 17.155762323507556], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/listTx.html", 1800, 0, 0.0, 298.9716666666666, 244, 5185, 278.0, 349.0, 368.0, 497.95000000000005, 42.17135627767495, 124.75912541292786, 16.02017342970269], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.globalsqa.com:443 failed to respond", 3, 100.0, 0.020833333333333332], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14400, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.globalsqa.com:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html", 1800, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.globalsqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html", 1800, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.globalsqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html", 1800, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.globalsqa.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
