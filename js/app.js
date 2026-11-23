/**
 * ============================================================================
 * ZAINI - Core JavaScript Application
 * Men's & Youth Streetwear E-Commerce Engine
 * Vanilla JS with HTML Escaping Security, Robust Egyptian Mobile Validation,
 * Central ZAINI_CONFIG, Live Order Totals, and Google Sheets Sync.
 * ============================================================================
 */

// ==========================================================================
// 1. Central Configuration
// ==========================================================================
const ZAINI_CONFIG = {
  // Merchant details
  merchantPhone: "01069236466",
  merchantWhatsApp: "201069236466", // International Egyptian format for wa.me

  // Demo Mode toggle: set to false when live for index, follow
  DEMO_MODE: false,

  // Ratings display toggle
  showRatings: true,

  // Google Sheets Integration
  googleSheets: {
    scriptURL: "", // Enter your deployed Google Apps Script URL here or in test_connection.html
    isEnabled: true
  }
};

// Backward-compatible alias
const LTB_CONFIG = ZAINI_CONFIG;

// ==========================================================================
// 2. Security & Arabic Localization Helpers
// ==========================================================================
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Convert Arabic-Indic digits (٠-٩) to Western Arabic digits (0-9)
function normalizeArabicIndicDigits(str) {
  if (!str) return "";
  const arabicIndic = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(str).replace(/[٠-٩]/g, d => arabicIndic.indexOf(d));
}

// Egyptian Mobile Validation: Starts with 010, 011, 012, or 015 followed by 8 digits (11 total)
function isValidEgyptianMobile(phone) {
  const normalized = normalizeArabicIndicDigits(phone).trim();
  return /^01[0125][0-9]{8}$/.test(normalized);
}

// Arabic Pluralization for Item Quantities (1 قطعة، 2 قطعتين، 3-10 قطع)
function formatQuantityArabic(qty) {
  const n = parseInt(qty, 10) || 1;
  if (n === 1) return "1 قطعة";
  if (n === 2) return "2 قطعتين";
  if (n >= 3 && n <= 10) return `${n} قطع`;
  return `${n} قطعة`;
}

