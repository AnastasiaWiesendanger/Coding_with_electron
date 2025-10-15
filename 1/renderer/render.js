async function updateStats() {
  try {
    const battery = await window.API.getBattery();
    const cpuLoad = await window.API.getCpuLoad();
    const mem = await window.API.getMemory();
    const cpuInfo = await window.API.getCpuInfo();
    const processes = await window.API.getProcesses();
    const timeInfo = await window.API.getTimeInfo();

    //Battery
    document.getElementById("battery").innerText = battery.hasBattery
      ? battery.percent.toFixed(0)
      : "N/A";

    //CPU Load
    const cpuPercent = cpuLoad.currentLoad.toFixed(1);
    document.getElementById("cpu").innerText = cpuPercent;

    //RAM Usage
    const ramPercent = ((mem.active / mem.total) * 100).toFixed(1);
    document.getElementById("ram").innerText = ramPercent;

    //CPU Thermometer
    document.getElementById("cpu-thermometer-label").innerText =
      cpuPercent + "%";

    //Uptime
    document.getElementById("uptime").innerText = formatTime(timeInfo.uptime);

    //shape battery
    document.getElementById("shape-battery").style.width =
      battery.percent.toFixed() + "px";
    document.getElementById("shape-battery").style.height =
      battery.percent.toFixed() + "px";
    //shape cpu
    document.getElementById("shape-cpu").style.transform = `scale(${
      cpuPercent / 10  //30
    })`;

    //shape uptime
    //get hour from uptime
    const hour = Math.floor(timeInfo.uptime / 3600);
    console.log(hour);
    document.getElementById("shape-uptime").style.left = `${
      hour
    }%`;

    //shape ram
    //document.getElementById(
    //  "shape-ram"
    //).style.transform = `rotate(${ramPercent}deg)`;

    //change all .shape background color in relation of the thermometer
    document.getElementById(
      "shape-ram"
    ).style.backgroundColor = `rgba(0, 149, 255, ${cpuPercent / 100})`;
  } catch (err) {
    console.error("Errore nel caricamento statistiche:", err);
  }
}

// async function showMouseCoords() {
//   const pos = await window.API.getMousePosition();
//   console.log(`Mouse: x=${pos.x}, y=${pos.y}`);
//   document.getElementById(
//     "mouse-coords"
//   ).innerText = `X: ${pos.x}, Y: ${pos.y}`;
//   //shape mouse
//   document.getElementById("shape-mouse").style.transform = `rotate(${
//     //pos.x / 2
//     (pos.x),  (pos.y/2) //da modificare
//   }deg)`;
// }

async function showMouseCoords() {
  const pos = await window.API.getMousePosition();
  console.log(`Mouse: x=${pos.x}, y=${pos.y}`);
  document.getElementById("mouse-coords").innerText = `X: ${pos.x}, Y: ${pos.y}`;

  // Selettore del triangolo (elemento da ruotare)
  const element = document.getElementById("shape-mouse");

  // Calcola il centro del triangolo nella finestra
  const rect = element.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // Calcola la differenza tra cursore e centro
  const dx = pos.x - cx;
  const dy = pos.y - cy;

  // Calcola l'angolo in gradi verso il mouse
  const angle = Math.atan2(dy, dx) / Math.PI;
  const rot = (angle * (180 / Math.PI) * -1) + 180;

  // Applica la rotazione
  element.style.transform = `rotate(${rot}deg)`;
}

function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hrs.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

setInterval(showMouseCoords, 500);
setInterval(updateStats, 1000);

showMouseCoords();
updateStats();
