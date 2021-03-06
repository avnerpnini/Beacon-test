    var beacons = {};    
    var beaconScanCounter;
    var beaconsCounter;
    var beaconScanTimeout;
    var beaconScanOutput;

    function beaconStartScan(){
        var MAXSCANTIME = 30 //in seconds
        beaconScanCounter = 0;
        beaconsCounter = 0;
        beacons = {};
        beaconScanOutput = {};
        beaconScanOutput.isScanning = 1;
        beaconScanOutput.maxScanTime = MAXSCANTIME;
        //איפוס לאחר 30 שניות ללא מציאה
        clearTimeout(beaconScanTimeout);
        beaconScanTimeout =  setTimeout(function(){
            beaconScanOutput.MaxTimeIsOver = 1;
            beaconScanFinished();
        }, MAXSCANTIME * 1000);
        updateBeaconOutput();
        //eddystone scan
        evothings.eddystone.startScan(
            function(beacon){
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
                updateBeaconOutput();
                
                
                
                //איפוס לאחר 60 סריקות או 15 סריקות לפחות כפול מספר הביקונים שאותרו 
                if ((beaconScanCounter >= 10 && beaconScanCounter >= beaconsCounter*15) || beaconScanCounter >= 60){
                    beaconScanFinished();
                }
            },
            function(error){
                beaconScanOutput.error = 'Eddystone scan error: ' + error;
                //alert('Eddystone scan error: ' + error);
            }
        );
    }

    //function that caled whan scan finished after beaconScanCounter reached destination or the max time is over
    function beaconScanFinished(){
        beaconCalculateDistanceData();
        beaconStopScan();
        beaconSaveScanResualt();
        console.log(beacons);
    }

    function beaconStopScan(){
            beaconScanOutput.isScanning = 0;
            clearTimeout(beaconScanTimeout);
            evothings.eddystone.stopScan();
            updateBeaconOutput();
    }

    //calculate min, max & ang ditance
    function beaconCalculateDistanceData(){
         for (var key in beacons)
         {
            //the ... way dont work on old devices
            beacons[key]["ditsnace-min"] = Math.max.apply(null, beacons[key]['distancePerScan'])//(...beacons[key]['distancePerScan']);
            beacons[key]["ditsnace-max"] = Math.max.apply(null, beacons[key]['distancePerScan'])//(...beacons[key]['distancePerScan']);
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

    function updateBeaconOutput(){
        beaconScanOutput.numOfFoundsBeacons = beaconsCounter;
        beaconScanOutput.numOfSucessScans = beaconScanCounter;
        //var html = 'אותרו '+beaconsCounter+' ביקונים<br>מספר סריקות: '+ ((beaconScanCounter));
        document.querySelector('#found-beacons').innerHTML = JSON.stringify(beaconScanOutput);
    }
    
   
    function beaconSaveScanResualt(){   
        beaconScanOutput.numOfFoundsBeacons = beaconsCounter;
        beaconScanOutput.numOfSucessScans = beaconScanCounter;
        beaconScanOutput.resualt = [];
        
        var log = '<h3>אותרו '+beaconsCounter+' ביקונים</h3>';
        for (var key in beacons)
        {
            var beacon = beacons[key];
            var htmlBeacon =
                '<p>'
                +	'<strong>'          + htmlBeaconName(beacon)    + '</strong><br/>' 
                +	'URL: '             + htmlBeaconURL(beacon)     + '<br/>'
                +	'RSSI: '            + htmlBeaconRSSI(beacon)    + '<br/>'
                +	 'ditsnace-min: '   + beaconMinDistance(beacon)       + '<br/>'
                +	 'ditsnace-max: '   + beaconMaxDistance(beacon)       + '<br/>'
                +	'ditsnace-avg: '    + beaconAvgDistance(beacon)       + '<br/>'
                +	'num-Of-Scans: '    + beaconNumOfScans(beacon)        + '<br/>' 
                + '</p>';
            log += htmlBeacon;

            var currentBeaconResualt = {};
            currentBeaconResualt.URL = htmlBeaconURL(beacon);
            currentBeaconResualt.RSSI = htmlBeaconRSSI(beacon);
            currentBeaconResualt.ditsnaceMin = beaconMinDistance(beacon);
            currentBeaconResualt.ditsnaceMax = beaconMaxDistance(beacon);
            currentBeaconResualt.ditsnaceAvg = beaconAvgDistance(beacon);
            currentBeaconResualt.numOfScans = beaconNumOfScans(beacon);
            
            beaconScanOutput.resualt.push(currentBeaconResualt);
        }
        console.log("scan success and finised", log);
        updateBeaconOutput()
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

    function beaconMinDistance(beacon){
        return beacon['ditsnace-min'] ?
            beacon['ditsnace-min'] :  null;
    }

    function beaconMaxDistance(beacon){
        return beacon['ditsnace-max'] ?
           beacon['ditsnace-max'] :  null;
    }

    function beaconAvgDistance(beacon){
        return beacon['ditsnace-avg'] ?
            beacon['ditsnace-avg']: null;
    }

    function beaconNumOfScans(beacon){
         return beacon['distancePerScan'] ?
            beacon['distancePerScan'].length: null;
    }

