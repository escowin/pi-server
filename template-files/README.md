# Template Configuration Files

This directory contains template versions of all configuration files needed for the Raspberry Pi server setup.

## 📁 File Descriptions

### Core Configuration Files
- **`docker-compose.yml`** - Main Docker Compose configuration
- **`nginx-default.conf`** - Nginx configuration with SSL and proxy settings
- **`Dockerfile`** - Multi-stage Docker build for full-stack applications

### System Configuration
- **`duckdns-update.sh`** - DuckDNS dynamic DNS update script
- **`update.sh`** - System update and maintenance script
- **`backup.sh`** - Automated backup script
- **`fstab-entry`** - External drive auto-mount configuration
- **`crontab-entries`** - Scheduled task configurations
- **`logrotate-config`** - Log rotation configuration
- **`ufw-rules`** - Firewall configuration commands

### VPN Configuration
- **`wireguard-server.conf`** - WireGuard server configuration template
- **`wireguard-client.conf`** - WireGuard client configuration template
- **`wireguard-setup-commands.sh`** - Complete WireGuard setup commands

## 🚀 Usage

1. **Copy the files** you need to your server
2. **Replace placeholders** with your actual values:
   - `[subdomain]` → Your DuckDNS subdomain
   - `[username]` → Your server username
   - `[DRIVE-UUID]` → Your external drive UUID
   - `[filesystem-type]` → Your drive's filesystem
   - `YOUR_TOKEN` → Your DuckDNS token
   - `YOUR_SUBDOMAIN` → Your DuckDNS subdomain
   - `your-app` → Your application name

3. **Follow the setup guide** for detailed instructions on using each file

## 📝 Placeholder Reference

| Placeholder | Description |
|-------------|-------------|
| `[subdomain]` | DuckDNS subdomain |
| `[username]` | Server username |
| `[DRIVE-UUID]` | External drive UUID |
| `[filesystem-type]` | Drive filesystem |
| `YOUR_TOKEN` | DuckDNS token |
| `YOUR_SUBDOMAIN` | DuckDNS subdomain |
| `your-app` | Application name |
| `[SERVER_PRIVATE_KEY]` | WireGuard server private key |
| `[CLIENT_PUBLIC_KEY]` | WireGuard client public key |
| `[CLIENT_PRIVATE_KEY]` | WireGuard client private key |
| `[SERVER_PUBLIC_KEY]` | WireGuard server public key |
| `[YOUR_DOMAIN_OR_IP]` | DuckDNS domain or public IP |

## 🔧 Customization

### For Different Applications
- Modify `Dockerfile` for different build requirements
- Adjust nginx configuration for different routing needs

### For Different Domains
- Replace DuckDNS references with your domain
- Update SSL certificate paths
- Modify DNS update scripts

### For Different Hardware
- Adjust fstab entries for different drive types
- Update network configurations for different subnets
- Modify resource limits in Docker configurations

## 📚 Related Documentation

- **[Setup Guide](../setup-guide.md)** - Complete setup instructions
- **[Full-Stack Template](../full-stack-app-deployment-template.md)** - Application deployment guide
- **[Server Template](../pi-server-template.md)** - Server configuration template
- **[WireGuard VPN Setup](../wireguard-vpn-setup.md)** - Secure remote access guide

---

**Note**: Always review and customize these templates for your specific needs before deploying to production.
