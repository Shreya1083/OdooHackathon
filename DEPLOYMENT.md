# 🚀 Deployment Guide

This guide covers deploying the HRMS application to production environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Environment Variables](#environment-variables)
5. [Security Considerations](#security-considerations)
6. [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

- Node.js 16+ installed on your server
- MongoDB instance (Atlas, AWS DocumentDB, or self-hosted)
- Domain name (optional but recommended)
- SSL certificate for HTTPS

## Backend Deployment

### Option 1: Deploy to Heroku

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create your-hrms-backend
```

4. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your_mongodb_connection_string"
heroku config:set JWT_SECRET="your_secure_jwt_secret"
heroku config:set FRONTEND_URL="https://your-frontend-url.com"
```

5. **Deploy**
```bash
git push heroku main
```

### Option 2: Deploy to Railway

1. **Install Railway CLI**
```bash
npm install -g @railway/cli
```

2. **Login and Initialize**
```bash
railway login
cd backend
railway init
```

3. **Add Environment Variables**
- Go to Railway dashboard
- Add all environment variables from `.env.example`

4. **Deploy**
```bash
railway up
```

### Option 3: Deploy to VPS (Ubuntu)

1. **SSH into your server**
```bash
ssh user@your-server-ip
```

2. **Install Node.js and MongoDB**
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

3. **Clone and Setup**
```bash
git clone <your-repo-url>
cd OdooHackathon/backend
npm install --production
```

4. **Create .env file**
```bash
nano .env
# Add your production environment variables
```

5. **Install PM2 for process management**
```bash
sudo npm install -g pm2
pm2 start server.js --name hrms-backend
pm2 startup
pm2 save
```

6. **Setup Nginx as reverse proxy**
```bash
sudo apt-get install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/hrms-backend
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/hrms-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

7. **Setup SSL with Let's Encrypt**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.yourdomain.com
```

## Frontend Deployment

### Option 1: Deploy to Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
cd frontend/hrms-frontend
vercel
```

4. **Set Environment Variables**
- Go to Vercel dashboard → Your Project → Settings → Environment Variables
- Add: `VITE_API_URL=https://your-backend-url.com/api`

5. **Redeploy with Environment Variables**
```bash
vercel --prod
```

### Option 2: Deploy to Netlify

1. **Build the app**
```bash
cd frontend/hrms-frontend
npm run build
```

2. **Install Netlify CLI**
```bash
npm install -g netlify-cli
```

3. **Login and Deploy**
```bash
netlify login
netlify init
netlify deploy --prod
```

4. **Set Environment Variables**
- Go to Netlify dashboard → Site settings → Environment variables
- Add: `VITE_API_URL=https://your-backend-url.com/api`

### Option 3: Deploy to VPS with Nginx

1. **Build the application**
```bash
cd frontend/hrms-frontend
npm run build
```

2. **Copy build files to server**
```bash
scp -r dist/* user@your-server-ip:/var/www/hrms-frontend
```

3. **Setup Nginx**
```bash
sudo nano /etc/nginx/sites-available/hrms-frontend
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/hrms-frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/hrms-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

4. **Setup SSL**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Environment Variables

### Backend Production Environment
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hrms_production
JWT_SECRET=use_a_very_long_random_string_here_at_least_32_characters
FRONTEND_URL=https://yourdomain.com
```

### Frontend Production Environment
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Security Considerations

### Backend Security

1. **Use Strong JWT Secret**
```bash
# Generate a strong secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

2. **Enable HTTPS Only**
- Always use SSL certificates
- Set secure cookie flags

3. **Rate Limiting**
Consider adding rate limiting to prevent abuse:
```bash
npm install express-rate-limit
```

4. **Helmet for Security Headers**
```bash
npm install helmet
```

Add to `app.js`:
```javascript
const helmet = require('helmet');
app.use(helmet());
```

5. **Environment Variables**
- Never commit `.env` files
- Use secret management services for production

### Frontend Security

1. **Environment Variables**
- Only prefix with `VITE_` for public variables
- Never store sensitive data in frontend

2. **Build Optimization**
```bash
npm run build
# Always use the built version in production
```

## MongoDB Production Setup

### Using MongoDB Atlas (Recommended)

1. **Create Cluster**
- Go to mongodb.com/cloud/atlas
- Create a free cluster

2. **Setup Network Access**
- Add IP whitelist (0.0.0.0/0 for all, or specific IPs)

3. **Create Database User**
- Database Access → Add New User
- Set username and password

4. **Get Connection String**
```
mongodb+srv://<username>:<password>@cluster.mongodb.net/hrms_production?retryWrites=true&w=majority
```

### Self-Hosted MongoDB

1. **Enable Authentication**
```bash
mongo
use admin
db.createUser({
  user: "hrmsAdmin",
  pwd: "securePassword",
  roles: [ { role: "readWrite", db: "hrms_production" } ]
})
```

2. **Enable Auth in MongoDB Config**
```bash
sudo nano /etc/mongod.conf
```

Add:
```yaml
security:
  authorization: enabled
```

```bash
sudo systemctl restart mongod
```

3. **Connection String**
```
mongodb://hrmsAdmin:securePassword@localhost:27017/hrms_production
```

## Monitoring & Maintenance

### Backend Monitoring

1. **PM2 Monitoring**
```bash
pm2 status
pm2 logs hrms-backend
pm2 monit
```

2. **Setup Log Rotation**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Database Backups

1. **Automated Backups with MongoDB Atlas**
- Atlas provides automatic backups

2. **Manual Backup**
```bash
mongodump --uri="mongodb://localhost:27017/hrms_production" --out=/backup/$(date +%Y%m%d)
```

3. **Automated Backup Script**
```bash
#!/bin/bash
BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
mongodump --uri="your_connection_string" --out=$BACKUP_DIR/$DATE
# Keep only last 7 days
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} +
```

Add to crontab:
```bash
crontab -e
# Add: 0 2 * * * /path/to/backup-script.sh
```

### Health Checks

1. **Backend Health Endpoint**
Add to `app.js`:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});
```

2. **Monitor with UptimeRobot**
- Go to uptimerobot.com
- Add monitor for your API health endpoint

## Performance Optimization

### Backend

1. **Enable Compression**
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

2. **Database Indexing**
Ensure indexes are created on frequently queried fields.

### Frontend

1. **Build Optimization**
Already configured in Vite

2. **CDN Integration**
Consider using a CDN for static assets

## Troubleshooting

### Backend Issues
```bash
# Check logs
pm2 logs hrms-backend

# Restart service
pm2 restart hrms-backend

# Check MongoDB connection
mongo --eval "db.adminCommand('ping')"
```

### Frontend Issues
```bash
# Clear cache and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Rollback Strategy

1. **Keep Previous Versions**
```bash
# Tag releases
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

2. **PM2 Rollback**
```bash
pm2 delete hrms-backend
cd /path/to/previous/version
pm2 start server.js --name hrms-backend
```

## Support

For deployment issues, check:
- Server logs
- MongoDB connection
- Environment variables
- Network/firewall settings
- SSL certificates validity

---

🎉 **Congratulations!** Your HRMS system is now deployed and production-ready!
