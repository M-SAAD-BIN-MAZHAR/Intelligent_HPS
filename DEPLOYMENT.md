# Deployment Guide

This guide covers different deployment options for the Intelligent Healthcare Management System.

## 🐳 Docker Deployment (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- At least 4GB RAM available
- 10GB free disk space

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd intelligent-healthcare-system

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Configuration
Edit `docker-compose.yml` to customize:
- Port mappings
- Environment variables
- Volume mounts

## 🌐 Manual Deployment

### Frontend Deployment

#### Build for Production
```bash
cd healthcare-app
npm install
npm run build
```

#### Deploy to Netlify
1. Build the project locally or connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables in Netlify dashboard

#### Deploy to Vercel
```bash
npm install -g vercel
cd healthcare-app
vercel --prod
```

#### Deploy to AWS S3 + CloudFront
```bash
# Install AWS CLI
aws configure

# Sync build files to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Backend Deployment

#### Deploy to Heroku
```bash
# Install Heroku CLI
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET_KEY=your-secret-key
heroku config:set DATABASE_URL=your-database-url

# Deploy
git subtree push --prefix IntelligentBasedHMS heroku main
```

#### Deploy to AWS EC2
```bash
# Connect to EC2 instance
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies
sudo apt update
sudo apt install python3-pip nginx

# Clone repository
git clone <repository-url>
cd intelligent-healthcare-system/IntelligentBasedHMS

# Install Python dependencies
pip3 install -r requirements.txt

# Configure systemd service
sudo cp deployment/healthcare-api.service /etc/systemd/system/
sudo systemctl enable healthcare-api
sudo systemctl start healthcare-api

# Configure nginx
sudo cp deployment/nginx.conf /etc/nginx/sites-available/healthcare-api
sudo ln -s /etc/nginx/sites-available/healthcare-api /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

#### Deploy to Google Cloud Run
```bash
# Build and push container
gcloud builds submit --tag gcr.io/PROJECT_ID/healthcare-backend

# Deploy to Cloud Run
gcloud run deploy healthcare-backend \
  --image gcr.io/PROJECT_ID/healthcare-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔧 Environment Configuration

### Frontend Environment Variables
```bash
# .env.production
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=Healthcare System
VITE_ENABLE_ANALYTICS=true
```

### Backend Environment Variables
```bash
# Production environment
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET_KEY=your-super-secret-jwt-key
CORS_ORIGINS=https://your-frontend-domain.com
DEBUG=false
```

## 🗄️ Database Setup

### SQLite (Development)
No additional setup required. Database file is created automatically.

### PostgreSQL (Production)
```sql
-- Create database
CREATE DATABASE healthcare_system;

-- Create user
CREATE USER healthcare_user WITH PASSWORD 'secure_password';

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE healthcare_system TO healthcare_user;
```

### Database Migration
```bash
# Run migrations (if available)
python manage.py migrate

# Or initialize database manually
python -c "from database import init_db; init_db()"
```

## 🔒 Security Considerations

### SSL/TLS Configuration
- Use HTTPS in production
- Configure SSL certificates (Let's Encrypt recommended)
- Set secure headers in nginx/reverse proxy

### Environment Security
- Use strong JWT secret keys
- Rotate secrets regularly
- Use environment variables for sensitive data
- Enable CORS only for trusted domains

### File Upload Security
- Limit file sizes
- Validate file types
- Scan uploaded files for malware
- Store uploads in secure location

## 📊 Monitoring and Logging

### Application Monitoring
```bash
# Install monitoring tools
pip install prometheus-client
pip install sentry-sdk

# Configure logging
export LOG_LEVEL=INFO
export SENTRY_DSN=your-sentry-dsn
```

### Health Checks
The backend includes health check endpoints:
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status

### Log Management
```bash
# View application logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Or for manual deployment
tail -f /var/log/healthcare-api.log
```

## 🚀 Performance Optimization

### Frontend Optimization
- Enable gzip compression
- Use CDN for static assets
- Implement service worker for caching
- Optimize images and assets

### Backend Optimization
- Use connection pooling for database
- Implement Redis for caching
- Use async/await for I/O operations
- Monitor and optimize ML model inference

### Database Optimization
- Add appropriate indexes
- Use connection pooling
- Implement query optimization
- Regular database maintenance

## 🔄 CI/CD Pipeline

### GitHub Actions (Included)
The repository includes GitHub Actions workflows for:
- Automated testing
- Security scanning
- Deployment to staging/production

### Custom CI/CD
```yaml
# Example GitLab CI
stages:
  - test
  - build
  - deploy

test:
  script:
    - npm test
    - python -m pytest

build:
  script:
    - docker build -t healthcare-app .

deploy:
  script:
    - docker push $CI_REGISTRY_IMAGE
    - kubectl apply -f k8s/
```

## 🆘 Troubleshooting

### Common Issues

#### Frontend Build Fails
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Backend Won't Start
```bash
# Check Python version
python --version

# Install missing dependencies
pip install -r requirements.txt

# Check port availability
netstat -tulpn | grep :8000
```

#### Database Connection Issues
```bash
# Check database status
systemctl status postgresql

# Test connection
python -c "from database import test_connection; test_connection()"
```

### Performance Issues
- Monitor resource usage (CPU, RAM, disk)
- Check database query performance
- Analyze network latency
- Review application logs for errors

### Security Issues
- Regularly update dependencies
- Monitor for security vulnerabilities
- Review access logs
- Implement rate limiting

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review application logs
3. Open an issue on GitHub
4. Contact the development team

---

**Note**: Always test deployments in a staging environment before production deployment.