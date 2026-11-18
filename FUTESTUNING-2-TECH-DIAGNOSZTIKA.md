# Fűtéstuning 2.0 – megvalósítás és ellenőrzési határok

A 0.7.0 a korábbi külön TECH diagnosztikai fejlesztést a jelenlegi dashboarddal együtt tartalmazza. A három eredeti oldal megmarad. A hozzáépítés korábban jóváhagyott kijelzése megmarad, de a 2.0 elemzés csak a három fő TECH-kört vizsgálja.

## Elkészült

- Kilenc késleltetett passzív problémaérzékelő és három napi hőigényidő-segéd opcionális HA-csomagként.
- Recorderre épülő napi időjárási/hőigénykimutatás, közös időtengelyű grafikon, lefedettség, rögzített hőigényindulások, belső/célérték-kontextus, CSV/JSON export a Főoldalból nyíló ablakban.
- Az elemzés közvetlenül a Recorderből számol; a külön időjáráscsomag telepítése nem előfeltétele.
- A napi 18 °C bázisú fokóra baloldali, szakaszonként állandó hőmérsékletet integrál a rögzített frissítések között. Nincs adatkimaradásra vetített nulla. A bázis referencia, nem az épület kalibrált egyensúlyi hőmérséklete.
- Teljes napok összevetése: ≥95% kültéri és hőigény-lefedettség, ≥1 fokóra, kültéri átlag ±2 °C, termosztát-célértékek átlaga ±0,5 °C és célérték-lefedettség ≥95%. A szél, napsütés, használat és kazánüzem hatását ez nem választja szét.

## Ellenőrzött forrásazonosítók, történeti mentés alapján

- Puffer: `sensor.elite_thr316d_sonoff_1002bdc9e4_temperature`.
- MINI-D: pince `switch.pince_szivattyu_mini_d_sonoff_10029bc9f9_1`, padló `switch.padlo_szivattyu_mini_d_sonoff_10029bc9ca_1`, radiátor `switch.radiator_szivattyu_mini_d_sonoff_10029bc6bf_1`.
- TECH hőmérők: `sensor.wifi_rs_beepitett_szelep_{1,2,3}_homerseklet`.
- TECH engedélyezés: `switch.wifi_rs_futeskor_{1,2,3}_szelep_aktiv`.

A történeti entitásmentés nem aktuális eszközállapot. A MINI-D hőigény/engedély, a TECH „Szelep aktív” konfiguráció; egyik sem motor-visszajelzés. A három valódi szivattyúrelé-entitás nincs igazolva. Nincs mért hőenergia, ezért energiahatásfok, tényleges üzemóra és valódi szivattyúindulásszám nem állítható.

## Éles ellenőrzés még szükséges

1. Élő teljes HA backup, működő dashboard export és csomagmentés.
2. Entitáslétezés, mértékegységek, állapotforrások és Recorder-lefedettség.
3. Időjárási forrás földrajzi helye: Tokodaltáró. A korábban talált `weather.forecast_otthon` csak forrásjelölt.
4. A három TECH kör valódi működési visszajelzésének felmérése; nincs kitalált helyettesítő entitás.
5. Meglévő HA-csomagok ütközésmentes frissítése, natív konfigurációellenőrzés.
6. Mindhárom oldal és mind a tíz helyiség élő visszajelzése, Gree automatizmus trace, TECH mentés-visszaállítás ellenőrzése a megfelelő üzemállapotban.

A munkakörnyezetből a korábban megadott helyi HA-cím nem volt elérhető, ezért a kód és a szimulált tesztek eredményét külön kell kezelni az éles telepítéstől. A forrásmentési ág nem helyettesíti a teljes HA mentést.

## Későbbi, adatigényes fejlesztés

Szél/napsugárzás szerinti korrekció, kalibrált anomáliák és energiaelemzés csak igazolt mérések, referenciaidőszak és szükség esetén fizikai mérő alapján. A diagnosztika nem írja a fűtési vezérlést.

Hivatalos API: https://developers.home-assistant.io/docs/api/rest/
History/Recorder: https://www.home-assistant.io/integrations/history/
