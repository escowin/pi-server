# Raspberry Pi Server Setup Guide

## Overview
This guide will help you configure a Raspberry Pi 4 as a personal server to host applications, media, and portfolio projects. The setup includes local network access and secure remote access capabilities.

## Hardware Requirements
- Raspberry Pi 4 Model B 2019 Quad Core 64 Bit WiFi Bluetooth (4GB) ✓
- GeeekPi Case with PWM Fan, Power Supply, Heatsinks ✓
- UnionSine 500GB 2.5" Ultra Slim Portable External Hard Drive ✓
- 64GB Ultra microSDXC UHS-I Memory Card ✓

## Phase 1: Initial Setup and Local Network Access

### Step 1: Prepare the Raspberry Pi OS
1. **Download Raspberry Pi Imager**
   - Download from: https://www.raspberrypi.org/downloads/
   - Install on your computer

2. **Flash the OS**
   - Insert the 64GB microSD card
   - Open Raspberry Pi Imager
   - Choose "Raspberry Pi OS Lite (64-bit)" for better performance
   - Click the gear icon to enable SSH and set up WiFi
   - Set username: `pi` (or your preferred username)
   - Set password: (create a strong password)
   - Enable SSH: Yes
   - Configure WiFi with your network credentials
   - Write the image to the SD card

### Step 2: Initial Boot and Configuration
1. **First Boot**
   - Insert SD card into Pi
   - Connect external hard drive via USB 3.0
   - Connect power supply and boot
   - Wait for initial setup to complete

2. **SSH into the Pi**
   ```bash
   ssh pi@[PI_IP_ADDRESS]
   # Find IP with: ping raspberrypi.local or check router admin panel
   ```

3. **Update the system**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y git curl wget vim htop
   ```

### Step 3: Configure External Hard Drive
1. **Identify the drive**
   ```bash
   lsblk
   # Look for your 500GB drive (usually /dev/sda1)
   ```

2. **Mount the external drive**
   ```bash
   # Create mount point
   sudo mkdir -p /mnt/external
   
   # Mount the drive
   sudo mount /dev/sda1 /mnt/external
   
   # Check if mounted correctly
   df -h
   ```

3. **Set up automatic mounting**
   ```bash
   # Get the UUID of your drive
   sudo blkid /dev/sda1
   
   # Add to fstab for automatic mounting
   sudo nano /etc/fstab
   # Add this line (replace UUID with actual UUID):
   # UUID=your-drive-uuid /mnt/external ext4 defaults,auto,users,rw,nofail 0 0
   ```

4. **Create directory structure**
   ```bash
   sudo mkdir -p /mnt/external/{apps,media,backups,logs}
   sudo chown -R pi:pi /mnt/external
   ```

### Step 4: Install Docker and Docker Compose
1. **Install Docker**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker pi
   # Log out and back in for group changes to take effect
   ```

2. **Install Docker Compose**
   ```bash
   sudo apt install -y docker-compose-plugin
   ```

### Step 5: Set Up Basic Services
1. **Create a docker-compose.yml for basic services**
   ```bash
   mkdir -p /mnt/external/docker
   cd /mnt/external/docker
   nano docker-compose.yml
   ```

2. **Basic docker-compose.yml template**
   ```yaml
   version: '3.8'
   services:
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       volumes:
         - ./nginx/conf.d:/etc/nginx/conf.d
         - ./nginx/html:/usr/share/nginx/html
         - ./ssl:/etc/nginx/ssl
       restart: unless-stopped
     
     portainer:
       image: portainer/portainer-ce
       ports:
         - "9000:9000"
       volumes:
         - /var/run/docker.sock:/var/run/docker.sock
         - portainer_data:/data
       restart: unless-stopped
   
   volumes:
     portainer_data:
   ```

3. **Start the services**
   ```bash
   docker compose up -d
   ```

## Phase 2: Remote Access and Security

### Step 6: Configure Dynamic DNS with DuckDNS
1. **Set up DuckDNS account**
   - Go to https://www.duckdns.org/
   - Sign in with your preferred method (Google, Twitter, etc.)
   - Choose a subdomain (e.g., `[subdomain]` for `[subdomain].duckdns.org`)
   - Note down your token from the DuckDNS control panel

2. **Install and configure DuckDNS client**
   ```bash
   # Create DuckDNS update script in home directory (external drive has noexec)
   mkdir -p /mnt/external/logs
   cat > ~/duckdns-update.sh << EOF
   #!/bin/bash
   # Replace YOUR_TOKEN and YOUR_SUBDOMAIN with your actual values
   TOKEN="YOUR_TOKEN"
   DOMAIN="YOUR_SUBDOMAIN"
   
   # Update DuckDNS
   curl -s "https://www.duckdns.org/update?domains=\$DOMAIN&token=\$TOKEN&ip="
   
   # Log the update
   echo "\$(date): DuckDNS updated for \$DOMAIN.duckdns.org" >> /mnt/external/logs/duckdns.log
   EOF
   
   chmod +x ~/duckdns-update.sh
   ```

