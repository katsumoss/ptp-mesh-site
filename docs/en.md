# 🛰️ ptp mesh (English)

An experimental Meshtastic MQTT bridge built for **sparse regions** — where nodes rarely hear each other over RF. Distant sites are stitched together over the internet, so messages hop between "islands" **even across different modem presets** (LongFast / LongMod / LongSlow …).

Unlike the official MQTT broker:

- Messages arriving from the internet are re-radiated over RF **with hops preserved** — mesh relaying continues on the far side (the official broker is zero-hop). Intentional: this is designed for sparse regions, not dense meshes, and per-group throttles exist for when an area gets busy.
- The bridge **rewrites the channel hash per destination**, so each site keeps its locally-optimal preset and they still decode each other.
- The root topic acts as a **group**: `ptp/commons` is the shared public group, `ptp/<any-name>` is your own isolated group (no server registration needed). Delivery is separated by topic; secrecy comes from your own channel PSK.

Currently running between three sites in Tokyo, Japan.

## Join / try it

Anyone can connect — same open-participation model as the official public MQTT.

| Setting | Value |
|---|---|
| Server (Address) | `160.16.104.222` : `1883` |
| Username | `friend` |
| Password | `kcu8nxvtae72r4` (all lowercase + digits, no confusable l/O/0/1) |
| Encryption | **ON** |
| TLS | **OFF** (⚠ ON will silently fail) |
| Proxy to Client | phone-proxy = **ON** / node on WiFi = **OFF** |
| Root topic | `ptp/commons` (shared) / `ptp/<your-group>` (your own) |
| Channel 0 → Uplink / Downlink | **both ON** (separate from MQTT settings) |

Keep your primary channel on the **default PSK** (`AQ==`) when joining commons. Your modem preset is free — the bridge absorbs the difference.

Nodes within RF range of one of our gateways can also join with no MQTT setup at all: just enable **OK to MQTT** (LoRa settings) and match the local gateway's preset/slot.

## Notes

- **Experimental, hobbyist-run.** TLS is off (credentials travel in plaintext), `friend` is shared by everyone, and the password may rotate.
- `ptp/commons` is public: anyone can read/write it. Private groups = separate root topic + your own PSK on a named channel.
- Nodes with **OK to MQTT ON + position enabled** get mirrored (position + node info only, never message bodies) to the official broker and appear on [meshmap.net](https://meshmap.net). Default is OFF = not listed. Set your channel position precision below maximum (precise positions are dropped by the official server anyway).

*Japanese documentation (main): [top page](index.md)*
