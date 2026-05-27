# SITE VETOR — CLAUDE.md

## Puppeteer (Screenshots)

Instalado em: `C:\Users\User\AppData\Local\Temp\puppeteer-test\`

### Tirar screenshot de uma URL

```powershell
node "C:\Users\User\AppData\Local\Temp\puppeteer-test\screenshot.js" <URL> <arquivo-saida.png>
```

**Exemplos:**

```powershell
# Servidor local na porta 3000
node "C:\Users\User\AppData\Local\Temp\puppeteer-test\screenshot.js" http://localhost:3000 screenshot.png

# Página específica
node "C:\Users\User\AppData\Local\Temp\puppeteer-test\screenshot.js" http://localhost:3000/contato contato.png
```

O screenshot é salvo no diretório de onde o comando for executado, a menos que um caminho absoluto seja especificado no segundo argumento.