// ==========================================================================
// 3. Initial Streetwear Products Catalog (Fallback & Standalone)
// ==========================================================================
const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "هودي أوفر سايز شتوي ميلتون ثقيل مبطن بشكير",
    category: "hoodies",
    categoryLabel: "هوديز وسويت شيرت",
    price: 499,
    oldPrice: 650,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    colors: ["أسود كربوني", "رمادي داكن", "بيج حجري", "كحلي ليل"],
    description: "قطن مصري 100% عالي الكثافة معالج ضد الانكماش والوبر ومناسب للأجواء الباردة."
  },
  {
    id: 2,
    name: "تيشيرت أوفر سايز دروب شولدر ستريت وير جرافيك",
    category: "oversized-tshirts",
    categoryLabel: "تيشيرتات وأوفر سايز",
    price: 340,
    oldPrice: 450,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["أسود", "أوف وايت", "زيتي كارجو"],
    description: "قصة دروب شولدر مريحة وخامة قطنية نقية 100% مناسبة لجميع الأوقات."
  },
  {
    id: 3,
    name: "بنطلون كارجو تكتيكال 6 جيوب جبردين تركي",
    category: "pants-cargo",
    categoryLabel: "بنطلونات وكارجو",
    price: 480,
    oldPrice: 620,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    sizes: ["30", "32", "34", "36", "38"],
    colors: ["أسود مطفي", "رمادي رصاصي", "زيتي ترابي", "كحلي"],
    description: "خامة جبردين متينة ومريحة مع جيوب جانبية واسعة ومظهر ستريت وير عصري."
  },
  {
    id: 4,
    name: "جاكيت بومبر خريفي شتوي ووتر بروف عازل للهواء",
    category: "jackets",
    categoryLabel: "جاكيتات وملابس شتوية",
    price: 690,
    oldPrice: 890,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["أسود ملكي", "زيتي غامق", "كحلي داكن"],
    description: "عازل تام للمطر والرياح مع بطانة داخلية خفيفة ودافئة وأزرار معدنية متينة."
  },
  {
    id: 5,
    name: "سويت شيرت راوند ستريت ستايل ميلتون ناعم",
    category: "hoodies",
    categoryLabel: "هوديز وسويت شيرت",
    price: 430,
    oldPrice: 550,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["رمادي ميرانج", "أسود", "زيتي ميتاليك"],
    description: "تصميم مينيمال مريح وخفيف، مثالي للجامعة والخروجات اليومية."
  },
  {
    id: 6,
    name: "قميص أوفر شيرت قطن تويل كاجوال للخروج",
    category: "casual-shirts",
    categoryLabel: "قمصان وشيرتات كاجوال",
    price: 450,
    oldPrice: 580,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["بيج كاكي", "رمادي فاتح", "أسود"],
    description: "خامة قطن تويل فاخرة يمكن ارتداؤها بمفردها أو مفتوحة فوق تيشيرت بيسيك."
  },
  {
    id: 7,
    name: "سويت بانتس أوفر سايز باجيز قطن بيور بجيوب عميقة",
    category: "pants-cargo",
    categoryLabel: "بنطلونات وكارجو",
    price: 390,
    oldPrice: 520,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
    sizes: ["M", "L", "XL", "XXL", "3XL"],
    colors: ["أسود", "رمادي داكن", "بيج ترابي"],
    description: "قطن مصري ناعم بقصة مريحة وأستك وسط قوي ومناسب للأحذية الرياضية والسنيكرز."
  },
  {
    id: 8,
    name: "كاب بيسبول مطرز ستريت وير فاخر قابل للتعديل",
    category: "accessories",
    categoryLabel: "إكسسوارات وسنيكرز",
    price: 180,
    oldPrice: 240,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    sizes: ["مقاس موحد قابل للتعديل"],
    colors: ["أسود", "كحلي", "بيج"],
    description: "قطن ثقيل وتطريز 3D عالي الدقة يمنحك مظهر ستريت وير متكامل."
  }
];

let PRODUCTS_DATA = [...DEFAULT_PRODUCTS];

// App State
let currentCategory = "all";
let selectedProductForOrder = null;
let lastFocusedElement = null;

// ==========================================================================
// 4. App Initialization
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initMerchantPhoneAndJsonLd();
  initWhatsAppLinks();
  initRobotsMeta();
  initDiscountConfig();
  initDemoRibbon();
  loadProductsFromSheet();
  setupCategoryTabs();
  setupModalEvents();
  setupMobileNav();
  setupOrderForm();
});

