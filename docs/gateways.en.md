# Groups and gateways

In ptp mesh the **root topic *is* the group**. Everyone who sets the same root topic forms one island, and **nothing is delivered across groups**. A gateway (GW) is that group's **RF entrance**, and one group can have several of them.

To join, put one of the strings below into the root topic field described in [Join](connect.md).

## Public groups

| Root topic | What it is |
|---|---|
| `ptp/commons` | **The shared group.** A public island anyone can read and write. Start here if unsure |

This is the only published group (the Akihabara gateway joined commons on 2026-10-29). **You can create your own instantly by using `ptp/<any-name>`** (no server-side registration). That island connects to nobody else, though, so announce the name if you want company.

!!! note "A root topic is a partition, not a secret"
    Anyone who knows the root topic can join — it is a **soft partition**. If you want the contents hidden, add a **named channel with your own PSK** on top of the group. Think of it as two layers: delivery is the topic, secrecy is the PSK.

## Permanent gateways

If a gateway is within RF range you can join with [no MQTT setup at all](connect.md). Listed here are the **permanent gateways we run**.

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

## Which server they live on

All groups live on the **ptp mesh server**, which is separate from the official broker.

| | Host | Contents |
|---|---|---|
| **ptp mesh (here)** | `160.16.104.222:1883` | `ptp/commons` |
| Official broker | `mqtt.meshtastic.org` | Public meshes worldwide. The [public map](map.md) is fed from here |

[`ptp-bousai`](bousai.md) is **a channel, not a group** — it flows inside `ptp/commons`. (Its source data is taken from the JPEQ channel on the official broker.)

## How topics are formed

For people who want to look at the broker with an MQTT client. Topics are derived mechanically from the node's own settings.

```
<root topic>/2/e/<channel name>/<gateway node ID>

e.g. ptp/commons/2/e/LongFast/!e0f79774
     ptp/commons/2/e/ptp-bousai/!626f7573
     ptp/commons/2/e/PKI/!6b626f74        ← encrypted direct messages
```

- `2/e` is a fixed part meaning "protocol v2, encrypted"
- **The channel name goes in verbatim**, so a stock primary channel shows up as `LongFast`
- The last element is the **gateway that relayed it**, not the originating node
- `PKI` carries direct messages. **Nobody but the two parties can decrypt the contents**

Subscribe to `ptp/#` for everything, or `ptp/commons/#` for just that group. Credentials are the same as in [Join](connect.md) (the `friend` account).

!!! warning "commons is a public group"
    Anyone can read and write it, and **the root topic string is visible to anyone who connects**. Keep anything sensitive in your own group with your own PSK.
