# FONTOS HELYESBÍTÉS – 2026-11-10

A két, korábban szivattyú-fogyasztásmérőként kezelt SONOFF konnektor a COMPUTHERM termosztátok tápját adja. A szivattyúk a felhasználó jelenlegi ismerete szerint közös, harmadik 230 V-os aljzatról kapnak betápot, és a COMPUTHERM termosztátok valószínűleg relét vezérelnek. Ezt kapcsolási felmérésnek kell igazolnia.

**Következmények:** a két korábbi 10 W-os szivattyú-Fűt sablon állapota nem tekinthető tényleges szivattyúállapotnak. A Főoldal/Helyiségek/Kazánház ilyen kijelzéseit nem szabad igazolt fűtésnek nevezni. A tervben korábban szereplő napi üzemidő/start számlálók visszavonva; a monitoring package szándékosan üres. Az élő HA-ban nem történt változtatás.

## Javasolt mérési helyek
1. Ha a harmadik aljzat kizárólag a két szivattyút táplálja: egy fogyasztásmérős okosdugalj összesített szivattyúműködést ad, **körönkénti állapotot nem**; mindkét motor és az esetleges töltőszivattyú terhelését és indulóáramát ellenőrizni kell.
2. Legjobb: két külön, közvetlen motortápon mért fogyasztási csatorna (körönként W). DIN-sínes, kétcsatornás CT mérővel is megoldható, de a kis teljesítményű motorok megbízható felismerési küszöbét próbával kell hitelesíteni. Áramváltó egy-egy fázisvezető körül, nem teljes kábel körül.
3. Relé/termosztát állapotvisszajelzés kiegészítő adat lehet, de az önmagában csak fűtési parancs, nem bizonyít motoráramot.
4. A hidraulikus váltó töltőszivattyú működését külön kell mérni, ha tényleges visszajelzést akarunk, nem pusztán két másik szivattyúból következtetni.

230 V-os áramkörök átalakítását villanyszerelő végezze. A HA-ban maradjon csak kijelzés; a meglévő COMPUTHERM/TECH vezérlés változatlan.

---

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
