
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
