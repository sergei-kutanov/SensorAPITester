//device motion rotation
var daccLab = document.getElementById("dacc");
var dgyrLab = document.getElementById("dgyr");
var dlacLab = document.getElementById("dlac");
var doriLab = document.getElementById("dori");

var reqDmPermBtn = document.getElementById('reqdmperm');
var reqDoPermBtn = document.getElementById('reqdoperm');

var debounce = function (func, delay) {
    var inDebounce;
    return function () {
        var context = this;
        var args = arguments;
        clearTimeout(inDebounce)
        inDebounce = setTimeout(function () {
            func.apply(context, args)
        }, delay)
    }
}

var throttle = function (func, limit) {
    var inThrottle;
    return function () {
        var args = arguments;
        var context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(function () {
                inThrottle = false
            }, limit)
        }
    }
}

/**
 *
 * @param {DeviceMotionEvent} event
 */
var dmListener = function (event) {
    console.log('DM interval: ' + event.interval)
    daccLab.innerText = JSON.stringify({
        x: event.accelerationIncludingGravity.x,
        y: event.accelerationIncludingGravity.y,
        z: event.accelerationIncludingGravity.z
    })
    dlacLab.innerText = JSON.stringify({
        x: event.acceleration.x,
        y: event.acceleration.y,
        z: event.acceleration.z
    })
    dgyrLab.innerText = JSON.stringify({
        x: event.rotationRate.beta,
        y: event.rotationRate.gamma,
        z: event.rotationRate.alpha
    })
}

/**
 *
 * @param {DeviceOrientationEvent} event
 */
var drListener = function (event) {
    doriLab.innerText = JSON.stringify({
        absolute: event.absolute,
        x: event.beta,
        y: event.gamma,
        z: event.alpha
    })
}

if (typeof DeviceMotionEvent === 'function' && typeof DeviceMotionEvent.requestPermission === 'function') {
    subscribeToDeviceMotion()
    reqDmPermBtn.addEventListener('click', function () {
        DeviceMotionEvent.requestPermission().then(function(status){
            // if (status === 'granted') {
            //     subscribeToDeviceMotion()
            // }
        });
    })
    reqDmPermBtn.style.display = 'initial';
} else {
    subscribeToDeviceMotion()
}
if (typeof DeviceOrientationEvent === 'function' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    subscribeToDeviceRotation()
    reqDoPermBtn.addEventListener('click', function () {
        DeviceOrientationEvent.requestPermission().then(function (status) {
            // if (status === 'granted') {
                // subscribeToDeviceRotation()
            // }
        })
    })
    reqDoPermBtn.style.display = 'initial';
} else {
    subscribeToDeviceRotation()
}

function subscribeToDeviceRotation() {
    doriLab.innerText = 'subscribed';
    window.addEventListener('deviceorientation', drListener, false)
    reqDoPermBtn.style.display = 'none';
}

function subscribeToDeviceMotion() {
    daccLab.innerText = 'subscribed';
    dlacLab.innerText = 'subscribed';
    dgyrLab.innerText = 'subscribed';
    window.addEventListener('devicemotion', throttle(dmListener, 300), false)
    reqDmPermBtn.style.display = 'none';
}