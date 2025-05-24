const express = require("express");
const { exec } = require("child_process");
const app = express();
const port = 3000;

app.use(express.static("."));

app.get("/set-hz", (req, res) => {
  const rate = req.query.rate;
  if (!["45", "60", "72", "90", "120"].includes(rate)) {
    return res.status(400).send("Invalid rate");
  }

  const cmd = `adb shell setprop debug.oculus.refresh_rate ${rate}`;
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error("Error:", error.message);
      return res.status(500).send("Failed to set refresh rate.");
    }
    console.log(`Refresh rate set to ${rate}Hz`);
    res.send(`Refresh rate set to ${rate}Hz`);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
