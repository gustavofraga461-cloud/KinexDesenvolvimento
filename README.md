# Kinex Desenvolvimento — Demo de Cardápio para Pizzaria

Aplicativo demonstrativo desenvolvido pela Kinex Desenvolvimento para apresentar a clientes um fluxo de cardápio, sacola, escolha de pagamento e confirmação de pedido.

> **Atenção:** o PIX e a confirmação do pedido são simulados. Este projeto não processa pagamentos reais nem envia pedidos para uma pizzaria.

## Gerar o APK pelo Termux usando GitHub Actions

1. Extraia este ZIP diretamente em uma pasta, por exemplo `~/kinex-pizzaria-demo`.
2. No Termux, entre na pasta do projeto:

```bash
cd ~/kinex-pizzaria-demo
pkg update -y
pkg install git -y
chmod +x push.sh
./push.sh
```

3. Quando solicitado, informe a URL HTTPS do seu repositório GitHub vazio (por exemplo, `https://github.com/SEU-USUARIO/kinex-pizzaria-demo.git`).
4. Se o GitHub pedir autenticação, use um método/token autorizado pelo GitHub; a senha normal da conta não funciona para `git push` por HTTPS.
5. No GitHub, abra **Actions** e aguarde o workflow **Build Android APK - Kinex Desenvolvimento** terminar.
6. Abra a execução concluída e baixe o artefato **Kinex-Desenvolvimento-Pizzaria-Demo-APK**. Dentro dele estará `app-debug.apk`.

O APK gerado é de demonstração/debug, adequado para instalar e apresentar em um aparelho Android. Para distribuição pública, será necessário preparar uma versão assinada de release.
