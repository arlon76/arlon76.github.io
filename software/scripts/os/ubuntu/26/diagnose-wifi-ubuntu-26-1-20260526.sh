#!/bin/bash

echo "===== WIFI DEVICE ====="
lspci | grep -i network

echo
echo "===== WIFI DRIVER ====="
sudo lshw -C network | grep -E "product:|vendor:|driver=|firmware="

echo
echo "===== CONNECTION INFO ====="
nmcli device wifi list | head -15

echo
echo "===== ACTIVE LINK ====="
iw dev

echo
echo "===== SIGNAL ====="
iwconfig 2>/dev/null | grep -E "ESSID|Signal|Bit Rate"

echo
echo "===== POWER SAVE ====="
IFACE=$(iw dev | awk '$1=="Interface"{print $2}' | head -1)

if [ -n "$IFACE" ]; then
    iw dev "$IFACE" get power_save
fi

echo
echo "===== PING ROUTER ====="
ping -c 10 192.168.1.1

echo
echo "===== PING CLOUDFLARE ====="
ping -c 10 1.1.1.1

echo
echo "===== DNS TEST ====="
ping -c 10 google.com

echo
echo "===== RECENT WIFI ERRORS ====="
dmesg | grep -iE "wifi|iwlwifi|firmware|network" | tail -20