// ==========================================================================
// 5. Dynamic Products Fetcher from Google Sheets
// ==========================================================================
async function loadProductsFromSheet() {
  const scriptURL = ZAINI_CONFIG.googleSheets.scriptURL || 
    (typeof localStorage !== "undefined" && (localStorage.getItem("zaini_sheets_url") || localStorage.getItem("ltb_sheets_url")));

  if (!scriptURL) {
    renderProducts();
    initDiscountConfig();
    return;
  }

  const container = document.getElementById("productsGrid");
  if (container) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px;">
        <i class="fas fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--primary-accent); margin-bottom: 14px; display: inline-block;"></i>
        <p style="font-weight: 700; color: var(--dark); font-size: 1.05rem;">جاري مزامنة كولكشن ZAINI من شيت جوجل...</p>
      </div>
    `;
  }

  try {
    const res = await fetch(scriptURL);
    const data = await res.json();
    if (data && Array.isArray(data.products) && data.products.length > 0) {
      PRODUCTS_DATA = data.products;
    } else {
      // Keep defaults if sheet has no products yet
      PRODUCTS_DATA = [...DEFAULT_PRODUCTS];
    }
  } catch (err) {
    console.warn("Could not fetch products from Google Sheets, using defaults:", err);
    PRODUCTS_DATA = [...DEFAULT_PRODUCTS];
  } finally {
    renderProducts();
    initDiscountConfig();
  }
}

// ==========================================================================
// 6. Merchant Phone, JSON-LD Schema & Robots Setup
// ==========================================================================
function initMerchantPhoneAndJsonLd() {
  const phone = ZAINI_CONFIG.merchantPhone;

  // 1. Footer WhatsApp line
  document.querySelectorAll("[data-wa-phone-text]").forEach(el => {
    el.textContent = `واتساب: ${phone}`;
  });

  // 2. Footer Phone line
  document.querySelectorAll("[data-merchant-phone-text]").forEach(el => {
    el.textContent = `الهاتف: ${phone}`;
  });

  // 3. Dynamic JSON-LD telephone update
  const jsonLdScript = document.getElementById("zainiJsonLd") || document.getElementById("ltbJsonLd");
  if (jsonLdScript) {
    try {
      const schema = JSON.parse(jsonLdScript.textContent);
      schema.telephone = `+2${phone}`;
      jsonLdScript.textContent = JSON.stringify(schema, null, 2);
    } catch (e) {
      console.warn("Could not update JSON-LD telephone:", e);
    }
  }
}

function initRobotsMeta() {
  const robotsMeta = document.getElementById("metaRobots") || document.querySelector('meta[name="robots"]');
  if (robotsMeta) {
    robotsMeta.setAttribute("content", ZAINI_CONFIG.DEMO_MODE ? "noindex, nofollow" : "index, follow");
  }

  // Ensure any meta keywords tag is removed
  const keywordsTag = document.querySelector('meta[name="keywords"]');
  if (keywordsTag) {
    keywordsTag.remove();
  }
}

function initWhatsAppLinks() {
  const defaultText = encodeURIComponent("مرحباً ZAINI، أود الاستفسار عن كولكشن الملابس والأسعار المتاحة");
  const defaultUrl = `https://wa.me/${ZAINI_CONFIG.merchantWhatsApp}?text=${defaultText}`;

  document.querySelectorAll("[data-wa-link]").forEach(link => {
    const customText = link.getAttribute("data-wa-text");
    if (customText) {
      link.href = `https://wa.me/${ZAINI_CONFIG.merchantWhatsApp}?text=${encodeURIComponent(customText)}`;
    } else {
      link.href = defaultUrl;
    }
  });
}

// Compute the highest real discount percentage among PRODUCTS_DATA
function getHighestDiscountPercentage() {
  let maxDiscount = 0;
  PRODUCTS_DATA.forEach(p => {
    if (p.oldPrice && p.oldPrice > p.price) {
      const discount = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
      if (discount > maxDiscount) maxDiscount = discount;
    }
  });
  return maxDiscount || 25;
}

function initDiscountConfig() {
  const maxDiscount = getHighestDiscountPercentage();
  
  const topBarEl = document.querySelector("[data-cfg-discount-top]");
  if (topBarEl) {
    topBarEl.textContent = `🔥 عروض وخصومات حصرية على كولكشن الشتاء حتى ${maxDiscount}%`;
  }

  const heroBadgeVal = document.querySelector("[data-cfg-discount-val]");
  if (heroBadgeVal) {
    heroBadgeVal.textContent = `${maxDiscount}%`;
  }

  const promoBadgeEl = document.querySelector("[data-cfg-discount-promo]");
  if (promoBadgeEl) {
    promoBadgeEl.textContent = `${maxDiscount}%`;
  }
}

