# ArgoCD GitOps Setup (Demonstration)

## Why This Is A Demo

I've included this ArgoCD setup as a demonstration of GitOps principles and modern deployment tools. However, I'm not using it for actual production deployments in this repository.

**Why I'm not using GitOps here:**
- My `k8s/` directory contains production configurations (domain names, server details) that I keep private for security
- ArgoCD requires Kubernetes manifests to be in the Git repository to watch and sync them
- In a public repository, exposing production configs would reveal sensitive infrastructure details (origin server IPs, internal architecture)
- For this portfolio project, GitHub Actions handles deployments via `kubectl rollout restart` which is more practical

**How I'd set this up in a real production environment:**
- Use a **private repository** for Kubernetes manifests
- ArgoCD watches the private repo and auto-deploys changes
- Remove the `kubectl rollout restart` step from `.github/workflows/deploy.yml` since ArgoCD handles deployments
- This provides true GitOps: Git is the source of truth, ArgoCD ensures cluster matches Git state

If you're setting this up in your own environment, follow the instructions below. Once ArgoCD is managing your deployments, you can remove the manual deployment step from your CI/CD pipeline.

---

## ArgoCD Setup Instructions

## 1. Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f k8s/argocd/install.yaml
```

Wait for pods:
```bash
kubectl get pods -n argocd -w
```

## 2. Create Basic Auth Secret
Before creating btw make sure you have apache tools run the command:
sudo apt install apache2-utils -y
and make sure you create the proper name space 
kubectl create namespace argocd
Run this command after:
```bash
htpasswd -nb admin YOUR_PASSWORD | kubectl create secret generic argocd-basic-auth -n argocd --from-file=auth=/dev/stdin --dry-run=client -o yaml | kubectl apply -f -
```

Replace `YOUR_PASSWORD` with your actual password (use whatever username you want instead of admin).

## 3. Apply DNS (Terraform)
Push to main, Terraform will create `argocd.example.com` automatically.
## 4. Expose ArgoCD UI

```bash
kubectl apply -f k8s/argocd/ingress.yaml
```

Access at: https://argocd.example.com (with your basic auth credentials)

## 5. Get ArgoCD Admin Password

```bash
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo
```

Login to ArgoCD UI with username `admin` and this password.

## 6. Deploy Your App via GitOps

```bash
kubectl apply -f k8s/argocd/application.yaml
```

Done! ArgoCD now watches your `k8s/` folder and auto-deploys changes when you push to main.
if by some chance you are following this readme while ur k8s dir is named k8s-demo still then change it to k8s


