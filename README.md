# Fűtéstuning Dashboard · 0.6.5

Három Home Assistant nézet: Főoldal, Kazánház, Helyiségek. Fekvő iPadhez igazított elrendezés, a 2026. október 28-i három képes koncepció alapján.

- Főoldal: két nagy körkártya, három kisebb kártya, rendszerösszegzés és kazánházi előnézet.
- Kazánház: külön SVG kazán/puffer, három TECH kör, HMV és hozzáépítés. A rajz csak a három TECH célhőmérsékletét módosítja. A csövek és irányok sematikusak.
- Helyiségek: emelet, földszint, pince; kiválasztható szobák, termosztátív, külön szelepállítás és a ténylegesen közölt presetek. A Gree klíma vezérlői csak a hozzájuk rendelt ismert klímaentitásokra küldenek parancsot.

## Telepítés és frissítés

HACS-ban a `fakoist-hash/futestuning-dashboard` egyedi Dashboard tároló. A csomag fő fájlja `dist/futestuning-dashboard.js`. Frissítés után a böngészőt is újra kell tölteni; a fejlécben 0.6.5 látszik.

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

Narancspiros: Fűt (visszajelzés vagy feliratozott közös köri becslés); zöld: termosztát hőigény; kékesszürke: Nem fűt; szürke: Nincs adat. A hőigény önmagában nem bizonyít tényleges hőleadást.

A csempe alatti −/+ közvetlen célértékparancsot küld. Két radiátornál mindkét szelep saját célértékét lépteti; ez két külön HA-parancs, nem atomi művelet. Csak akkor aktív, ha minden hozzárendelt szelep elérhető és kézi módban állítható. Hiányzó szelep, saját termosztát hiánya vagy időprogram/Eco esetén inaktív. Módot a részletes ablakban lehet váltani. A Gree vezérlés szintén ott marad.

A böngészős teszt a csempék és az érintési területek méretét, az iPad teljes magasságát, a modal nyitását/bezárását és a két szelepes parancsokat is ellenőrzi.

## Teljes képernyős Főoldal és Kazánház (0.6.5)

Fekvő iPaden mindkét oldal a Home Assistant fejlécének fenntartott hellyel együtt egy képernyőre igazodik. A Főoldalon kisebb térközök, tömörebb körkártyák, összegzés és kazánházi előnézet szerepel. A Kazánház rajza és adatkapcsolatai változatlanok; a felső és alsó kiegészítő csempék alacsonyabbak, a rajz a fennmaradó területet használja, aránytartó méretezéssel. Telefonon és nagyon alacsony ablakban a tartalom görgethető marad.

Az ellenőrzés 1024×768, 1112×834, 1180×820 és 1024×700 nézetben, nyitott és zárt oldalsáv mellett vizsgálja a tényleges tartalom kilógását, az SVG és a három TECH célérték megmaradását.
