# Get on the public map (opt-in)

ptp mesh can list **only the nodes that want it** on **[meshmap.net](https://meshmap.net)**, via a one-way mirror to the official broker. **By default nobody and no group is published.**

## What it takes

Two conditions: **OK to MQTT is ON** and **position is being transmitted**. What that means depends on how you joined.

**If you joined as a gateway (MQTT connected)** — OK to MQTT (app → Radio Config → **LoRa**) is effectively your opt-in switch for the map. Leaving it OFF does not affect your use of the bridge, because your own node uplinks its own traffic. To be listed, turn it ON and transmit a position (phone location sharing for proxy setups, a fixed position for permanent nodes).

**If you joined via someone else's gateway ([no MQTT](connect.md))** — joining at all requires OK to MQTT ON, so condition 1 is always met. **Whether you transmit position is therefore the whole decision.**

!!! warning "For people joining through a gateway"
    If you broadcast position (including phone location sharing) you are **automatically eligible for the world map**. Turn position sharing off if you don't want that.

Either way there is nothing to apply for — meeting the conditions is enough.

!!! tip "Position precision (recommended)"
    **Channel settings → Position → set "precise location" to anything but maximum** (10–16 bits ≈ rounded to ±350 m – a few km).
    Precise positions are discarded by the official server, so leaving it at maximum actually keeps you *off* the map. Rounding is better for privacy too.

## ⚠ What becomes public

Once listed, the following is **published worldwide** (including for private groups):

- Node name (long name / short name)
- Position (rounded per the precision setting above)
- Group name (the root topic string, e.g. `ptp/commons`)

**Message contents are never mirrored** — position and node info only.

## What is "OK to MQTT" anyway?

It is a permission bit meaning "may my transmissions be relayed to MQTT *by someone else's* gateway?"

- **ON**: nearby gateways will relay your packets (so you appear on coverage maps and your reachability is visible). Recommended for commons.
- **OFF**: stops relaying via other people's gateways, and stops public-map listing. If you are connected yourself (gateway or phone proxy), your own node still reports itself — OFF only blocks *proxy relaying by others*.
- Don't confuse it with `ignore_mqtt`, which is a different, downlink-side setting (ignore packets coming down from MQTT). Leave that off.
