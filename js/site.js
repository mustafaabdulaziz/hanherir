/* İletişim — marka panosundan. Telefon ve e-postayı buradan değiştirin. */
var CONTACT = {
  phoneDisplay: "+90 212 555 19 55",
  phoneTel: "+902125551955",
  wa: "902125551955",
  email: "info@khanalharir.com",
  instagram: "https://instagram.com/khanalharir",
  instagramHandle: "@khanalharir"
};

/*
  ŞUBELER
  Sokak adresini address alanına yazın. map, haritada aranacak tam adrestir.
*/
var BRANCHES = [
  {
    name: { ar: "الفرع الرئيسي", tr: "Merkez Şube", en: "Main Branch" },
    address: { ar: "إسطنبول، تركيا", tr: "İstanbul, Türkiye", en: "Istanbul, Turkey" },
    hours: { ar: "بموعد مسبق", tr: "Randevu ile", en: "By appointment" },
    phone: "+90 212 555 19 55",
    phoneTel: "+902125551955",
    map: "Istanbul, Turkey",
    photo: "photos/IMG_6478.JPG"
  },
  {
    name: { ar: "الفرع الثاني", tr: "2. Şube", en: "Branch 2" },
    address: { ar: "إسطنبول، تركيا", tr: "İstanbul, Türkiye", en: "Istanbul, Turkey" },
    hours: { ar: "بموعد مسبق", tr: "Randevu ile", en: "By appointment" },
    phone: "+90 212 555 19 55",
    phoneTel: "+902125551955",
    map: "Istanbul, Turkey",
    photo: "photos/IMG_6485.JPG"
  },
  {
    name: { ar: "الفرع الثالث", tr: "3. Şube", en: "Branch 3" },
    address: { ar: "إسطنبول، تركيا", tr: "İstanbul, Türkiye", en: "Istanbul, Turkey" },
    hours: { ar: "بموعد مسبق", tr: "Randevu ile", en: "By appointment" },
    phone: "+90 212 555 19 55",
    phoneTel: "+902125551955",
    map: "Istanbul, Turkey",
    photo: "photos/IMG_6491.JPG"
  },
  {
    name: { ar: "الفرع الرابع", tr: "4. Şube", en: "Branch 4" },
    address: { ar: "إسطنبول، تركيا", tr: "İstanbul, Türkiye", en: "Istanbul, Turkey" },
    hours: { ar: "بموعد مسبق", tr: "Randevu ile", en: "By appointment" },
    phone: "+90 212 555 19 55",
    phoneTel: "+902125551955",
    map: "Istanbul, Turkey",
    photo: "photos/IMG_6474.JPG"
  }
];

var CATEGORY = {
  6462: "iran", 6463: "iran", 6464: "iran", 6465: "iran", 6466: "iran", 6467: "iran",
  6468: "turkish", 6469: "turkish", 6470: "turkish", 6471: "turkish", 6472: "turkish",
  6473: "classic", 6474: "iran", 6475: "classic", 6476: "turkish", 6477: "iran",
  6478: "iran", 6479: "iran", 6480: "iran", 6481: "turkish", 6482: "turkish",
  6483: "turkish", 6484: "modern", 6485: "modern", 6486: "turkish", 6487: "modern",
  6488: "modern", 6489: "classic", 6490: "iran", 6491: "turkish", 6492: "modern",
  6493: "classic", 6494: "modern", 6495: "classic", 6496: "modern", 6497: "modern",
  6498: "classic", 6499: "iran"
};

