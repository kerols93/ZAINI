/**
 * ============================================================================
 * ZAINI - Google Apps Script Backend (نظام إدارة المنتجات والطلبات السحابي)
 * براند ZAINI للأزياء الشبابية والرجالية والستريت وير
 * ============================================================================
 * 
 * الميزات:
 * 1. استقبال وتوثيق طلبات العملاء من المتجر فوراً في شيت "الطلبات" مع تأكيد الكود.
 * 2. قراءة كتالوج المنتجات مباشرة من شيت "المنتجات" ومزامنته لحظياً مع الموقع.
 * 3. تنسيق تلقائي للجداول بألوان وهوية ZAINI (الأسود الفخم مع درجات الستريت وير).
 * 
 * طريقة التشغيل والتفعيل في 5 خطوات:
 * 1. افتح شيت جوجل جديد (Google Sheet).
 * 2. اضغط من القائمة العلوية: التوسيعات (Extensions) -> Apps Script.
 * 3. امسح أي كود موجود والصق هذا الكود كاملاً ثم اضغط حفظ (Save 💾).
 * 4. اضغط: نشر (Deploy) -> توزيع جديد (New deployment) -> تطبيق ويب (Web app).
 * 5. اضبط "من يملك حق الوصول" (Who has access) على: "أي شخص" (Anyone).
 * 6. انسخ رابط تطبيق الويب الناتج (Web App URL) وضعه في ملف js/app.js أو لوحة الفحص test_connection.html!
 * ============================================================================
 */

