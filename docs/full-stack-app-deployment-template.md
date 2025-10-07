# Full-Stack App Deployment Template
## Vite/React Frontend + Node.js Backend on Raspberry Pi

### Overview
This template provides a complete guide for deploying full-stack applications with Vite/React frontend and Node.js backend on a Raspberry Pi server using Docker.

### Prerequisites
- Raspberry Pi server with Docker and Docker Compose installed
- SSH access to the Pi
- GitHub repository with your full-stack application
- Basic understanding of Docker and Node.js

---

## Application Structure

### Expected Project Structure
```
your-app/
├── package.json              # Root package.json
├── Dockerfile               # Main Dockerfile
├── backend/
│   ├── package.json         # Backend dependencies
│   ├── src/                 # Backend source code
│   ├── dist/                # Built backend (created during build)
│   └── tsconfig.json        # TypeScript config
├── frontend/
│   ├── package.json         # Frontend dependencies
│   ├── src/                 # Frontend source code
│   ├── dist/                # Built frontend (created during build)
│   └── vite.config.js       # Vite configuration
└── README.md
```

### Package.json Scripts
**Root package.json should include:**
```json
{
  "scripts": {
    "start": "cd backend && npm start",
    "build": "npm run build:backend && npm run build:frontend",
    "build:backend": "cd backend && npm run build",
    "build:frontend": "cd frontend && npm run build",
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\""
  }
}
```

---

## Docker Configuration

### Dockerfile Template
```dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy root package files
COPY package*.json ./

# Install root dependencies
RUN npm ci

# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci

# Copy frontend package files and install dependencies
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm ci

# Copy all source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies to reduce image size
RUN npm ci --only=production && npm cache clean --force
RUN cd backend && npm ci --only=production && npm cache clean --force
RUN cd frontend && npm ci --only=production && npm cache clean --force

EXPOSE 3000
CMD ["npm", "start"]
```

### Docker Compose Configuration
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

  your-app:
    build: ../apps/your-app
    # No ports exposed - nginx handles all access
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    networks:
      - default

volumes:
  portainer_data:
