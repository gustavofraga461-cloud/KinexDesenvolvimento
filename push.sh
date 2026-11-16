#!/usr/bin/env bash
set -e

echo "🚀 Kinex Desenvolvimento - Enviando projeto para o GitHub..."

if [ ! -d ".git" ]; then
  git init
  git branch -M main
  echo "👉 Cole a URL HTTPS do seu repositório GitHub vazio:"
  read -r REPO_URL
  if [ -z "$REPO_URL" ]; then
    echo "URL não informada."
    exit 1
  fi
  git remote add origin "$REPO_URL"
fi

# Identidade local usada somente para criar este commit.
git config user.name "Kinex Desenvolvimento"
git config user.email "kinex-build@users.noreply.github.com"

git branch -M main
git add .
echo "📝 Mensagem do commit (Enter para usar a padrão):"
read -r MSG
if [ -z "$MSG" ]; then
  MSG="Morumba Lanches - Atualização do cardápio"
fi

git commit -m "$MSG"
git push -u origin main

echo "✅ Código enviado. No GitHub, abra Actions e baixe o artefato quando a compilação terminar."
