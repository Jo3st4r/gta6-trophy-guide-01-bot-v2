[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Jo3st4r/gta6-trophy-guide-01-bot-v2/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Jo3st4r/gta6-trophy-guide-01-bot-v2/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Platinum Road — 55 trophies, 9 one-shots, 1 missable

**55 trophies, 9 one-shots, 1 missable: hunt every one-shot before Chapter 1 locks it.**

An offline guide and tracker for all 55 PlayStation 5 trophies of Grand Theft Auto VI. Open `app/index.html` in a browser (or serve `app/` with any static server) — it works with the network off.

## What it does

- **Every trophy, with its own guide.** All 55 trophies with their official name, description and grade as reported, plus a guide in our own words for each one: what to do, where and how, and when it can be missed. Every guide cites its sources.
- **Tracker.** Tick trophies off as you earn them; progress is saved in the browser (localStorage) and can be exported to a JSON file and imported back.
- **Filters.** By grade, by kind (story, missable, collectibles, activities, strangers & side, heists, secret), by earned state, and by text search.
- **Spoiler setting.** Story trophies stay hidden — name, description and guide — until you earn them.
- **Roadmap to the platinum.** Six phases in order: the story, the one missable, the nine one-shot moments, the stranger strands, the open-world cleanup, then 100% and the platinum. Every missable trophy is flagged.
- **The nine one-shots.** Each one-shot trophy tells you to make a manual save first and retry from it if the moment fails.

## The one missable

**Positive Mental Attitude** — meditate at every spot across Leonida. It is the only missable trophy in this guide: visit every spot as you explore, because spots tied to story areas can close off once you move on.

## Honesty note

Rockstar and PlayStation had **not** published an official trophy list when this guide was built (20 November 2026). The 55 names, descriptions and grades here are the list reported in agreement by multiple outlets on 18 November 2026, and the PSNProfiles community has called the circulating named list “probably fake” — only the count of 55 traces to a dataminer claim. Treat every name, grade and guide step as **reported, not confirmed**: verify against your console's trophy list at launch. Sources are cited beside every trophy in the app and listed below.

## Sources

- Output Lag — GTA 6 Trophy List: All 55 Trophies and Achievements — https://outputlag.com/guides/gta-6-trophy-list/
- KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap — https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/
- EGamers.io — GTA 6 Trophy List: All 55 Trophies And Achievements — https://egamers.io/gta-6-trophy-list-all-55-trophies-and-achievements-plus-the-hardest-ones/
- CryptoGames — GTA 6 Trophies and Achievements: Full List — https://cryptogames.gg/gta-6-trophies-achievements-full-list/
- U7BUY — GTA 6 Trophies and Achievements Guide — https://www.u7buy.com/blog/gta-6-trophies/
- GTASnaps — GTA 6 Trophy List: What Is Confirmed, What Is Fake — https://gtasnaps.com/gta-6-trophy-list-and-achievements/

## Run it

```sh
# serve the app (any static server works)
node serve.ts        # serves app/ at http://localhost:8080
# or
python3 -m http.server --directory app 8080
```

Build the submission dossier:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).

---

Built with [make.fun](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) — try it yourself: https://make.fun/r/4h54dhb7
