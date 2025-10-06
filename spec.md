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

### Step 6: Configure Dynamic DNS (Optional but Recommended)
1. **Choose a DDNS service**
   - No-IP (free tier available)
   - DuckDNS (free)
   - Cloudflare (if you have a domain)

2. **Set up DDNS client**
   ```bash
   # For No-IP
   sudo apt install -y noip2
   sudo noip2 -C
   # Follow the prompts to configure
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

2. **Generate SSL certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   # Or for subdomain: sudo certbot --nginx -d pi.your-domain.com
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
       server_name your-domain.com;
       return 301 https://$server_name$request_uri;
   }
   
   server {
       listen 443 ssl http2;
       server_name your-domain.com;
       
       ssl_certificate /etc/nginx/ssl/fullchain.pem;
       ssl_certificate_key /etc/nginx/ssl/privkey.pem;
       
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

### Step 11: Create Isolated User for Applications
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

### Step 12: Deploy Portfolio Applications
1. **Create application structure**
   ```bash
   mkdir -p /mnt/external/apps/{portfolio,api,static}
   ```

2. **Example: Deploy a Node.js app**
   ```bash
   cd /mnt/external/apps
   git clone https://github.com/yourusername/your-app.git
   cd your-app
   
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
   
   # Add to docker-compose.yml
   ```

3. **Update docker-compose.yml with your apps**
   ```yaml
   version: '3.8'
   services:
     nginx:
       # ... existing nginx config
     
     portfolio-app:
       build: ./apps/your-app
       ports:
         - "3000:3000"
       volumes:
         - ./apps/your-app:/app
       restart: unless-stopped
     
     # Add more apps as needed
   ```

### Step 13: Set Up Monitoring and Logging
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
       create 644 pi pi
   }
   ```

## Phase 4: Security Hardening

### Step 14: Additional Security Measures
1. **Disable unnecessary services**
   ```bash
   sudo systemctl disable bluetooth
   sudo systemctl disable avahi-daemon
   ```

2. **Set up fail2ban**
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   ```

3. **Regular security updates**
   ```bash
   # Create update script
   cat > /mnt/external/scripts/update.sh << EOF
   #!/bin/bash
   sudo apt update && sudo apt upgrade -y
   docker system prune -f
   docker image prune -f
   EOF
   
   chmod +x /mnt/external/scripts/update.sh
   
   # Add to crontab for weekly updates
   crontab -e
   # Add: 0 2 * * 0 /mnt/external/scripts/update.sh
   ```

## Phase 5: Backup and Maintenance

### Step 15: Set Up Automated Backups
1. **Create backup script**
   ```bash
   mkdir -p /mnt/external/scripts
   cat > /mnt/external/scripts/backup.sh << EOF
   #!/bin/bash
   BACKUP_DIR="/mnt/external/backups"
   DATE=$(date +%Y%m%d_%H%M%S)
   
   # Backup important configs
   tar -czf $BACKUP_DIR/configs_$DATE.tar.gz /etc/nginx /etc/ssl /home/pi/.ssh
   
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
- **SSH**: `ssh pi@[PI_IP_ADDRESS]`

### Remote Access (After DNS setup)
- **Web Interface**: `https://your-domain.com`
- **Portainer**: `https://your-domain.com:9000`
- **SSH**: `ssh pi@your-domain.com`

## Security Checklist
- [ ] SSH key authentication enabled
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