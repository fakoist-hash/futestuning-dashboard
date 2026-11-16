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

## Időjárási normalizálás – új fejlesztési követelmény (2026-11-16)

A három fő TECH-kör elemzése a külső időjárási körülményekkel együtt történjen. A hozzáépítés továbbra is kizárt.

**Források és sorrend:** először a HA-ban ténylegesen rendelkezésre álló kültéri hőmérséklet-szenzor és időjárás-integráció felmérése. A 2026-10-28-i listában `sensor.wifi_rs_kulso_homerseklet_homerseklet = -203.0` szerepelt, ami nem érvényes kültéri mérés. Ne vegyük át adatnak, ne állítsuk, hogy a kültéri TECH szonda rendelkezésre áll. Ha nincs használható kültéri érzékelő, egy helyi időjárás-szolgáltatás HA-integrációjának *mért* adatait használjuk, külön megkülönböztetve az előrejelzéstől. Az időjárás helye Tokodaltáró, nem az éppen becsült felhasználói helyzet. Hiányzó adat esetén: Nincs adat, és nem számolunk hamis normalizált mutatót.

**Mérési adattípusok** (a beszerzést elkerülendő, csak meglévő adatokból):
- Külső hőmérséklet: tényleges időbélyeggel, azonos időintervallumban a MINI-D hőigényjelek BE-időtartamával és az adott TECH-kör előremenő hőmérsékletével.
- Szélsebesség és napsugárzás/napsütés: csak ha megfelelő minőségű forrás érhető el; a felhőborítottság vagy időjárás-ikon nem azonos a helyi napsugárzás mérésével.
- Helyiségi célérték és belső hőmérséklet: ugyanarra az időablakra, mert a setpoint-változás magyarázhatja a hőigényt.
- Előrejelzés: csak a későbbi prediktív felfűtéshez; történeti összehasonlításnál ne helyettesítse az időjárás valódi korábbi méréseit.

**Első mutatók:** napi minimum/átlag/maximum kültéri hőmérséklet; hőigény-időtartam körönként; pufferhőmérséklet trend; egyszerű fűtési fokóra a választott, dokumentált bázishőmérséklethez (például 18 °C, de a helyi épülethez kalibrálandó). Hasonló külső hőmérsékletű napok összevetése a belső célértékek és napsütés figyelembevételével. Nullához közeli fokóra esetén az órák/fokóra arányt nem használjuk.

**Korlát:** a MINI-D BE-idő és a fokóra arány *nem hőenergiahatásfok*, és nem bizonyítja a szivattyú működését vagy hidraulikus keringést. Eltérő kazánüzem, pufferfeltöltés, napsütés és használati szokások torzíthatják. Az első 2–4 hét kalibrációs/megfigyelési időszak; anomália-riasztás csak stabil referencia után, és nem automatikus TECH vezérlés.

**Megjelenítés:** Főoldalra azonos időtengelyű külső hőmérséklet+puffer trend és fűtési hőigény összesítés; részletes statisztikában napi időjárási kontextus. A három eredeti oldal megmarad, a hozzáépítéshez nem adunk új logikát. A jelenlegi időjárási modul dokumentált terv: még NINCS elkészült, bekötött HA-entitása vagy élesítése.
