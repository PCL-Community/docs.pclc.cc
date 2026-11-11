#!/usr/bin/env bash

cat > ~/.npmrc <<'EOF'
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
EOF

pnpm install
