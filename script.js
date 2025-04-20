document.getElementById("myForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const frequencyInput = parseFloat(document.getElementById("frequency").value);
  const frequencyUnit = document.getElementById("frequencyUnit").value;
  const mode = document.getElementById("options").value;
  const amplitude = parseFloat(document.getElementById("amplitude").value);
  const amplitudeUnit = document.getElementById("amplitudeUnit").value;

  const popup = document.getElementById("popup");
  const imgDiv = document.getElementById("img");
  const dataDiv = document.getElementById("data");

  if ((mode !== "2" && !frequencyInput) || mode === "0" || !amplitude) {
    alert("Please fill all the required fields correctly.");
    return;
  }

  // Convert frequency to Hz
  let frequencyHz = frequencyInput;
  switch (frequencyUnit) {
    case "mHz":
      frequencyHz *= 0.001;
      break;
    case "kHz":
      frequencyHz *= 1000;
      break;
    case "MHz":
      frequencyHz *= 1e6;
      break;
  }

  // Convert amplitude to Volts
  let amplitudeVolts = amplitude;
  if (amplitudeUnit === "mV") {
    amplitudeVolts /= 1000;
  }

  let circuitImg = "";
  let circuitData = "";

  if (mode === "1") {
    // Astable mode calculation: f = 1.44 / ((R1 + 2R2) * C)
    const C = 10e-9; // 0.01uF
    const denominator = 1.44 / frequencyHz;
    const rTotal = denominator / C;
    const R1 = 44000;
    const R2 = (rTotal - R1) / 2;

    circuitImg = "<img src='Astable.png' alt='Astable Circuit' style='width:100%; max-width:300px;' />";
    circuitData = `
      <h3>Astable Mode</h3>
      <p>Astable mode calculation: f = 1.44 / ((R1 + 2R2) * C)</p>
      <p>R1 = ${R1.toFixed(0)} ohms</p>
      <p>R2 = ${R2.toFixed(0)} ohms</p>
      <p>C = 0.01uF</p>
      <p>Vcc Amplitude = ${amplitudeVolts} V</p>
      <p>Output Amplitude = ${amplitudeVolts} V</p>
    `;
  } else if (mode === "3") {
    // Monostable mode: T = 1.1 * R * C --> f = 1 / T
    const T = 1 / frequencyHz;
    const C = 10e-6; // 10uF
    const R = T / (1.1 * C);

    circuitImg = "<img src='Monostable (Custom).png' alt='Monostable Circuit' style='width:100%; max-width:300px;' />";
    circuitData = `
      <h3>Monostable Mode</h3>
      <p>R = ${R.toFixed(0)} ohms</p>
      <p>C = 10uF</p>
      <p>Vcc Amplitude = ${amplitudeVolts} V</p>
      <p>Output Amplitude = ${amplitudeVolts} V</p>
    `;
  } else if (mode === "2") {
    circuitImg = "<img src='Bistable (Custom).jpg' alt='Bistable Circuit' style='width:100%; max-width:300px;' />";
    circuitData = `
      <h3>Bistable Mode</h3>
      <p>No timing components required.</p>
      <p>Use push buttons for Set and Reset.</p>
      <p>B1 Amplitude = ${amplitudeVolts} V</p>
      <p>Output Amplitude = ${amplitudeVolts} V</p>
    `;
  }

  imgDiv.innerHTML = circuitImg;
  dataDiv.innerHTML = circuitData;
  popup.style.display = "block";
});

function hide() {
  popup.style.display = "none";
}

function showIntroDialog() {
  const introDialog = document.createElement("div");
  introDialog.style.position = "fixed";
  introDialog.style.top = "50%";
  introDialog.style.left = "50%";
  introDialog.style.transform = "translate(-50%, -50%)";
  introDialog.style.background = "#fff";
  introDialog.style.padding = "20px";
  introDialog.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.2)";
  introDialog.style.borderRadius = "10px";
  introDialog.style.zIndex = "1001";
  introDialog.style.maxWidth = "400px";
  introDialog.style.textAlign = "center";

  introDialog.innerHTML = `
    <h2>Welcome!</h2>
    <p>This site is part of my Web Development journey.<br />
      It helps you design 555 timer circuits based on mode and frequency.</p>
    <button id="closeIntro" style="margin-top: 15px; padding: 8px 16px; border: none; background-color: #007BFF; color: white; border-radius: 5px; cursor: pointer;">Got it!</button>
  `;

  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.4)";
  overlay.style.zIndex = "1";
  overlay.style.backdropFilter = "blur(8px)";

  document.body.appendChild(overlay);
  document.body.appendChild(introDialog);

  document.getElementById("closeIntro").addEventListener("click", () => {
    introDialog.remove();
    overlay.remove();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  showIntroDialog();

  const modeSelect = document.getElementById("options");
  const frequency = document.getElementById("frequency");
  const frequencyUnit = document.getElementById("frequencyUnit");
  const frequencyWrapper = document.getElementById("frequencyWrapper");

  modeSelect.addEventListener("change", function () {
    const isBistable = modeSelect.value === "2";

    if (isBistable) {
      frequency.value = "";
      frequencyUnit.selectedIndex = 0;

      frequencyWrapper.classList.add("inactive");
    } else {
      frequencyWrapper.classList.remove("inactive");
    }
  });

  function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }


  // Attach listener to wrapper instead of disabled inputs
  frequencyWrapper.addEventListener("mousedown", function (e) {
    if (modeSelect.value === "2") {
      showToast("Frequency is not required in Bistable mode.");
      console.log("Frequency is not required in Bistable mode.");
      e.preventDefault();
    }
  });
});