```

### Nginx Proxy Configuration
```nginx
# Your app static files (adjust path based on your build output)
location /your-app-assets/ {
    proxy_pass http://your-app:3001/your-app-assets/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Your app API endpoints
location /your-app/api/ {
    proxy_pass http://your-app:3001/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Your app health check
location /your-app/health {
    proxy_pass http://your-app:3001/health;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Your app main route (catch-all for the app)
location /your-app/ {
    proxy_pass http://your-app:3001/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Handle WebSocket connections (if needed)
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_cache_bypass $http_upgrade;
}
```

---

## Deployment Process

### Step 1: Clone Repository
```bash
# Navigate to apps directory
cd /mnt/external/apps

# Clone your repository using SSH
git clone git@github.com:yourusername/your-app.git
cd your-app
```

### Step 2: Create Dockerfile
```bash
# Create Dockerfile in your app directory
nano Dockerfile
# Copy the Dockerfile template above
```

### Step 3: Update Docker Compose
```bash
# Edit docker-compose.yml
cd /mnt/external/docker
nano docker-compose.yml
# Add your app service using the template above
```

### Step 4: Build and Deploy
```bash
# Build the Docker image
docker compose build your-app

# Start the container
docker compose up -d your-app

# Check if it's running
docker ps

# Check logs
docker logs docker-your-app-1
```

---

## Common Issues and Solutions

### Issue 1: Build Failures
**Symptoms**: `tsc: not found` or `vite: not found`
**Cause**: Missing dev dependencies for building

**Solution**: Ensure Dockerfile installs all dependencies:
```dockerfile
# Install ALL dependencies (including dev dependencies for building)
RUN npm ci
RUN cd backend && npm ci
RUN cd frontend && npm ci
```

### Issue 2: Port Mismatch
**Symptoms**: App builds but can't be accessed
**Cause**: Backend runs on different port than expected

**Solution**: Check what port your backend actually uses:
```bash
# Check what's listening inside container
docker exec docker-your-app-1 netstat -tlnp

# Update docker-compose.yml port mapping accordingly
ports:
  - "3000:3001"  # Map to actual backend port
```

### Issue 3: External Drive Permissions
**Symptoms**: `npm install` fails with EPERM errors
**Cause**: External drive restrictions preventing symlink creation

**Solution**: Use Docker for building instead of local npm:
```bash
# Build with Docker (recommended)
docker compose build your-app

# Don't run npm install directly on external drive
```

### Issue 4: Frontend Not Served
**Symptoms**: Backend works but frontend not accessible
**Cause**: Frontend not being served by backend

**Solution**: Configure backend to serve frontend:
```javascript
// In your backend (Express.js example)
app.use(express.static(path.join(__dirname, '../frontend/dist')));
```

### Issue 5: Static Files Not Loading
**Symptoms**: 404 errors for CSS/JS files in browser console
**Cause**: Nginx not proxying static asset paths correctly

**Solution**: Add specific nginx location blocks for static files:
```nginx
# Your app static files (adjust path based on your build output)
location /your-app-assets/ {
    proxy_pass http://your-app:3001/your-app-assets/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

---

## Testing and Verification

### Health Check
```bash
# Test backend health endpoint
curl http://localhost:3000/health

# Expected response:
# {"success":true,"data":{"status":"healthy"}}
```

### Access Points
- **Main App**: https://[DOMAIN]/your-app/
- **Health Check**: https://[DOMAIN]/your-app/health
- **API**: https://[DOMAIN]/your-app/api/
- **Static Assets**: https://[DOMAIN]/your-app-assets/

### Log Monitoring
```bash
# View real-time logs
docker logs -f docker-your-app-1

# Check container status
docker ps

# Restart if needed
docker compose restart your-app
```

---

## Environment Configuration

### Environment Variables
```yaml
# In docker-compose.yml
environment:
  - NODE_ENV=production
  - PORT=3001
  - DATABASE_URL=your_database_url
  - API_KEY=your_api_key
```

### Backend Environment
```bash
# Create .env file in backend directory
cd /mnt/external/apps/your-app/backend
cp .env.example .env
nano .env
```

---

## Maintenance

### Updates
```bash
# Pull latest changes
cd /mnt/external/apps/your-app
git pull origin main

# Rebuild and restart
cd /mnt/external/docker
docker compose build your-app
docker compose up -d your-app
```

### Backup
```bash
# Backup your app
tar -czf backup-your-app-$(date +%Y%m%d).tar.gz /mnt/external/apps/your-app/
```

### Logs
```bash
# View logs
docker logs docker-your-app-1

# Clear logs (if needed)
docker logs --tail 0 -f docker-your-app-1
```

---

## Security Considerations

### Production Checklist
- [ ] Environment variables properly configured
- [ ] No sensitive data in Docker images
- [ ] HTTPS configured (via nginx)
- [ ] Firewall rules in place
- [ ] Regular security updates
- [ ] Database credentials secured

### Network Security
```bash
# Ensure only necessary ports are exposed
sudo ufw status

# Check what's listening
netstat -tlnp
```

---

## Troubleshooting Commands

### Container Management
```bash
# Check container status
docker ps

# View container logs
docker logs docker-your-app-1

# Execute commands inside container
docker exec -it docker-your-app-1 sh

# Restart container
docker compose restart your-app

# Rebuild container
docker compose build your-app
```

### Network Testing
```bash
# Test local connectivity
curl http://localhost:3000/health

# Test from host
curl http://192.168.1.244:3000/health

# Check port mapping
docker port docker-your-app-1
```

### System Resources
```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check Docker resource usage
docker stats
```

---

## Template Usage

1. **Copy this template** and customize for your specific application
2. **Update package.json scripts** to match your build process
3. **Modify Dockerfile** for any special requirements
4. **Configure environment variables** for your app
5. **Test thoroughly** before production deployment
6. **Document any customizations** for future reference

---

**Template Version**: 1.0  
**Last Updated**: October 7, 2025  
**Compatible With**: Vite/React + Node.js/TypeScript applications
