#!/bin/bash
# install-diagnostic-network-tools-ubuntu-26-1-20260526.sh.txt

set -e

echo "=== NETWORK DIAGNOSTICS TOOLKIT INSTALL ==="

sudo apt update

sudo apt install -y \
  iproute2 \
  iputils-ping \
  dnsutils \
  curl \
  wget \
  traceroute \
  mtr \
  ethtool \
  tcpdump \
  nmap \
  net-tools \
  iftop \
  nethogs \
  network-manager \
  resolvconf \
  systemd-resolved \
  wavemon \
  speedtest-cli \
  usbutils \
  pciutils \
  lshw

echo
echo "=== DONE ==="
echo "Network diagnostics tools installed."