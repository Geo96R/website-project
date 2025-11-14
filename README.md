# George DevOps Portfolio

My Terminal/Cyberpunk website showing off DevOps skills with real-time data streams and interactive stuff.
i wanted to merge imagination creation my innovation and skills from the day to day work to encapsulate how i feel in the field, how i think,
a bit of hopefull inspirations to try do things that are perhaps at times beyond my scope but studying is what i do almost all the time.
inspiring to be better and share my knowledge if can is why i made this, While i don't have 500years of experience from the year 1525(Sorry was born too late) i can still make up with the passion i have for the field for the learning.
Enjoy what i made, be happy be healthy work hard and believe in your self.

**Current Version: v1.3.0** - Added Grafana Cloud monitoring, ArgoCD GitOps demonstration, and updated to Next.js 16

Note any and all here may be subject for future change if i want to scrape and redo stuff this why ill have versions you can use wayback archive(if they index this beautiful creation) to see previous version
i will try keep it updated as much as possible wether it is new docker/k8s versions or next js. but life happens so be strong! and google away


## What's Here in this treasure trove of mine?

### Live Data Streams
- **AWS Stream**: Real AWS service health with 3D globe
- **Google Stream**: Google Cloud status with interactive globe  
- **Radio Stream**: Live radio with 300+ stations
- **Learn Stream**: DevOps learning with Wikipedia integration
- **CV Stream**: My professional profile with interactive skills

### Tech Stuff
- Cyberpunk animated borders with drawing animation
- Interactive terminal with typing effects
- Real-time data from AWS, Google Cloud, Radio APIs
- 3D visualizations using Three.js and amCharts
- Mobile responsive design
- Docker + Kubernetes deployment ready
- Infrastructure as Code with Terraform
- Grafana Cloud monitoring with OpenTelemetry instrumentation
- ArgoCD GitOps demonstration (see `k8s-demo/argocd/`)
- Automated CI/CD with GitHub Actions
- Cloudflare DNS, WAF, and SSL management

## Tech Stack

- **Frontend**: Next.js 16, React 19, Framer Motion, Tailwind CSS 4
- **3D Graphics**: Three.js, amCharts 5
- **APIs**: AWS Health, Google Cloud Status, Radio Browser, Wikipedia
- **Infrastructure**: Terraform (Cloudflare provider), GitHub Actions
- **Deployment**: Docker, Kubernetes (K3s), GitHub Container Registry
- **Observability**: Grafana Cloud (metrics, logs, traces), OpenTelemetry

## Quick Start

### Prerequisites
- Node.js 20.9.0+ 
- Docker (optional)
- Git
- Enviorment(Server/PC) for the bare minimum of 4-8gb ram (Storage wise dont need much no database)
- some image repositroy to upload to
- Coffee

### Local Development
```bash
# Clone the repo
git clone https://github.com/Geo96R/website-project.git
cd website-project

# Install dependencies
npm install

# Start dev server
npm run dev
```

Visit `http://localhost:3000` to see the site.

### Docker
```bash
# Build image
docker build -f docker/Dockerfile -t website-project:latest .

# Run container
docker run -p 8080:3000 website-project:latest
```

Visit `http://localhost:8080` to see the site.

### Production
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

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
├── infra/                # Infrastructure as Code
│   └── cloudflare/       # Cloudflare Terraform configs
├── k8s-demo/             # Kubernetes demo configs (sanitized examples)
│   └── argocd/           # ArgoCD GitOps demonstration
├── .github/workflows/    # GitHub Actions CI/CD
├── styles/               # Global styles
└── public/               # Static assets
```

## Live Features

- **AWS Infrastructure**: Real-time service health and region status
- **Google Cloud**: Platform status and service monitoring
- **Radio**: 300+ international radio stations with genre filtering
- **Learning**: DevOps topics with Wikipedia integration
- **CV**: Interactive professional profile with skills showcase

## Configuration

### Environment Variables
- `NODE_ENV=production` (optional)
- `PORT=3000` (optional, defaults to 3000)

### API Endpoints
- `/api/aws-health` - AWS service health data
- `/api/google-health` - Google Cloud status
- `/api/radio-stations` - Radio station data
- `/api/wikipedia` - Learning content

## Deployment

### Automated CI/CD (Recommended)
This project uses GitHub Actions for deployments:
- **Docker Build**: Automatically builds and pushes to GHCR on push to main
- **Kubernetes Deploy**: Auto-deploys via `kubectl rollout restart` after image push
- **Terraform**: Manages Cloudflare DNS, WAF, and SSL automatically

**Note on ArgoCD:** I've included an ArgoCD GitOps setup in `k8s-demo/argocd/` as a demonstration. I'm not using it for actual deployments here because my production `k8s/` directory is kept private (not in Git) for security reasons, which makes GitOps impractical in a public repo. If you're setting this up in your own environment with a private repository, you can use ArgoCD for full GitOps automation and remove the `kubectl rollout restart` step from the GitHub Actions workflow.

See `.github/workflows/` for pipeline configs and `k8s-demo/argocd/` for GitOps demonstration.

### Infrastructure Management
Cloudflare is managed via Terraform:
```bash
cd infra/cloudflare
terraform init
terraform plan
terraform apply
```

See `infra/cloudflare/README.md` for setup instructions.

### Manual Deployment

**Docker:**
```bash
docker build -f docker/Dockerfile -t your-registry/website-project:latest .
docker push your-registry/website-project:latest
```

**Kubernetes:**
```bash
kubectl apply -f k8s/
kubectl rollout restart deployment/website-project
```

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions welcome! Feel free to submit a Pull Request.

## Credits More in the thanks.txt i added!

- **APIs Used**: AWS Health, Google Cloud Status, Radio Browser, Wikipedia
- **Libraries**: Next.js, React, Framer Motion, Tailwind CSS, Three.js, amCharts
- **Inspiration**: Cyberpunk aesthetics, Love for linux, DevOps culture and a love for creation

---

**Built with ❤️ by George Tatevosov - DevOps Engineer**