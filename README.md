# Fűtéstuning Dashboard · 0.6.8

Három Home Assistant nézet: Főoldal, Kazánház, Helyiségek. Fekvő iPadhez igazított elrendezés, a 2026. október 28-i három képes koncepció alapján.

- Főoldal: két nagy körkártya, három kisebb kártya, rendszerösszegzés és kazánházi előnézet.
- Kazánház: külön SVG kazán/puffer, három TECH kör, HMV és hozzáépítés. A rajz csak a három TECH célhőmérsékletét módosítja. A csövek és irányok sematikusak.
- Helyiségek: emelet, földszint, pince; kiválasztható szobák, termosztátív, külön szelepállítás és a ténylegesen közölt presetek. A Gree klíma vezérlői csak a hozzájuk rendelt ismert klímaentitásokra küldenek parancsot.

## Telepítés és frissítés

HACS-ban a `fakoist-hash/futestuning-dashboard` egyedi Dashboard tároló. A csomag fő fájlja `dist/futestuning-dashboard.js`. Frissítés után a böngészőt is újra kell tölteni; a fejlécben 0.6.8 látszik.

A HACS-frissítés a kártya kódját frissíti, a meglévő dashboard nézetkonfigurációját nem írja át. Az `examples/dashboard.yaml` a teljes háromnézetes konfiguráció egy külön Fűtéstuning dashboardhoz. A régi V6 nézetek picture-elements vagy markdown kártyái nem alakulnak át automatikusan. Ne írd felül a régi dashboardokat.

## Állapotok és korlátok

A koncepcióképek mintaértékei nem kerülnek át élő adatként. Nincs háromzónás puffermérés, ha csak a TH Elite egy mérési pontja ismert. Az ismeretlen érték `—` vagy „Nincs adat”. Az Eco/Komfort/Éjszaka/Távollét csak akkor aktív, ha az adott termosztát `preset_modes` listája tartalmazza a megfelelő módot; a kártya nem rendel hozzá kitalált célhőmérsékleteket.

A szivattyúkhoz opcionálisan `pump_feedback_entities` adható meg 1, 2, 3 kulcsokkal (valódi on/off visszajelzés). Enélkül a padló becslése: MINI-D on és TH Elite >30 °C; a radiátoré: MINI-D on és TH Elite ≥35 °C. Az állapot „Becslés” feliratot kap. A pince on állapotára nincs megadott becslési küszöb, így visszajelzés nélkül ismeretlen. Nem küldünk kapcsolási parancsot szivattyúnak vagy keverőszelepnek. A forgó szimbólum a feliratozott állapotot jelzi, nem mért vízáramlást.

A kép szerinti elrendezést HTML/SVG valósítja meg. A képgenerált fotórealisztikus gépészeti dekoráció helyett olvasható vektoros elemek szerepelnek.

## Ellenőrzés

`tests/visual-browser.cjs`: mindhárom oldal öt szélességen; kilógás; TECH célértékparancs; navigáció; szobatermosztát célérték; Eco; Gree ki/be és üzemmód, ventilátor; szivattyúparancs tiltása; hiányzó pufferadat és küszöbértékek. A teszt egy elkülönített Home Assistant tesztobjektumot használ, nem a fizikai rendszert. A CI képernyőképei tesztadatokat tartalmaznak.

A Home Assistant alatti telepítést és a fizikai eszközválaszokat külön kell ellenőrizni; a GitHub-ellenőrzés sikere ezeket nem bizonyítja.

## SONOFF TRV módok

A SONOFF TRV-ZB SonoffLAN entitások `heat` módja kézi, `auto` módja időprogramos, `off` módja az eszköz Eco/fagyvédelmi célértékét használja. Ezek a helyiségpanelen külön, ténylegesen támogatott módválasztóként szerepelnek. A +/− kézi módban állítható; automata módból a kártya nem vált át észrevétlenül. A heti programot nem írja át. Forrás: a SonoffLAN `XThermostatTRVZB` implementációja. A hasonló nevű Matter és SONOFF entitások eltérhetnek; a kártya az ismert SONOFF entitásokat használja.

## Helyiségek · iPad elrendezés (0.6.5)

A teljes áttekintés tíz nagy csempét mutat emelet/földszint/pince bontásban, állandó részletpanel nélkül. Részletek koppintásra, bezárható ablakban jelennek meg; az alapoldal 1024×768-as fekvő képernyőhöz igazodik. Kisebb telefonon görgethető elrendezésre vált. A fejléc és a jelmagyarázat alacsony.

Szürke: nincs hőigény. Piros: hőigény és igazolt működési visszajelzés. Zöld: hőigény, de álló vagy nem igazolt szivattyú. Adathiány: külön „Nincs adat” felirat és szaggatott keret. A teljes csempe háttere változik.

