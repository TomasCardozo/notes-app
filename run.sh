#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

BACKEND_PID=""
FRONTEND_PID=""

OS="unknown"

log() {
  echo ""
  echo "==> $1"
}

fail() {
  echo "[ERROR] $1" >&2
  exit 1
}

cleanup() {
  [ -n "${FRONTEND_PID:-}" ] && kill "$FRONTEND_PID" 2>/dev/null || true
  [ -n "${BACKEND_PID:-}" ] && kill "$BACKEND_PID" 2>/dev/null || true
}

trap cleanup INT TERM EXIT

detect_os() {
  case "$(uname -s)" in
    Linux*)
      OS="linux"
      ;;
    MINGW*|MSYS*|CYGWIN*)
      OS="windows"
      ;;
    *)
      fail "Unsupported OS"
      ;;
  esac

  log "Detected OS: $OS"
}

detect_linux_distro() {
  if [ "$OS" != "linux" ]; then
    return
  fi

  [ -f /etc/os-release ] || fail "Unsupported Linux distro"

  . /etc/os-release

  case "${ID:-}" in
    ubuntu|debian)
      DISTRO_ID="$ID"
      DISTRO_CODENAME="${VERSION_CODENAME:-}"
      ;;
    *)
      fail "This script supports only Ubuntu or Debian on Linux"
      ;;
  esac
}

install_docker_if_missing() {

  if [ "$OS" = "windows" ]; then
    log "Skipping Docker installation on Windows (see README)"
    return
  fi

  if command -v docker >/dev/null 2>&1; then
    log "Docker already installed"
    return
  fi

  log "Installing Docker..."

  sudo apt update
  sudo apt install -y ca-certificates curl gnupg

  sudo install -m 0755 -d /etc/apt/keyrings

  if [ "$DISTRO_ID" = "ubuntu" ]; then
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
      sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $DISTRO_CODENAME stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  else
    curl -fsSL https://download.docker.com/linux/debian/gpg | \
      sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $DISTRO_CODENAME stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
  fi

  sudo chmod a+r /etc/apt/keyrings/docker.gpg
  sudo apt update
  sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

  sudo systemctl enable docker || true
  sudo systemctl start docker || true

  log "Docker installed"
}

wait_for_docker() {

  log "Waiting for Docker..."

  local attempts=0

  until docker info >/dev/null 2>&1; do
    attempts=$((attempts + 1))
    [ "$attempts" -lt 60 ] || fail "Docker is not running"
    sleep 2
  done
}

check_requirements() {

  command -v curl >/dev/null 2>&1 || fail "curl is required"
  command -v java >/dev/null 2>&1 || fail "java is required"
  command -v npm >/dev/null 2>&1 || fail "npm is required"

  [ -f "$BACKEND_DIR/mvnw" ] || fail "backend/mvnw not found"
}

start_db() {

  log "Starting database..."

  cd "$ROOT_DIR"
  docker compose up -d db
}

wait_for_db() {

  log "Waiting for MySQL..."

  DB_CONTAINER=$(docker compose ps -q db)

  until docker exec "$DB_CONTAINER" mysqladmin ping -uroot -proot --silent >/dev/null 2>&1; do
    sleep 2
  done
}

start_backend() {

  log "Starting backend..."

  cd "$BACKEND_DIR"
  chmod +x ./mvnw

  export JWT_SECRET="2CIHzoRTAxq03VjyY6m3VQ6g7ObQsMLVuoW6ITJiPUpb1EQKCO65IPWCLLGsTJff0Z8Ob7UahnS94spEst8emg=="

  ./mvnw spring-boot:run &
  BACKEND_PID=$!

  cd "$ROOT_DIR"
}

wait_for_backend() {

  log "Waiting for backend..."

  until curl -s http://localhost:8080/api/categories >/dev/null; do
    sleep 2
  done
}

start_frontend() {

  log "Starting frontend..."

  cd "$FRONTEND_DIR"

  if [ ! -d node_modules ]; then
    npm install
  fi

  npm run dev &
  FRONTEND_PID=$!

  cd "$ROOT_DIR"
}

main() {

  detect_os
  detect_linux_distro
  install_docker_if_missing
  wait_for_docker
  check_requirements

  start_db
  wait_for_db

  start_backend
  wait_for_backend

  start_frontend

  log "Application started"
  echo "Frontend: http://localhost:5173"
  echo "Backend:  http://localhost:8080"

  wait
}

main