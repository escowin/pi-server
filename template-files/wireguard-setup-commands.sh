#!/bin/bash
# WireGuard Setup Commands Template
# 
# This script contains all the commands needed to set up WireGuard VPN
# on a Raspberry Pi server for secure remote access.
#
# Usage: Copy and paste these commands one by one, or run as a script
# (be careful with the script approach - review commands first)

echo "=== WireGuard VPN Setup Commands ==="
echo "Run these commands on your Raspberry Pi server"
echo ""

echo "1. Install WireGuard"
echo "sudo apt update && sudo apt install -y wireguard"
echo ""

echo "2. Create WireGuard directory and generate server keys"
echo "sudo mkdir -p /etc/wireguard"
echo "cd /etc/wireguard"
echo "sudo wg genkey | sudo tee server_private_key | sudo wg pubkey | sudo tee server_public_key"
echo ""

echo "3. Display server public key (save this for client config)"
echo "sudo cat server_public_key"
echo ""

echo "4. Create server configuration file"
echo "sudo nano /etc/wireguard/wg0.conf"
echo "# Copy the contents from wireguard-server.conf template"
echo ""

echo "5. Enable IP forwarding"
echo "echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf"
echo "sudo sysctl -p"
echo ""

echo "6. Configure firewall"
echo "sudo ufw allow 51820/udp"
echo "sudo ufw allow from 10.0.0.0/24"
echo ""

echo "7. Start WireGuard service"
echo "sudo systemctl enable wg-quick@wg0"
echo "sudo systemctl start wg-quick@wg0"
echo ""

echo "8. Check service status"
echo "sudo systemctl status wg-quick@wg0"
echo "sudo wg show"
echo ""

echo "9. Get Pi's local IP address (for router port forwarding)"
echo "ip addr show | grep 'inet 192.168'"
echo ""

echo "=== Router Configuration ==="
echo "Configure your router to forward UDP port 51820 to your Pi's IP address"
echo ""

echo "=== Client Setup ==="
echo "1. Generate client keys on your local machine"
echo "2. Add client public key to server config"
echo "3. Create client config using wireguard-client.conf template"
echo "4. Import client config into WireGuard application"
echo "5. Connect to establish VPN tunnel"
echo ""

echo "=== Testing ==="
echo "Once connected, test with:"
echo "ping 10.0.0.1"
echo "ssh [username]@192.168.1.XXX"
echo ""

echo "=== Troubleshooting ==="
echo "Check logs: sudo journalctl -u wg-quick@wg0 -f"
echo "Check status: sudo wg show"
echo "Check firewall: sudo ufw status"
echo ""

echo "Setup complete! Your Pi server is now accessible via VPN."
