#!/bin/bash
set -e

echo "======================================="
echo " Ubuntu First-Hour Setup (Arlon Pack)"
echo "======================================="

sudo apt update
sudo apt upgrade -y


# -------------------------------------------------
# CORE UTILITIES (everyday system + dev basics)
# -------------------------------------------------
echo "Installing core utilities..."

sudo apt install -y \
  git curl wget unzip tar \
  build-essential \
  software-properties-common \
  htop btop \
  neofetch fastfetch \
  gnome-system-monitor \
  baobab \
  gparted \
  synaptic


# -------------------------------------------------
# TEXT EDITORS / LIGHT DEV TOOLS
# -------------------------------------------------
echo "Installing editors..."

sudo apt install -y \
  geany \
  kate \
  leafpad


# -------------------------------------------------
# GRAPHICS / CREATIVE TOOLS
# -------------------------------------------------
echo "Installing creative tools..."

sudo apt install -y \
  gimp \
  inkscape \
  scribus


# -------------------------------------------------
# OFFICE / BASIC PRODUCTIVITY
# -------------------------------------------------
echo "Installing office tools..."

sudo apt install -y \
  gnumeric


# -------------------------------------------------
# NETWORK / WIFI / HARDWARE TOOLS
# -------------------------------------------------
echo "Installing network tools..."

sudo apt install -y \
  net-tools \
  iputils-ping \
  traceroute \
  dnsutils \
  wavemon


# -------------------------------------------------
# WINE / WINDOWS COMPATIBILITY
# -------------------------------------------------
echo "Installing Wine support..."

sudo dpkg --add-architecture i386
sudo apt update

sudo apt install -y \
  wine64 wine32


# -------------------------------------------------
# TERMINAL FUN (Linux personality layer)
# -------------------------------------------------
echo "Installing terminal fun..."

sudo apt install -y \
  cowsay fortune lolcat \
  cmatrix sl aafire xcowsay \
  figlet toilet


# -------------------------------------------------
# GAMES (lightweight classics)
# -------------------------------------------------
echo "Installing games..."

sudo apt install -y \
  supertux \
  tuxpuck \
  quadrapassel


# -------------------------------------------------
# FILE MANAGEMENT
# -------------------------------------------------
echo "Installing file tools..."

sudo apt install -y \
  thunar \
  ranger


# -------------------------------------------------
# CLEANUP
# -------------------------------------------------
echo "Cleaning up..."

sudo apt autoremove -y

echo "======================================="
echo " Setup complete."
echo " You may want to reboot now."
echo "======================================="