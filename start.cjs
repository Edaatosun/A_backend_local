const { spawn } = require('child_process');

const app = spawn('node', ['app.cjs'], { stdio: 'inherit' });
const socket = spawn('node', ['socket/socketServer.cjs'], { stdio: 'inherit' });

app.on('close', code => {
  console.log(`app.cjs exited with code ${code}`);
});
socket.on('close', code => {
  console.log(`socketServer.cjs exited with code ${code}`);
});
