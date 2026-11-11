# Fűtéstuning 2.0 – TECH fő fűtőkörök, passzív diagnosztika

## Állapot és hatókör
Három fő TECH fűtőkör: pince (1), padló (2), radiátor (3).
A szülői háló, hozzáépített garázs és hidraulikusváltó töltőszivattyúja nem része ennek a csomagnak.

**Csak megfigyelés.** A TECH, MINI-D, szivattyúk, keverőszelepek célértékei és biztonsági funkciói változatlanok. Nem tartalmaz sem kapcsolási, sem klíma/parancs szolgáltatáshívást, sem értesítést. Nem került az éles Home Assistantba.

## Ellenőrzött, 2026-10-28-i HA-entitásmentésből származó ID-k
- Puffer TH Elite: `sensor.elite_thr316d_sonoff_1002bdc9e4_temperature`
- Pince hőigény/engedélyezés MINI-D: `switch.pince_szivattyu_mini_d_sonoff_10029bc9f9_1`
- Padló hőigény/engedélyezés MINI-D: `switch.padlo_szivattyu_mini_d_sonoff_10029bc9ca_1`
- Radiátor hőigény/engedélyezés MINI-D: `switch.radiator_szivattyu_mini_d_sonoff_10029bc6bf_1`
- TECH kör 1/2/3 hőmérséklet: `sensor.wifi_rs_beepitett_szelep_1_homerseklet`, `sensor.wifi_rs_beepitett_szelep_2_homerseklet`, `sensor.wifi_rs_beepitett_szelep_3_homerseklet`.

**A MINI-D a hőigény/engedélyező jel, nem a TECH szivattyú valódi működésének visszajelzése.**
Az aktuális entitáslétezés és név csak élő HA-ban ellenőrizhető.
A TECH Controllers 2.8.3 képes relé tile alapján bináris érzékelőt létrehozni, de ezen 3 körhöz tényleges relé-tile/entitás nem igazolt.

## Előkészített package: `examples/futestuning-2-tech-monitoring-package.yaml`
- Hiányzó vagy fizikailag életszerűtlen puffer- és TECH-kör hőmérséklet: 10 perc késleltetés, helyreállás 2 perc.
- Hiányzó MINI-D hőigényjel (pince/padló/radiátor): 10 perc késleltetés, helyreállás 2 perc.
- Padló: 15 percen át hőigény + puffer <30 °C → tartós hideg puffer figyelmeztetés.
- Radiátor: 15 percen át hőigény + puffer <35 °C → tartós hideg puffer figyelmeztetés.
- Pince: nincs kitalált pufferküszöb, így csak adatellenőrzés van.
- Napi három MINI-D jel BE állapot-időtartama a history_stats segítségével: **nem** tényleges szivattyú üzemóra.
- A TECH körhőmérsékletek trendje a meglévő HA History/Recorder grafikonból használható; nincs belőle gyártott áramlás- vagy szivattyúállapot.
- A hideg puffer jelzés nem feltétlen műszaki hiba: pufferfeltöltés és normál átmenet is okozhatja.
- A sablonok HA-indulásakor és távoli kapcsolatvesztéskor óvatosan kell értelmezni a késleltetéseket.

## Tesztek
`tests/tech-monitoring.py` statikusan ellenőrzi az entitásköröket, a csomagszerkezetet, a küszöböket (30/35 °C), az adatvesztést és hogy nincs vezérlő/hozzáépítés modul.
Az Actions a meglévő Playwright/dashboard tesztekkel együtt futtatja.
**A CI nem helyettesíti az éles HA `Check configuration` vizsgálatát.**

## Telepítési kapuk
1. Teljes élő HA backup és jelenlegi `configuration.yaml`/package include felmérése.
2. Ütközésmentes `unique_id` és aktuális entitásazonosítók ellenőrzése.
3. Meglévő package include szerint beillesztés; nem duplikálni root `template`/`sensor` kulcsot.
4. HA konfigurációellenőrzés; szükséges reload/restart.
5. Pufferadat kiesés és hőigénypróba kontrollált teszt, hőmérsékleti grafikon ellenőrzés.
6. Csak validált élő adatok után lehet a Fűtéstuning dashboardon diagnosztikai állapotot megjeleníteni.
7. Nincs automatikus éles merge vagy HA-telepítés.

## Későbbi fejlesztés
Előremenő hőmérséklet emelkedésének időbeli vizsgálata hőigény esetén, de csak a kazánházi fizikai hidraulika és a TECH előremenő érzékelők viselkedésének helyszíni kalibrálása után. Nem nevezhető pumpahibának vagy igazolt fűtésnek.
