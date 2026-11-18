# Fűtéstuning Dashboard · 0.7.0

Három meglévő Home Assistant oldal: **Főoldal → Kazánház → Helyiségek**. A HACS erőforrás továbbra is `dist/futestuning-dashboard.js`; az Otthon kártya változatlanul része a csomagnak.

## Mi működik a kódban?

- Tíz helyiség, teljes csempeszín: szürke = nincs hőigény, piros = fűtésjelzés, zöld = hőigény, de a működés feltétele nem teljesül. Hiányzó adat külön állapot.
- Két radiátoros szobák: közös és radiátoronkénti célértékállítás, azonnali kért érték, sorba rendezett parancsok és elmaradt visszajelzés jelzése. SONOFF TRV kézi `heat` módja állítható; az automatikus programot nem írja át észrevétlenül.
- A három TECH kör Aktív/Inaktív állapota és jóváhagyott TECH kapcsolója. Hiányzó állapotnál nincs feltételezett működés. A MINI-D és a szivattyú kézzel nem kapcsolható a rajzról.
- TECH szivattyú-visszajelzés adható meg `pump_feedback_entities: {1: ..., 2: ..., 3: ...}` alatt. Enélkül a padló MINI-D + puffer ≥30 °C, a radiátor MINI-D + puffer ≥35 °C alapján **becsült**; a pince működését nem találjuk ki. A forgó jel és a nyilak nem áramlásmérés.
- Nappali: padló és konvektor külön állapot, bármelyik fűtésjelzése esetén piros csempe.
- Hozzáépítés: két külön 10 W-os sablonérzékelő, mindkét irányban 5 s késleltetés, adathiány-kezelés. A két köri szivattyú és a töltőszivattyú animációja ugyanazt a visszajelzést követi. Egy működő kör elég a töltőszivattyú jelzéséhez. Csak kijelzés.
- Négy Gree klíma heti időprogramja, külön HA-csomaggal. A szerkesztő nem küld közvetlen indítási parancsot; a program a HA-ban fut, az iPad nélkül is.
- Elektromos TECH üzem: három indulási hőmérséklet mentése, 10 °C, majd visszaállítás. Közös HA-script akadályozza meg a párhuzamos be-/visszaállítást. Nem vezérli az elektromos kazánt, eWeLink jeleneteket vagy kézi csapokat.

## Diagnosztika és előzmények

A Főoldal **Diagnosztika és előzmények** gombja a meglévő HA History/Recorder adatokat olvassa. Nem kell hozzá új kötelező integráció vagy új dashboard.

- Utolsó 24 óra: kültéri, puffer- és három TECH hőmérséklet, alatta a három MINI-D hőigényjel ugyanazon időtengelyen.
- Hét nap: hőigényidő, igazolt KI→BE hőigény-átmenetek, adatlefedettség, kültéri minimum/idővel súlyozott átlag/maximum, 18 °C bázisú fokóra.
- Hasonló kültéri átlagú (±2 °C), hasonló termosztát-célértékű (±0,5 °C) teljes napok összevetése. Legalább 95% lefedettség, legalább 1 fokóra. Az aktuális résznap nem referencia.
- Belső hőmérséklet és célérték kontextus; napi CSV és időbélyegzett adatsorokat/adatkimaradásokat tartalmazó JSON export.
- `unknown`/`unavailable` megszakítja a lefedettséget. Hiányzó történet nem 0 üzemóra. A Recorder által nem jelzett leállást a kártya nem tudja utólag felismerni.

A MINI-D BE-idő **hőigényidő, nem tényleges szivattyúüzemóra**. Az indulásszám sem motorindulásszám. A hőigényóra/fokóra nem energiahatásfok. Hőenergia-mérő nélkül nem számolunk fiktív kWh-t. Szél- és napsugárzás-korrekció, prediktív vezérlés és automatikus anomália-beavatkozás nincs: ehhez igazolt forrás és kalibrált referencia kell.

Kültéri forrás: `outdoor_entity` explicit beállítás, enélkül egyetlen érvényes kültéri TECH szenzor, végül a meglévő `weather.forecast_otthon` (vagy `weather_entity`) aktuális hőmérséklet-attribútuma. Nem használ előrejelzést történeti mérésként. A szolgáltatás helyszínét **Tokodaltáróra** az élő HA-ban ellenőrizni kell. Csak Celsius-adatot fogadunk el; a hibás -203 °C kiesik.

## Frissítés a meglévő HA-ban

1. Teljes HA-mentés, a működő dashboard konfigurációjának és a jelenlegi csomagoknak külön mentése.
2. A HACS meglévő tárolójának frissítése/újraletöltése. A fejlécben **0.7.0** legyen. A HACS a HA YAML-csomagokat és a nézetsorrendet nem telepíti automatikusan.
3. Csak a már meglévő Fűtéstuning dashboardot módosítsuk. Az `examples/dashboard.yaml` a sorrend és a kártyák referenciája; más dashboardot nem kell létrehozni vagy felülírni.
4. A szükséges csomagokat a meglévő `homeassistant: packages:` include alá, ütközésmentesen illesszük. Konfigurációellenőrzés után a megfelelő újratöltés/újraindítás. Meglévő segédértékeket ne töröljünk.
5. Az érzékelők, klímaprogramok és TECH-scriptek élő állapotát, valamint a Recorder válaszát ellenőrizzük. Az alábbi automatikus tesztek nem bizonyítják a fizikai rendszer működését.

| Csomag | Szerep |
|---|---|
| `examples/extension-heating-package.yaml` | Szükséges a két hozzáépítéses kör késleltetett kijelzéséhez |
| `examples/gree-weekly-schedule-package.yaml` | Szükséges a heti klímaprogramhoz; első telepítéskor kikapcsolt |
| `examples/electric-boiler-tech-package.yaml` | Szükséges a jóváhagyott elektromos TECH üzemhez |
| `examples/futestuning-2-tech-monitoring-package.yaml` | Opcionális, késleltetett passzív adathiány-/hidegpuffer-jelzések |
| `examples/futestuning-2-weather-monitoring-package.yaml` | Opcionális HA-oldali fokóra-segédek; forráshely és generált entitásazonosító ellenőrzendő |

A négy Gree program engedélyező segédei és a három mentett TECH érték újraindításkor megmaradnak. Az elektromos mód részleges hibája után a visszaállítás újra megkísérelhető; a flag csak a helyreállító műveletek végén kapcsol ki.

## Fejlesztés és ellenőrzés

```
node tools/build.cjs
node tools/build.cjs --check
node tests/diagnostics-test.cjs
python tests/extension-template.py
python tests/tech-monitoring.py
python tests/control-packages.py
node tests/visual-browser.cjs
```

Python: PyYAML, Jinja2. Böngésző: Playwright 1.56.1 + Chromium; helyi telepített Chromiumhoz `FT_CHROMIUM_PATH` adható. A GitHub Actions mindezt végrehajtja. A képernyőképek **tesztadatok**, nem otthoni állapotképek. A csomagteszt a tényleges YAML-t futtatja szimulált állapot-/szolgáltatásmodellben; nem teljes HA konfigurációellenőrzés.

Mentési ág a munka előtt: `backup/before-completion-2026-11-18`, commit `560d672175cf70110c7be75b5b2fb6e50f01a991`. Ez forrásmentés, nem élő HA backup.
