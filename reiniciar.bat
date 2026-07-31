@echo off
REM ============================================================
REM  REINICIAR LIMPO — use este arquivo quando o site local
REM  estiver mostrando conteudo velho (textos que ja foram
REM  alterados mas nao aparecem na tela).
REM
REM  O que ele faz, na ordem:
REM    1. fecha o servidor que estiver rodando
REM    2. apaga a pasta .next (cache descartavel do Next.js)
REM    3. sobe o servidor de novo e abre o navegador
REM
REM  Para o dia a dia (sem problema de conteudo velho),
REM  continue usando o iniciar.bat, que e mais rapido.
REM ============================================================

cd /d "%~dp0"

echo.
echo [1/3] Fechando o servidor que estiver rodando...
REM Encerra o Node. Atencao: fecha tambem qualquer outro app Node
REM que esteja aberto nesta maquina (normalmente nao ha nenhum).
taskkill /F /IM node.exe >nul 2>&1
if errorlevel 1 (
  echo       Nenhum servidor estava rodando. Seguindo.
) else (
  echo       Servidor fechado.
)

echo.
echo [2/3] Apagando o cache ^(pasta .next^)...
if exist ".next" (
  rmdir /s /q ".next"
  echo       Cache apagado.
) else (
  echo       Nao havia cache para apagar.
)

echo.
echo [3/3] Subindo o servidor. A PRIMEIRA VEZ DEMORA 30-60 SEGUNDOS.
echo       Espere aparecer a linha "Ready in ..." abaixo.
echo       Quando o navegador abrir, aperte CTRL + SHIFT + R na pagina.
echo.

start "" http://localhost:3000
pnpm dev
