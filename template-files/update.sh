#!/bin/bash
# System Update Script
# Run weekly system updates and Docker cleanup

echo "$(date): Starting system update..."

# Update system packages
sudo apt update && sudo apt upgrade -y

# Clean up Docker resources
docker system prune -f
docker image prune -f

# Log completion
echo "$(date): System update completed" >> /mnt/external/logs/update.log