// 1. استقبال الطلبات وتسجيلها في شيت "الطلبات"
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000);

  try {
    ensureSheetsSetup();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("الطلبات");
    
    var order = JSON.parse(e.postData.contents);

    var rowData = [
      order.timestamp || new Date().toLocaleString("ar-EG"),
      order.orderId || "ZAINI-" + Math.floor(Math.random() * 900000 + 100000),
      order.customerName || "",
      "'" + (order.customerPhone || ""), // حفظ الرقم كنص للحفاظ على الصفر في بداية الرقم
      order.customerGov || "",
      order.customerAddress || "",
      order.productName || "",
      order.category || "",
      order.size || "",
      order.color || "",
      Number(order.quantity) || 1,
      Number(order.price) || 0,
      Number(order.totalPrice) || 0,
      order.customerNotes || "",
      "جديد (قيد التجهيز)" // حالة الطلب الافتراضية
    ];

    sheet.appendRow(rowData);

    var lastRow = sheet.getLastRow();
    var range = sheet.getRange(lastRow, 1, 1, rowData.length);
    range.setHorizontalAlignment("center");
    range.setVerticalAlignment("middle");
    range.setFontFamily("Cairo");
    range.setFontSize(10.5);

    // تلوين خفيف متبادل للصفوف
    if (lastRow % 2 === 0) {
      range.setBackground("#F8F9FA");
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      orderId: order.orderId,
      message: "تم حفظ طلبك في شيت ZAINI بنجاح!"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// 2. إرسال المنتجات من شيت "المنتجات" إلى واجهة المتجر
function doGet(e) {
  try {
    ensureSheetsSetup();
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("المنتجات");

    var data = sheet.getDataRange().getValues();
    var products = [];

    // تخطي الصف الأول (الهيدر)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var id = row[0];
      var name = row[1];
      var catLabel = row[2];
      var price = Number(row[3]);
      var oldPrice = Number(row[4]) || 0;
      var image = row[5];
      var sizesRaw = row[6] ? String(row[6]) : "";
      var colorsRaw = row[7] ? String(row[7]) : "";
      var description = row[8] || "";
      var status = row[9] ? String(row[9]).trim() : "نشط";

      // تجاهل الصفوف الفارغة أو المنتجات غير النشطة
      if (!name || status === "غير نشط") continue;

      // تحديد كود الفلترة المناسب للأزياء الشبابية والرجالية
      var catKey = "oversized-tshirts";
      var cl = String(catLabel).toLowerCase();
      if (cl.indexOf("هودي") !== -1 || cl.indexOf("سويت شيرت") !== -1 || cl.indexOf("سويتشرت") !== -1 || cl.indexOf("بلوفر") !== -1) {
        catKey = "hoodies";
      } else if (cl.indexOf("تيشيرت") !== -1 || cl.indexOf("اوفر سايز") !== -1 || cl.indexOf("أوفر") !== -1 || cl.indexOf("توب") !== -1) {
        catKey = "oversized-tshirts";
      } else if (cl.indexOf("كارجو") !== -1 || cl.indexOf("بنطلون") !== -1 || cl.indexOf("ميلتون") !== -1 || cl.indexOf("جينز") !== -1 || cl.indexOf("شورت") !== -1) {
        catKey = "pants-cargo";
      } else if (cl.indexOf("جاكيت") !== -1 || cl.indexOf("بومبر") !== -1 || cl.indexOf("ووتر بروف") !== -1 || cl.indexOf("وتربروف") !== -1 || cl.indexOf("شتوي") !== -1) {
        catKey = "jackets";
      } else if (cl.indexOf("قميص") !== -1 || cl.indexOf("شيرت") !== -1 || cl.indexOf("كتان") !== -1) {
        catKey = "casual-shirts";
      } else if (cl.indexOf("كاب") !== -1 || cl.indexOf("شنطة") !== -1 || cl.indexOf("إكسسوار") !== -1 || cl.indexOf("شراب") !== -1) {
        catKey = "accessories";
      }

      // تحويل المقاسات والألوان لمصفوفات نقية
      var sizes = sizesRaw.split(",").map(function(s) { return s.trim(); }).filter(Boolean);
      var colors = colorsRaw.split(",").map(function(c) { return c.trim(); }).filter(Boolean);

      products.push({
        id: id || i,
        name: name,
        category: catKey,
        categoryLabel: catLabel,
        price: price,
        oldPrice: oldPrice,
        image: image || "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
        sizes: sizes.length ? sizes : ["M", "L", "XL", "XXL"],
        colors: colors.length ? colors : ["أسود فحم", "أبيض ناصع"],
        description: description
      });
    }

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      store: "ZAINI - Streetwear & Men's Fashion",
      count: products.length,
      products: products
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 3. تهيئة وتنسيق شيت جوجل بهوية ZAINI تلقائياً
function ensureSheetsSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // أولاً: صفحة المنتجات
  var prodSheet = ss.getSheetByName("المنتجات");
  if (!prodSheet) {
    prodSheet = ss.insertSheet("المنتجات", 0);
  }
  if (prodSheet.getLastRow() === 0) {
    var prodHeaders = [
      "كود المنتج",
      "اسم المنتج",
      "القسم",
      "السعر (ج.م)",
      "السعر قبل الخصم (ج.م)",
      "رابط الصورة",
      "المقاسات (مفصولة بفاصلة)",
      "الألوان (مفصولة بفاصلة)",
      "الوصف والخامة",
      "الحالة (نشط / غير نشط)"
    ];
    prodSheet.appendRow(prodHeaders);

    formatHeaderRow(prodSheet, prodHeaders.length, "#0A0A0A", "#FF5E15");
    prodSheet.setRightToLeft(true);
    prodSheet.setFrozenRows(1);

    // إضافة نماذج منتجات رجالي وشبابي واقعية
    var sampleProducts = [
      [
        1,
        "هودي أوفر سايز شتوي ميلتون ثقيل مبطن بشكير",
        "هوديز وسويت شيرت",
        499,
        650,
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        "M, L, XL, XXL, 3XL",
        "أسود كربوني, رمادي داكن, بيج حجري, كحلي ليل",
        "قطن مصري 100% عالي الكثافة، معالج ضد الانكماش والوبر ومناسب للأجواء الباردة.",
        "نشط"
      ],
      [
        2,
        "تيشيرت أوفر سايز ستريت وير بطبعة ظهر ديجيتال",
        "تيشيرتات وأوفر سايز",
        340,
        450,
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
        "M, L, XL, XXL",
        "أسود, أوف وايت, زيتي كارجو",
        "قصة دروب شولدر مريحة جداً، قطن سنجل جيرسي معالج وناعم ومقاوم للحرارة.",
        "نشط"
      ],
      [
        3,
        "بنطلون كارجو تكتيكال 6 جيوب قطن جبردين تركي",
        "بنطلونات وكارجو",
        480,
        620,
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
        "30, 32, 34, 36, 38",
        "أسود مطفي, رمادي رصاصي, زيتي ترابي, كحلي",
        "خامة جبردين متينة ومريحة مع جيوب عملية وأستك كاحل مريح للستريت ستايل.",
        "نشط"
      ],
      [
        4,
        "جاكيت بومبر خريفي شتوي ووتر بروف عازل للمطر",
        "جاكيتات وملابس شتوية",
        690,
        890,
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
        "M, L, XL, XXL",
        "أسود ملكي, زيتي غامق, كحلي",
        "خامة تقاوم الماء والهواء، بطانة داخلية خفيفة ودافئة وأزرار وسوستة معدنية قوية.",
        "نشط"
      ]
    ];

    sampleProducts.forEach(function(p) {
      prodSheet.appendRow(p);
    });

    var rowsRange = prodSheet.getRange(2, 1, sampleProducts.length, prodHeaders.length);
    rowsRange.setHorizontalAlignment("center");
    rowsRange.setVerticalAlignment("middle");
    rowsRange.setFontFamily("Cairo");
  }

  // ثانياً: صفحة الطلبات
  var orderSheet = ss.getSheetByName("الطلبات");
  if (!orderSheet) {
    orderSheet = ss.insertSheet("الطلبات", 1);
  }
  if (orderSheet.getLastRow() === 0) {
    var orderHeaders = [
      "تاريخ ووقت الطلب",
      "رقم الطلب",
      "اسم العميل",
      "رقم الهاتف / واتساب",
      "المحافظة",
      "العنوان بالتفصيل",
      "اسم المنتج",
      "القسم",
      "المقاس",
      "اللون",
      "الكمية",
      "سعر القطعة (ج.م)",
      "إجمالي الحساب (ج.م)",
      "ملاحظات العميل",
      "حالة الطلب"
    ];
    orderSheet.appendRow(orderHeaders);

    formatHeaderRow(orderSheet, orderHeaders.length, "#0A0A0A", "#FF5E15");
    orderSheet.setRightToLeft(true);
    orderSheet.setFrozenRows(1);
  }

  // حذف ورقة "ورقة 1" أو "Sheet1" الافتراضية الفارغة إذا وجدت
  var defaultSheet = ss.getSheetByName("Sheet1") || ss.getSheetByName("ورقة 1");
  if (defaultSheet && ss.getSheets().length > 2 && defaultSheet.getLastRow() === 0) {
    try { ss.deleteSheet(defaultSheet); } catch(e) {}
  }
}

// 4. قائمة مخصصة لمتجر ZAINI تظهر في أعلى الشيت
function onOpen() {
  try {
    SpreadsheetApp.getUi()
      .createMenu("🔥 متجر ZAINI")
      .addItem("⚡ تهيئة وتنسيق الجداول تلقائياً", "ensureSheetsSetup")
      .addToUi();
  } catch(e) {}
}

function formatHeaderRow(sheet, numCols, bgColor, accentColor) {
  var range = sheet.getRange(1, 1, 1, numCols);
  range.setBackground(bgColor);
  range.setFontColor("#FFFFFF");
  range.setFontWeight("bold");
  range.setFontSize(11);
  range.setFontFamily("Cairo");
  range.setHorizontalAlignment("center");
  range.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 42);
}