function initDemoRibbon() {
  const existingRibbon = document.getElementById("demoModeRibbon");
  if (ZAINI_CONFIG.DEMO_MODE) {
    if (!existingRibbon) {
      const ribbon = document.createElement("div");
      ribbon.id = "demoModeRibbon";
      ribbon.className = "demo-ribbon";
      ribbon.setAttribute("aria-hidden", "true");
      ribbon.textContent = "نسخة تجريبية";
      document.body.appendChild(ribbon);
    }
  } else if (existingRibbon) {
    existingRibbon.remove();
  }
}

// ==========================================================================
// 7. Dynamic Rating Stars Helper (Controlled by showRatings)
// ==========================================================================
function renderRatingStars(rating) {
  if (!ZAINI_CONFIG.showRatings || typeof rating !== "number" || rating <= 0) {
    return "";
  }

  const fullStars = Math.floor(rating);
  const remainder = rating - fullStars;
  const hasHalf = remainder >= 0.3 && remainder <= 0.8;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalf ? 1 : 0));

  let stars = "";
  for (let i = 0; i < fullStars; i++) {
    stars += `<i class="fas fa-star" aria-hidden="true"></i>`;
  }
  if (hasHalf) {
    stars += `<i class="fas fa-star-half-alt" aria-hidden="true"></i>`;
  }
  for (let i = 0; i < emptyStars; i++) {
    stars += `<i class="far fa-star" aria-hidden="true"></i>`;
  }

  return `
    <div class="product-rating" aria-label="التقييم: ${rating} من 5">
      ${stars}
      <span>(${rating})</span>
    </div>
  `;
}

