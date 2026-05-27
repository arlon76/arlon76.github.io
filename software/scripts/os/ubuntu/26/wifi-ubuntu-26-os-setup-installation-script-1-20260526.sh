#!/bin/bash

set -e

echo "=== WIFI / NETWORK DIAGNOSTIC TOOLKIT INSTALL ==="

sudo apt update

sudo apt install -y \
  network-manager \
  iw \
  wireless-tools \
  wavemon \
  net-tools \
  dnsutils \
  iputils-ping \
  traceroute \
  mtr \
  nmap \
  ethtool \
  tcpdump \
  speedtest-cli \
  arp-scan \
  nftables \
  iproute2

echo
echo "=== NETWORK MANAGER STATUS ==="
nmcli general status || true

echo
echo "=== WIFI DEVICES ==="
nmcli device status || true

echo
echo "=== DONE ==="
echo "WiFi/network diagnostics tools installed."