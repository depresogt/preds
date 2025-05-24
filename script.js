let xrSession = null;
let currentHz = 72;
let predictionAmount = 50;

// UI Elements
const predictionSlider = document.getElementById("predictionSlider");
const predictionValue = document.getElementById("predictionValue");
const hzButton = document.getElementById("hzButton");
const enterVRButton = document.getElementById("enterVR");

predictionSlider.addEventListener("input", () => {
  predictionAmount = parseInt(predictionSlider.value, 10);
  predictionValue.textContent = predictionAmount;
});

// Change refresh rate
hzButton.addEventListener("click", async () => {
  if (!xrSession) {
    alert("Start a VR session first.");
    return;
  }

  const nextHz = currentHz === 72 ? 90 : currentHz === 90 ? 120 : 72;
  currentHz = nextHz;

  try {
    await xrSession.updateRenderState({ preferredFrameRate: currentHz });
    hzButton.textContent = `Current Refresh Rate: ${currentHz}Hz`;
    console.log(`Requested refresh rate: ${currentHz}Hz`);
  } catch (err) {
    console.warn("Could not set refresh rate:", err);
  }
});

// Enter VR
enterVRButton.addEventListener("click", async () => {
  if (!navigator.xr) {
    alert("WebXR not supported on this device.");
    return;
  }

  const supported = await navigator.xr.isSessionSupported("immersive-vr");
  if (!supported) {
    alert("Immersive VR not supported.");
    return;
  }

  xrSession = await navigator.xr.requestSession("immersive-vr", {
    optionalFeatures: ["local-floor", "bounded-floor"]
  });

  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  const gl = canvas.getContext("webgl", { xrCompatible: true });

  await xrSession.updateRenderState({ baseLayer: new XRWebGLLayer(xrSession, gl) });

  const refSpace = await xrSession.requestReferenceSpace("local");

  xrSession.requestAnimationFrame(function onXRFrame(time, frame) {
    const session = frame.session;
    session.requestAnimationFrame(onXRFrame);

    const pose = frame.getViewerPose(refSpace);
    if (pose) {
      // Simulate prediction — do something with predictionAmount here
      // e.g., adjust cube rotation speed or latency based on slider value
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, session.renderState.baseLayer.framebuffer);
    gl.clearColor(0.1, 0.0, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  });
});
