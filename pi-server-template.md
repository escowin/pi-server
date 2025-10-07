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
- [ ] Flash Raspberry Pi OS to SD card
- [ ] Enable SSH and configure WiFi
- [ ] Update system packages
- [ ] Install Docker and Docker Compose
- [ ] Mount external drive
- [ ] Create directory structure
- [ ] Set up basic Docker services
- [ ] Test local network access

### Phase 2: Remote Access and Security
- [ ] Set up DuckDNS dynamic DNS
- [ ] Configure router port forwarding
- [ ] Set up SSL certificates with Let's Encrypt
- [ ] Configure nginx for HTTPS
- [ ] Configure UFW firewall
- [ ] Set up fail2ban
- [ ] Create isolated users

### Phase 3: Application Deployment
- [ ] Deploy portfolio applications
- [ ] Set up monitoring
- [ ] Configure logging
- [ ] Test application access

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

## Security Notes

### Current Status Template
- [ ] SSH access configured
- [ ] Docker permissions set
- [ ] Port forwarding configured
- [ ] DuckDNS dynamic DNS active
- [ ] SSL certificates installed and configured
- [ ] HTTPS redirect configured
- [ ] Firewall configured
- [ ] Fail2ban configured

### Security Checklist
1. Change default passwords
2. Configure SSH key authentication
3. Set up DuckDNS dynamic DNS
4. Configure router port forwarding
5. Install SSL certificates with Let's Encrypt
6. Configure nginx for HTTPS with security headers
7. Set up UFW firewall
8. Set up fail2ban
9. Regular security updates
10. Backup important configurations

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
