# Otthon 1.0.1

Új, önálló `custom:otthon-card`, a meglévő Fűtéstuning HACS csomag részeként.
A fűtés kódja és dashboard-konfigurációja változatlan. Az új kód külön lezárt
névtérben kerül a csomag végére; a standalone forrás `dist/otthon-card.js`.

## Betöltés a saját HA-ban

1. A meglévő dashboard konfigurációját mentsd le. Az Otthont új dashboardként hozd létre.
2. HACS → Fűtéstuning Dashboard → Újraletöltés; a main változatot válaszd,
   ha a kiadott verzió még nem tartalmazza az Otthon kártyát.
3. Frissítsd a böngészőt. A meglévő HACS-erőforrás betölti az új kártyát is.
4. Beállítások → Irányítópultok → új, üres dashboard, név: Otthon.
5. Az új dashboard nyers konfigurációjába másold az `examples/otthon-dashboard.yaml` tartalmát.

Ez a minimális konfiguráció egy kártyát tölt be, benne a három oldallal.
A Fűtéstuning meglévő YAML-ját ne cseréld le. HACS-frissítés önmagában nem
hozza létre az új dashboardot.

## Működés

Négy, a korábbi listából ismert világítási kör. Nappali összes be/ki: a Kanapé
és Cserépkályha explicit közös szolgáltatáshívása; nem keres ki találomra jelenetet.
Részleges állapot, elérhetetlenség és parancshiba külön látható. A meglévő csempék két oszlopban kitöltik a helyet; üres tartalékcsempéket nem rajzolunk.
Fényerő csak támogatott `light` entitásoknál. iPaden és telefonon két oszlop, nagy érintési felületekkel.

Kapuk: elérhető entitásnál a működtető gomb aktív. Ellenőrzött impulzusvezérlés hiányában a HA saját vezérlőablakát nyitja meg, és nem küld automatikus reléparancsot.
Csak ellenőrzés után adj meg `verified_action: {domain: switch, service: turn_on}`
értéket a megfelelő kapuhoz. Ez önmagában nem állítja be a relé impulzusidejét!
A `position_entity` opcionális, ellenőrzött on=nyitott/off=zárt bináris érzékelő.
Alapból nem mutatunk kitalált nyitott/zárt állapotot.

Kamerák: `camera` mezőben explicit kameraentitás rendelhető a kapuhoz;
ennek hiányában kizárólag egyetlen, pontos névegyezésű `camera.*` fogadható el.
A `sensor.*` kameraadat nem kamerakép. A CAM-B1P/CAM-S2 integrációja még nincs
elvégezve; nincs feltételezett RTSP/ONVIF-cím. A kép megnyitása a HA részletablaka.

Riasztó: két nagy otthoni/távolléti élesítőgomb, a támogatott funkciók alapján. Kódigény esetén a HA saját vezérlőablaka nyílik meg. A hatástalanítás szintén a HA saját vezérlőjével történik. Nincs tárolt PIN. A mozgásérzékelők keskenyebb panelt kapnak. Hiányzó riasztó/érzékelő
nem jelenik meg hatástalanított/nincs mozgás állapotként.

Opcionális kártyakonfigurációk: `lights`, `gates`, `alarm_entity`, `sensors`.
`lights` elemei: `name`, `entity`, `area` (Nappali/Kültér/További helyiségek), `icon`.
`gates` elemei: `name`, `entity`, opcionális `camera`, `camera_name`,
`position_entity`, `verified_action`. Ne írd át élesben ellenőrzés nélkül.

## Ellenőrzési határok

`node tests/otthon-test.cjs dist/otthon-card.js` tesztkörnyezetben ellenőrzi
a parancsokat és a hibás/hiányzó adatokat. Nem kapcsol fizikai eszközt.
Az élő HA-telepítés, a fizikai válasz és a tényleges iPad/iPhone megjelenés
hozzáférés hiányában még nincs igazolva. A kamerák és kapuk beállítása hátravan.

Visszaállítás: az új Otthon dashboard törölhető a Fűtéstuning érintése nélkül.
A módosítás előtti repository-állapot az `otthon-dashboard` ágon maradt meg.
