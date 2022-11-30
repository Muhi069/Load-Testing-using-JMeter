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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8791111111111111, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.995, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html"], "isController": false}, {"data": [0.985, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/newCustomer.html"], "isController": false}, {"data": [0.994, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/openAccount.html"], "isController": false}, {"data": [0.994, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html"], "isController": false}, {"data": [0.997, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.996, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/withdrawlTx.html"], "isController": false}, {"data": [0.955, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/managerView.html"], "isController": false}, {"data": [0.996, 500, 1500, "https://www.globalsqa.com/angularJs-protractor/BankingProject/listTx.html"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4000, 0, 0.0, 295.6985, 244, 1300, 271.0, 341.0, 366.9499999999998, 755.0, 95.14068929429394, 171.19577538175201, 36.49072824251362], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/account.html", 500, 0, 0.0, 286.57799999999975, 245, 830, 266.0, 333.0, 357.95, 628.4900000000014, 12.7890321260487, 25.166017623286272, 4.87082278238183], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/newCustomer.html", 500, 0, 0.0, 294.9320000000001, 245, 942, 268.0, 336.90000000000003, 365.6499999999999, 742.9000000000001, 12.78151281985736, 17.89336903103351, 4.917886768577929], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/openAccount.html", 500, 0, 0.0, 285.464, 246, 920, 268.0, 332.0, 348.0, 522.0, 12.786415711947626, 21.370545932001843, 4.919773232917349], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/customerList.html", 500, 0, 0.0, 286.3440000000001, 246, 858, 268.0, 334.0, 344.0, 520.8900000000001, 12.78772378516624, 35.07967351342711, 4.932764546035806], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/depositTx.html", 500, 0, 0.0, 284.5439999999998, 244, 748, 267.0, 330.90000000000003, 346.95, 449.99, 12.784127227634169, 14.656752176497662, 4.893923704328706], "isController": false}, {"data": ["Test", 500, 0, 0.0, 2365.592000000003, 2049, 4447, 2300.5, 2595.8, 2814.8999999999996, 3614.0700000000006, 11.855364552459987, 170.6599640634262, 36.376518968583284], "isController": true}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/withdrawlTx.html", 500, 0, 0.0, 282.36399999999986, 246, 919, 266.0, 333.90000000000003, 343.0, 449.9100000000001, 12.758682283293782, 14.693167645895532, 4.909102362907959], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/managerView.html", 500, 0, 0.0, 360.956, 265, 1300, 302.0, 477.6000000000005, 780.75, 1236.93, 12.485329737558368, 16.941031787649514, 4.803925699802732], "isController": false}, {"data": ["https://www.globalsqa.com/angularJs-protractor/BankingProject/listTx.html", 500, 0, 0.0, 284.40599999999995, 245, 869, 266.5, 335.90000000000003, 348.95, 478.6800000000003, 12.78739674177131, 37.823720940640904, 4.857712238817422], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
