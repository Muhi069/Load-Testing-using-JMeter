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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8518611111111111, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9615, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html"], "isController": false}, {"data": [0.962, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/newCustomer.html"], "isController": false}, {"data": [0.965, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/openAccount.html"], "isController": false}, {"data": [0.9575, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html"], "isController": false}, {"data": [0.96575, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.96425, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/withdrawlTx.html"], "isController": false}, {"data": [0.93475, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/managerView.html"], "isController": false}, {"data": [0.956, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/listTx.html"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 16000, 0, 0.0, 390.799125, 242, 3225, 367.0, 469.0, 633.0, 956.0, 228.92790201885794, 411.93879688550743, 87.80413429483052], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html", 2000, 0, 0.0, 387.7429999999993, 246, 1869, 366.0, 460.9000000000001, 621.5999999999985, 910.97, 30.206917384080953, 59.44901284737956, 11.504587675577708], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/newCustomer.html", 2000, 0, 0.0, 390.4534999999995, 244, 1303, 365.0, 465.9000000000001, 646.9499999999998, 997.96, 29.886431560071728, 41.83046804953676, 11.499271518230723], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/openAccount.html", 2000, 0, 0.0, 386.8264999999999, 246, 1662, 365.0, 459.0, 625.8499999999995, 961.95, 30.078354112462968, 50.26351458048216, 11.573116719053134], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html", 2000, 0, 0.0, 392.32950000000034, 242, 3128, 369.0, 470.0, 645.9499999999998, 982.9100000000001, 30.206004953784813, 82.86737227579593, 11.65173042650879], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html", 2000, 0, 0.0, 381.16350000000034, 245, 1328, 366.0, 456.0, 568.8999999999996, 858.99, 30.204180258547783, 34.63375307705087, 11.562537755225325], "isController": false}, {"data": ["Test", 2000, 0, 0.0, 3126.3930000000005, 2019, 6249, 3073.0, 3714.9, 3960.0, 4474.75, 28.56489945155393, 411.2033599909306, 87.64737702810785], "isController": true}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/withdrawlTx.html", 2000, 0, 0.0, 382.33549999999946, 246, 1586, 366.0, 464.0, 577.8999999999996, 878.0, 30.200075500188753, 34.77733342770857, 11.619950924877314], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/managerView.html", 2000, 0, 0.0, 409.35150000000004, 247, 2048, 371.0, 567.0, 722.8999999999996, 1184.8000000000002, 29.588862752060123, 40.14434279437219, 11.384777269835633], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/listTx.html", 2000, 0, 0.0, 396.19, 243, 3225, 369.0, 474.8000000000002, 646.9499999999998, 986.94, 30.22472079914162, 89.41228030406069, 11.481851944205165], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 16000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
