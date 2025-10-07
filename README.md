# Raspberry Pi Server Setup

A comprehensive guide for setting up a production-ready Raspberry Pi server with Docker, nginx, SSL, and application deployment capabilities.

## 🚀 Quick Start

This repository contains everything you need to transform a Raspberry Pi into a powerful personal server:

- **Complete setup guide** with step-by-step instructions
- **Security hardening** with firewall, SSL, and intrusion prevention
- **Application deployment** templates for full-stack applications
- **Production-ready configuration** with automated backups and maintenance

## 📚 Documentation

### Core Guides
- **[Setup Guide](setup-guide.md)** - Complete step-by-step server setup (5 phases)
- **[Server Template](pi-server-template.md)** - Reusable template for new servers
- **[Full-Stack App Template](full-stack-app-deployment-template.md)** - Deploy Vite/React + Node.js apps

## 🏗️ What You'll Build

### Server Capabilities
- 🌐 **Remote Access**: HTTPS via DuckDNS dynamic DNS
- 🔒 **Security**: Production-ready with firewall, SSL, and intrusion prevention
- 🐳 **Containerization**: Docker with Portainer management interface
- 📦 **Application Hosting**: Ready for portfolio applications
- 🔄 **Automated Maintenance**: Daily backups, weekly updates
- 🔑 **SSH Authentication**: Key-based authentication for GitHub and server access

### Technology Stack
- **OS**: Raspberry Pi OS Lite (64-bit)
- **Containerization**: Docker + Docker Compose
- **Web Server**: nginx with SSL termination
- **Management**: Portainer for Docker management
- **Security**: UFW firewall, fail2ban, Let's Encrypt SSL
- **Applications**: Node.js, React, Vite, TypeScript support

## 📋 Prerequisites

### Hardware
- Raspberry Pi 4 Model B (4GB+ RAM recommended)
- 64GB+ microSD card
- External storage drive (500GB+ recommended)
- Case with cooling (optional but recommended)

### Software
- Raspberry Pi Imager
- SSH client
- Basic command line knowledge

## 🎯 Setup Phases

The setup is organized into 5 logical phases:

### Phase 1: Initial Setup & Local Network Access
- Flash Raspberry Pi OS
- Configure SSH and WiFi
- Install Docker and Docker Compose
- Mount external drive
- Set up basic services

### Phase 2: Remote Access & Security
- Configure DuckDNS dynamic DNS
- Set up router port forwarding
- Install SSL certificates with Let's Encrypt
- Configure nginx for HTTPS
- Set up firewall and security measures

### Phase 3: Application Deployment
- Deploy portfolio applications
- Set up monitoring and logging
- Configure application-specific settings

### Phase 4: Security Hardening
- Disable unnecessary services
- Set up fail2ban for intrusion prevention
- Configure automated security updates

### Phase 5: Backup & Maintenance
- Set up automated backups
- Configure maintenance scripts
- Test backup and restore procedures

## 🚀 Getting Started

1. **Read the [Setup Guide](setup-guide.md)** for complete instructions
2. **Follow each phase** in order for best results
3. **Use the templates** for deploying your own applications
4. **Reference the troubleshooting guides** if you encounter issues

## 📖 Example Deployment

After setup, you'll have a server accessible at:
- **Main Site**: `https://yourdomain.duckdns.org`
- **Portainer**: `https://yourdomain.duckdns.org:9000`
- **Applications**: `https://yourdomain.duckdns.org/your-app/`

## 🛠️ Application Deployment

### For Full-Stack Apps (Vite/React + Node.js)
Use the **[Full-Stack App Template](full-stack-app-deployment-template.md)** which includes:
- Multi-stage Docker builds
- nginx proxy configuration
- Static file serving
- API endpoint routing
- Health check endpoints

## 🔧 Maintenance

### Regular Tasks
- **Weekly**: Automated system updates
- **Daily**: Automated backups
- **As needed**: Application updates and deployments

### Monitoring
- **Portainer**: Docker container management
- **Health checks**: Built-in application monitoring
- **Logs**: Centralized logging via Docker

## 🆘 Troubleshooting

### Common Issues
- **Docker containers not starting**: Check logs with `docker logs [container-name]`
- **SSL certificate issues**: Verify DuckDNS and port forwarding
- **Application not accessible**: Check nginx configuration and proxy settings
- **Build failures**: Ensure all dependencies are installed in Dockerfile

### Getting Help
1. Check the troubleshooting sections in each guide
2. Review the common issues and solutions
3. Verify your configuration matches the examples
4. Check Docker and nginx logs for specific errors

## 📁 Repository Structure

```
pi-server/
├── README.md                           # This file - entry point
├── setup-guide.md                      # Complete setup instructions
├── pi-server-template.md               # Server configuration template
├── full-stack-app-deployment-template.md # App deployment template
├── server-docs/                        # Application-specific guides
│   └── rowcalibur-deployment-guide.md  # RowCalibur deployment
└── .gitignore                          # Git ignore rules
```

## 🎉 Success Stories

This setup has been successfully used to deploy:
- **RowCalibur PWA**: A Progressive Web Application for rowing challenges
- **Portfolio websites**: Static and dynamic content
- **API services**: Node.js backends with database integration
- **Development environments**: Isolated development containers

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report issues
- Suggest improvements
- Add new application deployment guides
- Improve documentation

## 📞 Support

For questions or issues:
1. Check the troubleshooting guides
2. Review the common issues sections
3. Open an issue in this repository

---

**Happy Server Building!** 🚀

*Last updated: October 7, 2025*
