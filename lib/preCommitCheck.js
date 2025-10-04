const { execSync, exec } = require('child_process');
const readline = require('readline');
const os = require('os');

function confirmInTerminal(msg) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`${msg} (yes/no): `, (answer) => {
      rl.close();
      const normalized = answer.trim().toLowerCase();
      resolve(normalized === 'yes' || normalized === 'y');
    });
  });
}

async function confirmViaGuiOrTerminal(name, email) {
  const msg = `Proceed with commit as ${name} <${email}>?`;
  const platform = os.platform();

  if (platform === 'darwin') {
    // macOS (osascript)
    try {
      const script = `
        button returned of (display dialog "${msg}" buttons {"No", "Yes"} default button "Yes")
      `;
      const button = execSync(`osascript -e '${script.trim()}'`).toString().trim();
      return button === 'Yes';
    } catch {
      return false;
    }
  } else if (platform === 'win32') {
    // Windows (PowerShell)
    try {
      const psScript = `
        Add-Type -AssemblyName System.Windows.Forms;
        $result = [System.Windows.Forms.MessageBox]::Show('${msg}', 'Git Commit', 'YesNo', 'Question');
        if ($result -eq [System.Windows.Forms.DialogResult]::Yes) { exit 0 } else { exit 1 }
      `;
      execSync(`powershell -NoProfile -Command "${psScript.replace(/\n/g, '')}"`, { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  } else if (platform === 'linux') {
    // Linux: try zenity first, fallback to terminal prompt
    return new Promise((resolve) => {
      exec(`zenity --question --text="${msg}"`, (error) => {
        if (!error) {
          resolve(true);
        } else {
          // zenity failed or not installed
          confirmInTerminal(msg).then(resolve);
        }
      });
    });
  } else {
    // Unknown OS, fallback to terminal
    return await confirmInTerminal(msg);
  }
}

module.exports = async function () {
  try {
    const name = execSync('git config user.name').toString().trim();
    const email = execSync('git config user.email').toString().trim();

    const confirmed = await confirmViaGuiOrTerminal(name, email);

    if (!confirmed) {
      console.log('❌ Commit cancelled by user.');
      process.exit(1);
    } else {
      console.log('✅ Commit confirmed.');
      process.exit(0);
    }
  } catch (err) {
    console.error('❌ Error in pre-commit check:', err.message);
    process.exit(1);
  }
};
