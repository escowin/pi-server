#!/bin/bash
# DuckDNS Update Script
# Replace YOUR_TOKEN and YOUR_SUBDOMAIN with your actual values

TOKEN="YOUR_TOKEN"
DOMAIN="YOUR_SUBDOMAIN"

# Update DuckDNS
curl -s "https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip="

# Log the update
echo "$(date): DuckDNS updated for $DOMAIN.duckdns.org" >> /mnt/external/logs/duckdns.log