var I18N = {
  ar: {
    "meta.title": "خان الحرير للسجاد | إسطنبول",
    "meta.desc": "خان الحرير: سجاد كلاسيكي، عصري، تركي وإيراني. الفروع والعنوان في إسطنبول.",
    "skip": "تخطي إلى المحتوى",
    "brand.name": "خان الحرير",
    "brand.sub": "للسجاد",
    "nav.label": "أقسام الموقع",
    "nav.home": "الرئيسية",
    "nav.categories": "التصنيفات",
    "nav.gallery": "الصور",
    "nav.branches": "الفروع",
    "nav.contact": "تواصل",
    "nav.open": "فتح القائمة",
    "nav.close": "إغلاق القائمة",
    "lang.label": "اللغة",
    "hero.kicker": "إسطنبول",
    "hero.title": "أربع مجموعات، تحت سقف واحد.",
    "hero.lead": "كلاسيكي، عصري، تركي وإيراني. افتحوا أي تصنيف لتروا صوره وحدها.",
    "hero.cta1": "التصنيفات",
    "hero.cta2": "الفروع والعنوان",
    "hero.photoAlt": "سجادة زرقاء في صالة معاصرة",
    "hero.stat1": "صورة",
    "hero.stat2": "تصنيفات",
    "hero.stat3": "فروع",
    "cat.kicker": "التصنيفات",
    "cat.title": "اختاروا النوع، ثم الصور.",
    "cat.lead": "كل بطاقة تفتح صور تلك المجموعة فقط.",
    "cat.open": "عرض الصور",
    "cat.classic": "السجاد الكلاسيكي",
    "cat.modern": "السجاد العصري",
    "cat.turkish": "السجاد التركي",
    "cat.iran": "السجاد الإيراني",
    "gallery.kicker": "الصور",
    "gallery.title": "كل الصور",
    "gallery.filters": "تصفية الصور",
    "gallery.all": "الكل",
    "gallery.count": "{n} صورة",
    "gallery.more": "عرض {n} صورة أخرى",
    "gallery.open": "فتح الصورة",
    "branch.kicker": "الفروع",
    "branch.title": "شُعبنا، العنوان والموقع.",
    "branch.lead": "أربعة فروع. اختاروا فرعاً لتروا عنوانه على الخريطة.",
    "branch.show": "اعرض على الخريطة",
    "branch.address": "العنوان",
    "branch.phone": "الهاتف",
    "branch.hours": "الزيارة",
    "branch.directions": "الاتجاهات",
    "branch.mapTitle": "خريطة الفرع",
    "contact.kicker": "تواصل",
    "contact.title": "اكتبوا المقاس والنوع.",
    "contact.lead": "كلاسيكي، عصري، تركي أو إيراني. نرد من المجموعة نفسها.",
    "contact.phone": "الهاتف",
    "contact.email": "البريد",
    "contact.ig": "إنستغرام",
    "form.name": "الاسم",
    "form.phone": "الهاتف",
    "form.message": "الرسالة",
    "form.namePh": "اسمكم",
    "form.phonePh": "رقم يمكن الاتصال به",
    "form.messagePh": "التصنيف، المقاس، أو لون الغرفة",
    "form.submit": "أرسل عبر واتساب",
    "form.need": "اكتبوا الاسم والرسالة.",
    "form.sent": "فُتحت رسالة واتساب. إن لم تظهر، استخدموا الرقم في الصفحة.",
    "form.waIntro": "طلب عبر موقع خان الحرير",
    "form.waHello": "السلام عليكم، أود الاستفسار عن السجاد.",
    "footer.tag": "سجاد في إسطنبول",
    "footer.rights": "جميع الحقوق محفوظة",
    "lb.close": "إغلاق",
    "lb.prev": "السابق",
    "lb.next": "التالي",
    "wa.label": "تواصل عبر واتساب"
  },
  tr: {
    "meta.title": "Khan Al Harir Halı | İstanbul",
    "meta.desc": "Khan Al Harir: klasik, modern, Türk ve İran halıları. Şubeler ve adres İstanbul'da.",
    "skip": "İçeriğe geç",
    "brand.name": "Khan Al Harir",
    "brand.sub": "Halı",
    "nav.label": "Site bölümleri",
    "nav.home": "Ana Sayfa",
    "nav.categories": "Kategoriler",
    "nav.gallery": "Fotoğraflar",
    "nav.branches": "Şubelerimiz",
    "nav.contact": "İletişim",
    "nav.open": "Menüyü aç",
    "nav.close": "Menüyü kapat",
    "lang.label": "Dil",
    "hero.kicker": "İstanbul",
    "hero.title": "Dört koleksiyon, tek çatı.",
    "hero.lead": "Klasik, modern, Türk ve İran halısı. Bir kategoriye girince yalnız onun fotoğrafları açılır.",
    "hero.cta1": "Kategoriler",
    "hero.cta2": "Şubeler ve adres",
    "hero.photoAlt": "Çağdaş bir salonda mavi halı",
    "hero.stat1": "fotoğraf",
    "hero.stat2": "kategori",
    "hero.stat3": "şube",
    "cat.kicker": "Kategoriler",
    "cat.title": "Türü seçin, fotoğrafları görün.",
    "cat.lead": "Her kart yalnızca o grubun fotoğraflarını açar.",
    "cat.open": "Fotoğrafları gör",
    "cat.classic": "Klasik halı",
    "cat.modern": "Modern halı",
    "cat.turkish": "Türk halısı",
    "cat.iran": "İran halısı",
    "gallery.kicker": "Fotoğraflar",
    "gallery.title": "Tüm fotoğraflar",
    "gallery.filters": "Fotoğrafları süz",
    "gallery.all": "Tümü",
    "gallery.count": "{n} fotoğraf",
    "gallery.more": "{n} fotoğraf daha göster",
    "gallery.open": "Fotoğrafı aç",
    "branch.kicker": "Şubelerimiz",
    "branch.title": "Konum ve adres.",
    "branch.lead": "Dört şube. Birini seçin, harita o adrese gider.",
    "branch.show": "Haritada göster",
    "branch.address": "Adres",
    "branch.phone": "Telefon",
    "branch.hours": "Ziyaret",
    "branch.directions": "Yol tarifi",
    "branch.mapTitle": "Şube haritası",
    "contact.kicker": "İletişim",
    "contact.title": "Ölçüyü ve türü yazın.",
    "contact.lead": "Klasik, modern, Türk veya İran. Aynı gruptan dönüş yaparız.",
    "contact.phone": "Telefon",
    "contact.email": "E-posta",
    "contact.ig": "Instagram",
    "form.name": "Ad",
    "form.phone": "Telefon",
    "form.message": "Mesaj",
    "form.namePh": "Adınız",
    "form.phonePh": "Ulaşabileceğimiz numara",
    "form.messagePh": "Kategori, ölçü ya da odanın rengi",
    "form.submit": "WhatsApp ile gönder",
    "form.need": "Adınızı ve mesajınızı yazın.",
    "form.sent": "WhatsApp mesajı açıldı. Açılmazsa sayfadaki numarayı kullanın.",
    "form.waIntro": "Khan Al Harir sitesinden talep",
    "form.waHello": "Merhaba, halılar hakkında bilgi almak istiyorum.",
    "footer.tag": "İstanbul'da halı",
    "footer.rights": "Tüm hakları saklıdır",
    "lb.close": "Kapat",
    "lb.prev": "Önceki",
    "lb.next": "Sonraki",
    "wa.label": "WhatsApp ile yazın"
  },
  en: {
    "meta.title": "Khan Al Harir Carpets | Istanbul",
    "meta.desc": "Khan Al Harir: classic, modern, Turkish and Iranian carpets. Branches and address in Istanbul.",
    "skip": "Skip to content",
    "brand.name": "Khan Al Harir",
    "brand.sub": "Carpets",
    "nav.label": "Site sections",
    "nav.home": "Home",
    "nav.categories": "Categories",
    "nav.gallery": "Photos",
    "nav.branches": "Branches",
    "nav.contact": "Contact",
    "nav.open": "Open menu",
    "nav.close": "Close menu",
    "lang.label": "Language",
    "hero.kicker": "Istanbul",
    "hero.title": "Four collections, one house.",
    "hero.lead": "Classic, modern, Turkish and Iranian. Open a category to see only its photographs.",
    "hero.cta1": "Categories",
    "hero.cta2": "Branches and address",
    "hero.photoAlt": "A blue carpet in a contemporary room",
    "hero.stat1": "photographs",
    "hero.stat2": "categories",
    "hero.stat3": "branches",
    "cat.kicker": "Categories",
    "cat.title": "Choose a type, then the photos.",
    "cat.lead": "Each card opens only that group's photographs.",
    "cat.open": "View photos",
    "cat.classic": "Classic carpets",
    "cat.modern": "Modern carpets",
    "cat.turkish": "Turkish carpets",
    "cat.iran": "Iranian carpets",
    "gallery.kicker": "Photos",
    "gallery.title": "All photographs",
    "gallery.filters": "Filter photographs",
    "gallery.all": "All",
    "gallery.count": "{n} photographs",
    "gallery.more": "Show {n} more",
    "gallery.open": "Open photograph",
    "branch.kicker": "Branches",
    "branch.title": "Location and address.",
    "branch.lead": "Four branches. Choose one and the map moves to that address.",
    "branch.show": "Show on the map",
    "branch.address": "Address",
    "branch.phone": "Phone",
    "branch.hours": "Visits",
    "branch.directions": "Directions",
    "branch.mapTitle": "Branch map",
    "contact.kicker": "Contact",
    "contact.title": "Send the size and the type.",
    "contact.lead": "Classic, modern, Turkish or Iranian. We reply from that same group.",
    "contact.phone": "Phone",
    "contact.email": "Email",
    "contact.ig": "Instagram",
    "form.name": "Name",
    "form.phone": "Phone",
    "form.message": "Message",
    "form.namePh": "Your name",
    "form.phonePh": "A number we can reach",
    "form.messagePh": "The category, the size, or the room's color",
    "form.submit": "Send via WhatsApp",
    "form.need": "Please add your name and a message.",
    "form.sent": "A WhatsApp message was opened. If it did not appear, use the number on this page.",
    "form.waIntro": "Request from the Khan Al Harir website",
    "form.waHello": "Hello, I would like to ask about the carpets.",
    "footer.tag": "Carpets in Istanbul",
    "footer.rights": "All rights reserved",
    "lb.close": "Close",
    "lb.prev": "Previous",
    "lb.next": "Next",
    "wa.label": "Message on WhatsApp"
  }
};

