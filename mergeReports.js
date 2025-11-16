const marge = require("mochawesome-merge");
const fs = require("fs");

(async () => {
  try {
    // cypress/reports/html içindeki tüm JSON raporlarını birleştir
    const merged = await marge.merge({
      files: ["cypress/reports/html/*.json"],
    });

    // UTF-8 ile combined.json olarak kaydet
    fs.writeFileSync(
      "cypress/reports/html/combined.json",
      JSON.stringify(merged, null, 2),
      { encoding: "utf8" }
    );

    console.log("✅ combined.json başarıyla oluşturuldu!");
  } catch (err) {
    console.error("❌ JSON birleştirme hatası:", err);
  }
})();
