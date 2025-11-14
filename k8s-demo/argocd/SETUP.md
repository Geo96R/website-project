# ArgoCD Setup Instructions

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


