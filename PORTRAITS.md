# Character portraits

The game shows a portrait for every crew member, escort pilot, and named person when a matching image file exists. With no file, it shows initials, so you can add them one at a time.

## How to add one

1. Make a square image, **512 x 512 px** (it is shown as a circle, so keep the face centred), save as **WebP** (PNG also works if you keep the `.webp` name; better to convert).
2. Name it exactly as in the table below, lowercase, hyphens: for example `wren-calloway.webp`.
3. Put it in the `portraits/` folder of the repo (create the folder if needed), commit, and push. GitHub Pages picks it up. Run `node scripts/sync-pages.cjs` if you test locally.

Keep each file under about 60 KB.

## Style prompt (use for every portrait so they match the ship art)

> Painted sci-fi concept-art portrait, head and shoulders, weathered and lived-in, same look as a worn industrial spaceship: grimy cream and rust-orange tones, scuffed metal and patched cloth, dramatic rim lighting with a soft blue glow from one side, deep navy-black background, realistic painterly texture, no text, no logo, square composition, face centred.

Then add the line for the person.

## Crew

| File | Add this to the style prompt |
| --- | --- |
| `wren-calloway.webp` | Pilot, woman in her 30s, ex-medical courier, flight jacket with a stripped courier badge, honest direct stare |
| `odo-brandt.webp` | Mechanic, broad stocky man in his 50s, grease-stained coveralls, goggles pushed up on forehead, warm tired smile |
| `juno-ashby.webp` | Gunner, wiry young person, cropped hair, targeting monocle over one eye, confident smirk |
| `mattias-vell.webp` | Purser, neat middle-aged man, patched waistcoat, tablet under arm, shrewd friendly eyes |
| `dessa-quill.webp` | Smuggler, woman with a hooded coat and many pockets, sly half-smile, glint of a hidden item |
| `ruvi-okafor.webp` | Fixer, calm older man, well-worn suit jacket, hands folded, patient knowing look |

## Escort pilots

| File | Add this to the style prompt |
| --- | --- |
| `kessa-vor.webp` | Burned-out ex-courier, 40s, tired eyes, faded courier jacket |
| `dmitri-hale.webp` | Farm-station pilot, young man, sunburned, work gloves, easy grin |
| `orin-tash.webp` | Principled ex-patrol officer, stern, old patrol badge on collar |
| `mara-quill.webp` | Mechanic who talks to engines, woman with a wrench tucked in her hair, oil on cheek |
| `joss-renn.webp` | Washed-out barge racer, scarred chin, racing helmet under arm |
| `ilsa-brandt.webp` | Cartographer, woman with star charts and a calibrated eyepiece |
| `tomas-reyes.webp` | Careful and quiet, thin man, watchful eyes, high collar |
| `nia-okoro.webp` | Cheerful blockade runner, woman with a wide smile, medicine case strap on shoulder |
| `brek-soren.webp` | Salvage appraiser, stocky, magnifier on a cord, wreckage glints behind |
| `yuna-park.webp` | Runaway navigator, young woman, academy jacket with the insignia torn off |
| `cal-moreau.webp` | Charming and always late, man with a rumpled jacket and grin, pocket watch |
| `vesper-lind.webp` | Instinctive flyer, woman with wind-tossed hair, aviator goggles around neck |

## People of the Reach (News screen)

| File | Add this to the style prompt |
| --- | --- |
| `mara-venn.webp` | Relief dispatcher, woman in her 40s, headset around neck, ex-traffic controller |
| `dr-ivo-rell.webp` | Clinic director, man in a worn medical coat, kind exhausted eyes |
| `sera-holt.webp` | Relay cartographer, woman with survey sketches pinned to her jacket, distant stare |
| `nadi-quill.webp` | Independent hauler, young person in a freight-company jacket that is too big |
| `edda-vale.webp` | Reach Mutual loan officer, composed woman in a tailored dark jacket |
| `tamsin-roe.webp` | Newspaper editor, ex-relay technician, rolled sleeves, ink on fingers |

## Notes

- Generating them needs an image tool (not available inside the game build). Make all 24 in one session so the lighting stays consistent.
- A later step could bake them into the HTML file, like the ship art, so the single file stays self-contained. That adds roughly 1 MB.
