#!/bin/bash

help() {
  echo "Usage: ./appctl.sh <build/rebuild/start/restart/stop>"
}

build() {
  # Execute the Docker build command
  docker build -t notes-manager -f Dockerfile .
  npm install
  docker images

  start
}

rebuild() {
  stop
  docker rmi -f notes-manager

  build
}

start() {
  docker compose -f docker-compose.yml up -d --remove-orphans
  docker ps -a
}

stop() {
  docker compose -f docker-compose.yml down
}

if [ "$#" -ne 1 ]; then
  help
  exit 1
fi

case $1 in
  build)
    build
    ;;
  rebuild)
    rebuild
    ;;
  start)
    start
    ;;
  restart)
    stop
    start
    ;;
  stop)
    stop
    ;;
  *)
    help
    exit 1
    ;;
esac