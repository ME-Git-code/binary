# Qilingan o'zgarishlar (2-bosqich)

## 1. Yangi: Sozlamalar sahifasi (`settings.html`, `settings.js`)
Navbardagi ⚙️ tugmasi orqali ochiladi. Ikkita sozlama bor:
- **🌙 Tungi rejim** — yoqilgan/o'chirilgan holatga qarab butun sayt qorong'i yoki
  yorug' fonga o'tadi (barcha sahifalarda saqlanadi, `localStorage` orqali).
- **📳 Vibratsiya** — tugmalar bosilganda telefon titrashini yoqadi/o'chiradi.

## 2. Yangi: umumiy `common.js`
Barcha sahifalarda ulangan. Tema, vibratsiya (`triggerHaptic()`), yordam oynasi
(`showHelp()`/`closeHelp()`) va umumiy `showToast()` funksiyalarini boshqaradi.
Har bir sahifadagi eski, alohida-alohida yozilgan `showToast()` funksiyalari olib
tashlandi — endi hammasi shu bitta joydan boshqariladi.

## 3. Yangi: yordam (❓) tugmasi har sahifada
Navbarning o'ng tomonida. Bosilganda o'sha sahifa nima qilishini qisqacha
tushuntiruvchi oyna ochiladi (to'liq qo'llanma emas, faqat asosiy g'oya).

## 4. Foto sahifasida: Galereya / Kamera orqali yuklash
Oldingi oddiy fayl tanlash o'rniga endi ikkita tugma bor:
- **🖼 Galereyadan** — telefon xotirasidagi rasmlar orasidan tanlash
- **📷 Kameradan** — to'g'ridan-to'g'ri kamerani ochib, rasmga tushirish
Rasm tanlangach, shifrlashdan oldin kichik preview (ko'rinish) chiqadi.

## 5. Vibratsiya butun saytga qo'shildi
Deyarli barcha tugmalar (tab almashtirish, nusxalash, tozalash, tarjima,
shifrlash/tiklash va h.k.) endi `triggerHaptic()` chaqiradi — lekin faqat
Sozlamalarda "Vibratsiya" yoqilgan bo'lsa ishlaydi.

## 6. To'liq mobil moslashtirish
- Barcha rang va o'lchamlar CSS o'zgaruvchilariga o'tkazildi (tungi/kunduzgi
  rejim shu orqali ishlaydi)
- `input`/`textarea`/`select` shrift hajmi 16px qilindi — iOS'da avtomatik
  zoom bo'lib ketishining oldi olindi
- Tugmalar minimal balandligi 40px+ ga chiqarildi (barmoq bilan bosish qulay
  bo'lishi uchun)
- Navbar kichik ekranlarda o'raladi (wrap), sozlamalar/yordam ikonkalari bilan
  birga chiroyli joylashadi
- Tarjimon sahifasida tillar tanlash bloki kichik ekranda ustma-ust (vertikal)
  joylashadi, almashtirish tugmasi aylantiriladi
- 480px va undan kichik ekranlar uchun alohida `@media` qoidalari qo'shildi

## Eslatma
Oldingi bosqichda qilingan xavfsizlik tuzatishlari (Firestore Rules, kod
to'qnashuvi tekshiruvi, hajm limiti, tugmalarni bloklash) o'zgarishsiz saqlanib
qoldi.
