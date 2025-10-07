import { Phase } from '../types';

export const phases: Phase[] = [
  {
    id: 'phase-1',
    title: 'Initial Setup & Local Network Access',
    description: 'Flash Raspberry Pi OS, configure SSH and WiFi, install Docker, and set up basic services',
    icon: '🚀',
    estimatedTime: '30-45 minutes',
    difficulty: 'Beginner',
    prerequisites: ['Raspberry Pi 4 Model B (4GB+ RAM)', '64GB+ microSD card', 'External storage drive (500GB+)', 'Raspberry Pi Imager', 'SSH client'],
    steps: [
      {
        id: 'step-1-1',
        title: 'Flash Raspberry Pi OS',
        description: 'Install Raspberry Pi OS Lite (64-bit) to your microSD card',
        content: 'Use Raspberry Pi Imager to flash the latest Raspberry Pi OS Lite (64-bit) to your microSD card. Enable SSH and configure WiFi during the imaging process.',
        codeBlocks: [
          {
            id: 'flash-os',
            language: 'bash',
            code: '# Download Raspberry Pi Imager from: https://www.raspberrypi.org/downloads/\n# Select "Raspberry Pi OS Lite (64-bit)"\n# Click the gear icon to enable SSH and configure WiFi\n# Flash to your microSD card',
            title: 'Raspberry Pi Imager Setup',
            description: 'Configure SSH and WiFi during the imaging process'
          }
        ],
        tips: [
          'Use a high-quality microSD card (Class 10 or better)',
          'Enable SSH during imaging for headless setup',
          'Configure WiFi to avoid needing Ethernet cable'
        ],
        warnings: [
          'Ensure you have a stable internet connection',
          'Backup any important data on the microSD card'
        ],
        completed: false
      },
      {
        id: 'step-1-2',
        title: 'Initial SSH Connection',
        description: 'Connect to your Pi via SSH and perform initial setup',
        content: 'Connect to your Raspberry Pi via SSH and perform the initial system updates and configuration.',
        codeBlocks: [
          {
            id: 'ssh-connect',
            language: 'bash',
            code: '# Find your Pi\'s IP address\nnmap -sn 192.168.1.0/24\n\n# Connect via SSH (replace with your Pi\'s IP)\nssh pi@192.168.1.XXX\n\n# Update system packages\nsudo apt update && sudo apt upgrade -y\n\n# Change default password\npasswd',
            title: 'SSH Connection and Initial Setup',
            description: 'Connect to your Pi and perform initial configuration'
          }
        ],
        tips: [
          'Use nmap to find your Pi\'s IP address on the network',
          'Always change the default password for security',
          'Keep your Pi connected to power during updates'
        ],
        warnings: [
          'Never use default passwords in production',
          'Ensure stable power supply during updates'
        ],
        completed: false
      },
      {
        id: 'step-1-3',
        title: 'Install Docker and Docker Compose',
        description: 'Install Docker and Docker Compose for containerization',
        content: 'Install Docker and Docker Compose to enable containerized application deployment.',
        codeBlocks: [
          {
            id: 'install-docker',
            language: 'bash',
            code: '# Install Docker\ncurl -fsSL https://get.docker.com -o get-docker.sh\nsudo sh get-docker.sh\n\n# Add user to docker group\nsudo usermod -aG docker $USER\n\n# Install Docker Compose plugin\nsudo apt install -y docker-compose-plugin\n\n# Verify installation\ndocker --version\ndocker compose version\n\n# Log out and back in for group changes to take effect',
            title: 'Docker Installation',
            description: 'Install Docker and Docker Compose with proper permissions'
          }
        ],
        tips: [
          'Log out and back in after adding user to docker group',
          'Test Docker installation with: docker run hello-world',
          'Docker Compose is now a plugin, not a separate package'
        ],
        warnings: [
          'Ensure you have sufficient disk space for Docker images',
          'Docker requires root privileges, so proper group setup is crucial'
        ],
        completed: false
      },
      {
        id: 'step-1-4',
        title: 'Mount External Drive',
        description: 'Mount external storage drive for application data',
        content: 'Mount your external drive to provide additional storage for applications and data.',
        codeBlocks: [
          {
            id: 'mount-drive',
            language: 'bash',
            code: '# Find your external drive\nlsblk\n\n# Create mount point\nsudo mkdir -p /mnt/external\n\n# Get drive UUID\nsudo blkid /dev/sdX1\n\n# Add to fstab for automatic mounting\nsudo nano /etc/fstab\n\n# Add this line (replace UUID with your drive\'s UUID):\n# UUID=YOUR-DRIVE-UUID /mnt/external exfat defaults,uid=1000,gid=1000 0 0\n\n# Mount the drive\nsudo mount -a\n\n# Verify mount\nls -la /mnt/external',
            title: 'External Drive Mounting',
            description: 'Mount external drive with automatic mounting on boot'
          }
        ],
        tips: [
          'Use UUID instead of device names for reliable mounting',
          'Set proper ownership (uid=1000,gid=1000) for your user',
          'Test automatic mounting by rebooting'
        ],
        warnings: [
          'Backup important data before mounting',
          'Ensure drive is properly formatted (exfat, ext4, or ntfs)'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'Remote Access & Security',
    description: 'Configure DuckDNS dynamic DNS, SSL certificates, nginx, and security measures',
    icon: '🔒',
    estimatedTime: '45-60 minutes',
    difficulty: 'Intermediate',
    prerequisites: ['DuckDNS account', 'Router admin access', 'Domain name (optional)'],
    steps: [
      {
        id: 'step-2-1',
        title: 'Set up DuckDNS Dynamic DNS',
        description: 'Configure DuckDNS for remote access to your Pi',
        content: 'Set up DuckDNS to provide a consistent domain name for your Pi, even with dynamic IP addresses.',
        codeBlocks: [
          {
            id: 'duckdns-setup',
            language: 'bash',
            code: '# Create DuckDNS update script\nsudo mkdir -p /opt/duckdns\nsudo nano /opt/duckdns/duck.sh\n\n# Add this content (replace with your details):\n#!/bin/bash\necho url="https://www.duckdns.org/update?domains=YOUR_SUBDOMAIN&token=YOUR_TOKEN&ip=" | curl -k -o ~/duckdns/duck.log -K -\n\n# Make executable\nsudo chmod 700 /opt/duckdns/duck.sh\n\n# Test the script\n/opt/duckdns/duck.sh\n\n# Add to crontab for automatic updates\nsudo crontab -e\n# Add this line:\n# */5 * * * * /opt/duckdns/duck.sh >/dev/null 2>&1',
            title: 'DuckDNS Configuration',
            description: 'Set up automatic IP updates for your domain'
          }
        ],
        tips: [
          'Choose a memorable subdomain name',
          'Test the script manually before adding to crontab',
          'Check logs if updates fail'
        ],
        warnings: [
          'Keep your DuckDNS token secure',
          'Ensure your router supports port forwarding'
        ],
        completed: false
      },
      {
        id: 'step-2-2',
        title: 'Configure Router Port Forwarding',
        description: 'Set up port forwarding on your router for external access',
        content: 'Configure your router to forward external traffic to your Raspberry Pi.',
        codeBlocks: [
          {
            id: 'port-forwarding',
            language: 'bash',
            code: '# Find your Pi\'s local IP address\nip addr show\n\n# Common ports to forward:\n# 80 (HTTP) -> Pi IP:80\n# 443 (HTTPS) -> Pi IP:443\n# 22 (SSH) -> Pi IP:22 (optional)\n# 9000 (Portainer) -> Pi IP:9000 (optional)\n\n# Test external access\ntelnet YOUR_SUBDOMAIN.duckdns.org 80',
            title: 'Router Port Forwarding',
            description: 'Configure router to forward traffic to your Pi'
          }
        ],
        tips: [
          'Only forward necessary ports for security',
          'Use your Pi\'s static local IP address',
          'Test connectivity after configuration'
        ],
        warnings: [
          'Be cautious with SSH port forwarding',
          'Consider using non-standard ports for additional security'
        ],
        completed: false
      },
      {
        id: 'step-2-3',
        title: 'Install SSL Certificates with Let\'s Encrypt',
        description: 'Set up SSL certificates for secure HTTPS access',
        content: 'Install and configure SSL certificates using Let\'s Encrypt for secure HTTPS access.',
        codeBlocks: [
          {
            id: 'ssl-setup',
            language: 'bash',
            code: '# Install Certbot\nsudo apt install -y certbot\n\n# Stop nginx if running\nsudo systemctl stop nginx\n\n# Obtain SSL certificate\nsudo certbot certonly --standalone -d YOUR_SUBDOMAIN.duckdns.org\n\n# Verify certificate\nsudo certbot certificates\n\n# Set up automatic renewal\nsudo crontab -e\n# Add this line:\n# 0 12 * * * /usr/bin/certbot renew --quiet',
            title: 'SSL Certificate Installation',
            description: 'Install Let\'s Encrypt SSL certificates'
          }
        ],
        tips: [
          'Ensure your domain points to your public IP',
          'Test certificate renewal manually first',
          'Keep certificates updated for security'
        ],
        warnings: [
          'Don\'t run nginx during certificate generation',
          'Monitor certificate expiration dates'
        ],
        completed: false
      },
      {
        id: 'step-2-4',
        title: 'Configure nginx for HTTPS',
        description: 'Set up nginx with SSL termination and security headers',
        content: 'Configure nginx to serve HTTPS traffic with proper security headers and SSL termination.',
        codeBlocks: [
          {
            id: 'nginx-https',
            language: 'nginx',
            code: 'server {\n    listen 80;\n    server_name YOUR_SUBDOMAIN.duckdns.org;\n    return 301 https://$server_name$request_uri;\n}\n\nserver {\n    listen 443 ssl http2;\n    server_name YOUR_SUBDOMAIN.duckdns.org;\n    \n    ssl_certificate /etc/letsencrypt/live/YOUR_SUBDOMAIN.duckdns.org/fullchain.pem;\n    ssl_certificate_key /etc/letsencrypt/live/YOUR_SUBDOMAIN.duckdns.org/privkey.pem;\n    \n    # Security headers\n    add_header X-Frame-Options DENY;\n    add_header X-Content-Type-Options nosniff;\n    add_header X-XSS-Protection "1; mode=block";\n    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";\n    \n    location / {\n        root /usr/share/nginx/html;\n        index index.html;\n        try_files $uri $uri/ =404;\n    }\n}',
            title: 'Nginx HTTPS Configuration',
            description: 'Configure nginx with SSL and security headers'
          }
        ],
        tips: [
          'Test configuration with: nginx -t',
          'Reload nginx after changes: systemctl reload nginx',
          'Use security headers for better protection'
        ],
        warnings: [
          'Verify SSL certificate paths are correct',
          'Test HTTPS access after configuration'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Application Deployment',
    description: 'Deploy portfolio applications, set up monitoring, and configure logging',
    icon: '📦',
    estimatedTime: '60-90 minutes',
    difficulty: 'Intermediate',
    prerequisites: ['Completed Phase 1 & 2', 'Application code ready for deployment'],
    steps: [
      {
        id: 'step-3-1',
        title: 'Deploy Portfolio Applications',
        description: 'Deploy your applications using Docker containers',
        content: 'Deploy your portfolio applications using Docker containers with proper configuration.',
        codeBlocks: [
          {
            id: 'app-deployment',
            language: 'yaml',
            code: 'version: \'3.8\'\nservices:\n  nginx:\n    image: nginx:alpine\n    ports:\n      - "80:80"\n      - "443:443"\n    volumes:\n      - ./nginx/conf.d:/etc/nginx/conf.d\n      - ./nginx/html:/usr/share/nginx/html\n      - /etc/letsencrypt:/etc/letsencrypt:ro\n    restart: unless-stopped\n  \n  portainer:\n    image: portainer/portainer-ce\n    ports:\n      - "9000:9000"\n    volumes:\n      - /var/run/docker.sock:/var/run/docker.sock\n      - portainer_data:/data\n    restart: unless-stopped\n\nvolumes:\n  portainer_data:',
            title: 'Docker Compose Configuration',
            description: 'Basic Docker Compose setup for applications'
          }
        ],
        tips: [
          'Use specific image tags instead of \'latest\'',
          'Configure proper volume mounts for data persistence',
          'Set restart policies for reliability'
        ],
        warnings: [
          'Test applications locally before deployment',
          'Ensure proper resource limits for containers'
        ],
        completed: false
      },
      {
        id: 'step-3-2',
        title: 'Set up Monitoring and Logging',
        description: 'Configure monitoring and centralized logging',
        content: 'Set up monitoring tools and centralized logging for your applications.',
        codeBlocks: [
          {
            id: 'monitoring-setup',
            language: 'bash',
            code: '# Create log directories\nsudo mkdir -p /mnt/external/logs\n\n# Set up log rotation\nsudo nano /etc/logrotate.d/pi-server\n\n# Add log rotation configuration:\n/mnt/external/logs/*.log {\n    daily\n    missingok\n    rotate 7\n    compress\n    delaycompress\n    notifempty\n    create 644 pi pi\n}\n\n# Install monitoring tools (optional)\nsudo apt install -y htop iotop nethogs',
            title: 'Monitoring and Logging Setup',
            description: 'Configure logging and basic monitoring'
          }
        ],
        tips: [
          'Use log rotation to prevent disk space issues',
          'Monitor system resources regularly',
          'Set up alerts for critical issues'
        ],
        warnings: [
          'Monitor disk space usage',
          'Configure log levels appropriately'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'Security Hardening',
    description: 'Disable unnecessary services, set up fail2ban, and configure security updates',
    icon: '🛡️',
    estimatedTime: '30-45 minutes',
    difficulty: 'Advanced',
    prerequisites: ['Completed Phase 1-3', 'Basic understanding of Linux security'],
    steps: [
      {
        id: 'step-4-1',
        title: 'Configure Firewall (UFW)',
        description: 'Set up UFW firewall with proper rules',
        content: 'Configure UFW firewall to restrict access and protect your server.',
        codeBlocks: [
          {
            id: 'firewall-setup',
            language: 'bash',
            code: '# Install UFW if not already installed\nsudo apt install -y ufw\n\n# Set default policies\nsudo ufw default deny incoming\nsudo ufw default allow outgoing\n\n# Allow SSH (be careful with this!)\nsudo ufw allow ssh\n\n# Allow HTTP and HTTPS\nsudo ufw allow 80/tcp\nsudo ufw allow 443/tcp\n\n# Allow specific ports for applications\nsudo ufw allow 9000/tcp  # Portainer\n\n# Enable firewall\nsudo ufw enable\n\n# Check status\nsudo ufw status verbose',
            title: 'UFW Firewall Configuration',
            description: 'Configure firewall rules for security'
          }
        ],
        tips: [
          'Always allow SSH before enabling firewall',
          'Use specific port rules instead of broad ranges',
          'Test connectivity after enabling firewall'
        ],
        warnings: [
          'Be very careful with SSH access rules',
          'Lock yourself out if you\'re not careful!'
        ],
        completed: false
      },
      {
        id: 'step-4-2',
        title: 'Set up fail2ban',
        description: 'Install and configure fail2ban for intrusion prevention',
        content: 'Set up fail2ban to automatically block IP addresses that show malicious behavior.',
        codeBlocks: [
          {
            id: 'fail2ban-setup',
            language: 'bash',
            code: '# Install fail2ban\nsudo apt install -y fail2ban\n\n# Create local configuration\nsudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local\n\n# Edit configuration\nsudo nano /etc/fail2ban/jail.local\n\n# Configure SSH protection:\n[sshd]\nenabled = true\nport = ssh\nfilter = sshd\nlogpath = /var/log/auth.log\nmaxretry = 3\nbantime = 3600\nfindtime = 600\n\n# Start and enable fail2ban\nsudo systemctl enable fail2ban\nsudo systemctl start fail2ban\n\n# Check status\nsudo fail2ban-client status',
            title: 'Fail2ban Configuration',
            description: 'Set up automatic intrusion prevention'
          }
        ],
        tips: [
          'Adjust ban times based on your needs',
          'Monitor fail2ban logs regularly',
          'Whitelist trusted IP addresses if needed'
        ],
        warnings: [
          'Don\'t set bantime too high initially',
          'Test with a separate connection first'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'phase-5',
    title: 'Backup & Maintenance',
    description: 'Set up automated backups, maintenance scripts, and test procedures',
    icon: '🔄',
    estimatedTime: '30-45 minutes',
    difficulty: 'Intermediate',
    prerequisites: ['Completed Phase 1-4', 'External storage configured'],
    steps: [
      {
        id: 'step-5-1',
        title: 'Set up Automated Backups',
        description: 'Create automated backup scripts for important data',
        content: 'Set up automated backup scripts to protect your important data and configurations.',
        codeBlocks: [
          {
            id: 'backup-script',
            language: 'bash',
            code: '#!/bin/bash\n# Create backup script\nsudo nano /opt/backup.sh\n\n# Add this content:\n#!/bin/bash\nBACKUP_DIR="/mnt/external/backups"\nDATE=$(date +%Y%m%d_%H%M%S)\n\n# Create backup directory\nmkdir -p $BACKUP_DIR\n\n# Backup Docker configurations\ntar -czf $BACKUP_DIR/docker-config-$DATE.tar.gz /mnt/external/docker/\n\n# Backup system configurations\ntar -czf $BACKUP_DIR/system-config-$DATE.tar.gz /etc/fstab /home/pi/.ssh/\n\n# Backup SSL certificates\ntar -czf $BACKUP_DIR/ssl-certs-$DATE.tar.gz /etc/letsencrypt/\n\n# Clean up old backups (keep last 7 days)\nfind $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete\n\n# Make executable\nsudo chmod +x /opt/backup.sh\n\n# Add to crontab for daily backups\nsudo crontab -e\n# Add this line:\n# 0 2 * * * /opt/backup.sh >/dev/null 2>&1',
            title: 'Automated Backup Script',
            description: 'Create comprehensive backup system'
          }
        ],
        tips: [
          'Test backup and restore procedures',
          'Monitor backup disk space usage',
          'Store backups in multiple locations'
        ],
        warnings: [
          'Ensure backup storage has sufficient space',
          'Test restore procedures regularly'
        ],
        completed: false
      },
      {
        id: 'step-5-2',
        title: 'Configure Maintenance Scripts',
        description: 'Set up automated maintenance and update scripts',
        content: 'Create maintenance scripts for system updates and cleanup tasks.',
        codeBlocks: [
          {
            id: 'maintenance-script',
            language: 'bash',
            code: '#!/bin/bash\n# Create maintenance script\nsudo nano /opt/maintenance.sh\n\n# Add this content:\n#!/bin/bash\n\n# Update system packages\napt update && apt upgrade -y\n\n# Clean up package cache\napt autoremove -y\napt autoclean\n\n# Clean up Docker resources\ndocker system prune -f\n\n# Update Docker images\ndocker compose pull\ndocker compose up -d\n\n# Check disk usage\ndf -h\n\n# Check system resources\nfree -h\n\n# Make executable\nsudo chmod +x /opt/maintenance.sh\n\n# Add to crontab for weekly maintenance\nsudo crontab -e\n# Add this line:\n# 0 3 * * 0 /opt/maintenance.sh >/dev/null 2>&1',
            title: 'System Maintenance Script',
            description: 'Automated system maintenance and updates'
          }
        ],
        tips: [
          'Schedule maintenance during low-usage periods',
          'Monitor system performance after updates',
          'Keep logs of maintenance activities'
        ],
        warnings: [
          'Test maintenance scripts manually first',
          'Ensure sufficient disk space for updates'
        ],
        completed: false
      }
    ]
  },
  {
    id: 'phase-6',
    title: 'WireGuard VPN Setup',
    description: 'Set up WireGuard VPN for secure remote access to your Pi server for Git operations',
    icon: '🔐',
    estimatedTime: '45-60 minutes',
    difficulty: 'Advanced',
    prerequisites: ['Completed Phase 1-5', 'Router admin access', 'Local machine (Windows/macOS/Linux)', 'Basic networking knowledge'],
    steps: [
      {
        id: 'step-6-1',
        title: 'Configure Router Port Forwarding',
        description: 'Set up port forwarding on your router for WireGuard VPN access',
        content: 'Configure your router to forward WireGuard traffic to your Raspberry Pi. This allows external access to your VPN server.',
        codeBlocks: [
          {
            id: 'router-port-forwarding',
            language: 'bash',
            code: '# Find your router\'s IP address\nip route | grep default\n# or on Windows: ipconfig\n\n# Access router admin panel\n# Go to http://192.168.1.1 (or your router\'s IP)\n# Login with your router credentials\n# Navigate to "Firewall" or "NAT/Gaming" section\n\n# Add WireGuard port forwarding rule:\n# Service Name: WireGuard VPN\n# Global Port Range: 51820\n# Base Host Port: 51820\n# Protocol: UDP\n# Device: Select your Raspberry Pi\'s local IP address\n# Enabled: Yes',
            title: 'Router Port Forwarding Configuration',
            description: 'Configure router to forward WireGuard traffic to your Pi'
          }
        ],
        tips: [
          'Use UDP protocol for WireGuard (not TCP)',
          'Port 51820 is the standard WireGuard port',
          'Ensure your Pi has a static local IP address'
        ],
        warnings: [
          'Only forward necessary ports for security',
          'Keep router firmware updated',
          'Document your port forwarding rules'
        ],
        completed: false
      },
      {
        id: 'step-6-2',
        title: 'Install WireGuard on Raspberry Pi',
        description: 'Install and configure WireGuard server on your Pi',
        content: 'Install WireGuard on your Raspberry Pi and generate the necessary cryptographic keys for secure communication.',
        codeBlocks: [
          {
            id: 'wireguard-install',
            language: 'bash',
            code: '# SSH into your Pi\nssh [username]@[pi-ip-address]\n\n# Update system\nsudo apt update && sudo apt upgrade -y\n\n# Install WireGuard\nsudo apt install -y wireguard\n\n# Create WireGuard directory\nsudo mkdir -p /etc/wireguard\ncd /etc/wireguard\n\n# Generate server private key\nsudo wg genkey | sudo tee server_private_key | sudo wg pubkey | sudo tee server_public_key\n\n# Display the public key (you\'ll need this for client config)\nsudo cat server_public_key',
            title: 'WireGuard Installation and Key Generation',
            description: 'Install WireGuard and generate server keys'
          }
        ],
        tips: [
          'Keep your private keys secure and never share them',
          'The public key will be used in client configurations',
          'WireGuard uses modern cryptography (ChaCha20, Poly1305)'
        ],
        warnings: [
          'Backup your keys in a secure location',
          'Don\'t lose your private keys - you\'ll need to regenerate everything',
          'Use strong, unique keys for each client'
        ],
        completed: false
      },
      {
        id: 'step-6-3',
        title: 'Configure WireGuard Server',
        description: 'Create WireGuard server configuration with proper networking',
        content: 'Set up the WireGuard server configuration with IP forwarding and firewall rules for secure VPN access.',
        codeBlocks: [
          {
            id: 'wireguard-server-config',
            language: 'ini',
            code: '[Interface]\n# Server private key (from server_private_key file)\nPrivateKey = [SERVER_PRIVATE_KEY]\n\n# VPN network address for the server\nAddress = 10.0.0.1/24\n\n# Port WireGuard will listen on\nListenPort = 51820\n\n# Enable IP forwarding\nPostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE\nPostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE\n\n# Client configuration (add after generating client keys)\n[Peer]\n# Client public key (will be added after client setup)\nPublicKey = [CLIENT_PUBLIC_KEY]\nAllowedIPs = 10.0.0.2/32',
            title: 'WireGuard Server Configuration',
            description: 'Complete server configuration with networking rules'
          },
          {
            id: 'enable-ip-forwarding',
            language: 'bash',
            code: '# Enable IP forwarding permanently\necho \'net.ipv4.ip_forward = 1\' | sudo tee -a /etc/sysctl.conf\n\n# Apply immediately\nsudo sysctl -p\n\n# Allow WireGuard port in firewall\nsudo ufw allow 51820/udp\n\n# Allow traffic from VPN network\nsudo ufw allow from 10.0.0.0/24\n\n# Check firewall status\nsudo ufw status',
            title: 'Enable IP Forwarding and Firewall Rules',
            description: 'Configure system for VPN traffic routing'
          }
        ],
        tips: [
          'IP forwarding is required for VPN clients to access the internet',
          'The MASQUERADE rule allows VPN clients to access external networks',
          'Test firewall rules after configuration'
        ],
        warnings: [
          'Ensure IP forwarding is enabled before starting WireGuard',
          'Check that firewall rules don\'t block legitimate traffic',
          'Monitor logs for any connection issues'
        ],
        completed: false
      },
      {
        id: 'step-6-4',
        title: 'Set up WireGuard Client',
        description: 'Configure WireGuard client on your local machine',
        content: 'Install WireGuard client on your local machine and generate client keys for secure connection to your Pi server.',
        codeBlocks: [
          {
            id: 'client-key-generation',
            language: 'bash',
            code: '# Create client directory\nmkdir -p ~/wireguard-keys\ncd ~/wireguard-keys\n\n# Generate client private key\nwg genkey | tee client_private_key | wg pubkey | tee client_public_key\n\n# Display the public key (you\'ll need this for server config)\ncat client_public_key',
            title: 'Client Key Generation',
            description: 'Generate cryptographic keys for client connection'
          },
          {
            id: 'client-config',
            language: 'ini',
            code: '[Interface]\n# Client private key\nPrivateKey = [YOUR_CLIENT_PRIVATE_KEY]\n\n# VPN network address for the client\nAddress = 10.0.0.2/24\n\n# DNS servers (optional, use your Pi\'s IP or public DNS)\nDNS = 10.0.0.1, 8.8.8.8\n\n[Peer]\n# Server public key\nPublicKey = [SERVER_PUBLIC_KEY]\n\n# Server endpoint (use your DuckDNS domain if you have one)\nEndpoint = [YOUR_PUBLIC_IP_OR_DOMAIN]:51820\n\n# Allowed IPs (route all traffic through VPN, or just Pi network)\nAllowedIPs = 10.0.0.0/24, 192.168.1.0/24\n\n# Keep connection alive\nPersistentKeepalive = 25',
            title: 'Client Configuration File',
            description: 'Complete client configuration for VPN connection'
          }
        ],
        tips: [
          'Use your DuckDNS domain instead of IP address for better reliability',
          'AllowedIPs determines which traffic goes through the VPN',
          'PersistentKeepalive helps maintain connection through NAT'
        ],
        warnings: [
          'Keep client private keys secure',
          'Test connection before relying on VPN for important operations',
          'Use IP addresses instead of hostnames for better security'
        ],
        completed: false
      },
      {
        id: 'step-6-5',
        title: 'Test VPN Connection and Git Operations',
        description: 'Verify VPN connectivity and test remote Git operations',
        content: 'Test your VPN connection and verify that you can securely access your Pi server for Git operations.',
        codeBlocks: [
          {
            id: 'test-vpn-connection',
            language: 'bash',
            code: '# Test VPN connection\nping 10.0.0.1\n\n# Test access to Pi\'s local network IP\nping 192.168.1.XXX  # Replace with your Pi\'s actual local IP\n\n# Test SSH through VPN (use IP address for security)\nssh [username]@192.168.1.XXX  # Use Pi\'s local IP, not hostname\n\n# Test Git operations\nssh [username]@192.168.1.XXX \'git clone https://github.com/username/repository.git\'\n\n# Or pull updates to existing repos\nssh [username]@192.168.1.XXX \'cd /path/to/existing/repo && git pull\'',
            title: 'VPN Connection and Git Operations Testing',
            description: 'Verify VPN connectivity and test remote Git operations'
          }
        ],
        tips: [
          'Always use IP addresses instead of hostnames for better security',
          'Test both VPN connectivity and Git operations',
          'Set up convenient aliases for common operations'
        ],
        warnings: [
          'Ensure you\'re using the correct IP addresses',
          'Test from different network locations if possible',
          'Monitor connection stability over time'
        ],
        completed: false
      }
    ]
  }
];
