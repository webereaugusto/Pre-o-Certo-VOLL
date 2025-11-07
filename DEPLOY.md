# Guia de Deploy - PCI Preço Certo Inteligente

## Opções de Hospedagem Gratuita

### 1. Vercel (Recomendado) ⭐

**Por que Vercel?**
- Deploy automático em segundos
- SSL gratuito
- CDN global
- Perfeito para React + Vite
- Zero configuração necessária

**Passos:**

1. Crie uma conta em: https://vercel.com
2. Instale o Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Faça login:
   ```bash
   vercel login
   ```
4. Deploy (dentro da pasta do projeto):
   ```bash
   vercel
   ```
5. Para produção:
   ```bash
   vercel --prod
   ```

**Via GitHub (mais fácil):**
1. Faça push do código para um repositório GitHub
2. Entre em https://vercel.com/new
3. Conecte seu repositório GitHub
4. Clique em "Deploy" (detecção automática de Vite)
5. Pronto! Seu app estará no ar

**Configurações detectadas automaticamente:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### 2. Netlify

**Passos:**

1. Crie uma conta em: https://netlify.com
2. Instale o Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
3. Faça login:
   ```bash
   netlify login
   ```
4. Deploy:
   ```bash
   netlify deploy --prod
   ```

**Via GitHub:**
1. Push para GitHub
2. Em https://app.netlify.com, clique em "New site from Git"
3. Conecte o repositório
4. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy!

---

### 3. Render

**Passos:**

1. Crie uma conta em: https://render.com
2. Clique em "New Static Site"
3. Conecte seu repositório GitHub
4. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `dist`
5. Deploy automático

---

### 4. GitHub Pages

**Passos:**

1. Instale gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Adicione no `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   },
   "homepage": "https://SEU-USUARIO.github.io/Pre-o-Certo-VOLL"
   ```

3. Ajuste `vite.config.ts` (adicione base):
   ```typescript
   export default defineConfig({
     base: '/Pre-o-Certo-VOLL/',
     // ... resto da config
   })
   ```

4. Deploy:
   ```bash
   npm run deploy
   ```

---

## Antes de Publicar

### Teste o Build Local

```bash
npm run build
npm run preview
```

### Checklist

- [ ] Código commitado no Git
- [ ] Dependências instaladas
- [ ] Build funcionando localmente
- [ ] Arquivo .env.local NÃO commitado (já está no .gitignore)
- [ ] README atualizado

---

## Variáveis de Ambiente

Este projeto não requer variáveis de ambiente para funcionar.

A `GEMINI_API_KEY` está configurada no `vite.config.ts` mas não é usada no código atual.

---

## Monitoramento Pós-Deploy

Após o deploy, teste:
1. Todos os formulários funcionando
2. Cálculos exibidos corretamente
3. Exportação de PDF funcionando
4. Responsividade em mobile
5. Tooltips funcionando

---

## URLs de Exemplo

- Vercel: `https://preco-certo-voll.vercel.app`
- Netlify: `https://preco-certo-voll.netlify.app`
- Render: `https://preco-certo-voll.onrender.com`
- GitHub Pages: `https://webereaugusto.github.io/Pre-o-Certo-VOLL`

---

## Domínio Personalizado

Todas as plataformas acima permitem adicionar domínio personalizado gratuitamente.

Basta adicionar um registro CNAME no seu provedor de domínio apontando para o URL fornecido pela plataforma.

