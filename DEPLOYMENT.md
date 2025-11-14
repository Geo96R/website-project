# Deployment Guide

## Deployment Options

### 1. Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your GitHub repository
4. Deploy automatically

### 2. Docker Deployment

#### Local Docker
```bash
# Build the image
docker build -f docker/Dockerfile -t website-project:latest .

# Run the container
docker run -p 8080:3000 website-project:latest
```

#### Docker Hub
```bash
# Build and tag
docker build -f docker/Dockerfile -t yourusername/website-project:latest .

# Push to Docker Hub
docker push yourusername/website-project:latest
```

### 3. Kubernetes Deployment

#### Create deployment file
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: website-project
spec:
  replicas: 2
  selector:
    matchLabels:
      app: website-project
  template:
    metadata:
      labels:
        app: website-project
    spec:
      containers:
      - name: website-project
        image: yourusername/website-project:latest
        ports:
        - containerPort: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: website-project-service
spec:
  selector:
    app: website-project
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

#### Deploy to Kubernetes
```bash
kubectl apply -f deployment.yaml
kubectl get services
```

### 4. Environment Variables

The deployment uses the following environment variables:
- `NODE_ENV=production` (optional)
- `PORT=3000` (optional, defaults to 3000)

### 5. Production Features

This site includes real-time data streams from AWS, Google Cloud, radio stations, and a learning platform. Check the main README for full feature list.