# Fűtéstuning Dashboard

Saját, kísérleti Home Assistant Lovelace-kártya. **v0.1.0 – első működési alap, HA alatt még nem tesztelt.**

Három nézet: Főoldal, Kazánház és Helyiségek. A helyiségek sorrendje **Emelet → Földszint → Pince**, vízszintes szintenkénti sávokkal. A kártya ismert TECH, SONOFF és radiátortermosztát entitásokat használ. Az ismeretlen Gree-hozzárendeléseket és hiányzó HMV-méréseket nem találja ki.

## Biztonság

A program csak a három ismert `number.wifi_rs_futeskor_*_szelep_beallitott_hom` célhőmérsékletet módosítja `number.set_value` útján. A MINI-D állapotot **hőigényként** jelzi, nem mint szivattyú-visszajelzést. Szivattyúvezérlés és a kapcsolóállapotokra alapozott hamis áramlásanimáció nincs.

## Első telepítés

A GitHub-tároló jelenleg privát. A HACS egyedi tárhely-hozzáadásához a HACS verziójától és a GitHub jogosultságtól függően külön hozzáférés szükséges.

1. A Home Assistant HACS felületén válaszd az **Egyéni tárolók / Custom repositories** hozzáadását.
2. GitHub repository: `fakoist-hash/futestuning-dashboard`; kategória **Dashboard** (egyes verzióknál **Lovelace**).
3. Ha a privát tároló elérhető a HACS számára, telepítsd a kártyát és ellenőrizd, hogy a JS-erőforrás automatikusan regisztrálódott-e. A resource URL jellemzően `/hacsfiles/futestuning-dashboard/futestuning-card.js`; a tényleges útvonalat a HACS által megadott érték alapján ellenőrizd.
4. Új, külön tesztdashboard nyers konfigurációjaként használd az `examples/dashboard.yaml` fájlt. A meglévő dashboardok változatlanok maradjanak.

**Ha a privát tárolóhoz a HACS nem fér hozzá**, az alternatív első telepítés: `dist/futestuning-card.js` feltöltése a HA `/config/www/futestuning-card.js` helyére, JavaScript-modul erőforrásként `/local/futestuning-card.js`, majd az `examples/dashboard.yaml` mintával egy új dashboard létrehozása.

## Fejlesztési állapot

- A kártya forrása feltöltve; GitHubon ellenőrizhető.
- Ez még nem az elfogadott három prémium látványterv végleges, pixelpontos megvalósítása.
- A Home Assistant élő környezetében még nincs kipróbálva.
- Nem módosítja a TECH, SONOFF, Matter vagy Gree integrációkat.
- A HACS frissítés a GitHubon később létrehozott release/verzió kezelésétől és a privát hozzáféréstől függ.
