#!/bin/bash

set -e

echo "=== SYSTEM DIAGNOSTIC TOOLKIT INSTALL ==="

sudo apt update

sudo apt install -y \
  htop \
  btop \
  iotop \
  iftop \
  sysstat \
  lm-sensors \
  stress-ng \
  smartmontools \
  nvme-cli \
  pciutils \
  usbutils \
  inxi \
  fastfetch \
  dstat \
  glances \
  powertop \
  mesa-utils \
  lmbench \
  git \
  curl \
  wget \
  unzip \
  tar

  # neofetch \
echo
echo "=== SENSORS SETUP ==="
sudo sensors-detect --auto || true

echo
echo "=== SMART QUICK CHECK (if NVMe exists) ==="
sudo smartctl -a /dev/nvme0n1 || true

echo
echo "=== DONE ==="
echo "System diagnostics tools installed."