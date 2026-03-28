# Terraforming Mars — Custom Server

<div align="center">
  <img src="https://raw.githubusercontent.com/bafolts/terraforming-mars/main/assets/expansion_icons/expansion_icon_corporateEra.png">
  <img src="https://raw.githubusercontent.com/bafolts/terraforming-mars/main/assets/expansion_icons/expansion_icon_venus.png">
  <img src="https://raw.githubusercontent.com/bafolts/terraforming-mars/main/assets/expansion_icons/expansion_icon_colonies.png">
  <img src="https://raw.githubusercontent.com/bafolts/terraforming-mars/main/assets/expansion_icons/expansion_icon_turmoil.png">
  <img src="https://raw.githubusercontent.com/bafolts/terraforming-mars/main/assets/expansion_icons/expansion_icon_prelude.png">
  <img src="https://raw.githubusercontent.com/bafolts/terraforming-mars/main/assets/expansion_icons/expansion_icon_pathfinders.png">
</div>

Fork of [terraforming-mars/terraforming-mars](https://github.com/terraforming-mars/terraforming-mars) with custom features for competitive 3P play.

**Not affiliated with FryxGames, Asmodee Digital or Steam.**

## Play

**[tm.knightbyte.win](https://tm.knightbyte.win/)** — live server, all expansions enabled.

## What's different from upstream

- **SmartBot** — improved AI opponent with VP/MC optimization, better card evaluation, adaptive strategy
- **Elo rating system** — player ratings tracked across games, visible in Game History
- **Browser extension** — card tier ratings, synergy hints, draft advisor overlay ([tm-tierlist](https://rusliksu.github.io/tm-tierlist/))
- **Card Tier List** — 700+ cards evaluated for 3P/WGT format with economic analysis and community data
- Various UI tweaks and bugfixes

## Card Tier List

**[rusliksu.github.io/tm-tierlist](https://rusliksu.github.io/tm-tierlist/)** — interactive tier lists for corporations, preludes, project cards, and CEOs.

- 702 cards evaluated (S/A/B/C/D/F)
- Format: 3 players / World Government Terraforming / All Expansions
- Based on mathematical analysis + Reddit COTD community opinions + 290+ real game results

## Setup

```bash
git clone https://github.com/rusliksu/terraforming-mars.git
cd terraforming-mars
npm install
npm run build
npm run start
```

Server starts at `http://localhost:8080`. Uses SQLite by default (zero config). Set `POSTGRES_HOST` for PostgreSQL.

## Upstream

Based on the [open-source TM project](https://github.com/terraforming-mars/terraforming-mars) by Brian Folts and contributors. Regularly synced with upstream.

## License

GPLv3
