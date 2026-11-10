# Fűtéstuning 2.0 – megvalósítási terv és ellenőrzési kapuk

## Biztonsági szabály
A TECH marad a szivattyúk, keverőszelepek és védelmi funkciók elsődleges vezérlője.
HA nem küld parancsot pumpának, keverőszelepnek vagy pufferhőmérsékletet kezelő eszköznek.
Új célhőmérséklet-automatizálást csak az élő entitások és funkciók ellenőrzése után szabad bekapcsolni.
Hibás/hiányzó adat nem kezelhető nulla fogyasztásként vagy kikapcsolt szivattyúként.

## 1. Megfigyelő szakasz (előkészítve)
Fájl: `examples/futestuning-2-monitoring-package.yaml`.
A két már dokumentált hozzáépítéses okoskonnektor teljesítményértékeihez
10 perc után aktiválódó, majd 2 perc jó adat után megszűnő adatvesztési hibaérzékelő.
A két meglévő >=10 W, 5 s késleltetésű szivattyú-működésjelből napi
üzemórák és napi bekapcsolási események a HA history_stats rendszerével.
A history_stats count az intervallum kezdő állapotát is beleszámíthatja,
így nem garantált, hogy pontosan a valós motorindítások száma.
A csomag nem tartalmaz értesítéseket vagy semmilyen vezérlő automatizálást.

Telepítés ELŐTT: teljes HA-mentés, tényleges entitásazonosítók ellenőrzése,
a már telepített extension package ellenőrzése, meglévő packages-betöltés
ellenőrzése. Nem szabad vakon felülírni sem a `configuration.yaml`-t,
sem a dashboardot. Konfigurációellenőrzés és HA újratöltés után tesztelni kell
a két adatvesztés-jelzőt, a két napi óraszámot és a két számlálót.
A dokumentáció nem bizonyítja, hogy a csomag éles HA-ban telepítve van.
A naplómegőrzés hosszát a recorder határozza meg.

## 2. Diagnosztika – második fázis
A TECH szivattyúrelé entitásait és a puffer/termókör forrásait az élő
HA-ból kell felmérni. Egyelőre ne legyen 'szivattyúhiba' riasztás
pusztán a MINI-D vagy pufferhőmérséklet becslése alapján.
A figyelmeztetés különítse el: valós relé-visszajelzés, becslés,
hiányzó adat. Üzemi küszöböket és késleltetést üzemi adatokból hangoljuk.
Értesítés csak ellenőrzött iPhone notify céllal, teszt után.

## 3. Dashboard (meglévő három nézet)
Főoldal: kompakt puffertrend (ha valós mérés elérhető), diagnosztika,
hibastátusz, hőigény és fűtési idő. Kazánház: a jóváhagyott kapcsolási
rajz és animált nyilak megmaradnak. Helyiségek: szürke/zöld/piros,
hiányzó adat külön; a Flóra két radiátorának nagyméretű külön +/- vezérlése
a jelenlegi támogatott módok tiszteletben tartásával.
Minden új kártyán `Nincs adat` jelenjen meg, ha nincs hiteles forrás.
Nincs éles dashboard-YAML módosítás, amíg nem ismert az élő konfiguráció.

## 4. Felfűtés és távollét – csak külön engedélyezett fázis
Először legalább 2–3 hét történeti adat gyűjtése.
A célhőmérséklet-állítás csak az ellenőrzött TECH climate entitásokhoz,
ésszerű min/max korláttal, egyértelmű kézi felülbírálással.
Ne vezérelje a szivattyút és a keverőszelepet.
Újraindításkor és HA-kapcsolatvesztéskor sem küldhet nem ellenőrzött
visszaállító parancsot. Távollét módhoz külön fagyvédelmi
minimum és családtagok jelenlétének/privát adatainak kezelése kell.

## 5. Új mérések – beszerzés előtt
Prioritás: tényleges TECH szivattyú-visszajelzés az összes releváns
körön; valós pufferérték; előremenő/visszatérő hőmérséklet a kritikus
körökön; később további teljesítménymérés. A fogyasztásmérő W adata
nem azonos a hőenergia-méréssel; kWh villamos energia méréséhez hiteles
összegző energiaentitás vagy megfelelő integrálási konfiguráció kell.
A 10 W küszöb a már egyeztetett konkrét két szivattyúra érvényes.

## Elfogadási tesztek
- HA/SONOFF offline esetén nem jelenik meg hamis 'Nem fűt' és nem indul vezérlés.
- Minimum tíz perc adatkiesés után megjelenik a problem; 2 perc jó adat után elmúlik.
- A számolt fűtési idő közelíti a HA history grafikonon látható időt.
- A 10 W-os határ és az 5 s késleltetés változatlan a korábbi package-ben.
- Dashboard nem küld szivattyú, keverőszelep vagy konnektor kapcsolási parancsot.
- iPad 1024x768 és iPhone 2 oszlop: nincs átfedés; minden gomb érinthető.
