
    // Dictionary of beacons.
    
    var beacons = {};    
    var beaconScanCounter;
    var beaconsCounter;
    var beaconScanTimeout;
    var beaconScanOutput;
    function beaconStartScan()
        {
        var MAXSCANTIME = 30 //in seconds
        beaconScanCounter = 0;
        beaconsCounter = 0;
        beacons = {};
        beaconScanOutput = {};
        beaconScanOutput.isScanning = 1;
        beaconScanOutput.maxScanTime = MAXSCANTIME;
        
        showMessage('Scan in progress.');
        //איפוס לאחר 30 שניות ללא מציאה
        clearTimeout(beaconScanTimeout);
        beaconScanTimeout =  setTimeout(function(){
            calculateDistanceData();
            beaconStopScan();
            displayBeacons();
            console.log(beacons);
            
        }, MAXSCANTIME * 1000);
        
        //eddystone scan
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
                beaconScanCounter++;
                updateBeaconList();
                
                
                
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
                beaconScanOutput.error = 'Eddystone scan error: ' + error;
                //alert('Eddystone scan error: ' + error);
            });
        }

        function beaconStopScan()
        {
            beaconScanOutput.isScanning = 0;
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
        beaconScanOutput.numOfFoundsBeacons = beaconsCounter;
        beaconScanOutput.numOfSucessScans = beaconScanCounter;
        var html = 'אותרו '+beaconsCounter+' ביקונים<br>מספר סריקות: '+ ((beaconScanCounter)+1);
        document.querySelector('#found-beacons').innerHTML = html+JSON.stringify(beaconScanOutput);
    }
    
   
    function displayBeacons()
    {   
        eaconScanOutput.numOfFoundsBeacons = beaconsCounter;
        beaconScanOutput.numOfSucessScans = beaconScanCounter;
        beaconScanOutput.resualt = {};
        
        var html = '<h3>אותרו '+beaconsCounter+' ביקונים</h3>';
        //var sortedList = getSortedBeaconList(beacons);
        for (var key in beacons)
        {
            // beaconList.push(beacons[key]);
            // }
            // for (var i = 0; i < sortedList.length; ++i)
            // {
            var beacon = beacons[key];
            var htmlBeacon =
                '<p>'
                +	'<strong>' + htmlBeaconName(beacon) + '</strong><br/>' 
                +	'URL: ' + htmlBeaconURL(beacon) + '<br/>'
                +	htmlBeaconNID(beacon)
                +	htmlBeaconBID(beacon)
                +	htmlBeaconEID(beacon)
                +	htmlBeaconVoltage(beacon)
                +	htmlBeaconTemperature(beacon)
                +	htmlBeaconRSSI(beacon)
                +	minDistance(beacon)
                +	maxDistance(beacon)
                +	avgDistance(beacon)
                +	numOfScans(beacon)
                + '</p>';
            html += htmlBeacon
        }
        document.querySelector('#found-beacons').innerHTML = html;
    }

    function htmlBeaconName(beacon){
        var name = beacon.name || 'no name';
        return name;
    }

    function htmlBeaconURL(beacon)
    {
        return beacon.url ?
             beacon.url  :  null;
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

    function numOfScans(beacon)
    {
         return beacon['distancePerScan'] ?
            'num-Of-Scans: ' + beacon['distancePerScan'].length + '<br/>' :  '';
    }

    function showMessage(text)
    {
        document.querySelector('#message').innerHTML = text;
    }

