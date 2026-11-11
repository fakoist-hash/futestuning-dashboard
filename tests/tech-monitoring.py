"""Static and synthetic-data checks of the read-only TECH monitoring package."""
from pathlib import Path
import yaml
from jinja2 import Environment

p = Path("examples/futestuning-2-tech-monitoring-package.yaml")
source = p.read_text(encoding="utf-8")
cfg = yaml.safe_load(source)
assert set(cfg) == {"template", "sensor"}, "Unexpected HA root keys"
sensors = cfg["template"][0]["binary_sensor"]
stats = cfg["sensor"]
assert len(sensors) == 9, len(sensors)
assert len(stats) == 3, len(stats)
assert len({s["unique_id"] for s in sensors}) == len(sensors)
assert all(s["device_class"] == "problem" for s in sensors)
assert all("delay_on" in s and "delay_off" in s for s in sensors)
assert all(s["platform"] == "history_stats" and s["type"] == "time" for s in stats)
assert all("pince" in s["entity_id"] or "padlo" in s["entity_id"] or "radiator" in s["entity_id"] for s in stats)
for forbidden in ("szuloi", "szülői", "garazs", "garázs", "lenti_garazs", "hozzaepitett", "hozzáépítés"):
    assert forbidden not in source.lower(), forbidden
assert "automation:" not in source and "service:" not in source

env = Environment()
def evaluate(template, states_map):
    def states(e): return states_map.get(e, "unavailable")
    def is_state(e, v): return states(e) == v
    def is_number(v):
        try:
            return float(v) == float(v) and abs(float(v)) != float("inf")
        except (ValueError, TypeError): return False
    return env.from_string(template).render(states=states, is_state=is_state, is_number=is_number).strip().lower() == "true"

buffer = "sensor.elite_thr316d_sonoff_1002bdc9e4_temperature"
floor = "switch.padlo_szivattyu_mini_d_sonoff_10029bc9ca_1"
rad = "switch.radiator_szivattyu_mini_d_sonoff_10029bc6bf_1"
def case(uid):
    return next(x for x in sensors if x["unique_id"] == uid)
cold_floor=case("futestuning_floor_cold_buffer")
cold_rad=case("futestuning_radiator_cold_buffer")
for temp, demand, expected in [(29.9,"on",True),(30,"on",False),(20,"off",False)]:
    values={buffer:str(temp),floor:demand}
    assert evaluate(cold_floor["availability"],values)
    assert evaluate(cold_floor["state"],values) == expected
for temp, demand, expected in [(34.9,"on",True),(35,"on",False),(20,"off",False)]:
    values={buffer:str(temp),rad:demand}
    assert evaluate(cold_rad["availability"],values)
    assert evaluate(cold_rad["state"],values) == expected
assert not evaluate(cold_floor["availability"],{buffer:"unavailable",floor:"on"})
assert not evaluate(cold_rad["availability"],{buffer:"35",rad:"unavailable"})
for uid, e in [
    ("futestuning_tech_basement_temp_missing","sensor.wifi_rs_beepitett_szelep_1_homerseklet"),
    ("futestuning_tech_floor_temp_missing","sensor.wifi_rs_beepitett_szelep_2_homerseklet"),
    ("futestuning_tech_radiator_temp_missing","sensor.wifi_rs_beepitett_szelep_3_homerseklet"),
]:
    template=case(uid)["state"]
    assert evaluate(template,{e:"-203"})
    assert evaluate(template,{e:"unavailable"})
    assert not evaluate(template,{e:"36.8"})
assert evaluate(case("futestuning_tech_buffer_missing")["state"],{buffer:"unknown"})
assert not evaluate(case("futestuning_tech_buffer_missing")["state"],{buffer:"53.6"})
print("PASS: TECH-only monitoring package, thresholds, unavailable and no control actions")