var photos = [];
for (var n = 6462; n <= 6499; n++) {
  photos.push({
    src: "photos/IMG_" + n + ".JPG",
    cat: CATEGORY[n] || "classic"
  });
}

var lang = document.documentElement.lang || "ar";
if (!I18N[lang]) lang = "ar";
var filter = "all";
var lbIndex = 0;
var lastFocus = null;
var activeBranch = 0;
var PREVIEW = 12;
var showAll = false;

function t(key) {
  var pack = I18N[lang] || I18N.ar;
  return pack[key] || I18N.ar[key] || key;
}

function currentList() {
  return photos.filter(function (p) {
    return filter === "all" || p.cat === filter;
  });
}

function applyContact() {
  document.querySelectorAll("[data-contact='phone']").forEach(function (el) {
    el.textContent = CONTACT.phoneDisplay;
    el.setAttribute("href", "tel:" + CONTACT.phoneTel);
  });
  document.querySelectorAll("[data-contact='email']").forEach(function (el) {
    el.textContent = CONTACT.email;
    el.setAttribute("href", "mailto:" + CONTACT.email);
  });
  document.querySelectorAll("[data-contact='instagram']").forEach(function (el) {
    el.textContent = CONTACT.instagramHandle;
    el.setAttribute("href", CONTACT.instagram);
  });
  var wa = document.querySelector(".whatsapp");
  if (wa) wa.href = "https://wa.me/" + CONTACT.wa + "?text=" + encodeURIComponent(t("form.waHello"));
}

