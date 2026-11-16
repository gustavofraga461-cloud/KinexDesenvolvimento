# MORUMBA LANCHES — versão funcional local (Kinex Desenvolvimento)

Aplicativo de demonstração em React + Vite + Capacitor, com área do cliente e painel administrativo no mesmo APK.

## Funções implementadas

- Cardápio com categorias, busca, imagens e preços.
- Carrinho, quantidades, modalidade entrega/retirada e dados do cliente.
- Registro local de pedidos com número, itens, total, forma de pagamento e status.
- Painel administrativo protegido por senha de demonstração.
- Consulta de pedidos e atualização de status.
- Cadastro, edição e exclusão de produtos.
- Botão para preparar e encaminhar o pedido pelo WhatsApp da lanchonete (19) 99262-5518.
- Produtos e pedidos gravados no armazenamento local do aplicativo (localStorage).

## Acesso ao painel

Toque em **Painel** na barra superior do cardápio. Senha inicial de demonstração: `1234`. Esta senha está fixa no código (`adminPassword === '1234'`) e deve ser alterada antes de qualquer entrega. Não use esta versão para armazenar dados pessoais reais ou operar uma loja em produção.

## Limitações importantes desta versão

- Não há banco de dados ou sincronização entre aparelhos. Pedidos e alterações de produtos existem somente no aparelho onde foram registrados.
- O WhatsApp é aberto com o pedido formatado; o usuário ainda precisa confirmar o envio na conversa.
- PIX e cartão são apenas demonstrativos: não existe cobrança, QR Code válido nem confirmação financeira. Não realizar pagamentos usando o código exibido.
- A taxa de entrega permanece R$ 0,00 porque o estabelecimento ainda não informou o valor.
- Preços de alguns pastéis salgados e sucos foram fornecidos como faixa; confirmar os valores finais com a lanchonete.
- O armazenamento local pode ser apagado se os dados do aplicativo forem limpos ou se o app for desinstalado.

## Atualizar o projeto existente pelo Termux

1. Baixe o ZIP atualizado e extraia por cima da pasta `~/kinex-pizzaria-demo`, mantendo a pasta oculta `.git`.
2. Execute:

```bash
cd ~/kinex-pizzaria-demo
git add .
git commit -m "Adiciona painel local e pedidos funcionais"
git branch -M main
git push -u origin main
```

3. Acesse GitHub Actions e aguarde a compilação. O artefato terá o nome `Morumba-Lanches-Funcional-APK`.

## Build local web

```bash
npm install
npm run build
```

Para compilar Android localmente é necessário Android SDK/Java configurados. O fluxo recomendado deste projeto é o GitHub Actions.
