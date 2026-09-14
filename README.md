# iOS27TR — Türkiye Takip

iOS 27 yeniliklerini Türkiye, dil ve cihaz desteğine göre takip eden statik site.

## Yerelde çalıştırma

```bash
python -m http.server 8080
```

Sonra `http://localhost:8080` adresini açın.

## Veri güncelleme

Ana veri kaynağı `data/features.json` dosyasıdır. Yeni iOS 27.x özellikleri geldikçe kartları ve zaman çizelgesini buradan güncelleyebilirsiniz.

## Otomatik resmi kaynak kontrolü

`.github/workflows/apple-watch.yml` her gün Apple'ın iOS Newsroom arşivini kontrol eder. Yeni iOS 27 bağlantıları bulunduğunda `data/apple_feed.json` dosyasını günceller. Bu akış **özellik durumunu otomatik yorumlamaz**; resmi duyuruyu yakalar. Türkiye/dil durumunu doğrulayıp `features.json` içine eklemek gerekir.

## Deploy

- GitHub Pages: statik olarak doğrudan yayınlanabilir.
- Vercel / Netlify: klasörü import etmek yeterlidir.

> Bağımsız takip sayfasıdır; Apple ile bağlantılı değildir.
