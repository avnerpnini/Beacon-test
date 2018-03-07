
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
        var html = 'אותרו '+beaconsCounter+' ביקונים<br>מספר סריקות: '+ ((beaconScanCounter));
        document.querySelector('#found-beacons').innerHTML = html+JSON.stringify(beaconScanOutput);
    }
    
   
    function displayBeacons()
    {   
        beaconScanOutput.numOfFoundsBeacons = beaconsCounter;
        beaconScanOutput.numOfSucessScans = beaconScanCounter;
        beaconScanOutput.resualt = [];
        
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
                +	'<strong>'          + htmlBeaconName(beacon)    + '</strong><br/>' 
                +	'URL: '             + htmlBeaconURL(beacon)     + '<br/>'
                +	'RSSI: '            + htmlBeaconRSSI(beacon)    + '<br/>'
                +	 'ditsnace-min: '   + minDistance(beacon)       + '<br/>'
                +	 'ditsnace-max: '   + maxDistance(beacon)       + '<br/>'
                +	'ditsnace-avg: '    + avgDistance(beacon)       + '<br/>'
                +	'num-Of-Scans: '    + numOfScans(beacon)        + '<br/>' 
                + '</p>';
            html += htmlBeacon;

            var currentBeaconResualt = {};
            currentBeaconResualt.URL = htmlBeaconURL(beacon);
            currentBeaconResualt.RSSI = htmlBeaconRSSI(beacon);
            currentBeaconResualt.ditsnaceMin = minDistance(beacon);
            currentBeaconResualt.ditsnaceMax = maxDistance(beacon);
            currentBeaconResualt.ditsnaceAvg = avgDistance(beacon);
            currentBeaconResualt.numOfScans = numOfScans(beacon);
            
            beaconScanOutput.resualt.push(currentBeaconResualt);
        }
        document.querySelector('#found-beacons').innerHTML = html+JSON.stringify(beaconScanOutput);
    }

    function htmlBeaconName(beacon){
        var name = beacon.name || 'no name';
        return name;
    }

    function htmlBeaconURL(beacon){
        return beacon.url ?
             beacon.url  :  null;
    }
    
    function htmlBeaconRSSI(beacon){
        return beacon.rssi ?
            beacon.rssi  :  null;
    }

    function minDistance(beacon){
        return beacon['ditsnace-min'] ?
            beacon['ditsnace-min'] :  null;
    }

    function maxDistance(beacon){
        return beacon['ditsnace-max'] ?
           beacon['ditsnace-max'] :  null;
    }

    function avgDistance(beacon){
        return beacon['ditsnace-avg'] ?
            beacon['ditsnace-avg']: null;
    }

    function numOfScans(beacon){
         return beacon['distancePerScan'] ?
            beacon['distancePerScan'].length: null;
    }

    function showMessage(text){
        document.querySelector('#message').innerHTML = text;
    }

