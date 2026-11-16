# Art direction (research and plan)

Status: **proposal, not yet decided by Sean.** Written 2026-11-16 after Sean asked for an artwork pass ("character and ship and ... TBD"). Full research entry with all sources: shared-mind `memory/game-design-references.md`, entry "artwork: what makes ships and characters loved". Tracked in [BACKLOG.md](BACKLOG.md) (Artwork pass row).

## Where art stands today
- Crew, escorts and Reach people show initials; 24 painted portraits are specified in [PORTRAITS.md](PORTRAITS.md) and load by file name when present.
- 10 ships (Flea to Wasp) use fixed 3/4-view images; no police, marauder or customs art; planets are procedural.
- Sean says planets and ships look poor (BACKLOG). Art is made outside the build environment (ComfyUI); Claude wires it in.

## What loved games do (evidence)
Grades: opinion = practitioner writing; observational = survey or case study; measured = controlled experiment. No source tests art against retention in games.

| Finding | Grade | Source |
| --- | --- | --- |
| Design the outline first; a plain geometric outline looks artificial however detailed the inside is | opinion | Endless Sky ship-sprite guide; Starsector blog |
| Characters and ships must read as a flat silhouette at small size; detail only supports that read | opinion | TF2/Overwatch readability piece; 80.lv; studios |
| The "70% silhouette, 30% detail" figure is a folk rule, not a measurement | opinion | RocketBrush |
| Treat a ship as a character: new or beaten-up, rich or poor owner, a role in the story | opinion | Creative Bloq; Starsector blog (Mora carrier) |
| One design language per shipyard or faction tells the player its personality; a shared color language shows function | opinion | Endless Sky; Command Deck; Falling Frontier |
| Fans notice bad silhouettes (Homeworld 3 "cereal box" carrier was reshaped) | opinion (anecdote) | Windows Central |
| Busy surface detail ("greebles") reads as noise; some art should be plain on purpose; one asset is a tree, the set is the forest | opinion | Starsector blog |
| Appearance that changes with story events is tied to engagement (about avatars, not crew) | observational | BG3 study, n=149 survey + 10 interviews |
| Cute images made later detail tasks more careful; held or touched objects look cuter | measured (students, short tasks) | Nittono 2012; Ohashi and Nittono 2026 |
| Consistent style, readable line at small size, few muted colors | opinion | art commenter on itch.io |

Weak spots: no controlled test of portrait or ship art in games; cuteness studies are short lab tasks and do not fit a grimy painted tone (not recommended here).

## Recommendation (order of work)
1. **Six crew portraits first.** Most seen, already wired. Give each person one accent color and one signature prop. Test at 48 px (the circle size).
2. **Ships.** One design language per shipyard; one signature feature per hull; a grayscale silhouette test across all ships at hull-tile size; side-view versions for jump scenes; larger haulers (see New ships row). Keep detail restrained.
3. **Escorts, then Reach people.**
4. **Later:** police cutter and marauder art, equipment drawn on the hull, cutaway scene cards, a second expression per crew member after story moments (extrapolation from the BG3 finding, untested).

**Pushback on PORTRAITS.md:** one shared palette (cream, rust-orange, blue rim light) keeps the set consistent but may make 24 look-alike thumbnails. Keep the shared style, add a per-person accent color to each prompt. Generate each set in one session so lighting matches.

## Open questions for Sean
- Scope and order: crew first, or ships first?
- Planets: keep procedural, or move to clean flat style (BACKLOG "Better planet and ship graphics")?
- Ship style: keep the angled 3/4 view, or switch to a side view that also serves jump scenes?
- Characters beyond the 24 (new crew, antagonists, the player)?

## Checks to add when art lands
- Grayscale silhouette sheet of all ships at hull-tile size (distinct at a glance).
- Crew row at 48 px (six faces distinguishable).
- File size budget (portraits under about 60 KB each; baking into the HTML adds roughly 1 MB).
