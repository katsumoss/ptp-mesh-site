# kbot (info bot)

**kbot** is a query bot that lives on ptp mesh. Talk to it and it replies **by direct message** with earthquake, weather-warning and typhoon information for Japan.

It has no physical node. It runs as a virtual node (`!6b626f74`) on the server and sits on the **primary channel of every group**, so people on commons and people who made their own group both reach the same information **without switching topics**.

## How to talk to it

| Method | How | Example |
|---|---|---|
| **DM (recommended)** | Pick `kbot` from your node list and DM it. **No `kbot` prefix needed** | `eq` |
| Broadcast on a channel | **Must start with `kbot`** | `kbot eq` |

**Replies always come back as a DM**, even when you asked on a channel, so the channel doesn't fill up with answers.

!!! warning "The very first message may get no reply"
    DMs only work once the two sides know each other's public key (standard Meshtastic behaviour). If kbot doesn't have your key yet, it **requests your NodeInfo first** and then replies. **If nothing comes back, just send it once more** — from the second attempt on it works normally.

## Commands

| Command | Aliases | What you get |
|---|---|---|
| `eq` | `quake` / `earthquake` | Latest earthquake. `eq 2` / `eq 3` for multiple (max 3) |
| `wr` | `warn` / `weather` | Weather warnings currently in force (by area × type) |
| `ty` | `typhoon` | Typhoon information |
| `status` | `st` | Freshness (last received, 24 h counts) and the data source |
| `help` | `?` / just `kbot` | One-line command list |
| `get time` | `time` | Current time (JST) |
| `ping` | — | Replies `pong` |

`ping` is for **isolating the path**: it exercises you → RF → GW → server → DM → GW → RF → you without touching the disaster-information pipeline.

## Real replies (captured from production)

```
help    cmds: eq=quake wr=weather-warning ty=typhoon status=freshness | get time | ping

eq      EQ 07/27 13:56 M2.7 I:1 | Near Tokara Islands, KAGOSHIMA
        | Max:Akusekijima,ToshimaMura, KAGOSHIMA | NO TSUNAMI [FINAL] (10h ago)

wr      no active WR (last update 1h ago)

ty      TY2613 DOLPHIN 998hPa W:20m/s(Gust 30m/s) at(13.7N,175.3E) mv W 30km/h (2m ago)

status  JPEQ, last msg 2m ago, SCH_TX 3h ago, 24h EQ5 WR15 TY3 EEW1. src:JPEQ by YNGMT
```

`I:1` is the JMA seismic intensity (shindo), `M2.7` the magnitude, `D:20km` the hypocentre depth. `[FINAL]` means confirmed; `PRELIMINARY` marks an **earthquake early warning issued before confirmation**, so the numbers will change afterwards.

Place names are JMA romanisations. There is a decoding table on the [disaster channel page](bousai.md#jma).

## Things worth knowing

- **Unknown commands get no reply at all.** Sending a DM for every stray word would be noise, so **staying silent** is the specification. No response = it wasn't parsed as a command.
- **Every reply is one line, ASCII only, under 200 bytes**, so it fits a single LoRa packet. Japanese would cost 3 bytes per character and cut the payload to a third, so it deliberately stays in English.
- **One request per 5 seconds** from the same node.
- If the upstream feed stalls, `eq` **keeps returning the old value silently**. Use `status` when in doubt.

## Source and disclaimer

Earthquake, weather-warning and typhoon data is republished with permission from **JPEQ (by YNGMT)**. Accuracy and timeliness are not guaranteed. **For evacuation decisions always use official JMA and municipal sources.**

If you would rather receive the same information **without asking**, set up the [`ptp-bousai` channel](bousai.md) — an independent path from kbot.
