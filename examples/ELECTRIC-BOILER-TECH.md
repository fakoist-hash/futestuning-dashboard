# Elektromos kazán üzem – TECH rész (v0.6.21)

A Fűtéstuning Főoldalán megjelenő gomb **kizárólag a TECH három indítási hőmérsékletét** kezeli. Az eWeLink jeleneteket, a TH Elite-et és az elektromos kazánt **nem kapcsolja**.

## Telepítés
A már működő `homeassistant: packages: !include_dir_named packages` beállítás mellett a `examples/electric-boiler-tech-package.yaml` teljes tartalmát mentsd a HA-ba `/homeassistant/packages/futestuning_electric.yaml` néven. Konfiguráció ellenőrzése után HA újraindítás, HACS dashboard frissítés. Ez nem települ HACS-frissítéssel automatikusan.

## Használat
1. Mielőtt elektromos módot aktiválsz: a két kézi golyóscsap megfelelő állása, megfelelő vízút, elektromos kazán és annak saját keringetője működik; eWeLink hidegpuffer-jeleneteket szükség esetén külön le kell tiltani.
2. Gomb: elmenti a három indítási értéket és **10 °C-ra** állítja mindhármat. A 10 °C alatti puffer esetén továbbra is lehet tiltás.
3. Normál gomb: a három eredeti, elmentett értéket visszaállítja. A pufferhez tartozó kézi szelepeket helyesen kell visszaállítani. Az eWeLink jelenetek külön állítandók vissza.

**Biztonság:** Az indítási hőmérséklet módosítása nem azonos a túlmelegedés elleni védelem kikapcsolásával, de nem garantál biztonságos keringést. A dashboard nem érzékeli a kézi csapokat és nem igazolja az elektromos kazán üzemét. A kapcsoló csak a telepített csomaghoz tartozó script jelenlétekor aktív. Hiba/részleges lefutás esetén a mentett értékek a `input_number.futestuning_tech_start_saved_{1,2,3}` segédekben megvannak; az élő TECH-értékeket ellenőrizd. A három számozott TECH entitás körönkénti megfeleltetése nem igazolt, a művelet ezért mindhármat kezeli.