3. **Set up automatic updates**
   ```bash
   # Test the script first
   ~/duckdns-update.sh
   
   # Add to crontab for updates every 5 minutes
   crontab -e
   # Add this line:
   # */5 * * * * /home/[username]/duckdns-update.sh
   ```

### Step 7: Configure Router Port Forwarding
1. **Access your router admin panel**
   - Usually at 192.168.1.1 or 192.168.0.1
   - Login with admin credentials

2. **Set up port forwarding**
   - Forward port 80 → Pi IP:80
   - Forward port 443 → Pi IP:443
   - Forward port 22 → Pi IP:22 (SSH)
   - Consider changing SSH port to something non-standard (e.g., 2222)

### Step 8: SSL Certificate Setup
1. **Install Certbot**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

2. **Generate SSL certificate for DuckDNS domain**
   ```bash
   # Replace with your actual DuckDNS subdomain
   sudo certbot --nginx -d [subdomain].duckdns.org
   # Certbot will automatically configure nginx with SSL
   ```

### Step 9: Configure Nginx for Security
1. **Create secure nginx configuration**
   ```bash
   mkdir -p /mnt/external/docker/nginx/conf.d
   nano /mnt/external/docker/nginx/conf.d/default.conf
   ```

2. **Basic secure nginx config**
   ```nginx
   server {
       listen 80;
       server_name [subdomain].duckdns.org;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name [subdomain].duckdns.org;
       
       ssl_certificate /etc/letsencrypt/live/[subdomain].duckdns.org/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/[subdomain].duckdns.org/privkey.pem;
       
       # Security headers
       add_header X-Frame-Options DENY;
       add_header X-Content-Type-Options nosniff;
       add_header X-XSS-Protection "1; mode=block";
       add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
       
       # Restrict access to specific directories
       location / {
           root /usr/share/nginx/html;
           index index.html;
           try_files $uri $uri/ =404;
       }
       
       # Portfolio apps (example)
       location /apps/ {
           alias /usr/share/nginx/html/apps/;
           autoindex off;
       }
       
       # Block access to sensitive files
       location ~ /\. {
           deny all;
       }
       
       location ~ \.(env|log|conf)$ {
           deny all;
       }
   }
   ```

### Step 10: Set Up Firewall
1. **Configure UFW (Uncomplicated Firewall)**
   ```bash
   sudo ufw enable
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow ssh
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw allow from 192.168.1.0/24  # Allow local network
   ```

### Step 11: Set Up SSH Key Authentication for GitHub
1. **Generate SSH Key Pair**
   ```bash
   ssh-keygen -t ed25519 -C "[username]@github" -f ~/.ssh/id_ed25519
   # Enter passphrase when prompted (optional but recommended)
   ```

