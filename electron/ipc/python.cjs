const { spawn } = require("child_process");

let currentProcess = null;

function runPython(request, events) {
  return new Promise((resolve) => {
    if (currentProcess) {
      resolve({
        success: false,
        exitCode: -1,
      });
      return;
    }

    const executable =
      request.pythonPath || "python";

    currentProcess = spawn(
      executable,
      [
        request.filePath,
        ...(request.args || []),
      ],
      {
        cwd: request.workingDirectory,
      }
    );

    currentProcess.stdout.on("data", (data) => {
      events.stdout(data.toString());
    });

    currentProcess.stderr.on("data", (data) => {
      events.stderr(data.toString());
    });

    currentProcess.on("close", (code) => {
      currentProcess = null;

      events.exit(code);

      resolve({
        success: code === 0,
        exitCode: code,
      });
    });

    currentProcess.on("error", (err) => {
      currentProcess = null;

      events.stderr(err.message);

      resolve({
        success: false,
        exitCode: -1,
      });
    });
  });
}

function stopPython() {
  if (currentProcess) {
    currentProcess.kill();
    currentProcess = null;
  }
}

module.exports = {
  runPython,
  stopPython,
};