# Fűtéstuning Dashboard · 0.6.0

Három Home Assistant nézet: Főoldal, Kazánház, Helyiségek. Fekvő iPadhez igazított elrendezés, a 2026. október 28-i három képes koncepció alapján.

- Főoldal: két nagy körkártya, három kisebb kártya, rendszerösszegzés és kazánházi előnézet.
- Kazánház: külön SVG kazán/puffer, három TECH kör, HMV és hozzáépítés. A rajz csak a három TECH célhőmérsékletét módosítja. A csövek és irányok sematikusak.
- Helyiségek: emelet, földszint, pince; kiválasztható szobák, termosztátív, külön szelepállítás és a ténylegesen közölt presetek. A Gree klíma vezérlői csak a hozzájuk rendelt ismert klímaentitásokra küldenek parancsot.

## Telepítés és frissítés

HACS-ban a `fakoist-hash/futestuning-dashboard` egyedi Dashboard tároló. A csomag fő fájlja `dist/futestuning-dashboard.js`. Frissítés után a böngészőt is újra kell tölteni; a fejlécben 0.6.0 látszik.

A HACS-frissítés a kártya kódját frissíti, a meglévő dashboard nézetkonfigurációját nem írja át. Az `examples/dashboard.yaml` a teljes háromnézetes konfiguráció egy külön Fűtéstuning dashboardhoz. A régi V6 nézetek picture-elements vagy markdown kártyái nem alakulnak át automatikusan. Ne írd felül a régi dashboardokat.

## Állapotok és korlátok

A koncepcióképek mintaértékei nem kerülnek át élő adatként. Nincs háromzónás puffermérés, ha csak a TH Elite egy mérési pontja ismert. Az ismeretlen érték `—` vagy „Nincs adat”. Az Eco/Komfort/Éjszaka/Távollét csak akkor aktív, ha az adott termosztát `preset_modes` listája tartalmazza a megfelelő módot; a kártya nem rendel hozzá kitalált célhőmérsékleteket.

A szivattyúkhoz opcionálisan `pump_feedback_entities` adható meg 1, 2, 3 kulcsokkal (valódi on/off visszajelzés). Enélkül a padló becslése: MINI-D on és TH Elite >30 °C; a radiátoré: MINI-D on és TH Elite >35 °C. Az állapot „Becslés” feliratot kap. A pince on állapotára nincs megadott becslési küszöb, így visszajelzés nélkül ismeretlen. Nem küldünk kapcsolási parancsot szivattyúnak vagy keverőszelepnek. A forgó szimbólum a feliratozott állapotot jelzi, nem mért vízáramlást.

A kép szerinti elrendezést HTML/SVG valósítja meg. A képgenerált fotórealisztikus gépészeti dekoráció helyett olvasható vektoros elemek szerepelnek.

## Ellenőrzés

`tests/visual-browser.cjs`: mindhárom oldal öt szélességen; kilógás; TECH célértékparancs; navigáció; szobatermosztát célérték; Eco; Gree ki/be és üzemmód, ventilátor; szivattyúparancs tiltása; hiányzó pufferadat és küszöbértékek. A teszt egy elkülönített Home Assistant tesztobjektumot használ, nem a fizikai rendszert. A CI képernyőképei tesztadatokat tartalmaznak.

A Home Assistant alatti telepítést és a fizikai eszközválaszokat külön kell ellenőrizni; a GitHub-ellenőrzés sikere ezeket nem bizonyítja.
