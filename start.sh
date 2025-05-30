#!/bin/bash

# API sunucusunu arka planda çalıştır
node app.cjs &

# Socket sunucusu
node socket/socketServer.cjs
