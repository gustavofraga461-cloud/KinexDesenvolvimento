# Morumba Lanches — Cardápio Digital de Demonstração

Aplicativo de demonstração personalizado com o cardápio informado pelo MORUMBA LANCHES. Desenvolvido pela Kinex Desenvolvimento.

## Observações importantes

- Os preços de pastéis salgados e sucos foram informados como faixas; o aplicativo exibe um valor inicial de referência e avisa para confirmar o preço do sabor.
- A taxa de entrega não foi informada e aparece como “a combinar”.
- PIX e cartão são apenas demonstrativos. Não faça pagamentos pelo código de teste e não informe dados reais de cartão.
- O pedido ainda não é gravado em um banco de dados nem enviado automaticamente ao WhatsApp. O contato da lanchonete está disponível no cabeçalho.

## Atualizar o projeto já enviado ao GitHub pelo Termux

1. Baixe o ZIP atualizado e extraia os arquivos por cima da pasta `~/kinex-pizzaria-demo`, sem apagar a pasta oculta `.git`.
2. No Termux: `cd ~/kinex-pizzaria-demo`
3. Execute `git add .`
4. Execute `git commit -m "Personaliza cardapio Morumba Lanches"`
5. Execute `git push`
6. Abra o GitHub Actions e aguarde a nova compilação.

O APK de demonstração/debug pode ser instalado em um Android para apresentação. Para distribuição pública, será necessário preparar uma versão assinada de release.
