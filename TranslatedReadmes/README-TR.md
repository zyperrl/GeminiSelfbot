# GeminiSelfbot

Gemini Selfbot, Node.js ile yazılmış ve Discord için yapılmıştır.

## Çeviri
Çeviri [TheoEren](https://github.com/TheoEren) tarafından sağlanmıştır. 
[Orijinalini görün](https://github.com/zyperrl/GeminiSelfbot/blob/main/TranslatedReadmes/README-TR.md) [Diğer Çevirilere Göz Atın](https://github.com/zyperrl/GeminiSelfbot/blob/main/TranslatedReadmes/)

## Kurulum

[tr-TR.js](https://github.com/zyperrl/GeminiSelfbot/blob/main/tr-TR.js) dosyasına göz atın, içeriğini kopyalayın ve “main.js” adında bir dosya oluşturun. Ardından kodun içindeki Discord token’ınızı ve Gemini API anahtarınızı kendi bilgilerinizle değiştirin. Son olarak scripti çalıştırın.

## Diğer Diller İçin

Gemini Selfbot’u başka bir dilde kullanmak istiyorsanız, **tr-TR.js** dosyasını temel alarak yeni bir dil dosyası oluşturarak katkıda bulunabilirsiniz.

1. **tr-TR.js** dosyasını kopyalayın ve dil koduna göre yeniden adlandırın (örneğin, `en-US.js`, `es-ES.js`, `de-DE.js` vb.).
2. Dosya içindeki tüm metinleri aynı yapı ve anahtarları koruyarak çevirin.
3. Yeni dil dosyanızı depo (repository)’ya **pull request** olarak gönderin.

Katkınız, Gemini Selfbot’un dünya genelinde daha fazla kullanıcıya ulaşmasına yardımcı olacaktır!

## Proje Yapısı

```structure
GeminiSelfbot/
│
├─ node_modules/
├─ package.json
├─ package-lock.json
└─ main.js
```

## Paket Kurulumu

JavaScript kodu, gerekli paketlerin yüklü olup olmadığını otomatik olarak kontrol eder ve eksikse yükler.
Ancak manuel kurulum yapmak isterseniz şu komutu çalıştırabilirsiniz:

```bash
npm i chalk discord.js-selfbot-v13 debug
```

## Deepseek, ChatGPT vb. Selfbot

Şşş! Çok yakında geliyor...
