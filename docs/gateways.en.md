# Gateways

If a ptp mesh gateway is within RF range, you can join with [no MQTT setup at all](connect.md).

Listed here are the **permanent gateways we run**. Which group each belongs to is on the [Groups](topics.md) page.

!!! tip "For what is up right now, use meshmap"
    This page lists locations and groups. For live status check **[meshmap.net](https://meshmap.net)** (see [Public map](map.md) for how to get listed).

<div class="gw-map" id="gwMap"></div>
<div id="gwTbl"><p class="gw-note-loading">Loading…</p></div>

<p class="gw-foot">Pins mark a publicly shareable landmark (a station, typically), not an exact address.</p>

Beyond these, **gateways run by other participants** — in Ibaraki (Mito–Hitachinaka) and elsewhere — are connected to `ptp/commons`. They are not ours to list. For actual RF coverage, [meshmap.net](https://meshmap.net) is closer to reality.

## Getting your gateway listed

If you run a permanent gateway and are happy to be listed, say so on the Discord linked from [Links](links.md). Listing is **optional** — the bridge works the same either way.

What we need:

- A **landmark location you are willing to publish** (station or area name — **we do not list home addresses**)
- The **root topic** you use (e.g. `ptp/commons`)
- **preset / slot** (everything here runs LongFast / slot 12)
- Uptime (24/7, offline at night, …)
