# Deploying with GitHub Pages

This guide outlines the process for publishing this repository using GitHub Pages and connecting it to the custom domain iwjong.com.

## 1. Enable GitHub Pages

- Navigate to the repository: https://github.com/iwjong/jonginwon
- Go to Settings → Pages
- Under Build and deployment:
  - Source: Deploy from a branch
  - Branch: main (or gh-pages)
  - Folder: / (root)
- Save the configuration

## 2. Configure Custom Domain

- In Pages settings, set the custom domain:
  iwjong.com
- Save to generate the CNAME file in the repository

## 3. Verify Domain Ownership

Create a TXT record in your DNS provider:

- Type: TXT
- Name: _github-pages-challenge-iwjong
- Value: 054cbdec54ae268f0352726aacb752

Allow time for DNS propagation, then complete verification in GitHub.

## 4. Configure DNS

If using Squarespace as the DNS provider, configure the following records:

A Records (root domain):
- Host: @ → 185.199.108.153
- Host: @ → 185.199.109.153
- Host: @ → 185.199.110.153
- Host: @ → 185.199.111.153

CNAME Record (www):
- Host: www → iwjong.github.io

Ensure no conflicting DNS records remain.

## 5. Enable HTTPS

- In GitHub Pages settings, enable "Enforce HTTPS"

## 6. Deployment Workflow

All changes pushed to the configured branch are automatically deployed:

git add .
git commit -m "update"
git push origin main

## 7. Access

- https://iwjong.com
- https://www.iwjong.com

## Notes

- Do not include the full domain in the TXT record name
- Ensure an index.html file exists in the repository root
- DNS propagation may take up to 24 hours
