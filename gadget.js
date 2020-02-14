var oShell = new ActiveXObject("WScript.Shell");
var KefOut, KefHost

System.Gadget.settingsUI = "settings.html";
System.Gadget.onSettingsClosed = onSettingsClosed;

System.Debug.outputString("Init\n");
var lastTime = (new Date()).getTime();

// select output every 50 minutes (prevent lsx to enter standby after 1 hour)
setInterval(KefOn, 50 * 60 * 1000);

// power on when standby is detected
setInterval(function () {
    var currentTime = (new Date()).getTime();
    // System.Debug.outputString("currentTime="+currentTime + " lastTime="+lastTime+" diff="+(currentTime - lastTime)+"\n");
    if (currentTime - lastTime > 20 * 1000) {
        // give 10 more seconds for network to be up...etc
        setTimeout(function () {
            KefOn();
        }, 10 * 1000);
    }
    lastTime = currentTime;
}, 10 * 1000);

function init() {
    KefOut = System.Gadget.Settings.read("output");
    KefHost = System.Gadget.Settings.read("KefHost");
    if (KefOut == "")
        KefOut = "AUX";
    if (KefHost == "")
        KefHost = "192.168.0.58";
    KefOn();
}

function onSettingsClosed() {
    init();
}

function terminate() {}

function ExecCmd(cmd) {
    var ExePath = "powershell.exe -File \"" + System.Gadget.path + "\\kefctrl.ps1\" ip:" + KefHost + " " + cmd;
    // System.Debug.outputString(ExePath);
    oShell.Run(ExePath, 0);
}

function volumeDec() {
    ExecCmd("dec");
}

function volumeInc() {
    ExecCmd("inc");
}

function KefOn() {
    System.Debug.outputString("KefOn()\n");
    if (KefOut == "Optical") {
        ExecCmd("opt");
    } else {
        ExecCmd("aux");
    }
}
