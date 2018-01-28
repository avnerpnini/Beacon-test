
//Example 1
function success() {
    alert('BlueCats SDK is purring');
    //Start watching beacons using com.bluecats.beacons.watchEnterBeacon etc.
};

function error() {
    alert('onError!');
};

var sdkOptions = {
    trackBeaconVisits:true, //Log visits to beacons to the BlueCats api
    useLocalStorage:true, //Cache beacons in local db for offline availability
    cacheAllBeaconsForApp:true, //Cache all beacons on startup
    discoverBeaconsNearby:true, //Cache beacons as detected by the device
    cacheRefreshTimeIntervalInSeconds:300 //Period to check for changes in seconds
};
function startPuring (){
    alert(1);
    com.bluecats.beacons.startPurringWithAppToken('00caffac-9ecd-42b9-8b75-1bd46a02f58c', success, error, sdkOptions);
    alert(2);
}


//Example 2
function success2(watchData) {
    var beacons = watchData.filteredMicroLocation.beacons;
    var sites = watchData.filteredMicroLocation.sites;
      alert('Beacons: ' + beacons.length + '\n' +
            'Sites: ' + sites.length);
  };
  
  function error2() {
      alert('error2!');
  };
  
  var beaconWatchOptions2 = {
    minimumTriggerIntervalInSeconds:2, //Integer. Minimum seconds between callbacks (default 1)
    repeatCount:3, //Integer. Default repeat infinite
      filter:{
        minimumProximity:'BC_PROXIMITY_IMMEDIATE', //String. Closest proximity to include. Default BC_PROXIMITY_IMMEDIATE
        maximumProximity:'BC_PROXIMITY_NEAR', //String. Furthest proximity to include. Default BC_PROXIMITY_UNKNOWN
        minimumAccuracy:0, //Number. Minimum distance in metres (Default 0)
          maximumAccuracy:0.5, //Number. Maximum distance in metres (Default unrestricted)
          sitesNamed:['Site1','Another Site'],//Array of string. Only include beacons in specified sites
          categoriesNamed:['Entrance','Another Category'],//Array of string. Only include beacons in specified categories
  
      }
  };
  
  var watchID = com.bluecats.beacons.watchMicroLocation(success2,error2, beaconWatchOptions2);


  
//Example 3
  function success3(watchData) {
    var beacons = watchData.filteredMicroLocation.beacons;
    var sites = watchData.filteredMicroLocation.sites;
      alert('Entered Beacons: ' + beacons.length + '\n' +
            'Sites: ' + sites.length);
  };
  
  function error3() {
      alert('error3!');
  };
  
  var beaconWatchOptions3 = {
    minimumTriggerIntervalInSeconds:2, //Integer. Minimum seconds between callbacks (default 1)
    repeatCount:3, //Integer. Default repeat infinite
    secondsBeforeExitBeacon:5, //Integer. Seconds after beacon leaves range before it can re-enter (Default 5)
      filter:{
        minimumProximity:'BC_PROXIMITY_IMMEDIATE', //String. Closest proximity to include. Default BC_PROXIMITY_IMMEDIATE
        maximumProximity:'BC_PROXIMITY_NEAR', //String. Furthest proximity to include. Default BC_PROXIMITY_UNKNOWN
        minimumAccuracy:0, //Number. Minimum distance in metres (Default 0)
          maximumAccuracy:10 //Number. Maximum distance in metres (Default unrestricted)
      }
  };
  
  var watchID = com.bluecats.beacons.watchEnterBeacon(success3,
                                                         error3,
                                                         beaconWatchOptions3);

//Example 5
function success5(watchData) {
    var closestBeacon = watchData.filteredMicroLocation.beacons[0];
    var site = watchData.filteredMicroLocation.sites[0];
      alert('Closest Beacon is: ' + closestBeacon.name + '\n' +
            'In Site: ' + site.name);
  };
  

  
  function error5() {
      alert('error5!');
  };
  
  var beaconWatchOptions5 = {
    minimumTriggerIntervalInSeconds:2, //Integer. Minimum seconds between callbacks (default 1)
    repeatCount:3, //Integer. Default repeat infinite
    secondsBeforeExitBeacon:5, //Integer. Seconds after beacon leaves range before counts as 'exited' (Default 5)
      filter:{
        minimumProximity:'BC_PROXIMITY_IMMEDIATE', //String. Closest proximity to include. Default BC_PROXIMITY_IMMEDIATE
        maximumProximity:'BC_PROXIMITY_UNKNOWN', //String. Furthest proximity to include. Default BC_PROXIMITY_UNKNOWN
        minimumAccuracy:0, //Number. Minimum distance in metres (Default 0)
          maximumAccuracy:10, //Number. Maximum distance in metres (Default unrestricted)
          sitesNamed:[],//Array of string. Only include beacons in specified sites
          categoriesNamed:[]//Array of string. Only include beacons in specified categories
      }
  };
  
  var watchID = com.bluecats.beacons.watchClosestBeaconChange(success5,
                                                         error5,
                                                         beaconWatchOptions5);



//Example 7
function success7(notificationData) {
    alert('Notification received' + JSON.stringify(notificationData));
};

function error7() {
    alert('error!');
};

com.bluecats.beacons.localNotificationReceived(success7, error7);