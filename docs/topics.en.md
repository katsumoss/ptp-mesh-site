# Groups

In ptp mesh the **root topic *is* the group**. Everyone who sets the same root topic forms one island, and **nothing is delivered across groups**.

To join, put one of the strings below into the root topic field described in [Join](connect.md).

## Public groups

| Root topic | Area | What it is |
|---|---|---|
| `ptp/commons` | Tokyo (around Hounancho Sta. / Sendagaya Sta.) plus external participants incl. Ibaraki (Mito–Hitachinaka) | **The shared group.** A public island anyone can read and write. Start here if unsure |
| `ptp/akiba-pcn` | Akihabara (near the Radio Department Store) | The Akihabara line. **Fully isolated** from commons |

Those two are the only published groups. **You can create your own instantly by using `ptp/<any-name>`** (no server-side registration). That island connects to nobody else, though, so announce the name if you want company.

Per-site locations are on the [Gateways](gateways.md) page. For **what is actually up right now**, [meshmap.net](https://meshmap.net) is more reliable.

!!! note "A root topic is a partition, not a secret"
    Anyone who knows the root topic can join — it is a **soft partition**. If you want the contents hidden, add a **named channel with your own PSK** on top of the group. Think of it as two layers: delivery is the topic, secrecy is the PSK.

## Which server they live on

All groups live on the **ptp mesh server**, which is separate from the official broker.

| | Host | Contents |
|---|---|---|
| **ptp mesh (here)** | `160.16.104.222:1883` | `ptp/commons` / `ptp/akiba-pcn` |
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
