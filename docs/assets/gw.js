/* ptp mesh — ゲートウェイ一覧（地図＋表）
   データ = docs/gateways.json（手編集の単一情報源）
   置き場所 = gateways.md の #gwMap / #gwTbl

   2026-07-27: 登録フォーム版から「静的運用」へ切り替え。パスキー照合・編集・削除の
   UIは撤去した（元実装は _wip/gw-with-register.js.bak に保全）。 */
(function () {
  "use strict";

  /* ★データURLは「ページ」ではなく「このスクリプト」からの相対で解決する。
     /en/gateways/ から見た "../gateways.json" は /en/gateways.json になり404になるため
     （i18nの英語版はサブディレクトリに建つが、静的ファイルはルートにしか置かれない）。 */
  var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || "";
  var DATA_URL = SCRIPT_SRC ? new URL("../gateways.json", SCRIPT_SRC).href : "../gateways.json";

  var LEAFLET_CSS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
  var LEAFLET_JS = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
  var EN = /\/en\//.test(location.pathname);
  var T = EN
    ? { gw: "Gateway", area: "Area", root: "Group (root)", sched: "Uptime", loading: "Could not load the list", none: "—" }
    : { gw: "ゲートウェイ", area: "エリア", root: "グループ(root)", sched: "運用", loading: "一覧を読み込めませんでした", none: "—" };

  function loadLeaflet() {
    return new Promise(function (resolve) {
      if (window.L) return resolve();
      if (!document.querySelector("link[data-gw-leaflet]")) {
        var l = document.createElement("link");
        l.rel = "stylesheet"; l.href = LEAFLET_CSS; l.setAttribute("data-gw-leaflet", "");
        document.head.appendChild(l);
      }
      var s = document.querySelector("script[data-gw-leaflet]");
      if (s) { s.addEventListener("load", function () { resolve(); }); return; }
      s = document.createElement("script");
      s.src = LEAFLET_JS; s.setAttribute("data-gw-leaflet", "");
      s.onload = function () { resolve(); };
      document.head.appendChild(s);
    });
  }

  function esc(s) {
    return (s == null ? "" : String(s)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function pick(g, key) {
    // 英語ページでは <key>_en があればそちらを使う（無ければ日本語のまま）
    return (EN && g[key + "_en"]) ? g[key + "_en"] : g[key];
  }

  function buildTable(gws) {
    var rows = gws.slice().sort(function (a, b) {
      return (a.country + a.region + a.name).localeCompare(b.country + b.region + b.name, "ja");
    });
    var html = '<div class="gw-tblwrap"><table class="gw-tbl"><thead><tr>' +
      "<th>" + T.gw + "</th><th>" + T.area + "</th><th>preset</th><th>" + T.root + "</th><th>" + T.sched + "</th>" +
      "</tr></thead><tbody>";
    var cur = "";
    rows.forEach(function (g) {
      var loc = pick(g, "country") + " / " + pick(g, "region");
      if (loc !== cur) {
        cur = loc;
        var cnt = rows.filter(function (x) { return pick(x, "country") + " / " + pick(x, "region") === loc; }).length;
        html += '<tr class="gw-grp"><td colspan="5">' + esc(loc) + '<span class="gw-badge">' + cnt + "</span></td></tr>";
      }
      html += '<tr><td class="gw-name">' + esc(pick(g, "name")) + "</td>" +
        "<td>" + esc(pick(g, "area") || T.none) + "</td>" +
        "<td>" + esc(g.preset || T.none) + "</td>" +
        '<td><span class="gw-code">' + esc(g.root) + "</span></td>" +
        '<td><span class="gw-sched">' + esc(pick(g, "schedule") || T.none) + "</span></td></tr>";
    });
    return html + "</tbody></table></div>";
  }

  function initList(mapEl) {
    if (mapEl.dataset.gwInit) return;
    mapEl.dataset.gwInit = "1";
    var tbl = document.getElementById("gwTbl");

    fetch(DATA_URL, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error("gateways.json " + r.status);
      return r.json();
    }).then(function (data) {
      var gws = (data && data.gateways) || [];
      if (tbl) tbl.innerHTML = buildTable(gws);
      return loadLeaflet().then(function () {
        var map = L.map(mapEl, { scrollWheelZoom: false }).setView([37, 139], 5);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18, attribution: "© OpenStreetMap"
        }).addTo(map);
        var grp = L.featureGroup().addTo(map);
        gws.forEach(function (g) {
          if (g.lat == null) return;
          L.circleMarker([g.lat, g.lon], {
            radius: 9, color: "#00897b", weight: 2, fillColor: "#00897b", fillOpacity: 0.55
          }).addTo(grp).bindPopup(
            "<b>" + esc(pick(g, "name")) + "</b><br>" + esc(pick(g, "area") || pick(g, "region")) +
            "<br>root: " + esc(g.root) + "<br>" + esc(g.preset || "")
          );
        });
        if (gws.some(function (g) { return g.lat != null; })) {
          try { map.fitBounds(grp.getBounds().pad(0.4)); } catch (e) { /* 1点のみ等 */ }
        }
        setTimeout(function () { map.invalidateSize(); }, 120);
      });
    }).catch(function (e) {
      if (tbl) tbl.innerHTML = '<p class="gw-note-loading">' + T.loading + "（" + esc(e.message) + "）</p>";
    });
  }

  function boot() {
    var m = document.getElementById("gwMap");
    if (m) initList(m);
  }

  // Material の document$ があればページ遷移ごとに、無ければ通常のDOM読み込みで
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(boot);
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
