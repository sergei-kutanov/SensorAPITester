//device motion rotation
var daccLab = document.getElementById("dacc");
var dgyrLab = document.getElementById("dgyr");
var dlacLab = document.getElementById("dlac");
var dlacMaxLab = document.getElementById("maxdlac");
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

var maxLacX = 0;
var maxLacY = 0;
var maxLacZ = 0;

/**
 *
 * @param {DeviceMotionEvent} event
 */
var dmListener = function (event) {
    console.log(event)
    daccLab.innerText = JSON.stringify({
        x: Math.round(event.accelerationIncludingGravity.x * 100) / 100,
        y: Math.round(event.accelerationIncludingGravity.y * 100) / 100,
        z: Math.round(event.accelerationIncludingGravity.z * 100) / 100
    })
    var lacX = Math.round(event.acceleration.x * 100) / 100;
    var lacY = Math.round(event.acceleration.y * 100) / 100;
    var lacZ = Math.round(event.acceleration.z * 100) / 100;
    if (maxLacX < lacX) {
        maxLacX = lacX
    }
    if (maxLacY < lacY) {
        maxLacY = lacY
    }
    if (maxLacZ < lacZ) {
        maxLacZ = lacZ
    }
    dlacLab.innerText = JSON.stringify({
        x: lacX,
        y: lacY,
        z: lacZ
    })
    dlacMaxLab.innerText = JSON.stringify({
        x: maxLacX,
        y: maxLacY,
        z: maxLacZ
    })
    dgyrLab.innerText = JSON.stringify({
        x: Math.round(event.rotationRate.beta * 100) / 100,
        y: Math.round(event.rotationRate.gamma * 100) / 100,
        z: Math.round(event.rotationRate.alpha * 100) / 100
    })
}

/**
 *
 * @param {DeviceOrientationEvent} event
 */
var drListener = function (event) {
    console.log(event);
    doriLab.innerText = JSON.stringify({
        absolute: event.absolute,
        x: Math.round(event.beta * 100) / 100,
        y: Math.round(event.gamma * 100) / 100,
        z: Math.round(event.alpha * 100) / 100
    })
}

if (typeof DeviceMotionEvent === 'function' && typeof DeviceMotionEvent.requestPermission === 'function') {
    subscribeToDeviceMotion()
    reqDmPermBtn.addEventListener('click', function () {
        DeviceMotionEvent.requestPermission().then(function(status){});
    })
    reqDmPermBtn.style.display = 'initial';
} else {
    subscribeToDeviceMotion()
}
if (typeof DeviceOrientationEvent === 'function' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    subscribeToDeviceRotation()
    reqDoPermBtn.addEventListener('click', function () {
        DeviceOrientationEvent.requestPermission().then(function (status) {})
    })
    reqDoPermBtn.style.display = 'initial';
} else {
    subscribeToDeviceRotation()
}

function subscribeToDeviceRotation() {
    doriLab.innerText = 'subscribed';
    window.addEventListener('deviceorientation', throttle(drListener, 300), false)
    reqDoPermBtn.style.display = 'none';
}

function subscribeToDeviceMotion() {
    daccLab.innerText = 'subscribed';
    dlacLab.innerText = 'subscribed';
    dgyrLab.innerText = 'subscribed';
    window.addEventListener('devicemotion', throttle(dmListener, 300), false)
    reqDmPermBtn.style.display = 'none';
}
