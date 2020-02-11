var oShell = new ActiveXObject("WScript.Shell");
var KefOut,KefHost

System.Gadget.settingsUI = "settings.html";
System.Gadget.onSettingsClosed = onSettingsClosed;

var lastTime = (new Date()).getTime();

// power on every hour
setInterval(KefOn,50*60*1000);

// power on when standby is detected
setInterval(function() {
  var currentTime = (new Date()).getTime();
  //System.Debug.outputString("checking if no timer for more than 20s\n");
  if (currentTime > (lastTime + 20*1000)) {  // ignore small delays
    setTimeout(function() {
     KefOn();
    }, 0);
  }
  lastTime = currentTime;
}, 10*1000);


function init()
{    
KefOut=System.Gadget.Settings.read("output");
KefHost=System.Gadget.Settings.read("KefHost");
if (KefOut=="") KefOut="Optical";
if (KefHost=="") KefHost="192.168.0.58";
KefOn();
}

function onSettingsClosed()
{
init();
}

function terminate()
{
}

function ExecCmd(cmd)
{
var ExePath = "powershell.exe -File \"" + System.Gadget.path  + "\\kefctrl.ps1\" ip:" + KefHost + " " + cmd;
//System.Debug.outputString(ExePath);
//System.Debug.outputString("\n");
oShell.Run(ExePath,0);
}

function volumeDec()
{
ExecCmd("dec");
}

function volumeInc()
{
ExecCmd("inc");
}

function KefOn()
{
System.Debug.outputString("KefOn()\n");
if (KefOut=="Optical") {ExecCmd("opt");} else {ExecCmd("aux");}
}
