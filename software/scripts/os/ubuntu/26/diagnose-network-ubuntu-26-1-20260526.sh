#!/bin/bash
# diagnose-wifi-ubuntu-26-1-20260526.sh
echo "=============================="
echo " NETWORK TRUTH DIAGNOSTIC"
echo "=============================="

echo
echo "== MACHINE ID =="
hostnamectl | grep -E "Static hostname|Operating System|Kernel"

echo
echo "== ACTIVE NETWORK INTERFACES =="
ip -br link

echo
echo "== IP ADDRESSES =="
ip -br addr

echo
echo "== DEFAULT ROUTE (CRITICAL) =="
ip route | grep default

echo
echo "== DNS RESOLVER =="
resolvectl status | grep -E "DNS Servers|Current DNS Server|DNS Domain"

echo
echo "== WIFI / LINK STATUS =="
nmcli device status

echo
echo "== WIFI SIGNAL (if applicable) =="
iwconfig 2>/dev/null | grep -E "ESSID|Signal|Bit Rate" || echo "No wireless interface detected"

echo
echo "== USB / ETHERNET DEVICES =="
lsusb | grep -i -E "ether|net|realtek|asix|ax|lan" || echo "No obvious USB NIC detected"

echo
echo "== PCI NETWORK DEVICES =="
lspci | grep -i network

echo
echo "== DRIVER + FIRMWARE (KEY SECTION) =="
sudo lshw -C network 2>/dev/null | grep -E "description|product|vendor|configuration|driver|firmware"

echo
echo "== ROUTE METRICS (MULTI-INTERFACE BUG CHECK) =="
ip route show

echo
echo "== PING TEST (ROUTER) =="
ping -c 5 192.168.0.1

echo
echo "== PING TEST (INTERNET IP) =="
ping -c 5 1.1.1.1

echo
echo "== DNS TEST (DOMAIN) =="
ping -c 5 google.com

echo
echo "== HTTP TIMING TEST (REAL WORLD) =="
curl -o /dev/null -s -w \
"time_namelookup=%{time_namelookup}\n\
time_connect=%{time_connect}\n\
time_starttransfer=%{time_starttransfer}\n\
time_total=%{time_total}\n" \
https://example.com

echo
echo "== YOUTUBE FRONT PAGE TIMING =="
curl -o /dev/null -s -w \
"time_total=%{time_total}\n" \
https://youtube.com

echo
echo "== RECENT NETWORK ERRORS =="
dmesg | grep -iE "firmware|wifi|usb|reset|link|error" | tail -30

echo
echo "=============================="
echo " DONE"
echo "=============================="