function galleryHeading() {
  var title = document.getElementById("galleryTitle");
  if (!title) return;
  title.textContent = filter === "all" ? t("gallery.title") : t("cat." + filter);
}

function syncFilters() {
  document.querySelectorAll("[data-filter]").forEach(function (b) {
    var on = b.getAttribute("data-filter") === filter;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  document.querySelectorAll(".cat-card").forEach(function (card) {
    card.classList.toggle("is-active", card.getAttribute("data-cat") === filter);
  });
  galleryHeading();
}

function setFilter(name, scroll) {
  filter = name;
  syncFilters();
  renderGallery();
  if (scroll) {
    var target = document.getElementById("gallery");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function renderGallery() {
  var grid = document.getElementById("galleryGrid");
  if (!grid) return;
  var list = currentList();
  var limit = showAll || filter !== "all" ? list.length : PREVIEW;
  grid.innerHTML = "";
  list.slice(0, limit).forEach(function (p, i) {
    var fig = document.createElement("figure");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "shot";
    btn.addEventListener("click", function () { openLightbox(i); });
    var img = document.createElement("img");
    img.src = p.src;
    img.alt = t("cat." + p.cat);
    img.loading = i < 4 ? "eager" : "lazy";
    img.decoding = "async";
    var cap = document.createElement("figcaption");
    cap.textContent = t("cat." + p.cat);
    btn.setAttribute("aria-label", t("gallery.open") + ": " + t("cat." + p.cat));
    btn.appendChild(img);
    fig.appendChild(btn);
    fig.appendChild(cap);
    grid.appendChild(fig);
  });
  var count = document.querySelector("[data-count]");
  if (count) count.textContent = t("gallery.count").replace("{n}", String(list.length));
  var more = document.getElementById("galleryMore");
  if (more) {
    more.hidden = limit >= list.length;
    more.querySelector("span").textContent = t("gallery.more").replace("{n}", String(list.length - limit));
  }
  document.querySelectorAll("[data-cat-count]").forEach(function (el) {
    var cat = el.getAttribute("data-cat-count");
    var n = photos.filter(function (p) { return p.cat === cat; }).length;
    el.textContent = t("gallery.count").replace("{n}", String(n));
  });
}

function mapSrc(branch) {
  if (!branch) return "";
  if (branch.map_url && (branch.map_url.indexOf("output=embed") !== -1 || branch.map_url.indexOf("/embed") !== -1)) {
    return branch.map_url;
  }
  var q = (branch.map && branch.map.indexOf("http") !== 0 ? branch.map : null) || (branch.address && (branch.address.tr || branch.address.en || branch.address.ar)) || "Istanbul, Turkey";
  return "https://maps.google.com/maps?q=" + encodeURIComponent(q) + "&z=14&output=embed";
}

function selectBranch(index) {
  activeBranch = index;
  document.querySelectorAll(".branch-card").forEach(function (card, i) {
    var on = i === index;
    card.classList.toggle("is-active", on);
    card.setAttribute("aria-pressed", on ? "true" : "false");
  });
  var frame = document.getElementById("branchMap");
  var branch = BRANCHES[index];
  if (frame && branch) {
    var next = mapSrc(branch);
    if (frame.getAttribute("src") !== next) frame.src = next;
  }
}

function renderBranches() {
  var list = document.getElementById("branchList");
  var frame = document.getElementById("branchMap");
  if (!list) return;
  list.innerHTML = "";
  BRANCHES.forEach(function (branch, index) {
    var card = document.createElement("article");
    card.className = "branch-card" + (index === activeBranch ? " is-active" : "");
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", index === activeBranch ? "true" : "false");
    var photo = document.createElement("img");
    photo.className = "branch-photo";
    photo.src = branch.photo;
    photo.alt = "";
    var body = document.createElement("div");
    body.className = "branch-body";
    var num = document.createElement("span");
    num.className = "branch-no";
    num.textContent = "0" + (index + 1);
    var name = document.createElement("h3");
    name.textContent = branch.name[lang] || branch.name.tr;
    var addressLabel = document.createElement("span");
    addressLabel.className = "branch-label";
    addressLabel.textContent = t("branch.address");
    var address = document.createElement("p");
    address.className = "branch-address";
    address.textContent = branch.address[lang] || branch.address.tr;
    var hours = document.createElement("p");
    hours.className = "branch-hours";
    hours.textContent = branch.hours[lang] || branch.hours.tr;
    var phone = document.createElement("a");
    phone.dir = "ltr";
    phone.href = "tel:" + branch.phoneTel;
    phone.textContent = branch.phone;
    var directions = document.createElement("a");
    var dirUrl = (branch.map_url && branch.map_url.indexOf("http") === 0)
      ? branch.map_url
      : (branch.map && branch.map.indexOf("http") === 0)
        ? branch.map
        : "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(branch.map || "Istanbul, Turkey");
    directions.href = dirUrl;
    directions.target = "_blank";
    directions.rel = "noopener";
    directions.textContent = t("branch.directions");
    var media = document.createElement("div");
    media.className = "branch-media";
    media.appendChild(photo);
    media.appendChild(num);
    body.appendChild(name);
    body.appendChild(addressLabel);
    body.appendChild(address);
    body.appendChild(hours);
    body.appendChild(phone);
    body.appendChild(directions);
    card.appendChild(media);
    card.appendChild(body);
    card.addEventListener("click", function (e) {
      if (e.target.closest("a")) return;
      selectBranch(index);
    });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectBranch(index);
      }
    });
    list.appendChild(card);
  });
  var current = BRANCHES[activeBranch] || BRANCHES[0];
  if (frame && current) {
    frame.title = t("branch.mapTitle");
    var next = mapSrc(current.map);
    if (frame.getAttribute("src") !== next) frame.src = next;
  }
}

function applyLanguage(next) {
  if (!I18N[next]) next = "ar";
  lang = next;
  try { localStorage.setItem("kh_lang", lang); } catch (e) {}
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = t("meta.title");
  var md = document.querySelector('meta[name="description"]');
  if (md) md.setAttribute("content", t("meta.desc"));
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = t(el.getAttribute("data-i18n"));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });
  document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
    el.alt = t(el.getAttribute("data-i18n-alt"));
  });
  document.querySelectorAll("[data-i18n-title]").forEach(function (el) {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
  document.querySelectorAll(".lang").forEach(function (btn) {
    var on = btn.getAttribute("data-lang") === lang;
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.classList.toggle("is-active", on);
  });
  applyContact();
  syncMenuLabel();
  syncFilters();
  renderGallery();
  renderBranches();
  var lb = document.getElementById("lightbox");
  if (lb && !lb.hidden) showSlide();
}

function openLightbox(i) {
  lbIndex = i;
  lastFocus = document.activeElement;
  var lb = document.getElementById("lightbox");
  lb.hidden = false;
  document.body.classList.add("no-scroll", "lb-open");
  showSlide();
  lb.querySelector(".lb-close").focus();
}

function closeLb() {
  var lb = document.getElementById("lightbox");
  lb.hidden = true;
  document.body.classList.remove("no-scroll", "lb-open");
  if (lastFocus && lastFocus.focus) lastFocus.focus();
}

function showSlide() {
  var list = currentList();
  if (!list.length) return;
  if (lbIndex < 0) lbIndex = list.length - 1;
  if (lbIndex >= list.length) lbIndex = 0;
  var p = list[lbIndex];
  var img = document.getElementById("lbImg");
  img.src = p.src;
  img.alt = t("cat." + p.cat);
  document.getElementById("lbCap").textContent = t("cat." + p.cat);
  document.getElementById("lbCount").textContent = (lbIndex + 1) + " / " + list.length;
}

function shift(step) {
  lbIndex += step;
  showSlide();
}

function setMenu(open) {
  document.body.classList.toggle("nav-open", open);
  document.body.classList.toggle("no-scroll", open);
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  syncMenuLabel();
}

function syncMenuLabel() {
  var toggle = document.querySelector(".nav-toggle");
  if (!toggle) return;
  var open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-label", t(open ? "nav.close" : "nav.open"));
}

function init() {
  applyLanguage(lang);
  document.getElementById("year").textContent = String(new Date().getFullYear());

  document.querySelectorAll(".lang").forEach(function (btn) {
    btn.addEventListener("click", function () {
      applyLanguage(btn.getAttribute("data-lang"));
    });
  });

  document.querySelectorAll("[data-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      setFilter(btn.getAttribute("data-filter"), false);
    });
  });

  document.getElementById("galleryMore").addEventListener("click", function () {
    showAll = true;
    renderGallery();
  });

  document.querySelectorAll(".cat-card").forEach(function (card) {
    card.addEventListener("click", function () {
      setFilter(card.getAttribute("data-cat"), true);
    });
  });

  var toggle = document.querySelector(".nav-toggle");
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  document.querySelectorAll(".nav a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });

  var lb = document.getElementById("lightbox");
  lb.querySelector(".lb-close").addEventListener("click", closeLb);
  lb.querySelector(".lb-prev").addEventListener("click", function () { shift(-1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { shift(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });

  var touchX = null;
  lb.addEventListener("touchstart", function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (touchX == null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    var dir = document.documentElement.dir === "rtl" ? -1 : 1;
    if (dx < -40) shift(dir);
    else if (dx > 40) shift(-dir);
    touchX = null;
  }, { passive: true });

  document.addEventListener("keydown", function (e) {
    if (lb.hidden) {
      if (e.key === "Escape") setMenu(false);
      return;
    }
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") shift(document.documentElement.dir === "rtl" ? 1 : -1);
    if (e.key === "ArrowRight") shift(document.documentElement.dir === "rtl" ? -1 : 1);
  });

  var header = document.querySelector(".site-header");
  var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        document.querySelectorAll(".nav a").forEach(function (a) {
          var on = a.getAttribute("href") === "#" + entry.target.id;
          if (on) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });
    ["top", "categories", "gallery", "branches", "contact"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });

    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          revealObs.unobserve(entry.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      document.documentElement.classList.add("can-reveal");
      document.querySelectorAll(".reveal, .cat-card").forEach(function (el) { revealObs.observe(el); });
    }
  }

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setMenu(false);
  });

  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var form = e.currentTarget;
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    var message = form.message.value.trim();
    var note = document.getElementById("formNote");
    if (!name || !message) {
      note.textContent = t("form.need");
      note.className = "form-note is-error";
      return;
    }
    var lines = [
      t("form.waIntro"),
      t("form.name") + ": " + name,
      phone ? t("form.phone") + ": " + phone : "",
      t("form.message") + ": " + message
    ].filter(Boolean);
    window.open("https://wa.me/" + CONTACT.wa + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    note.textContent = t("form.sent");
    note.className = "form-note is-ok";
    form.reset();
  });
}

try { init(); }
finally { document.documentElement.classList.add("ready"); }