A csempe alatti −/+ közvetlen célértékparancsot küld. Két radiátornál mindkét szelep saját célértékét lépteti; ez két külön HA-parancs, nem atomi művelet. Csak akkor aktív, ha minden hozzárendelt szelep elérhető és kézi módban állítható. Hiányzó szelep, saját termosztát hiánya vagy időprogram/Eco esetén inaktív. Módot a részletes ablakban lehet váltani. A Gree vezérlés szintén ott marad.

A böngészős teszt a csempék és az érintési területek méretét, az iPad teljes magasságát, a modal nyitását/bezárását és a két szelepes parancsokat is ellenőrzi.

## Teljes képernyős Főoldal és Kazánház (0.6.5)

Fekvő iPaden mindkét oldal a Home Assistant fejlécének fenntartott hellyel együtt egy képernyőre igazodik. A Főoldalon kisebb térközök, tömörebb körkártyák, összegzés és kazánházi előnézet szerepel. A Kazánház rajza és adatkapcsolatai változatlanok; a felső és alsó kiegészítő csempék alacsonyabbak, a rajz a fennmaradó területet használja, aránytartó méretezéssel. Telefonon és nagyon alacsony ablakban a tartalom görgethető marad.

Az ellenőrzés 1024×768, 1112×834, 1180×820 és 1024×700 nézetben, nyitott és zárt oldalsáv mellett vizsgálja a tényleges tartalom kilógását, az SVG és a három TECH célérték megmaradását.


## Helyiségszínek és állapotforrások · 0.6.7

A SONOFF TRV `hvac_action` értéke hőigény, nem szivattyú-visszajelzés. Két radiátornál bármelyik szelep aktív hőigénye elegendő; nincs igény csak akkor állítható, ha mindkettő ismert és inaktív. Hiányzó adat nem kikapcsolt állapot.

Emeleti fürdő, Hanna háló és Nappali/konyha/étkező: közös radiátorköri hőigény a SONOFF MINI-D `switch.radiator_szivattyu_mini_d_sonoff_10029bc6bf_1` állapotából. A meglévő `switch.radiator_szivattyu_mini_d` alias csak akkor tartalék, ha a közvetlen SONOFF entitás nem létezik; elérhetetlen közvetlen entitás esetén nincs visszaesés régi aliasadatra.

Igazolt működéshez meglévő `pump_feedback_entities: {3: ...}` TECH szivattyúrelé-entitás vagy `room_heating_entities` helyiségi visszajelzés kell. Ezekhez nem adunk kitalált entitásazonosítót. A szivattyú-hőmérséklet és a letapadás elleni védelem kapcsolója nem reléállapot. A puffer ≥35 °C és MINI-D becslése továbbra is elérhető a részletekben, de nem kapcsolja pirosra a helyiségkártyát. A „Fűt” állapot szivattyúalapú, nem helyiségenkénti hőleadásmérés.

Visszajelzés nélkül vagy álló szivattyúnál az aktív hőigény zöld, „Hőigény” felirattal. Szülői háló és Lenti garázs számára nincs igazolt Computherm-hőigény entitás: az engedélyező okoskonnektor bekapcsolása önmagában nem hőigény. Ezért ezek „Nincs adat” állapotúak, amíg meglévő, ellenőrzött `room_demand_entities` és működési visszajelzés nincs hozzárendelve.

Mentés: `backup/before-room-colors-2026-11-01` ág, a módosítás előtti a55b2198f585995ae3dd8744960312122d040cfe commit teljes forrásával és példakonfigurációjával. Ez repository-mentés, nem az élő Home Assistant exportja. Az élő felület elérését a Work böngészőjében `ERR_CERT_COMMON_NAME_INVALID` blokkolta; a hálózathoz és a tanúsítvány-ellenőrzéshez nem nyúltunk.

Alkalmazás: a meglévő HACS csomag frissítése/újraletöltése és böngészőfrissítés után a kártya verziója 0.6.8. A már működő háromoldalas dashboard YAML-konfigurációja változatlan; azt nem kell az example fájllal felülírni. Az élő dashboard-konfiguráció mentése telepítés előtt továbbra is szükséges, mert innen nem volt hozzáférhető.

## Rövid állapotfeliratok · 0.6.8

A helyiségkártyákon és részleteiken kizárólag Fűt / Hőigény / Nem fűt / Nincs adat szerepel állapotként. A magyarázó megjegyzések, állapot-tooltippek és a parancs elfogadását követő ellenőrzési megjegyzés nem jelennek meg. A szín- és állapotszámítás, a kezelőszervek, valamint a valódi parancshibák kijelzése változatlan.
