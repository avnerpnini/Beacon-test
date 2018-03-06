
    // Dictionary of beacons.
    var beacons = {};
    // Timer that displays list of beacons.
    var timer = null;

    
    function onDeviceReady()
    {
        // // Start tracking beacons!
        // setTimeout(startScan, 500);
        // // Timer that refreshes the display.
        // timer = setInterval(updateBeaconList, 500);
    }
    
  var beaconScanCounter;
  var beaconsCounter;
  var beaconScanTimeout;
  function beaconStartScan()
      {
      beaconScanCounter = 0;
      beaconsCounter = 0;
      beacons = {};
        showMessage('Scan in progress.');
        evothings.eddystone.startScan(
            function(beacon)
            {
                // Update beacon data.
                beacon.timeStamp = Date.now();
                //distance calculate 
                if (typeof(beacon.distancePerScan) == "undefined"){//a new beacon
                    beacon.distancePerScan = [];
                    beaconsCounter++;
                }
                beacon.distancePerScan.push(evothings.eddystone.calculateAccuracy(beacon.txPower, beacon.rssi)); 
                
                if (typeof(beacon.timesOfScaning) == "undefined")
                    beacon.timesOfScaning = 1;
                else
                    beacon.timesOfScaning++;
                
                beacons[beacon.address] = beacon;
                updateBeaconList();
                beaconScanCounter++;
                
                //איפוס לאחר 30 שניות ללא מציאה
                beaconScanTimeout =  setTimeout(function(){
                    calculateDistanceData();
                    beaconStopScan();
                    displayBeacons();
                    console.log(beacons);
                    
                }, 30000);
                
                //איפוס לאחר 60 סריקות או 15 סריקות לפחות כפול מספר הביקונים שאותרו 
                if ((beaconScanCounter >= 10 && beaconScanCounter >= beaconsCounter*15) || beaconScanCounter >= 60){
                    calculateDistanceData();
                    beaconStopScan();
                    displayBeacons();
                    console.log(beacons);
                }
            },
            function(error)
            {
                alert('Eddystone scan error: ' + error);
            });
    }

    function beaconStopScan()
    {
        showMessage('Scan stoped.');
        clearTimeout(beaconScanTimeout);
        evothings.eddystone.stopScan();
    }


     function calculateDistanceData(){
         for (var key in beacons)
         {
             beacons[key]["ditsnace-min"] = Math.min(...beacons[key]['distancePerScan']);
             beacons[key]["ditsnace-max"] = Math.max(...beacons[key]['distancePerScan']);
             var total = 0;
             for(var i = 0; i < beacons[key]['distancePerScan'].length; i++) {
                 total += beacons[key]['distancePerScan'][i];
             }
             beacons[key]["ditsnace-avg"] = total / beacons[key]['distancePerScan'].length;
         }
    }
    
    

    // Map the RSSI value to a value between 1 and 100.
    function mapBeaconRSSI(rssi)
    {
        if (rssi >= 0) return 1; // Unknown RSSI maps to 1.
        if (rssi < -100) return 100; // Max RSSI
        return 100 + rssi;
    }

   

    function getSortedBeaconList(beacons)
    {
        var beaconList = [];
        for (var key in beacons)
        {
            beaconList.push(beacons[key]);
        }
        beaconList.sort(function(beacon1, beacon2)
        {
            return mapBeaconRSSI(beacon1['distance-min']) < mapBeaconRSSI['distance-min'];
        });
        return beaconList;
    }


    function updateBeaconList()
    {
        var html = 'אותרו '+beaconsCounter+' ביקונים<br>מספר סריקות: '+ ((beaconScanCounter)+1);
        document.querySelector('#found-beacons').innerHTML = html
    }
    
   
    function displayBeacons()
    {
        var html = '<h3>אותרו '+beaconsCounter+' ביקונים</h3>';
        var sortedList = getSortedBeaconList(beacons);
        for (var i = 0; i < sortedList.length; ++i)
        {
            var beacon = sortedList[i];
            var htmlBeacon =
                '<p>'
                +	htmlBeaconName(beacon)
                +	htmlBeaconURL(beacon)
                +	htmlBeaconNID(beacon)
                +	htmlBeaconBID(beacon)
                +	htmlBeaconEID(beacon)
                +	htmlBeaconVoltage(beacon)
                +	htmlBeaconTemperature(beacon)
                +	htmlBeaconRSSI(beacon)
                +	minDistance(beacon)
                +	maxDistance(beacon)
                +	avgDistance(beacon)
                + '</p>';
            html += htmlBeacon
        }
        document.querySelector('#found-beacons').innerHTML = html;
    }
    function htmlBeaconName(beacon)
    {
        var name = beacon.name || 'no name';
        return '<strong>' + name + '</strong><br/>';
    }
    function htmlBeaconURL(beacon)
    {
        return beacon.url ?
            'URL: ' + beacon.url + '<br/>' :  '';
    }
    function htmlBeaconURL(beacon)
    {
        return beacon.url ?
            'URL: ' + beacon.url + '<br/>' :  '';
    }
    function htmlBeaconNID(beacon)
    {
        return beacon.nid ?
            'NID: ' + uint8ArrayToString(beacon.nid) + '<br/>' :  '';
    }
    function htmlBeaconBID(beacon)
    {
        return beacon.bid ?
            'BID: ' + uint8ArrayToString(beacon.bid) + '<br/>' :  '';
    }
    function htmlBeaconEID(beacon)
    {
        return beacon.eid ?
            'EID: ' + uint8ArrayToString(beacon.eid) + '<br/>' :  '';
    }
    function htmlBeaconVoltage(beacon)
    {
        return beacon.voltage ?
            'Voltage: ' + beacon.voltage + '<br/>' :  '';
    }
    function htmlBeaconTemperature(beacon)
    {
        return beacon.temperature && beacon.temperature != 0x8000 ?
            'Temperature: ' + beacon.temperature + '<br/>' :  '';
    }
    function htmlBeaconRSSI(beacon)
    {
        return beacon.rssi ?
            'RSSI: ' + beacon.rssi + '<br/>' :  '';
    }
    function uint8ArrayToString(uint8Array)
    {
        function format(x)
        {
            var hex = x.toString(16);
            return hex.length < 2 ? '0' + hex : hex;
        }
        var result = '';
        for (var i = 0; i < uint8Array.length; ++i)
        {
            result += format(uint8Array[i]) + ' ';
        }
        return result;
    }
    function htmlDistance(beacon){
            var distance = evothings.eddystone.calculateAccuracy(beacon.txPower, beacon.rssi);
            return distance ?
            'distance: ' + distance + '<br/>' :  '';
    }
    function minDistance(beacon)
    {
        return beacon['ditsnace-min'] ?
            'ditsnace-min: ' + beacon['ditsnace-min']+ '<br/>' :  '';
    }
    function maxDistance(beacon)
    {
        return beacon['ditsnace-max'] ?
            'ditsnace-max: ' + beacon['ditsnace-max'] + '<br/>' :  '';
    }
    function avgDistance(beacon)
    {
        return beacon['ditsnace-avg'] ?
            'ditsnace-avg: ' + beacon['ditsnace-avg'] + '<br/>' :  '';
    }

    function showMessage(text)
    {
        document.querySelector('#message').innerHTML = text;
    }

