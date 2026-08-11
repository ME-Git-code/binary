# Qilingan o'zgarishlar

## 1. `firestore.rules` (YANGI FAYL)
Hozirgi qoidalaringiz "test mode" edi (2026-09-10 gacha hammaga ochiq).
Bu faylni Firebase Console'ga qo'llang:

1. https://console.firebase.google.com → loyihangiz (`binary-6`) → Firestore Database → Rules
2. Shu fayl ichidagi matnni to'liq nusxalab, mavjud qoidalar o'rniga joylashtiring
3. "Publish" tugmasini bosing

Bu qoidalar:
- Har kim kod orqali (`get`) rasmni o'qiy oladi (ilova shunday ishlaydi)
- Hech kim butun bazani ro'yxatga ololmaydi (`list: false`)
- Yozishda hujjat hajmi va maydonlari tekshiriladi (spam/zararli yozuvlarning oldi olinadi)
- O'chirish faqat "once" (bir martalik) rasmlar uchun ruxsat etiladi
- Hujjatni tahrirlash umuman taqiqlangan

## 2. `foto.js`
- `deleteMode` ("1 martalik" / "ko'p martalik") endi to'liq ishlaydi
- 6 xonali kod yaratilganda endi bazada band emasligi tekshiriladi (to'qnashuv oldini olish)
- Shifrlangan hajm 900KB dan oshsa, foydalanuvchiga aniq xabar chiqadi
- Yuklash/tiklash paytida tugmalar vaqtincha bloklanadi (ikki marta bosishning oldini olish)

## 3. `foto.html`
- Tugmalarga `id="encryptBtn"` va `id="decryptBtn"` qo'shildi (yuqoridagi bloklash uchun kerak)

## 4. `script.js` olib tashlandi
Bu fayl hech qaysi HTML sahifada ishlatilmagan (eski/dublikat versiya edi).