2. **Display Public Key**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the entire output (starts with ssh-ed25519 and ends with @github)
   ```

3. **Add Key to GitHub Account**
   - Go to GitHub.com and sign in
   - Click your profile picture → Settings
   - In the left sidebar, click "SSH and GPG keys"
   - Click "New SSH key"
   - Give it a title like "Raspberry Pi Server"
   - Paste your public key into the "Key" field
   - Click "Add SSH key"

4. **Test SSH Connection**
   ```bash
   ssh -T git@github.com
   # Should return: "Hi [username]! You've successfully authenticated, but GitHub does not provide shell access."
   ```

5. **Clone Repository Using SSH**
   ```bash
   # Use SSH URL format instead of HTTPS
   git clone git@github.com:[username]/[repository].git
   ```

### Step 12: Create Isolated User for Applications
1. **Create application user**
   ```bash
   sudo adduser --system --group --home /mnt/external/apps appuser
   sudo chown -R appuser:appuser /mnt/external/apps
   ```

2. **Set up restricted shell access (if needed)**
   ```bash
   sudo usermod -s /bin/rbash appuser
   sudo mkdir -p /home/appuser/.bin
   sudo ln -s /bin/ls /home/appuser/.bin/
   sudo ln -s /bin/cat /home/appuser/.bin/
   # Add other necessary commands
   ```

## Phase 3: Application Deployment

### Step 13: Deploy Portfolio Applications
1. **Create application structure**
   ```bash
   mkdir -p /mnt/external/apps/{portfolio,api,static}
   ```

2. **Example: Deploy a Node.js app**
   ```bash
   cd /mnt/external/apps
   git clone git@github.com:yourusername/your-app.git
   cd your-app
   
   # Install Node.js and npm (if not already installed)
   # Option 1: Install nvm for version management (Recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   nvm install --lts
   nvm use --lts
   nvm alias default lts/*
   
   # Option 2: Direct installation
   # sudo apt update && sudo apt install -y nodejs npm
   
   # Create Dockerfile
   cat > Dockerfile << EOF
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   EXPOSE 3000
   CMD ["npm", "start"]
   EOF
   
   # Build with Docker (recommended for external drives)
   cd /mnt/external/docker
   docker compose build your-app
   
   # Add to docker-compose.yml
   ```

3. **Update docker-compose.yml with your apps**
   ```yaml
   version: '3.8'
   services:
     nginx:
       # ... existing nginx config
     
     portfolio-app:
       build: ../apps/your-app  # Note: ../apps/ not ./apps/
       ports:
         - "3000:3000"
       volumes:
         - ../apps/your-app:/app  # Correct path for external drives
         - /app/node_modules      # Prevent overwriting node_modules
       restart: unless-stopped
       environment:
         - NODE_ENV=production
     
     # Add more apps as needed
   ```

### Step 14: Set Up Monitoring and Logging
1. **Install monitoring tools**
   ```bash
   # System monitoring
   sudo apt install -y htop iotop nethogs
   
   # Log management
   sudo apt install -y logrotate
   ```

2. **Set up log rotation**
   ```bash
   sudo nano /etc/logrotate.d/pi-server
   ```
   ```bash
   /mnt/external/logs/*.log {
       daily
       missingok
       rotate 7
       compress
       delaycompress
       notifempty
       create 644 [username] [username]
   }
   ```

## Phase 4: Security Hardening

### Step 15: Additional Security Measures
1. **Disable unnecessary services**
   ```bash
   # Disable services from starting on boot
   sudo systemctl disable bluetooth
   sudo systemctl disable avahi-daemon
   
   # Stop currently running services
   sudo systemctl stop bluetooth
   sudo systemctl stop avahi-daemon
   
   # Verify services are disabled and stopped
   sudo systemctl is-enabled bluetooth    # should show "disabled"
   sudo systemctl is-enabled avahi-daemon # should show "disabled"
   sudo systemctl is-active bluetooth     # should show "inactive"
   sudo systemctl is-active avahi-daemon  # should show "inactive"
   ```
   
   **Note**: avahi-daemon.socket may remain active for local network hostname resolution (this is fine).

2. **Set up fail2ban**
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   ```

3. **Regular security updates**
   ```bash
   # Create scripts directory first (required before creating files)
   mkdir -p /mnt/external/scripts
   
   # Create update script
   cat > /mnt/external/scripts/update.sh << EOF
   #!/bin/bash
   sudo apt update && sudo apt upgrade -y
   docker system prune -f
   docker image prune -f
   EOF
   
   # Make script executable
   chmod +x /mnt/external/scripts/update.sh
   
   # Add to crontab for weekly updates
   crontab -e
   # Add: 0 2 * * 0 /mnt/external/scripts/update.sh
   ```

## Phase 5: Backup and Maintenance

### Step 16: Set Up Automated Backups
1. **Create backup script**
   ```bash
   mkdir -p /mnt/external/scripts
   cat > /mnt/external/scripts/backup.sh << EOF
   #!/bin/bash
   BACKUP_DIR="/mnt/external/backups"
   DATE=$(date +%Y%m%d_%H%M%S)
   
   # Backup important configs
   tar -czf $BACKUP_DIR/configs_$DATE.tar.gz /etc/nginx /etc/letsencrypt /home/[username]/.ssh
   
   # Backup application data
   tar -czf $BACKUP_DIR/apps_$DATE.tar.gz /mnt/external/apps
   
   # Keep only last 7 days of backups
   find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
   EOF
   
   chmod +x /mnt/external/scripts/backup.sh
   ```

2. **Schedule backups**
   ```bash
   crontab -e
   # Add: 0 3 * * * /mnt/external/scripts/backup.sh
   ```

## Access Your Server

### Local Network Access
- **Web Interface**: `http://[PI_IP_ADDRESS]`
- **Portainer**: `http://[PI_IP_ADDRESS]:9000`
- **SSH**: `ssh [username]@[PI_IP_ADDRESS]`

### Remote Access (After DNS setup)
- **Web Interface**: `https://[subdomain].duckdns.org`
- **Portainer**: `https://[subdomain].duckdns.org:9000`
- **SSH**: `ssh [username]@[subdomain].duckdns.org`

## Security Checklist
- [ ] SSH key authentication enabled for server access
- [ ] SSH key authentication enabled for GitHub
- [ ] Firewall configured
- [ ] SSL certificates installed
- [ ] Regular updates scheduled
- [ ] Backup system in place
- [ ] Unnecessary services disabled
- [ ] Fail2ban configured
- [ ] User permissions properly set
- [ ] Nginx security headers configured
- [ ] Port forwarding limited to necessary ports

## Troubleshooting
- Check logs: `docker logs [container_name]`
- Monitor resources: `htop`
- Check disk usage: `df -h`
- Test nginx config: `nginx -t`
- Check firewall status: `sudo ufw status`

This setup provides a secure, scalable foundation for hosting your portfolio applications while maintaining security and performance.