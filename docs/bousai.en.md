# Disaster channel `ptp-bousai`

A channel that carries Japanese disaster information — earthquakes, weather warnings, typhoons — **verbatim, as it arrives**. Set it up and you receive without asking. It is **opt-in** and does not affect any of your existing channels.

To listen you **do not need MQTT**. Enter the name and PSK, and be within range of a gateway that broadcasts this channel.

!!! note "Which gateways broadcast it"
    Among the gateways we run, only the **Sendagaya gateway** broadcasts this channel over the air for now (as of 2026-11-02). The [gateway list](gateways.md) shows which ones do in the "ptp-bousai" column. Elsewhere you can still receive it if a nearby gateway operator enables it (Downlink ON, below).

## What to set (only two things)

Add **one channel** in the app and fill in these two fields.

| Field | Value |
|---|---|
| Name | `ptp-bousai` |
| PSK | `Bg==` |

!!! warning "The PSK is where people get stuck"
    The app asks you to pick a **key size**. `Bg==` is a **1-byte** key. If the selector is left on 256-bit it will not accept it. **Choose 1 byte first**, then enter `Bg==`.

- **The channel index does not matter.** Channels are identified by name and PSK, so any slot works (max 8).
- **Do not change your primary channel.** This goes in a secondary slot.
- **Leave Uplink OFF** (receive only).

!!! tip "If you run a gateway"
    Turn **Downlink ON** for this channel. **A gateway cannot re-radiate a channel it cannot decrypt**, so without it you get the "I configured it but nothing arrives" state.
    Also issue `--ch-set` **one item at a time** (batching them is a known failure).

    ```bash
    meshtastic --host <node> --ch-index 2 --ch-set name ptp-bousai
    meshtastic --host <node> --ch-index 2 --ch-set psk base64:Bg==
    meshtastic --host <node> --ch-index 2 --ch-set downlink_enabled true
    ```

    Note the CLI displays a 1-byte key as `psk=simple5` (the same thing as `Bg==` = 0x06).

## What arrives

- **Nothing is filtered out.** Even intensity 1 comes through. This is *everything*, not "just the important ones".
- **One event arrives as several messages.** It is relayed verbatim, so a single earthquake typically produces **6 messages** (headline → detail → map URL → max intensity → felt areas → tsunami status) about **12 seconds apart**. **This is not a malfunction.**
- Normal-day volume is roughly **3–4 messages per hour** (measured; about half weather warnings, the rest earthquakes and typhoons).
- The text stays **in English (ASCII)** — the on-device fonts and the 237-byte packet limit make that the practical choice.

**If you prefer to pull rather than receive**, use [kbot](kbot.md), which summarises one event into one message. The two paths are independent; using only one is fine.

## Source and disclaimer

Republished with permission from **JPEQ (by YNGMT)**. It appears in node lists as `JPEQ mirror by YNGMT`.

**Accuracy and timeliness are not guaranteed. For evacuation decisions always use official JMA and municipal sources.**

<a id="jma"></a>

## Reading JMA romanised place names

Place names are JMA's own romanisations. These are regional subdivisions that are not obvious even to Japanese readers. Taken from names actually observed on the channel.

| As shown | Meaning |
|---|---|
| `Kaetsu NIIGATA` | Kaetsu district, Niigata (northern Niigata) |
| `Chuetsu NIIGATA` | Chuetsu district, Niigata (central) |
| `Joetsu NIIGATA` | Joetsu district, Niigata (southern) |
| `Sado NIIGATA` | Sado Island, Niigata |
| `Okitama YAMAGATA` | Okitama district, Yamagata |
| `Aizu FUKUSHIMA` | Aizu district, Fukushima |
| `Kaga ISHIKAWA` | Kaga district, Ishikawa (southern) |
| `Noto ISHIKAWA` | Noto peninsula, Ishikawa (northern) |
| `Satsuma, KAGOSHIMA` | Satsuma region, Kagoshima |
| `Near Tokara Islands, KAGOSHIMA` | Waters near the Tokara Islands |
| `Hyuganada Sea, KYUSHU Region` | Hyuganada Sea, off eastern Kyushu |
| `Off Tomakomai, HOKKAIDO` | Off Tomakomai, Hokkaido |

Names with a compass direction are simply prefectural subdivisions: `Northern IBARAKI`, `Southern NAGANO`, `Eastern TOYAMA` and so on.

## Symbols in the messages

| Symbol | Meaning |
|---|---|
| `M2.7` | Magnitude |
| `I:1` | Max JMA seismic intensity (shindo) |
| `D:20km` | Hypocentre depth |
| `[FINAL]` | Confirmed information |
| `PRELIMINARY` | Early warning — **before confirmation**. The numbers will change |
| `[EEW #N]` | Earthquake early warning, Nth bulletin |
| `<D/G>` | A warning was cancelled or downgraded |
| `L:3->2` | Alert level went from 3 down to 2 |
