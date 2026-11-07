# Gree heti időprogram – telepítés

A csomag 4 meglévő Gree climate entitáshoz készült; nem telepít integrációt, nem nyúl szivattyúhoz/TECH vezérléshez.

1. Készíts teljes HA mentést.
2. Másold a `examples/gree-weekly-schedule-package.yaml` fájlt a HA `/config/packages/gree_weekly.yaml` helyére.
3. A meglévő `configuration.yaml` `homeassistant:` szakaszába egyszer add hozzá: `packages: !include_dir_named packages`. Ha már szerepel, ne duplikáld. Ha más packages-megoldás van, ahhoz igazítsd.
4. HA konfigurációellenőrzés, majd újraindítás. Az új helper entitások és automatizmusok ekkor töltődnek be.
5. HACS frissítés / frontend cache frissítés után a Helyiségek oldalon a Gree klímával rendelkező szoba részletei → **Időprogram** gomb.
6. A heti programokat naponta szerkesztheted (egy indulás és egy leállítás naponta), majd **Mentés**. Alapállapotban **kikapcsolt**, explicit bekapcsolás kell.

## Működés és korlátok

- A HA minden percben megnézi, hogy van-e az adott időponthoz tartozó parancs. Működéséhez a HA és a klíma elérhetősége szükséges. HA-leállás alatt elmulasztott kapcsolás **nem kerül automatikusan pótlásra** újraindítás után; a következő programidőpont végrehajtódik.
- A bekapcsolás módja: heat/cool/auto a Gree entitás elérhető módjaitól függően. Ezután célhőmérsékletet is beállít. Kikapcsoláskor off módot küld.
- Kézi beavatkozást a következő időprogram-esemény felülírhatja, de közben nem változtatja az állapotot.
- A mentett program a HA input_text segédében található, a be/ki pedig input_boolean segédben. iPad nélkül is fut.
- A csomag csak akkor telepíthető élesben, ha a 4 climate entitásazonosító és a packages mechanizmus a HA-ban ellenőrzött.
- Ne másold az éles konfigurációba automatikusan, ha már léteznek azonos néven segéd entitások.

## Entitások

- Gréta klíma: `climate.502cc6c37c75`; `input_text.gree_weekly_greta`, `input_boolean.gree_weekly_greta_enabled`
- Flóra klíma: `climate.c6a66343`; `input_text.gree_weekly_flora`, `input_boolean.gree_weekly_flora_enabled`
- Szülői háló klíma: `climate.c6a643cb`; `input_text.gree_weekly_szuloi`, `input_boolean.gree_weekly_szuloi_enabled`
- Nappali klíma: `climate.a0cd3dc6`; `input_text.gree_weekly_nappali`, `input_boolean.gree_weekly_nappali_enabled`

Példa mentett heti adat: `06:30,heat,22;22:00,off||||||` (hétfőre egy bekapcsolás és kikapcsolás, a további 6 nap üres). Az adattartalom 255 karakteren belül marad.
