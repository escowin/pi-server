# Raspberry Pi Server Template Documentation

## Server Access Information

### Local Network Access
- **Server IP**: `192.168.1.XXX` (Replace with actual IP)
- **SSH Access**: `ssh [username]@[server-ip]`
- **Web Interface**: `http://[server-ip]`
- **Portainer**: `http://[server-ip]:9000`

### Remote Access (DuckDNS)
- **Domain**: `[subdomain].duckdns.org`
- **Web Interface**: `https://[subdomain].duckdns.org`
- **Portainer**: `https://[subdomain].duckdns.org:9000`
- **SSH Access**: `ssh [username]@[subdomain].duckdns.org`

### External Drive
- **Mount Point**: `/mnt/external`
- **Drive Type**: `[filesystem-type]` (e.g., exfat, ext4, ntfs)
- **UUID**: `[DRIVE-UUID]` (Get with `sudo blkid /dev/sdX1`)
- **Size**: `[SIZE]GB` available

## Docker Compose Configuration

### File Location
`/mnt/external/docker/docker-compose.yml`

### Configuration
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
      - /etc/letsencrypt:/etc/letsencrypt:ro
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

### Container Management
```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker logs docker-nginx-1
docker logs docker-portainer-1

# Check status
docker ps
```

## Nginx Configuration

### File Location
`/mnt/external/docker/nginx/conf.d/default.conf`

### Configuration
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
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ =404;
    }
}
```

### Web Content Directory
- **Location**: `/mnt/external/docker/nginx/html/`
- **Current Content**: `index.html` with test page
- **Permissions**: `[username]:[username]` (755)

## Directory Structure

```
/mnt/external/
├── apps/           # Portfolio applications
├── media/          # Media files
├── backups/        # Backup files
├── logs/           # Log files
└── docker/         # Docker configuration
    ├── docker-compose.yml
    └── nginx/
        ├── conf.d/
        │   └── default.conf
        ├── html/
        │   └── index.html
        └── ssl/    # SSL certificates (mounted from /etc/letsencrypt)
```

## System Information

### Hardware
- **Raspberry Pi**: [Model] (e.g., 4 Model B, 3B+, etc.)
- **RAM**: [X]GB
- **OS**: Raspberry Pi OS Lite (64-bit)
- **External Drive**: [Brand/Model] ([Size]GB, [filesystem])
- **SD Card**: [Size]GB

### Software
- **Docker**: Latest version
- **Docker Compose**: Plugin version
- **Nginx**: Alpine-based container
- **Portainer**: Community Edition

## Setup Checklist

### Phase 1: Initial Setup
- [x] Flash Raspberry Pi OS to SD card
- [x] Enable SSH and configure WiFi
- [x] Update system packages
- [x] Install Docker and Docker Compose
- [x] Mount external drive
- [x] Create directory structure
- [x] Set up SSH key authentication for GitHub
- [x] Set up basic Docker services
- [x] Test local network access

### Phase 2: Remote Access and Security
- [x] Set up DuckDNS dynamic DNS
- [x] Configure router port forwarding
- [x] Set up SSL certificates with Let's Encrypt
- [x] Configure nginx for HTTPS
- [x] Configure UFW firewall
- [x] Set up fail2ban
- [x] Create isolated users
- [x] Configure SSH key authentication for GitHub

### Phase 3: Application Deployment
- [x] Deploy portfolio applications
- [x] Set up monitoring
- [x] Configure logging
- [x] Test application access

### Phase 4: Security Hardening
- [x] Disable unnecessary services
- [x] Set up fail2ban
- [x] Configure regular security updates

### Phase 5: Backup and Maintenance
- [x] Set up automated backups
- [x] Configure maintenance scripts
- [x] Test backup and restore procedures

## ✅ SETUP COMPLETE
**All phases have been successfully implemented!**

## Troubleshooting Commands

### Check Services
```bash
# Check container status
docker ps

# Check nginx logs
docker logs docker-nginx-1

# Check portainer logs
docker logs docker-portainer-1

# Test nginx locally
curl http://localhost

# Test portainer locally
curl http://localhost:9000
```

### Check System Resources
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check running processes
htop
```

### Check Network
```bash
# Check listening ports
netstat -tlnp | grep :80
netstat -tlnp | grep :9000

# Test connectivity
ping google.com

# Find Pi IP address
ping [hostname].local
# or
nmap -sn 192.168.1.0/24
```

## Common Issues and Solutions

### Docker Permission Issues
```bash
# Add user to docker group
sudo usermod -aG docker [username]
# Log out and back in
```

### Nginx Connection Reset
```bash
# Check if nginx config exists
ls -la /mnt/external/docker/nginx/conf.d/
# Create basic config if missing
```

### External Drive Not Mounting
```bash
# Check drive status
lsblk
# Check fstab entry
cat /etc/fstab
# Test mount manually
sudo mount /dev/sdX1 /mnt/external
```

### Container Won't Start
```bash
# Check logs for errors
docker logs [container-name]
# Check disk space
df -h
# Restart Docker service
sudo systemctl restart docker
```

### Node.js App Build Failures
**Symptoms**: `npm install` fails with EPERM errors
**Cause**: External drive restrictions preventing symlink creation

