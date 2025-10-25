# George DevOps Site

A cyberpunk-inspired portfolio website showcasing DevOps engineering capabilities through interactive data streams and real-time monitoring.

## 🚀 Features

### Interactive Streams
- **AWS Stream**: Real-time AWS infrastructure monitoring with 3D globe visualization
- **Google Stream**: Google Cloud Platform status tracking with interactive globe
- **Radio Stream**: Live radio with 300+ international stations and frequency scanner
- **Learn Stream**: DevOps learning platform with Wikipedia integration (100+ topics)
- **CV Stream**: Professional profile with pixelated avatar and interactive skills

### Technical Highlights
- **Cyberpunk-style animated borders** with sequential drawing animation
- **Interactive terminal** with typing animations and keyboard highlighting
- **Real-time data integration** from AWS, Google Cloud, and Radio APIs
- **3D visualizations** using Three.js and amCharts
- **Responsive design** with cyberpunk aesthetics
- **Docker containerization** ready for deployment

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React, Framer Motion, Tailwind CSS
- **3D Graphics**: Three.js, amCharts 5
- **APIs**: AWS Health, Google Cloud Status, Radio Browser, Wikipedia
- **Containerization**: Docker
- **Deployment**: Docker, Kubernetes, Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker (optional)
- Git

### Local Development
```bash
# Clone the repository
git clone https://github.com/Geo96R/website-project.git
cd website-project

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the website.

### Docker Deployment
```bash
# Build the Docker image
docker build -f docker/Dockerfile -t website-project:latest .

# Run the container
docker run -p 8080:3000 website-project:latest
```

Visit `http://localhost:8080` to see the website.

### Production Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── aws/               # AWS stream page
│   ├── google/            # Google stream page
│   ├── radio/             # Radio stream page
│   ├── learn/             # Learning platform
│   └── cv/                # CV page
├── components/            # React components
├── docker/               # Docker configuration
├── styles/               # Global styles
└── public/               # Static assets
```

## 🌐 Live Features

- **AWS Infrastructure**: Real-time service health and region status
- **Google Cloud**: Platform status and service monitoring
- **Radio**: 300+ international radio stations with genre filtering
- **Learning**: DevOps topics with Wikipedia integration
- **CV**: Interactive professional profile with skills showcase

## 🔧 Configuration

### Environment Variables
- `NODE_ENV=production` (optional)
- `PORT=3000` (optional, defaults to 3000)

### API Endpoints
- `/api/aws-health` - AWS service health data
- `/api/google-health` - Google Cloud status
- `/api/radio-stations` - Radio station data
- `/api/wikipedia` - Learning content

## 🚀 Deployment Options

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

### Docker
```bash
docker build -f docker/Dockerfile -t your-registry/website-project:latest .
docker push your-registry/website-project:latest
```

### Kubernetes
See [DEPLOYMENT.md](DEPLOYMENT.md) for Kubernetes deployment instructions.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- **APIs Used**: AWS Health, Google Cloud Status, Radio Browser, Wikipedia
- **Libraries**: Next.js, React, Framer Motion, Tailwind CSS, Three.js, amCharts
- **Inspiration**: Cyberpunk aesthetics and DevOps culture

---

**Built with ❤️ by George Tatevosov - DevOps Engineer**