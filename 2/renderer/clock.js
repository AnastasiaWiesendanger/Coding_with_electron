(function () {
  // Load audio files
  const secondSound = new Audio('./sound/second.mp3');
  const minuteSound = new Audio('./sound/minute.mp3');
  const hourSound = new Audio('./sound/hour.mp3');
  
  // Store previous values to detect changes
  let prevSeconds = -1;
  let prevMinutes = -1;
  let prevHours = -1;

  function createGrid(containerId, cellCount) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing content
    
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      container.appendChild(cell);
    }
  }

  function updateClock() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Play sounds when time units change
    if (seconds !== prevSeconds) {
      playSecondSound();
      prevSeconds = seconds;
    }
    
    if (minutes !== prevMinutes) {
      playMinuteSound();
      prevMinutes = minutes;
    }
    
    if (hours !== prevHours) {
      playHourSound();
      prevHours = hours;
    }

    // Update grid cells
    updateTimeGrid('hours-container', hours, 24);
    updateTimeGrid('minutes-container', minutes, 60);
    updateTimeGrid('seconds-container', seconds, 60);

    // Every minute show notification (optional - you can remove this if you want)
    if(seconds === 0) {
      showNotification("System Monitor", "Un minuto è passato!");
    }
  }

  function playSecondSound() {
    try {
      secondSound.currentTime = 0; // Reset to start
      secondSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (error) {
      console.log("Second sound error:", error);
    }
  }

  function playMinuteSound() {
    try {
      minuteSound.currentTime = 0;
      minuteSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (error) {
      console.log("Minute sound error:", error);
    }
  }

  function playHourSound() {
    try {
      hourSound.currentTime = 0;
      hourSound.play().catch(e => console.log("Audio play failed:", e));
    } catch (error) {
      console.log("Hour sound error:", error);
    }
  }

  function updateTimeGrid(containerId, currentValue, maxValue) {
    const container = document.getElementById(containerId);
    const cells = container.getElementsByClassName('grid-cell');
    
    // Clear all cells first
    for (let cell of cells) {
      cell.classList.remove('filled');
    }
    
    // Fill cells up to current value (from bottom to top)
    for (let i = 0; i < currentValue; i++) {
      // Fill from the bottom (last cell represents 0/first value)
      const cellIndex = cells.length - 1 - i;
      if (cellIndex >= 0) {
        cells[cellIndex].classList.add('filled');
      }
    }
  }

  function initializeClock() {
    // Create grids for each time unit
    createGrid('hours-container', 24);
    createGrid('minutes-container', 60);
    createGrid('seconds-container', 60);
    
    // Initialize previous values
    const now = new Date();
    prevSeconds = now.getSeconds();
    prevMinutes = now.getMinutes();
    prevHours = now.getHours();
    
    updateClock();
  }

  window.addEventListener("cpuLoadUpdate", (e) => {
    const data = e.detail;
    let wrap = document.querySelector(".wrap");
    let dataValue = map(data.currentLoad, 0, 100, 0, 40);
    wrap.style.gap = `${dataValue}px`;
  });

  function map(value, min, max, minOut, maxOut) {
    return ((value - min) / (max - min)) * (maxOut - minOut) + minOut;
  }

  function showNotification(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: body,
      });
    }
  }

  // Initialize when the page loads
  initializeClock();
  setInterval(updateClock, 1000);
})();