**Solutions**:
```bash
# Option 1: Use Docker for building (Recommended)
cd /mnt/external/docker
docker compose build [app-name]

# Option 2: Build in home directory
cp -r /mnt/external/apps/[app-name] ~/[app-name]
cd ~/[app-name]
npm install && npm run build
```

### Docker Volume Mount Errors
**Symptoms**: `chown /mnt/external/docker/apps/[app]: operation not permitted`
**Solution**: Use correct paths in docker-compose.yml
```yaml
# Wrong: ./apps/your-app
# Correct: ../apps/your-app
volumes:
  - ../apps/your-app:/app
```

### Web Interface Not Accessible
**Symptoms**: Cannot access web interface locally or remotely
**Solutions**:
```bash
# Check container status
docker ps

# Start containers if stopped
cd /mnt/external/docker
docker compose up -d

# Install UFW if missing
sudo apt install -y ufw
sudo ufw enable
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## SSH Key Authentication for GitHub

### Setup Process
1. **Generate SSH Key Pair**
   ```bash
   ssh-keygen -t ed25519 -C "[username]@github" -f ~/.ssh/id_ed25519
   # Enter passphrase when prompted (optional but recommended)
   ```

2. **Display Public Key**
   ```bash
   cat ~/.ssh/id_ed25519.pub
   # Copy the entire output
   ```

3. **Add Key to GitHub**
   - Go to GitHub.com → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Title: "Raspberry Pi Server"
   - Paste the public key
   - Click "Add SSH key"

4. **Test SSH Connection**
   ```bash
   ssh -T git@github.com
   # Should return: "Hi [username]! You've successfully authenticated..."
   ```

5. **Clone Repository Using SSH**
   ```bash
   git clone git@github.com:[username]/[repository].git
   ```

### Benefits
- No password prompts for Git operations
- More secure than HTTPS with tokens
- Works for all GitHub repositories
- Automatic authentication for push/pull operations

## Security Notes

### Current Status Template
- [ ] SSH access configured
- [ ] SSH key authentication for GitHub configured
- [ ] Docker permissions set
- [ ] Port forwarding configured
- [ ] DuckDNS dynamic DNS active
- [ ] SSL certificates installed and configured
- [ ] HTTPS redirect configured
- [ ] Firewall configured
- [ ] Fail2ban configured

### Security Checklist
1. Change default passwords
2. Configure SSH key authentication for server access
3. Configure SSH key authentication for GitHub
4. Set up DuckDNS dynamic DNS
5. Configure router port forwarding
6. Install SSL certificates with Let's Encrypt
7. Configure nginx for HTTPS with security headers
8. Set up UFW firewall
9. Set up fail2ban
10. Regular security updates
11. Backup important configurations

## Backup Information

### Important Files to Backup
- `/mnt/external/docker/docker-compose.yml`
- `/mnt/external/docker/nginx/conf.d/default.conf`
- `/mnt/external/docker/nginx/html/`
- `/etc/fstab` (for external drive mounting)
- SSH keys and configurations

### Backup Commands
```bash
# Backup docker configuration
tar -czf backup-docker-$(date +%Y%m%d).tar.gz /mnt/external/docker/

# Backup nginx configuration
tar -czf backup-nginx-$(date +%Y%m%d).tar.gz /mnt/external/docker/nginx/

# Backup system configurations
tar -czf backup-system-$(date +%Y%m%d).tar.gz /etc/fstab /home/[username]/.ssh/
```

## Maintenance

### Regular Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker compose pull
docker compose up -d

# Clean up unused Docker resources
docker system prune -f
```

### Log Management
```bash
# View nginx access logs
docker exec docker-nginx-1 cat /var/log/nginx/access.log

# View nginx error logs
docker exec docker-nginx-1 cat /var/log/nginx/error.log

# Set up log rotation (if needed)
sudo nano /etc/logrotate.d/pi-server
```

## Customization Notes

### Replace These Placeholders
- `[username]` - Your actual username
- `[server-ip]` - Your Pi's IP address
- `[hostname]` - Your Pi's hostname
- `[subdomain]` - Your DuckDNS subdomain
- `[DRIVE-UUID]` - Your external drive's UUID
- `[filesystem-type]` - Your drive's filesystem
- `[SIZE]` - Your drive's size
- `[Brand/Model]` - Your hardware details
- `[YOUR_TOKEN]` - Your DuckDNS token
- `[YOUR_SUBDOMAIN]` - Your DuckDNS subdomain

### Optional Additions
- Add more services to docker-compose.yml
- Configure additional nginx virtual hosts
- Set up database containers
- Add monitoring tools (Grafana, Prometheus)
- Configure reverse proxy for multiple apps

## Template Usage

1. Copy this template file
2. Replace all placeholder values with your actual information
3. Follow the setup checklist in order
4. Customize configurations as needed
5. Document any additional services or modifications

## Support Resources

- [Raspberry Pi Documentation](https://www.raspberrypi.org/documentation/)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Portainer Documentation](https://documentation.portainer.io/)

---
**Template Version**: 1.0  
**Last Updated**: [Date]  
**Compatible With**: Raspberry Pi 3B+, 4B, 5
