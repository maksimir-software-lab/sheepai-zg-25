#!/bin/bash
set -e

echo "bun: Authenticating..."
bun neonctl auth

echo "bun: Setting Project ID..."
bun neon set-context --org-id org-calm-tree-21298941 --project-id still-feather-17014830

echo "✅ Setup complete."