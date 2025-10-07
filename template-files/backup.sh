#!/bin/bash
# Backup Script
# Create automated backups of important configurations and data

BACKUP_DIR="/mnt/external/backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "$(date): Starting backup process..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup important configs
tar -czf $BACKUP_DIR/configs_$DATE.tar.gz /etc/nginx /etc/letsencrypt /home/[username]/.ssh

# Backup application data
tar -czf $BACKUP_DIR/apps_$DATE.tar.gz /mnt/external/apps

# Backup Docker configurations
tar -czf $BACKUP_DIR/docker_$DATE.tar.gz /mnt/external/docker

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "$(date): Backup completed - $DATE" >> /mnt/external/logs/backup.log