// ==========================================================================
// 8. Products Rendering & Filtering (With Full HTML Escaping)
// ==========================================================================
function renderProducts() {
  const container = document.getElementById("productsGrid");
  if (!container) return;

  const filtered = currentCategory === "all" 
    ? PRODUCTS_DATA 
    : PRODUCTS_DATA.filter(p => p.category === currentCategory);

  if (filtered.length === 0) {
    if (PRODUCTS_DATA.length === 0) {
      container.innerHTML = `
        <div class="empty-products-state">
          <i class="fas fa-box-open" style="font-size: 3.5rem; color: var(--primary-accent); margin-bottom: 16px; display: inline-block;"></i>
          <h3>جاهز لإضافة تشكيلة منتجات ZAINI! 🛍️</h3>
          <p>يمكنك إضافة منتجاتك من شيت جوجل بسهولة لتظهر مباشرة لعملائك.</p>
          <a href="google_sheets/test_connection.html" target="_blank" class="btn-primary" style="margin-top: 10px; display: inline-flex; text-decoration: none;">
            <i class="fas fa-table"></i> فتح لوحة فحص وربط شيت جوجل
          </a>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px;">
          <i class="fas fa-box-open" style="font-size: 3rem; color: #BDC3C7; margin-bottom: 12px; display: inline-block;"></i>
          <p style="font-size: 1.1rem; color: #7F8C8D;">لا توجد منتجات حالياً في هذا القسم.</p>
        </div>
      `;
    }
    return;
  }

  container.innerHTML = filtered.map(product => {
    // Dynamic discount computation per product
    let discountBadgeHTML = "";
    if (product.oldPrice && product.oldPrice > product.price) {
      const discountPercent = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
      discountBadgeHTML = `<span class="badge-discount">خصم ${discountPercent}%</span>`;
    }

    // Escaped variables
    const safeId = Number(product.id);
    const safeName = escapeHTML(product.name);
    const safeCat = escapeHTML(product.categoryLabel);
    const safeImg = escapeHTML(product.image);
    const safePrice = Number(product.price);
    const safeOldPrice = Number(product.oldPrice || 0);
    const ratingHTML = renderRatingStars(product.rating);

    // Sizes display
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const displayedSizes = sizes.slice(0, 4).map(s => `<span class="size-chip">${escapeHTML(s)}</span>`).join('');
    const extraSizesBadge = sizes.length > 4 ? `<span class="size-chip">+${sizes.length - 4}</span>` : '';

    return `
      <div class="product-card" data-id="${safeId}">
        <div class="product-image-box">
          ${discountBadgeHTML}
          <span class="badge-cat">${safeCat}</span>
          <img src="${safeImg}" alt="${safeName}" loading="lazy" />
          <button class="quick-view-btn" onclick="openOrderModal(${safeId}, this)" aria-label="معاينة وطلب ${safeName}">
            <i class="fas fa-eye"></i> معاينة وطلب سريع
          </button>
        </div>

        <div class="product-info">
          <span class="product-category-sub">${safeCat}</span>
          <h4 class="product-title" title="${safeName}">${safeName}</h4>
          
          ${ratingHTML}

          <div class="product-sizes" aria-label="المقاسات المتاحة">
            <span style="font-size: 0.75rem; color: #7F8C8D; margin-left: 4px;">المقاسات:</span>
            ${displayedSizes}
            ${extraSizesBadge}
          </div>

          <div class="product-price-row">
            <div class="price-box">
              <span class="current-price">${safePrice} ج.م</span>
              ${safeOldPrice > safePrice ? `<span class="old-price">${safeOldPrice} ج.م</span>` : ''}
            </div>
            <button class="btn-order-now" onclick="openOrderModal(${safeId}, this)" aria-label="اطلب ${safeName} الآن">
              <i class="fas fa-shopping-bag"></i> اطلب الآن
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setupCategoryTabs() {
  const tabs = document.querySelectorAll(".cat-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      currentCategory = tab.getAttribute("data-category");
      renderProducts();
    });
  });
}

// ==========================================================================
// 9. Order Modal & Live Total Calculation (Proper Arabic Plurals)
// ==========================================================================
function updateLiveOrderTotal() {
  if (!selectedProductForOrder) return;
  const qtyInput = document.getElementById("orderQty");
  const qty = Math.max(1, parseInt(qtyInput ? qtyInput.value : 1, 10) || 1);
  const total = Number(selectedProductForOrder.price) * qty;

  const totalEl = document.getElementById("modalLiveTotal");
  if (totalEl) {
    totalEl.textContent = `${total} ج.م (${formatQuantityArabic(qty)})`;
  }
}

function openOrderModal(productId, triggerBtn) {
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  if (!product) return;

  selectedProductForOrder = product;
  lastFocusedElement = triggerBtn || document.activeElement;

  // Fill in modal details
  const imgEl = document.getElementById("modalProdImg");
  imgEl.src = product.image;
  imgEl.alt = product.name;

  document.getElementById("modalProdTitle").textContent = product.name;
  document.getElementById("modalProdPrice").textContent = `${product.price} ج.م`;
  document.getElementById("modalProdCat").textContent = product.categoryLabel;

  // Populate size options with escaping
  const sizeSelect = document.getElementById("orderSize");
  sizeSelect.innerHTML = product.sizes.map(s => 
    `<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`
  ).join('');

  // Populate color options with escaping
  const colorSelect = document.getElementById("orderColor");
  colorSelect.innerHTML = product.colors.map(c => 
    `<option value="${escapeHTML(c)}">${escapeHTML(c)}</option>`
  ).join('');

  // Reset quantity and calculate initial live total
  const qtyInput = document.getElementById("orderQty");
  if (qtyInput) qtyInput.value = 1;
  updateLiveOrderTotal();

  // Reset views and errors
  document.getElementById("orderForm").style.display = "block";
  document.getElementById("orderSuccessView").style.display = "none";
  document.getElementById("orderFallbackView").style.display = "none";
  clearAllValidationErrors();
  document.getElementById("orderForm").reset();
  if (qtyInput) qtyInput.value = 1;
  updateLiveOrderTotal();

  // Lock body scroll and open modal
  const modal = document.getElementById("orderModal");
  modal.classList.add("active");
  document.body.classList.add("modal-open");

  // Focus the first form input for accessibility
  setTimeout(() => {
    const firstInput = document.getElementById("customerName");
    if (firstInput) firstInput.focus();
  }, 100);
}

function closeOrderModal() {
  const modal = document.getElementById("orderModal");
  if (modal) modal.classList.remove("active");
  document.body.classList.remove("modal-open");
  selectedProductForOrder = null;

  // Return focus to the trigger button for accessibility
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function setupModalEvents() {
  const modal = document.getElementById("orderModal");
  const closeBtn = document.getElementById("modalCloseBtn");
  const qtyInput = document.getElementById("orderQty");

  if (closeBtn) {
    closeBtn.addEventListener("click", closeOrderModal);
  }

  // Click outside modal card to close
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeOrderModal();
      }
    });
  }

  // Close modal on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (modal && modal.classList.contains("active")) {
        closeOrderModal();
      }
    }
  });

  // Live total calculation on quantity change
  if (qtyInput) {
    qtyInput.addEventListener("input", updateLiveOrderTotal);
    qtyInput.addEventListener("change", updateLiveOrderTotal);
  }
}

// ==========================================================================
// 10. Form Validation & Submission
// ==========================================================================
function clearAllValidationErrors() {
  document.querySelectorAll(".field-error").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".form-control").forEach(el => el.classList.remove("has-error"));
}

function showFieldError(inputId, errorId, message) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (inputEl) inputEl.classList.add("has-error");
  if (errorEl) {
    if (message) errorEl.textContent = message;
    errorEl.classList.add("active");
  }
}

function clearFieldError(inputId, errorId) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(errorId);
  if (inputEl) inputEl.classList.remove("has-error");
  if (errorEl) errorEl.classList.remove("active");
}

function setupOrderForm() {
  const form = document.getElementById("orderForm");
  if (!form) return;

  const nameInput = document.getElementById("customerName");
  const phoneInput = document.getElementById("customerPhone");
  const addressInput = document.getElementById("customerAddress");

  // Real-time error clearing as user types
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim().length >= 3) {
        clearFieldError("customerName", "nameError");
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      if (isValidEgyptianMobile(phoneInput.value)) {
        clearFieldError("customerPhone", "phoneError");
      }
    });
  }

  if (addressInput) {
    addressInput.addEventListener("input", () => {
      if (addressInput.value.trim().length >= 8) {
        clearFieldError("customerAddress", "addressError");
      }
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearAllValidationErrors();

    // 1. Validate Form Fields
    let hasError = false;
    let firstErrorField = null;

    const rawName = nameInput.value.trim();
    if (rawName.length < 3) {
      showFieldError("customerName", "nameError", "يرجى كتابة الاسم بالكامل (3 أحرف على الأقل)");
      hasError = true;
      if (!firstErrorField) firstErrorField = nameInput;
    }

    const rawPhone = phoneInput.value;
    const normalizedPhone = normalizeArabicIndicDigits(rawPhone).trim();
    if (!isValidEgyptianMobile(normalizedPhone)) {
      showFieldError("customerPhone", "phoneError", "يرجى إدخال رقم هاتف مصري صحيح (مثال: 01069236466)");
      hasError = true;
      if (!firstErrorField) firstErrorField = phoneInput;
    }

    const rawAddress = addressInput.value.trim();
    if (rawAddress.length < 8) {
      showFieldError("customerAddress", "addressError", "يرجى إدخال العنوان بالتفصيل (8 أحرف على الأقل)");
      hasError = true;
      if (!firstErrorField) firstErrorField = addressInput;
    }

    if (hasError) {
      if (firstErrorField && typeof firstErrorField.focus === "function") {
        firstErrorField.focus();
      }
      return; // Block submit
    }

    // 2. Gather Validated Payload
    const qty = Math.max(1, parseInt(document.getElementById("orderQty").value, 10) || 1);
    const unitPrice = selectedProductForOrder ? Number(selectedProductForOrder.price) : 0;
    const totalPrice = unitPrice * qty;

    const orderData = {
      orderId: "ZAINI-" + Math.floor(100000 + Math.random() * 900000),
      timestamp: new Date().toLocaleString("ar-EG"),
      productName: selectedProductForOrder ? selectedProductForOrder.name : "منتج من ZAINI",
      category: selectedProductForOrder ? selectedProductForOrder.categoryLabel : "",
      price: unitPrice,
      size: document.getElementById("orderSize").value,
      color: document.getElementById("orderColor").value,
      quantity: qty,
      totalPrice: totalPrice,
      customerName: rawName,
      customerPhone: normalizedPhone,
      customerGov: document.getElementById("customerGov").value,
      customerAddress: rawAddress,
      customerNotes: document.getElementById("customerNotes").value.trim()
    };

    const submitBtn = form.querySelector(".btn-submit-order");
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> جاري تأكيد الطلب...`;
    submitBtn.disabled = true;

    try {
      // 3. Google Sheets Submission Flow
      const activeScriptURL = ZAINI_CONFIG.googleSheets.scriptURL || 
        (typeof localStorage !== "undefined" && (localStorage.getItem("zaini_sheets_url") || localStorage.getItem("ltb_sheets_url")));

      if (ZAINI_CONFIG.googleSheets.isEnabled && activeScriptURL) {
        await fetch(activeScriptURL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });
        
        saveLocalOrder(orderData);
        showOrderSuccess(orderData);
      } else {
        // Disabled or No Script URL yet: Save local order & show WhatsApp confirmation
        await new Promise(r => setTimeout(r, 600));
        saveLocalOrder(orderData);
        showOrderFallback(orderData, "demo");
      }

    } catch (err) {
      console.error("Order submission failure:", err);
      showOrderFallback(orderData, "sheets_failure");
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
}

function saveLocalOrder(orderData) {
  try {
    const existing = JSON.parse(localStorage.getItem("zaini_orders") || localStorage.getItem("ltb_orders") || "[]");
    existing.unshift(orderData);
    localStorage.setItem("zaini_orders", JSON.stringify(existing));
  } catch (e) {
    console.warn("Could not save to localStorage:", e);
  }
}

// ==========================================================================
// 11. Real Success Screen (Only on True Google Sheets Success)
// ==========================================================================
function showOrderSuccess(orderData) {
  const form = document.getElementById("orderForm");
  const successView = document.getElementById("orderSuccessView");
  const fallbackView = document.getElementById("orderFallbackView");

  form.style.display = "none";
  if (fallbackView) fallbackView.style.display = "none";
  successView.style.display = "block";

  document.getElementById("successOrderId").textContent = orderData.orderId;
  document.getElementById("successCustomer").textContent = `${orderData.customerName} (${orderData.customerPhone})`;

  // Configure optional WhatsApp copy
  const waBtn = document.getElementById("btnSendWAConfirmation");
  if (waBtn) {
    const waText = buildWhatsAppOrderMessage(orderData);
    waBtn.href = `https://wa.me/${ZAINI_CONFIG.merchantWhatsApp}?text=${encodeURIComponent(waText)}`;
  }
}

// ==========================================================================
// 12. WhatsApp Fallback Screen (On Failure or When Sheets Disabled/Demo)
// ==========================================================================
function showOrderFallback(orderData, triggerReason = "demo") {
  const form = document.getElementById("orderForm");
  const successView = document.getElementById("orderSuccessView");
  const fallbackView = document.getElementById("orderFallbackView");

  form.style.display = "none";
  if (successView) successView.style.display = "none";
  fallbackView.style.display = "block";

  // Dynamic message based on trigger reason
  const noticeTextEl = document.getElementById("fallbackNoticeText");
  const titleEl = document.getElementById("fallbackTitle");
  if (noticeTextEl) {
    if (triggerReason === "sheets_failure") {
      noticeTextEl.textContent = "حصلت مشكلة بسيطة في الاتصال السحابي، أكمل طلبك بنقرة واحدة عبر واتساب:";
      if (titleEl) titleEl.textContent = "تأكيد الطلب السريع عبر واتساب";
    } else {
      noticeTextEl.textContent = "لتأكيد طلبك وتحديد موعد التوصيل، يمكنك إتمام الطلب مباشرة مع خدمة عملاء ZAINI عبر واتساب بنقرة واحدة:";
      if (titleEl) titleEl.textContent = "تأكيد الطلب المباشر عبر واتساب";
    }
  }

  // Build summary card with proper Arabic plurals
  const summaryContainer = document.getElementById("fallbackOrderSummary");
  if (summaryContainer) {
    summaryContainer.innerHTML = `
      <div class="fallback-summary-item">
        <span class="label">رقم الطلب:</span>
        <span class="val">${escapeHTML(orderData.orderId)}</span>
      </div>
      <div class="fallback-summary-item">
        <span class="label">المنتج:</span>
        <span class="val">${escapeHTML(orderData.productName)}</span>
      </div>
      <div class="fallback-summary-item">
        <span class="label">المقاس واللون:</span>
        <span class="val">${escapeHTML(orderData.size)} - ${escapeHTML(orderData.color)}</span>
      </div>
      <div class="fallback-summary-item">
        <span class="label">الكمية:</span>
        <span class="val">${formatQuantityArabic(orderData.quantity)}</span>
      </div>
      <div class="fallback-summary-item">
        <span class="label">الاسم ورقم الهاتف:</span>
        <span class="val">${escapeHTML(orderData.customerName)} (${escapeHTML(orderData.customerPhone)})</span>
      </div>
      <div class="fallback-summary-item">
        <span class="label">العنوان والمحافظة:</span>
        <span class="val">${escapeHTML(orderData.customerGov)} - ${escapeHTML(orderData.customerAddress)}</span>
      </div>
      <div class="fallback-summary-item">
        <span class="label">إجمالي الحساب:</span>
        <span class="val" style="color: var(--primary-accent); font-size: 1.15rem; font-weight: 900;">${Number(orderData.totalPrice)} ج.م</span>
      </div>
    `;
  }

  // Configure direct WhatsApp button
  const waFallbackBtn = document.getElementById("btnFallbackWhatsApp");
  if (waFallbackBtn) {
    const waText = buildWhatsAppOrderMessage(orderData);
    waFallbackBtn.href = `https://wa.me/${ZAINI_CONFIG.merchantWhatsApp}?text=${encodeURIComponent(waText)}`;
  }
}

function buildWhatsAppOrderMessage(orderData) {
  return (
    `مرحباً ZAINI، أود تأكيد طلبي (${orderData.orderId}):\n\n` +
    `👕 المنتج: ${orderData.productName}\n` +
    `📏 المقاس: ${orderData.size}\n` +
    `🎨 اللون: ${orderData.color}\n` +
    `📦 الكمية: ${formatQuantityArabic(orderData.quantity)}\n` +
    `💰 إجمالي الحساب: ${orderData.totalPrice} ج.م\n\n` +
    `👤 بيانات العميل:\n` +
    `الاسم: ${orderData.customerName}\n` +
    `الموبايل: ${orderData.customerPhone}\n` +
    `العنوان: ${orderData.customerGov} - ${orderData.customerAddress}\n` +
    (orderData.customerNotes ? `📝 ملاحظات: ${orderData.customerNotes}\n` : "") +
    `\nيرجى تأكيد موعد الشحن والتسليم.`
  );
}

// ==========================================================================
// 13. Mobile Navigation Toggle
// ==========================================================================
function setupMobileNav() {
  const toggleBtn = document.getElementById("menuToggleBtn");
  const navMenu = document.getElementById("navMenu");

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    // Close menu when clicking link
    navMenu.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        toggleBtn.setAttribute("aria-expanded", "false");
      });
    });
  }
}
