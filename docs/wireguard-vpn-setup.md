# WireGuard VPN Setup for Remote Pi Server Access

## Overview

This guide will help you set up WireGuard VPN to securely access your Raspberry Pi server remotely for Git operations. WireGuard is a modern, fast, and secure VPN protocol that's perfect for this use case.

## Prerequisites

- Raspberry Pi server already set up (following your existing setup guide)
- AT&T home router with admin access
- Local machine (Windows, macOS, or Linux)
- Basic understanding of networking concepts

## Benefits of WireGuard VPN

- **Secure**: Modern cryptography with minimal attack surface
- **Fast**: Minimal overhead, faster than OpenVPN
- **Simple**: Easy to configure and maintain
- **Mobile-friendly**: Works great on phones and tablets
- **Git-friendly**: Seamless access to your Pi for repository operations

## Phase 1: AT&T Router Configuration

### Step 1: Access Router Admin Panel

1. **Find your router's IP address**
   ```bash
   # On your local machine, find the gateway
   ip route | grep default
   # or on Windows: ipconfig
   ```

2. **Access router admin**
   - Open browser and go to `http://192.168.1.1` (or your router's IP)
   - Login with your AT&T credentials
   - Look for "Firewall" or "NAT/Gaming" section

### Step 2: Configure Port Forwarding

1. **Add WireGuard port forwarding rule**
   - **Service Name**: WireGuard VPN
   - **Global Port Range**: 51820
   - **Base Host Port**: 51820
   - **Protocol**: UDP
   - **Device**: Select your Raspberry Pi's local IP address
   - **Enabled**: Yes

2. **Save and apply settings**
   - Click "Save" or "Apply"
   - Wait for router to restart if prompted

### Step 3: Note Your Public IP

```bash
# Check your current public IP
curl ifconfig.me
# or visit: https://whatismyipaddress.com/
```

**Important**: If your public IP changes frequently, you'll need to use your DuckDNS domain instead of the IP address.

## Phase 2: WireGuard Server Setup (Raspberry Pi)

### Step 1: Install WireGuard

```bash
# SSH into your Pi
ssh [username]@[pi-ip-address]

# Update system
sudo apt update && sudo apt upgrade -y

# Install WireGuard
sudo apt install -y wireguard
```

### Step 2: Generate Server Keys

```bash
# Create WireGuard directory
sudo mkdir -p /etc/wireguard
cd /etc/wireguard

# Generate server private key
sudo wg genkey | sudo tee server_private_key | sudo wg pubkey | sudo tee server_public_key

# Display the public key (you'll need this for client config)
sudo cat server_public_key
```

### Step 3: Create Server Configuration

```bash
# Create server config file
sudo nano /etc/wireguard/wg0.conf
```

Add the following configuration:

```ini
[Interface]
# Server private key (from server_private_key file)
PrivateKey = [SERVER_PRIVATE_KEY]

# VPN network address for the server
Address = 10.0.0.1/24

# Port WireGuard will listen on
ListenPort = 51820

# Enable IP forwarding
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client configuration (add after generating client keys)
[Peer]
# Client public key (will be added after client setup)
PublicKey = [CLIENT_PUBLIC_KEY]
AllowedIPs = 10.0.0.2/32
```

### Step 4: Enable IP Forwarding

```bash
# Enable IP forwarding permanently
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf

# Apply immediately
sudo sysctl -p
```

### Step 5: Configure Firewall

```bash
# Allow WireGuard port
sudo ufw allow 51820/udp

# Allow traffic from VPN network
sudo ufw allow from 10.0.0.0/24

# Check firewall status
sudo ufw status
```

### Step 6: Start WireGuard Service

```bash
# Enable and start WireGuard
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0

# Check status
sudo systemctl status wg-quick@wg0
sudo wg show
```

## Phase 3: WireGuard Client Setup (Local Machine)

### Step 1: Install WireGuard Client

**Windows:**
- Download from: https://www.wireguard.com/install/
- Install the Windows client

**macOS:**
```bash
# Using Homebrew
brew install wireguard-tools

# Or download from Mac App Store
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt install wireguard

# Or download from official site
```

### Step 2: Generate Client Keys

```bash
# Create client directory
mkdir -p ~/wireguard-keys
cd ~/wireguard-keys

# Generate client private key
wg genkey | tee client_private_key | wg pubkey | tee client_public_key

# Display the public key (you'll need this for server config)
cat client_public_key
```

### Step 3: Update Server Configuration

Back on your Pi, add the client's public key to the server config:

```bash
# Edit server config
sudo nano /etc/wireguard/wg0.conf
```

Update the `[Peer]` section with your client's public key:

```ini
[Peer]
PublicKey = [YOUR_CLIENT_PUBLIC_KEY]
AllowedIPs = 10.0.0.2/32
```

Restart WireGuard:
```bash
sudo systemctl restart wg-quick@wg0
```

### Step 4: Create Client Configuration

Create a client config file (e.g., `pi-vpn.conf`):

```ini
[Interface]
# Client private key
PrivateKey = [YOUR_CLIENT_PRIVATE_KEY]

# VPN network address for the client
Address = 10.0.0.2/24

# DNS servers (optional, use your Pi's IP or public DNS)
DNS = 10.0.0.1, 8.8.8.8

[Peer]
# Server public key
PublicKey = [SERVER_PUBLIC_KEY]

# Server endpoint (use your DuckDNS domain if you have one)
Endpoint = [YOUR_PUBLIC_IP_OR_DOMAIN]:51820

# Allowed IPs (route all traffic through VPN, or just Pi network)
AllowedIPs = 10.0.0.0/24, 192.168.1.0/24

# Keep connection alive
PersistentKeepalive = 25
```

### Step 5: Import and Connect

**Windows:**
1. Open WireGuard application
2. Click "Add Tunnel" → "Add from file"
3. Select your `pi-vpn.conf` file
4. Click "Activate"

**macOS/Linux:**
```bash
# Import config
sudo wg-quick up pi-vpn.conf

# To disconnect later
sudo wg-quick down pi-vpn.conf
```

## Phase 4: Testing and Git Operations

### Step 1: Test VPN Connection

```bash
# Check if you can ping the Pi's VPN IP
ping 10.0.0.1

# Check if you can access Pi's local network IP
ping 192.168.1.XXX  # Replace with your Pi's actual local IP

# Test SSH through VPN (use IP address for security)
ssh [username]@192.168.1.XXX  # Use Pi's local IP, not hostname
```

**Note**: Use the IP address (`192.168.1.XXX`) instead of the hostname (`escopi`) when connecting through VPN. This provides better security by limiting DNS resolution scope and ensuring you only access explicitly allowed network resources.

### Step 2: Configure Git for Remote Operations

Once connected to VPN, you can access your Pi as if you're on the local network:

```bash
# SSH into your Pi (use IP address for security)
ssh [username]@192.168.1.XXX

# Clone repositories directly to your Pi
git clone https://github.com/username/repository.git

# Or pull updates to existing repos
cd /path/to/existing/repo
git pull origin main
```

**Security Note**: Always use the IP address (`192.168.1.XXX`) when connecting through VPN rather than hostnames. This prevents DNS resolution issues and provides better network isolation security.

### Step 3: Set Up Git Aliases (Optional)

Create convenient aliases for common operations:

```bash
# Add to your local machine's ~/.bashrc or ~/.zshrc
alias pi-ssh="ssh [username]@192.168.1.XXX"  # Use IP address for security
alias pi-git-clone="ssh [username]@192.168.1.XXX 'git clone'"
alias pi-git-pull="ssh [username]@192.168.1.XXX 'cd /path/to/repo && git pull'"
```

**Security Best Practice**: All aliases use IP addresses instead of hostnames to maintain network isolation and prevent DNS resolution issues.

## Security Considerations

### 1. Key Management
- Keep private keys secure and never share them
- Consider rotating keys periodically
- Use strong, unique keys for each client

### 2. Network Security
- WireGuard uses modern cryptography (ChaCha20, Poly1305)
- All traffic is encrypted end-to-end
- No metadata leakage

### 3. Access Control
- Only allow necessary IP ranges in `AllowedIPs`
- Use specific client IPs rather than broad ranges
- Regularly review connected clients

### 4. DNS and Hostname Security
**Why Use IP Addresses Instead of Hostnames:**
- **Network Isolation**: VPN clients can only access explicitly allowed resources
- **DNS Scope Limitation**: Prevents full local network DNS resolution
- **Security Boundary**: Maintains clear separation between VPN and local networks
- **Reduced Attack Surface**: Limits potential DNS-based attacks or information leakage

**Best Practice**: Always use IP addresses (`192.168.1.XXX`) when connecting through VPN rather than hostnames (`escopi`).

### 5. Monitoring
```bash
# Check active connections
sudo wg show

# Monitor traffic
sudo wg show wg0 transfer
```

## Troubleshooting

### Common Issues

**1. Can't connect to VPN**
```bash
# Check if WireGuard is running
sudo systemctl status wg-quick@wg0

# Check firewall rules
sudo ufw status

# Verify port forwarding on router
```

**2. Can't access Pi after connecting**
```bash
# Check routing table
ip route

# Verify Pi's local IP
ping 192.168.1.XXX

# Check if IP forwarding is enabled
cat /proc/sys/net/ipv4/ip_forward
```

**3. Connection drops frequently**
```bash
# Check PersistentKeepalive setting
# Increase to 30-60 seconds if needed

# Check router's NAT timeout settings
# Some routers have aggressive NAT timeouts
```

**4. Slow performance**
```bash
# Check MTU settings
# Try reducing MTU in client config:
# PostUp = ip link set mtu 1420 dev %i
```

### Logs and Debugging

```bash
# Check WireGuard logs
sudo journalctl -u wg-quick@wg0 -f

# Check system logs
sudo dmesg | grep wireguard

# Test with verbose output
sudo wg-quick up wg0 --verbose
```

## Advanced Configuration

### Multiple Clients

To add more clients, generate new key pairs and add them to the server config:

```ini
[Peer]
PublicKey = [CLIENT2_PUBLIC_KEY]
AllowedIPs = 10.0.0.3/32

[Peer]
PublicKey = [CLIENT3_PUBLIC_KEY]
AllowedIPs = 10.0.0.4/32
```

### Mobile Access

WireGuard works great on mobile devices:
- Download WireGuard app from App Store/Google Play
- Import your client configuration
- Connect when needed for remote Git operations

### Integration with Existing Setup

This VPN setup works alongside your existing:
- DuckDNS dynamic DNS
- nginx reverse proxy
- SSL certificates
- Docker containers

You can access all services through the VPN using their local IP addresses.

## Maintenance

### Regular Tasks

1. **Update WireGuard** (monthly)
   ```bash
   sudo apt update && sudo apt upgrade wireguard
   ```

2. **Monitor connections** (weekly)
   ```bash
   sudo wg show
   ```

3. **Check logs** (as needed)
   ```bash
   sudo journalctl -u wg-quick@wg0 --since "1 week ago"
   ```

### Backup Configuration

```bash
# Backup WireGuard configs
sudo cp -r /etc/wireguard /mnt/external/backups/wireguard-$(date +%Y%m%d)
```

## Success!

Once set up, you'll be able to:
- ✅ Securely access your Pi server from anywhere
- ✅ Clone and pull GitHub repositories remotely
- ✅ Manage your server as if you're on the local network
- ✅ Access all your applications and services
- ✅ Maintain security with modern encryption

Your Pi server is now accessible remotely with enterprise-grade security! 🚀
