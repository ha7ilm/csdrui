/* eslint-disable no-console */
/**
 * Setup and run the development server for Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */

import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { spawn } from 'child_process';

import config from './webpack.config.development';

const argv = require('minimist')(process.argv.slice(2));

const app = express();
const compiler = webpack(config);
const PORT = process.env.PORT || 3000;

const wdm = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
});

app.use(wdm);

app.use(webpackHotMiddleware(compiler));

const server = app.listen(PORT, 'localhost', serverError => {
  if (serverError) {
    return console.error(serverError);
  }

  if (argv['start-hot']) {
    spawn('npm', ['run', 'start-hot'], { shell: true, env: process.env, stdio: 'inherit' })
      .on('close', code => process.exit(code))
      .on('error', spawnError => console.error(spawnError));
  }

  console.log(`Listening at http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  wdm.close();
  server.close(() => {
    process.exit(0);
  });
});

function ab2str(buf) { //https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}

//csdrui starts
const io = require('socket.io')(server);
var currentSocket = null;
process.stdin.on("readable", ()=>{ 
	let stdinRead = process.stdin.read();
	console.log("stdin: "+stdinRead); 
	//if(currentSocket) currentSocket.broadcast.emit("stdin", stdinRead);
	//else console.log("currentSocket is not set");
	if(stdinRead) io.sockets.emit("stdin", ab2str(stdinRead));
});

io.on("connection", (socket)=>
{
	console.log("server: socket.io connected"); 
	io.sockets.emit("stdin", "test");
	currentSocket = socket;
});

