System.Gadget.onSettingsClosing = SettingsClosing;

function onLoad() {
    loadSettings();
}

function onUnload() {}

function SettingsClosing(event) {
    if (event.closeAction == event.Action.commit)
        saveSettings();
    event.cancel = false;
}

function loadSettings() {
    SelectOutput.value = System.Gadget.Settings.read("output");
    KefHost.value = System.Gadget.Settings.read("KefHost");
    if (SelectOutput.value == "")
        SelectOutput.value = "AUX"
	if (KefHost.value == "")
		KefHost.value = "192.168.0.58"
}

function saveSettings() {
    System.Gadget.Settings.write("output", SelectOutput.value);
    System.Gadget.Settings.write("KefHost", KefHost.value);
}