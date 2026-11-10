# Fűtéstuning 2.0 – TECH megfigyelő modul

## Hatókör
Csak pince, padlófűtés, radiátorkör és puffer. A hozzáépítés (Szülői háló, Lenti garázs és hidraulikusváltó-töltő) kizárva.

## A meglévő frontend-kódból azonosított források
- Puffer: `sensor.elite_thr316d_sonoff_1002bdc9e4_temperature`
- Padló MINI-D közvetlen jel: `switch.padlo_szivattyu_mini_d_sonoff_10029bc9ca_1`
- Radiátor MINI-D közvetlen jel: `switch.radiator_szivattyu_mini_d_sonoff_10029bc6bf_1`
- Pince: `switch.pince_szivattyu_mini_d` – **alias/állapotforrás még nem igazolt**, ezért e csomagban nincs rá aktív diagnosztika.
- A TECH három fűtőkörének kijelzése: `sensor.wifi_rs_beepitett_szelep_1_homerseklet`, `sensor.wifi_rs_beepitett_szelep_2_homerseklet`, `sensor.wifi_rs_beepitett_szelep_3_homerseklet`, illetve 3 darab `number.wifi_rs_futeskor_N_szelep_beallitott_hom`.
- Opció: `pump_feedback_entities` 1/2/3, de konkrét hiteles TECH kimeneti entitások nem ismertek.

## Készült fájl
`examples/futestuning-2-tech-monitoring-package.yaml`

Csak érzékelők:
- TH Elite pufferadat hiánya 10 perc után.
- Padló és radiátor közvetlen MINI-D hőigényjelének adatvesztése 10 perc után.
- Padló: hőigény és puffer <30 °C 15 percen át.
- Radiátor: hőigény és puffer <35 °C 15 percen át.
- Napi MINI-D *hőigényjel-időtartam* (nem igazolt pumpaüzemidő).

**Nem** állítunk elő 'TECH pumpa hibás' vagy 'ténylegesen fűt' riasztást, mert nem ismert igazolt motorüzem visszajelzés. A hűvös puffer jelzés működési figyelmeztetés, nem feltétlen rendszerhiba.

## Élesítés előtti kötelező ellenőrzések
1. Teljes Home Assistant mentés.
2. A fenti entitásokat ellenőrizni a HA Fejlesztői eszközök / Állapotok alatt.
3. Ellenőrizni, hogy egy meglévő package nem tartalmazza-e a létrehozandó unique_id-kat.
4. A meglévő `configuration.yaml` packages-betöltéséhez igazítani: ne hozzunk létre második root `template` vagy `sensor` blokkot.
5. HA-konfiguráció ellenőrzése, majd megfelelő újratöltés.
6. Az adatvesztési jelzéseket kontrollált módszerrel tesztelni: 'unavailable' nem azonos 'off'-fal.
7. A puffer hideg jelzést valós hőigény és 15 perc tartós <30/<35 °C mellett ellenőrizni.
8. A recorder megőrzési időt ellenőrizni; a history_stats csak rendelkezésre álló történeti adaton dolgozhat.
9. Jelenleg **nincs éles telepítés**, értesítés, szivattyúkapcsolás, TECH-célérték-módosítás vagy dashboard-felülírás.

## Következő szakasz
Az élő HA-ból a TECH pumpa reléállapotok és a pince közvetlen hőigényjelek felmérése. Csak ezek után üzemidő-számlálás és körönkénti valódi diagnosztika.
