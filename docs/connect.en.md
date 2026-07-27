# Join

There are two ways in: **borrow the RF of a nearby gateway**, or **make your own node a gateway**.

## Use a gateway (no MQTT setup)

Even if your node is not connected to MQTT, you can join **as long as a ptp mesh gateway is within RF range**. A nearby gateway picks up your transmission, hands it to the bridge, and it is **re-radiated over RF from the other sites** (and the same in reverse).

| Setting | Value |
|---|---|
| LoRa → **OK to MQTT** | **ON** (left at the default OFF, gateways cannot relay your packets and nothing reaches the bridge) |
| Primary channel PSK | leave at the default (`AQ==`) |
| preset / slot | **LongFast / slot 12** (the JP standard = Meshtastic's stock setting; every gateway here uses it) |

No MQTT configuration at all — just be in range. The downside is that you have few ways to confirm delivery, so if you plan to use it regularly, running your own gateway is better.

Note that if you transmit position in this mode you automatically become eligible for the [public map](map.md). Turn position sharing off if you'd rather not be listed.

## Run a gateway (MQTT)

Connect your node to the MQTT server so it becomes a relay point too. Either the node's own WiFi or the phone-app proxy is fine.

| Setting | Value |
|---|---|
| MQTT enabled | ON |
| Server (Address) | `160.16.104.222:1883` |
| Username / Password (recommended) | `friend` / `kcu8nxvtae72r4` (all lowercase + digits, no confusable characters) |
| Username / Password (legacy, still valid) | `guest` / `lboAwDEzV1Hvh33O` (⚠ starts with lowercase L, ends with capital O — copy-paste recommended) |
| Encryption | **ON** |
| TLS | **OFF** (⚠ turning it on silently fails) |
| Proxy to Client | phone proxy = **ON** / node on its own WiFi = **OFF** (backwards = silent failure) |
| Root topic | `ptp/commons` (shared group) / `ptp/<your-name>` (your own group) |
| Channel → Primary → Uplink / Downlink | **both ON** (separate from the MQTT settings; forgetting this fails silently) |

Your preset is **free** — the bridge absorbs the difference. When joining commons, keep your primary channel on the default PSK.

!!! tip "Want your own group?"
    Just change the root topic to `ptp/<any-name>`. No server-side registration needed. To make it private, also add a named channel with your own PSK.

## ⚠ Notes (this is an experiment)

- **TLS is OFF = plaintext.** Username and password travel unencrypted. Treat this as a hobbyist test server.
- **`friend` is shared by everyone.** The password may be rotated (e.g. in response to abuse); we will re-announce it if so.
- **commons is public**: anyone can read and write it, and **the root topic string is visible to anyone who connects** (its "obscurity" only works against outsiders who have no connection details). Keep private conversations in your own group with your own PSK.

## When it doesn't connect

1. Is TLS switched on? (it must be off)
2. Proxy to Client direction (phone proxy = ON / node on WiFi = OFF)
3. Are the channel's Uplink / Downlink on? (separate from the MQTT settings)
4. Wait 20–30 seconds first — nothing works right after a reboot
