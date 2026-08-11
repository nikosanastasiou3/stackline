/* Stackline — data: drills, catalog, skills, routines, schedule
   Generated file. Edit and re-upload just this one when content changes. */
"use strict";
/* ============================================================
   STACKLINE — data model
   Modular structure: CATS, EXERCISES, SCHEDULE, seed routines,
   state {routines, logs, prefs, milestones}
============================================================ */
const CAT_GROUPS = [
  {name:"Shoulder & overhead", cats:["flexion","overhead","lats","pecs","scap"]},
  {name:"Spine & line",        cats:["thoracic","rib","line"]},
  {name:"Lower body & compression", cats:["compression","hips"]},
  {name:"Wrists",              cats:["wrist"]}
];
const CATS = [
  {id:"flexion",  name:"Shoulder flexion",   ab:"FLX"},
  {id:"overhead", name:"Overhead mobility",  ab:"OVH"},
  {id:"lats",     name:"Lats",               ab:"LAT"},
  {id:"pecs",     name:"Pecs",               ab:"PEC"},
  {id:"thoracic", name:"Thoracic extension", ab:"TSP"},
  {id:"scap",     name:"Scapular elevation", ab:"SCP"},
  {id:"rib",      name:"Rib control / line", ab:"RIB"},
  {id:"wrist",    name:"Wrist prep",         ab:"WRS"},
  {id:"legs",     name:"Legs & glutes",      ab:"LEG"},
  {id:"line",     name:"Handstand line drills", ab:"LNE"},
  {id:"compression", name:"Compression / pike", ab:"CMP"},
  {id:"hips",     name:"Hips / anterior chain", ab:"HIP"},
];
const catName = id => (CATS.find(c=>c.id===id)||{}).name || id;
const catAb   = id => (CATS.find(c=>c.id===id)||{}).ab || "—";

const WHEN = {before:"Before class", after:"After class", recovery:"Recovery day", skill:"Skill day"};

const yt = q => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const gg = q => "https://www.google.com/search?tbm=isch&q=" + encodeURIComponent(q);

const LEVELS = {1:"Level 1 · Foundation", 2:"Level 2 · Building range", 3:"Level 3 · Active control", 4:"Level 4 · Loaded / advanced"};

const EXERCISES = [
/* ---- FLEXION / OVERHEAD ---- */
{ id:"wall-slides", name:"Wall slides", cats:["scap","flexion"], fatigue:"low", level:1,
  targets:"Serratus anterior and lower trapezius, driving active shoulder flexion with the ribs held down.",
  why:"This is the drill nearly every hand-balancing and physio source starts with. It teaches your arms to travel overhead while your ribs stay stacked over your pelvis — the exact pattern that keeps a handstand straight instead of arched.",
  when:["before","recovery"],
  dosage:"2–3 × 8–10 slow reps. Pause 2 s at the top with forearms still touching the wall.",
  progression:"Once full contact is easy, move to the Level 3 lift-off variation below — same setup, but you hover the forearms off the wall at the top.",
  regression:"Step feet further from the wall or reduce range to the pain-free zone.",
  mistakes:"Ribs flaring off the wall; shrugging into the neck instead of upward rotation; forcing elbows into the wall.",
  cues:"Low back and ribs glued to the wall. Reach tall out of the armpits. Slow up, slower down.",
  pairs:"Great right before wall-facing holds or after dislocates.",
  source:"Standard physiotherapy shoulder-flexion drill, taught the same way across PT clinics and calisthenics coaching — reflects that it doubles as an assessment (Muscle & Strength / clinical exercise libraries).",
  upgrades:[
    {type:"measurable", label:"Mark the wall", detail:"Tape a strip where your forearms reach at the top — track the mark creeping higher week to week instead of going by feel."},
    {type:"harder", label:"Add resistance, or move up", detail:"Loop a light band around your wrists, or progress straight to the lift-off variation once full contact feels easy."},
  ],
  media:[
    {t:"video", label:"Wall Slide Shoulder Blade Exercise", src:"Physiotherapist Coulton Roe · YouTube", url:"https://www.youtube.com/watch?v=ab2pQvk8utE"},
    {t:"video", label:"Wall Slides — mobility check + drill", src:"YouTube", url:"https://www.youtube.com/watch?v=GaP20t6ZOfU"},
    {t:"article",label:"Scapular Wall Slide guide", src:"Muscle & Strength", url:"https://www.muscleandstrength.com/exercises/scapular-wall-slide"},
  ]},
{ id:"dislocates", name:"Band / PVC dislocates", cats:["flexion","overhead","pecs"], fatigue:"low", level:2,
  targets:"Full shoulder circumduction through pecs, lats, and the anterior capsule.",
  why:"Sweeps the whole overhead arc under light load so the last degrees of flexion stop feeling like a wall on handstand entry. It's the most universally recommended shoulder-opener in overhead training.",
  when:["before","recovery"],
  dosage:"2 × 10 slow passes. Start wide; narrow the grip only gradually over weeks.",
  progression:"Narrow the grip 1–2 cm per week as it stays pain-free. When grip width plateaus, pair it with Level 4 PAILs/RAILs flexion work to convert the new range into active strength.",
  regression:"Widen grip, use a towel, or work partial arcs front-to-overhead only.",
  mistakes:"Bending elbows to cheat the narrow grip; arching the lower back as the band passes overhead; rushing the tempo.",
  cues:"Elbows locked, ribs down, glutes lightly on. Let the shoulders rotate — don't wrestle the band.",
  pairs:"Ideal opener before wall slides or any handstand prep block.",
  source:"Consensus warm-up across Olympic weightlifting, gymnastics and calisthenics coaching for opening overhead range before loading it.",
  upgrades:[
    {type:"both", label:"Switch to a rigid dowel", detail:"A broomstick or PVC pipe can't stretch to hide a restriction the way a band can — and it turns your grip width into an honest, trackable number."},
    {type:"measurable", label:"Mark your grip width", detail:"Tape or a pen mark on the dowel at your current hand position. Narrowing it a centimeter a week is a real log, not a feeling."},
    {type:"harder", label:"Add light load", detail:"Once bodyweight passes feel easy, tape a small plate to the center of the dowel for a loaded overhead pass-through."},
  ],
  media:[
    {t:"video", label:"How To Do Band Dislocates / Pass-Throughs", src:"YouTube", url:"https://www.youtube.com/watch?v=riVxa9By-pM"},
    {t:"article",label:"Banded Shoulder Dislocates guide", src:"Muscle & Strength", url:"https://www.muscleandstrength.com/exercises/banded-shoulder-dislocates"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("shoulder dislocates band exercise form")},
  ]},
{ id:"scap-wall-slides", name:"Scapular wall slides + lift-off", cats:["scap","flexion","overhead"], fatigue:"med", level:3,
  targets:"End-range active flexion — the lower traps and serratus working overhead, unsupported.",
  why:"Passive range you can't hold is range you don't own upside-down. Hovering off the wall converts the top of your flexion from something gravity gave you into something you can actively produce — the direct bridge to a real handstand line.",
  when:["before","skill"],
  dosage:"2 × 6–8 slides, each with a 2–3 s hover off the wall at the top.",
  progression:"Once the hover is steady for 3 s, hold light plates during the hover, or move to the freestanding shrug (Level 4) for the fully-inverted version of the same skill.",
  regression:"Skip the hover; just trace the wall with full contact (this is Level 1 wall slides).",
  mistakes:"Ribs popping to reach higher; the hover turning into a shrug into the neck; wrists leading instead of pinkies.",
  cues:"Grow out of the wall, hover without moving anything else. Shaking is fine — that's the adaptation.",
  pairs:"The bridge between passive stretching and wall-facing work.",
  source:"Progression logic follows the standard active-range-of-motion principle used in physio and FRC-style training: passive range first, then the same range trained actively.",
  upgrades:[
    {type:"measurable", label:"Time the hover", detail:"Log hover seconds each session with a phone timer — that number climbing is the real signal active flexion is improving."},
    {type:"harder", label:"Load the hover", detail:"Hold light plates during the hover, or move to the free handstand shrug once the hover is rock-steady for 5+ seconds."},
  ],
  media:[
    {t:"video", label:"Wall Slides — form and progression", src:"YouTube", url:"https://www.youtube.com/watch?v=ab2pQvk8utE"},
    {t:"gif",   label:"Lift-off variation reference", src:"Image search", url:gg("wall slide lift off active shoulder flexion")},
    {t:"article",label:"Serratus wall slide breakdown", src:"K Squared Fitness · YouTube description", url:"https://www.youtube.com/watch?v=eI7IHxvhA3k"},
  ]},
{ id:"pails-rails-flexion", name:"Shoulder flexion PAILs/RAILs", cats:["flexion","overhead"], fatigue:"med", level:4,
  targets:"End-range shoulder flexion under isometric load — capsule and rotator cuff strength exactly where you're stuck.",
  why:"This is the method serious mobility coaches (Functional Range Conditioning) use to convert a stretch into permanent range: you contract into the stretch, then contract out of it. For a stalled overhead angle after wall slides and dislocates stop moving the needle, this is the next lever.",
  when:["before","recovery"],
  dosage:"1 round: 20–30 s passive stretch → 10 s gentle PAIL (push back against the stretch) → 10 s RAIL (pull further into it) → repeat 2–3 rounds.",
  progression:"Deepen the starting stretch angle over weeks as end-range strength improves. This is the ceiling drill — once this stops being hard, your flexion restriction is likely resolved.",
  regression:"Reduce the stretch depth and hold the isometrics for less time (5 s) until the position feels controlled, not just held.",
  mistakes:"Skipping the passive stretch and going straight to isometrics; holding your breath during the contractions; forcing depth instead of building it.",
  cues:"Contract like you're trying to move out of the stretch, then contract like you're trying to move deeper into it. Both against your own resistance.",
  pairs:"Do this after dislocates and wall slides have warmed the joint — not as a cold starting drill.",
  source:"Functional Range Conditioning (Dr. Andreo Spina) — PAILs/RAILs is the named methodology; applied here specifically to shoulder flexion for overhead athletes.",
  upgrades:[
    {type:"measurable", label:"Log your starting depth", detail:"Note hand or arm position on a wall mark at the start of each round — a deeper starting stretch over weeks is the ceiling actually moving."},
    {type:"harder", label:"Extend the holds", detail:"Push the isometric phases from 10 s toward 15–20 s, or add light band resistance to the PAIL phase."},
  ],
  media:[
    {t:"video", label:"Shoulder Flexion — PAILs/RAILs", src:"YouTube", url:"https://www.youtube.com/watch?v=IxKMX6818lY"},
    {t:"video", label:"Shoulder Flexion PAIL's/RAIL's (FRC-based)", src:"YouTube", url:"https://www.youtube.com/watch?v=bMhzHWL4PrM"},
    {t:"article",label:"What PAILs/RAILs actually train", src:"Markow Training Systems", url:"https://www.markowtrainingsystems.com/2022/12/04/p-a-i-l-s-and-r-a-i-l-s-explained/"},
  ]},

/* ---- LATS ---- */
{ id:"oh-lat-stretch", name:"Overhead wall lat stretch", cats:["lats","overhead"], fatigue:"low", level:1,
  targets:"Both lats and the long head of triceps, in a two-hand overhead reach against a wall.",
  why:"Tight lats pull the arms forward and drag the back into a banana. Lengthening them lets the arms stack over the torso instead of in front of it.",
  when:["after","recovery"],
  dosage:"2–3 × 30–45 s. Both hands on the wall, breathing into the sides — not the low back.",
  progression:"Once 45 s is easy without the lower back sagging, try the one-arm version below for a deeper stretch on each side individually, or move to the PNF version (Level 3) for a bigger single-session gain.",
  regression:"Stand closer to the wall and hinge less at the hips.",
  mistakes:"Letting the lower back sag to fake range; holding the breath; shoulders creeping up toward the ears instead of staying long.",
  cues:"Ribs pulled down, hinge at the hips, let the chest sink down through straight arms.",
  pairs:"Follow with wall slides to convert the new range into active control.",
  source:"Standard hand-balancing lat opener. Cross-checked against The Prehab Guys and multiple lat-stretch guides: both one-arm and two-arm wall versions are widely taught. Two-arm is the more common default and slightly gentler; one-arm gives a deeper, more targeted stretch per side with a rotation bias. Kept as separate options here rather than treated as identical.",
  upgrades:[
    {type:"measurable", label:"Mark the wall", detail:"Tape your fingertip reach during a full lean — the mark inching further out is your honest number."},
    {type:"harder", label:"One arm at a time", detail:"Place just one hand on the wall, step the same-side foot back, and add a slight lean away. This isolates each lat individually and typically finds more depth than the two-hand version."},
  ],
  media:[
    {t:"video", label:"Overhead Lat Stretch for Handstands", src:"YouTube", url:"https://www.youtube.com/watch?v=UvZMX-cDqZg"},
    {t:"video", label:"Overhead Wall Stretch", src:"YouTube", url:"https://www.youtube.com/watch?v=fgPPTH-LkY0"},
    {t:"article",label:"Standing overhead lat stretch reference", src:"Physitrack", url:"https://us.physitrack.com/home-exercise-video/standing-overhead-lat-stretch"},
  ]},
{ id:"bench-lat-opener", name:"Puppy pose — elbows elevated", cats:["lats","thoracic","overhead"], fatigue:"low", level:2,
  targets:"Lats, thoracic extension, and deep overhead flexion, with the arms locked in a fixed line by the elevated elbows.",
  why:"Elbows raised on a bench or blocks lock the arms overhead so gravity does the opening for you at exactly the handstand angle between arm and torso — this is the position doing the most work in your Saturday session.",
  when:["after","recovery"],
  dosage:"3 × 45–60 s. Hold a light stick with palms up to bias external rotation if you have one.",
  progression:"As depth increases, lower the block height, or move to a contract-relax version — press the elbows down into the blocks for a few seconds, then sink deeper on the release.",
  regression:"Higher surface under the elbows, wider elbows, shorter holds.",
  mistakes:"Dumping into the lower back instead of the thoracic spine; elbows sliding wide; craning the neck up to breathe.",
  cues:"Ribs pulled toward the hips, chest melts through the arms. Long exhale on every sink.",
  pairs:"Core of the Saturday long session; pair with the bodyline drill afterward.",
  source:"This is not the classic \"extended puppy pose\" (that name refers to the straight-arm, hands-on-the-floor yoga version). The bent-elbow, elevated version here is a distinct pose sometimes called the \"butcher block stretch,\" documented separately by YogaUOnline (\"Puppy Pose 2.0\"), Yoga15, and Antranik Kizirian's wall variation for handstand training specifically.",
  upgrades:[
    {type:"measurable", label:"Log the block height", detail:"Note how many inches your elbows sit above the floor — needing a lower surface over weeks is direct proof of new range."},
    {type:"harder", label:"Add a stick or pulse", detail:"Hold a light stick overhead with palms up to bias external rotation, or add a gentle pulsing sink on each exhale."},
  ],
  media:[
    {t:"video", label:"Elevated Bent Elbow Puppy Pose (Butcher Block Stretch)", src:"YouTube", url:"https://www.youtube.com/watch?v=_jg2fJ7FnGI"},
    {t:"video", label:"How To Do Puppy Pose With Yoga Blocks", src:"YouTube", url:"https://www.youtube.com/watch?v=_-JgQJyqg7U"},
    {t:"article",label:"Puppy Pose 2.0 — elbows on blocks", src:"YogaUOnline", url:"https://yogauonline.com/yoga-practice-teaching-tips/yoga-practice-tips/create-mobility-in-the-upper-body-with-puppy-pose-yoga-2-0/"},
  ]},
{ id:"lat-pnf", name:"Lat stretch with PNF reach", cats:["lats","overhead"], fatigue:"med", level:3,
  targets:"Lats and teres major using a contract-relax (PNF) technique for a bigger single-session range gain.",
  why:"A gentle contraction against resistance before relaxing deeper into the stretch produces more range in one set than static holding alone — useful when overhead reach has plateaued on the basic stretch.",
  when:["after","recovery"],
  dosage:"3 rounds: 20 s passive stretch → 5–6 s gentle push against a wall/band → relax and sink 10–15 s deeper.",
  progression:"Once this stops adding range session to session, move to the loaded PAILs/RAILs lat stretch (Level 4).",
  regression:"Skip the contraction phase and hold the passive stretch only (this is Level 1 overhead lat stretch).",
  mistakes:"Pushing hard enough to strain rather than a gentle 20–30% contraction; forgetting to fully relax between rounds.",
  cues:"Push gently, like you're trying to move out of the stretch — then let go completely and let the new range arrive on its own.",
  pairs:"Do after your session is already warm, not as a cold opener.",
  source:"PNF (proprioceptive neuromuscular facilitation) contract-relax stretching — a well-established sports-therapy technique, applied here to the overhead lat line.",
  upgrades:[
    {type:"measurable", label:"Compare round 1 to round 3", detail:"Check your reach against a wall mark before and after — the gap between rounds is the real number, not just how open it feels."},
    {type:"harder", label:"Add resistance, or move up", detail:"Add light band resistance to the push phase, or progress to the loaded PAILs/RAILs version below."},
  ],
  media:[
    {t:"video", label:"Fix Your Overhead Reach with This Lat PNF Stretch", src:"YouTube", url:"https://www.youtube.com/watch?v=8sJHzn4MIJc"},
    {t:"article",label:"Wall Lat Stretch technique", src:"The Prehab Guys", url:"https://library.theprehabguys.com/vimeo-video/wall-lat-stretch/"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("lat stretch PNF contract relax overhead")},
  ]},
{ id:"lat-pails-rails", name:"Lat stretch PAILs/RAILs", cats:["lats","flexion"], fatigue:"med", level:4,
  targets:"Lats and shoulder extensors under isometric load at the deepest part of your overhead reach.",
  why:"The loaded end of the lat-opening progression. If your overhead line still collapses under handstand load despite good passive range, this builds the strength to hold the new range, not just visit it.",
  when:["before","recovery"],
  dosage:"20–30 s passive lat stretch → 10 s PAIL → 10 s RAIL → repeat 2–3 rounds per side. This is a shortened, practical version — the full FRC protocol calls for a 2-minute initial hold, which is a lot to ask on a training day. Use the longer hold on days you have time.",
  progression:"This is the top of the lat progression — from here, range gains transfer directly into wall-facing hold quality.",
  regression:"Drop back to the PNF version (Level 3) or the basic overhead lat stretch (Level 1) if isometrics feel like straining rather than working.",
  mistakes:"Rushing through the isometric holds; not warming the shoulder up first with dislocates or wall slides.",
  cues:"Same contract-in / contract-out pattern as flexion PAILs/RAILs, applied to the side-body stretch position.",
  pairs:"Pair with pails-rails-flexion in the same session for a complete active-flexibility block — but no more than 2–3x a week. FRC guidance is explicit that maximal-effort PAILs/RAILs need recovery time like any strength work.",
  source:"Functional Range Conditioning (FRC), the isometric-loading method created by Dr. Andreo Spina — cross-checked against The Prehab Guys' technique breakdown and K Squared Fitness, a strength coach applying the same method outside of a yoga context, confirming it's a legitimate tool in calisthenics and gymnastics circles, not just flexibility training.",
  upgrades:[
    {type:"measurable", label:"Log starting depth every session", detail:"The position you can hold before the round even begins should creep deeper over weeks — that's the number that matters."},
    {type:"harder", label:"Extend or load the phases", detail:"Hold each isometric phase a few seconds longer, or add a small plate during the RAIL phase."},
  ],
  media:[
    {t:"video", label:"Lat Stretch with PAILs/RAILs for Shoulder Flexion", src:"YouTube", url:"https://www.youtube.com/watch?v=9yYClQLPoVM"},
    {t:"article",label:"PAILs and RAILs explained", src:"Markow Training Systems", url:"https://www.markowtrainingsystems.com/2022/12/04/p-a-i-l-s-and-r-a-i-l-s-explained/"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("lat PAILs RAILs stretch form")},
  ]},

/* ---- PECS ---- */
{ id:"pec-doorway", name:"Pec doorway stretch", cats:["pecs"], fatigue:"low", level:1,
  targets:"Pec major and minor, anterior shoulder.",
  why:"Short pecs drag the shoulders forward and block the final stack. Opening them frees the line without any strength cost — the cheapest range you'll gain all week.",
  when:["after","recovery"],
  dosage:"2 × 30–40 s per side at two elbow heights (90° and high elbow).",
  progression:"Once static holding stops producing new range, move to the upgraded contract-relax version (Level 2).",
  regression:"Step back less; lower elbow position only.",
  mistakes:"Rotating the whole torso to fake depth; shrugging; pushing into pinchy front-of-shoulder pain.",
  cues:"Squeeze the shoulder blade gently back, step through, chest proud. Stretch in the chest, never pinching in the joint.",
  pairs:"Slot after class or in the Sunday recovery flow.",
  source:"One of the most-taught corrective stretches in physical therapy for anterior shoulder tightness.",
  upgrades:[
    {type:"measurable", label:"Mark your stance", detail:"Tape the floor at your foot position when you first feel tension — that mark moving further from the doorway is the number."},
    {type:"harder", label:"Raise the elbow, or move up", detail:"Move to the high-elbow variation, or progress straight to the upgraded contract-relax version below."},
  ],
  media:[
    {t:"video", label:"Guided Motion: Doorway Pec Stretch", src:"YouTube", url:"https://www.youtube.com/watch?v=Yh5HQiz8Bkw"},
    {t:"video", label:"Doorway Pec Stretch — 90° abduction", src:"MedBridge · YouTube", url:"https://www.youtube.com/watch?v=M850sCj9LHQ"},
    {t:"article",label:"Technique breakdown", src:"Gulf Coast Spine & Sport", url:"https://www.youtube.com/watch?v=qMSQoI-GITY"},
  ]},
{ id:"pec-doorway-upgraded", name:"Doorway pec stretch — upgraded", cats:["pecs"], fatigue:"low", level:2,
  targets:"Pec major and minor with an added end-range activation for lasting change, not just a temporary stretch.",
  why:"Static stretching alone gives range that fades within hours. Adding a brief contraction at end range is what makes the pec opening actually stick between sessions.",
  when:["after","recovery"],
  dosage:"2–3 rounds per side: 20 s passive lean → 5 s gentle push back into the frame → sink deeper.",
  progression:"This is the practical ceiling for pec work — from here, focus shifts to lats and thoracic extension, which are usually the bigger limiters for handstand.",
  regression:"Drop the contraction phase and use the basic doorway stretch (Level 1).",
  mistakes:"Same as the basic version, plus pushing the contraction too hard — this should be a gentle 20–30% effort.",
  cues:"Lean, push gently against the frame for a few seconds, relax, then notice you can lean a little further.",
  pairs:"Good superset with the pec-doorway basic version as a warm-up-then-work pairing.",
  source:"Contract-relax progression applied to the standard doorway stretch — same PNF principle used in the lat and flexion progressions above.",
  upgrades:[
    {type:"measurable", label:"Track how much you sink", detail:"Note how much further the same gentle push lets you lean by round 3 versus round 1 — that delta is the real progress marker."},
    {type:"harder", label:"Add a torso rotation", detail:"Rotate the torso slightly away from the working arm at the end of each round for a deeper stretch angle."},
  ],
  media:[
    {t:"video", label:"The Doorway Pec Stretch UPGRADED", src:"YouTube", url:"https://www.youtube.com/watch?v=l5nMszaaJ28"},
    {t:"video", label:"Doorway Pec Stretch technique", src:"Wellen · YouTube", url:"https://www.youtube.com/watch?v=bZ-eaBPOGiM"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("doorway pec stretch contract relax")},
  ]},

/* ---- THORACIC ---- */
{ id:"tspine-ext", name:"Thoracic extension over roller", cats:["thoracic"], fatigue:"low", level:1,
  targets:"Mid-back extension, segment by segment.",
  why:"If the upper back can't extend, the lower back does it for you — hello banana. This drill puts the arch where it belongs, and it's the single most-cited fix for a stiff t-spine in overhead work.",
  when:["before","after","recovery"],
  dosage:"6–8 slow extensions per segment, 3–4 segments. ~2 min total.",
  progression:"Once comfortable, add arms overhead holding a light weight, or move to wall angels (Level 2) to combine t-spine extension with scapular control.",
  regression:"Support the head with hands; smaller range; use a rolled towel instead of a roller.",
  mistakes:"Hinging only at one hot spot; flaring the ribs and arching the lumbar instead of the thoracic; holding the breath.",
  cues:"Ribs stay down, extend over the roller not off it. Exhale as you drape back.",
  pairs:"Do before the bench lat opener — extension first, then lats.",
  source:"Standard physical-therapy thoracic mobilization, universally taught the same way (The Prehab Guys, Muscle & Strength, and general PT libraries all converge on this exact setup).",
  upgrades:[
    {type:"measurable", label:"Count segments cleared", detail:"Note how many vertebrae up the roller extend cleanly without the ribs flaring — more segments is more progress."},
    {type:"harder", label:"Add load, or move up", detail:"Hold a light weight with arms overhead, or move to wall angels below to combine extension with active scapular control."},
  ],
  media:[
    {t:"video", label:"Thoracic Extension on Foam Roller", src:"YouTube", url:"https://www.youtube.com/watch?v=J1-aNR1yby0"},
    {t:"video", label:"Foam Roller Thoracic Extension", src:"YouTube", url:"https://www.youtube.com/watch?v=9Y11Kc0E0og"},
    {t:"article",label:"Segment-by-segment technique", src:"The Prehab Guys", url:"https://library.theprehabguys.com/vimeo-video/thoracic-spine-extension-on-foam-roller/"},
  ]},
{ id:"wall-angels", name:"Wall angels", cats:["thoracic","scap"], fatigue:"low", level:2,
  targets:"Thoracic extension, scapular upward rotation, and deep neck flexors — all at once, standing.",
  why:"One of the highest bang-for-buck combination drills: it forces t-spine extension and scapular control together, which is exactly the coordination a handstand line needs, without any equipment.",
  when:["before","after","recovery"],
  dosage:"2 × 8–10 slow reps, forearms tracking the wall the whole way.",
  progression:"If you can't keep contact through the full range, use the isometric wall-angel hold at your current end range first, then build toward the full sliding version.",
  regression:"Reduce range to wherever contact can be maintained; use the pec-stretch + lift-off prep drill first if the starting position itself feels blocked.",
  mistakes:"Losing contact with the wall (head, low back, wrists) to fake more range; shrugging up instead of sliding.",
  cues:"Flatten low back to the wall, slide arms up only as far as everything stays in contact.",
  pairs:"Pairs naturally with thoracic extension over roller — do the roller version supine, then wall angels standing to reinforce the same opening under control.",
  source:"A staple rehab and prehab exercise (used broadly in physical therapy) that hand-balancing coaches have adopted for the same reason — it trains extension and scapular upward rotation as one coordinated pattern.",
  upgrades:[
    {type:"measurable", label:"Mark your ceiling", detail:"Tape the wall at the highest point you can slide to while staying in full contact — track it climbing."},
    {type:"harder", label:"Add resistance or slow down", detail:"Loop a light band around the wrists, or slow the tempo to a 3-second rise and fall."},
  ],
  media:[
    {t:"video", label:"How to Perform Wall Angel for Tight Upper Back", src:"YouTube", url:"https://www.youtube.com/watch?v=1UU4VvklQ44"},
    {t:"video", label:"Wall Angel — form walkthrough", src:"YouTube", url:"https://www.youtube.com/watch?v=cvx06snMQ3A"},
    {t:"article",label:"Prep stretches if you can't hold contact", src:"The Prehab Guys", url:"https://library.theprehabguys.com/vimeo-video/wall-pec-stretch-and-standing-childs-pose-to-improve-your-wall-angel/"},
  ]},

/* ---- SCAP ---- */
{ id:"scapular-pushups", name:"Scapular push-ups", cats:["scap"], fatigue:"low", level:1,
  targets:"Serratus anterior — pure protraction/retraction with no elbow bend.",
  why:"This is the standard warm-up before any handstand shrug work: it isolates the exact muscle (serratus) that has to fire to keep your shoulder blades wrapped around your ribs instead of winging under load.",
  when:["before","recovery"],
  dosage:"2 × 10–12 reps. Small range — only the shoulder blades move.",
  progression:"Once this is easy from the toes, move straight to pike shrugs or wall-facing shrugs (Level 2–3) for the loaded, elevation-specific version.",
  regression:"Perform from the knees instead of the toes.",
  mistakes:"Bending the elbows to increase range; letting the hips sag; rushing instead of pausing at each end.",
  cues:"Arms are pillars — only your shoulder blades travel. Push the floor away, then let your chest sink slightly between the blades.",
  pairs:"Use as a warm-up before wall-facing shrugs, not as a substitute for them.",
  source:"A well-established serratus-activation drill from physical therapy and gymnastics conditioning alike (Redefining Strength, Niel Asher Education).",
  upgrades:[
    {type:"measurable", label:"Count clean reps", detail:"Track how many you can do with a full pause at each end before form breaks down."},
    {type:"harder", label:"Elevate the feet, or move up", detail:"Raise the feet on a box for more load, or move straight to pike shoulder shrugs."},
  ],
  media:[
    {t:"video", label:"Scapula Pushup — form breakdown", src:"YouTube", url:"https://www.youtube.com/watch?v=5YHZnEsE9hA"},
    {t:"video", label:"Exercise With an Athletic Trainer: Scapular Pushups", src:"YouTube", url:"https://www.youtube.com/watch?v=LeMk15TN0No"},
    {t:"article",label:"Full coaching cues", src:"Redefining Strength", url:"https://redefiningstrength.com/scapular-push-ups/"},
  ]},
{ id:"pike-shrugs", name:"Pike shoulder shrugs", cats:["scap"], fatigue:"med", level:2,
  targets:"Scapular elevation with partial load — traps and serratus working together.",
  why:"The scaled version of handstand shrugs: builds the push-tall reflex without the balance or fatigue cost of being upside down.",
  when:["before","skill","recovery"],
  dosage:"3 × 8–12 reps, feet elevated on a box for more transfer.",
  progression:"Elevate feet higher to approach vertical, then move to wall-facing shrugs (Level 3) once the shrug feels strong and controlled here.",
  regression:"Hands on a raised surface, or reduce range.",
  mistakes:"Bending elbows; letting the head hang without intent; rushing the reps.",
  cues:"Lock elbows, push the world away, pause tall at the top of every rep.",
  pairs:"Superset with wall slides for a full elevation circuit on short days.",
  source:"Common calisthenics-coaching scaling of the handstand shrug for athletes not yet holding a wall handstand comfortably.",
  upgrades:[
    {type:"measurable", label:"Log the box height", detail:"Note how high your feet are elevated — the higher it climbs, the closer this gets to true handstand loading."},
    {type:"harder", label:"Pause, or move up", detail:"Add a 3-second pause at the top of every rep, or progress to wall-facing handstand shrugs."},
  ],
  media:[
    {t:"video", label:"Pike push-up / shrug positioning reference", src:"YouTube", url:"https://www.youtube.com/watch?v=akgQbxhrhOc"},
    {t:"gif",   label:"Form loop / GIF", src:"Image search", url:gg("pike shrugs exercise handstand prep")},
    {t:"article",label:"Scapular shrug mechanics", src:"Antranik Kizirian", url:"https://antranik.org/the-bodyline-drills/"},
  ]},
{ id:"wf-shrugs", name:"Wall-facing handstand shrugs", cats:["scap","line"], fatigue:"high", level:3,
  targets:"Scapular elevation strength in the fully inverted position.",
  why:"Active elevation is what locks the stack. Shrugging under load, upside down, teaches you to push tall exactly where it matters — this is the drill Kyle Weiger's handstand tutorial calls out as the go-to conditioning tool once basic shoulder flexion is in place.",
  when:["before","skill"],
  dosage:"3 × 5–8 slow shrugs inside a wall-facing hold. Full depress → full elevate.",
  progression:"Once you can do 3×8 with a clean 2 s pause at the top, freestanding handstand shrugs (Level 4) are the natural next step.",
  regression:"Do pike shrugs (Level 2) or scapular push-ups (Level 1) in a supported position first.",
  mistakes:"Bending elbows; turning it into a head-bob; losing rib position while shrugging.",
  cues:"Arms are pillars — only the shoulder blades travel. Ears get further from shoulders at the top.",
  pairs:"Directly after wall-facing holds, or superset with pike shrugs on low-energy days.",
  source:"A named staple in hand-balancing coaching (referenced e.g. in Kyle Weiger's handstand-tutorial breakdown) as the conditioning bridge between scapular activation and full handstand control.",
  upgrades:[
    {type:"measurable", label:"Count clean shrugs per set", detail:"With a 2-second pause at the top — that number rising is real strength, not luck."},
    {type:"harder", label:"Pause longer, or move up", detail:"Hold a longer pause at end range, or progress to the free handstand shrug once 3×8 feels easy."},
  ],
  media:[
    {t:"video", label:"Drastically increase your scapular elevation", src:"YouTube Shorts", url:"https://www.youtube.com/shorts/dtJ0-LNwIQk"},
    {t:"article",label:"Wall Shrugs — full coaching breakdown", src:"Kyle Weiger", url:"https://kyleweiger.com/handstand-tutorial-breakdown/"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("wall facing handstand shrugs form")},
  ]},
{ id:"free-handstand-shrug", name:"Free handstand shrug", cats:["scap","line"], fatigue:"high", level:4,
  targets:"Scapular elevation strength with zero wall support — the fully-expressed, competition-standard version.",
  why:"The top of the scapular-elevation progression. GymnasticBodies teaches this as the direct test of whether your shoulder elevation actually holds up in a real, unsupported handstand.",
  when:["skill"],
  dosage:"3–5 × 3–5 slow shrugs inside a freestanding handstand (against a spotter, wall-adjacent, or in a doorframe handstand if balance isn't there yet).",
  progression:"This is the ceiling drill for the scap category — from here, progress is about handstand balance training itself, not more mobility work.",
  regression:"Go back to wall-facing shrugs (Level 3) until freestanding hold time is consistently 20–30 s.",
  mistakes:"Attempting this before a freestanding handstand is reasonably consistent — it's a strength drill for people who can already balance, not a way to learn balance.",
  cues:"Full scapular elevation with no gap between shoulders and ears at the top; a small, controlled gap appears as you depress.",
  pairs:"The natural finisher once wall-facing shrugs feel easy and your freestanding hold is developing.",
  source:"GymnasticBodies — published as \"Free Handstand Shrug,\" explicitly for building the rotator cuff and scapular elevation strength needed for handstand balance.",
  upgrades:[
    {type:"measurable", label:"Log unsupported hold time", detail:"This is the real ceiling metric for the whole scapular category — track it directly."},
    {type:"harder", label:"Reduce assistance, or slow down", detail:"Wean off spotter or wall assistance incrementally, or slow every shrug to a 3-second tempo."},
  ],
  media:[
    {t:"article",label:"Free Handstand Shrug — official breakdown", src:"GymnasticBodies", url:"https://www.gymnasticbodies.com/exercises/free-handstand-shrug/"},
    {t:"video", label:"Wall shrug progression (build toward this)", src:"YouTube Shorts", url:"https://www.youtube.com/shorts/dtJ0-LNwIQk"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("free handstand shrug gymnasticbodies")},
  ]},

/* ---- RIB CONTROL / LINE ---- */
{ id:"hollow-line", name:"Hollow body hold", cats:["rib"], fatigue:"med", level:1,
  targets:"Rib-down position, posterior pelvic tilt, and full-body tension with arms overhead.",
  why:"New shoulder range is only useful if the ribs don't leak. This wires ribs-down with arms fully overhead — your anti-banana insurance, and the shape every hand-balancing coach builds on first.",
  when:["before","skill","recovery"],
  dosage:"3 × 20–30 s hold, arms by ears. Lower back lightly pressing the floor.",
  progression:"Once 30 s is clean and ribs stay closed, move to the bodyline drill (Level 2) to train the same shape in the actual push-up/handstand plank position.",
  regression:"Bend the knees or keep arms forward until ribs stay down.",
  mistakes:"Arms by ears but ribs flared — that's the exact fault it exists to fix; chin jammed to chest.",
  cues:"Exhale ribs to hips first, then send arms back only as far as ribs allow.",
  pairs:"Immediately before wall-facing holds to preload the shape.",
  source:"GMB Fitness's Hollow Body Hold tutorial and the broader gymnastics-conditioning canon — this is the foundational core shape behind every straight-line handstand.",
  upgrades:[
    {type:"measurable", label:"Time the hold", detail:"Log seconds directly — 30 clean seconds with ribs shut is the benchmark before moving on."},
    {type:"harder", label:"Extend the line, or add motion", detail:"Reach arms and legs further from center, or add a slow rock without losing the shape."},
  ],
  media:[
    {t:"video", label:"Hollow Body Hold Progression", src:"YouTube", url:"https://www.youtube.com/watch?v=LlDNef_Ztsc"},
    {t:"video", label:"Hollow Body Hold — proper form", src:"YouTube", url:"https://www.youtube.com/watch?v=0yPin8hSc8o"},
    {t:"article",label:"Full tutorial with 3 progressions", src:"GMB Fitness", url:"https://gmb.io/hollow-body/"},
  ]},
{ id:"bodyline-drill", name:"Bodyline drill (front + back line)", cats:["rib","line"], fatigue:"med", level:2,
  targets:"The straight-line shape trained on the floor first, so it's pattern-memorized before you're upside down.",
  why:"If you can't hold a straight line on the floor, holding it while inverted and balancing is much harder. This drill assesses and conditions your front-line and back-line shapes separately, which is exactly how coaches diagnose whether a banana back comes from the front (hip/rib control) or the back (shoulder/thoracic).",
  when:["before","skill"],
  dosage:"3 × 15–20 s each: front line (plank-based) and back line (prone, arms overhead).",
  progression:"Once both lines hold cleanly for 20 s with no wobble, move into the wall-facing hold (Level 2 line) — the same shape, now supported and closer to vertical.",
  regression:"Shorter holds, or perform against a wall for tactile feedback on where the line breaks.",
  mistakes:"Ribs flaring in the front line; lower back overextending in the back line; holding the breath instead of maintaining tension while breathing.",
  cues:"Full-body tension from fingers to toes — this should feel like a plank at both ends, not a relaxed stretch.",
  pairs:"Do right before any wall-facing work — it's the same shape, just not vertical yet.",
  source:"A named diagnostic + conditioning tool in handstand coaching for isolating exactly where a line breaks down (front vs. back), cross-referenced against Antranik Kizirian's plank/hollow/arch mini-routine.",
  upgrades:[
    {type:"measurable", label:"Time each line separately", detail:"Log front-line and back-line hold times individually to see which one is actually your limiter."},
    {type:"harder", label:"Remove the wall, or add a hold", detail:"Perform away from the wall for less tactile feedback, or add a 2-count hold at the hardest point of each rep."},
  ],
  media:[
    {t:"video", label:"BODYLINE DRILL - Straighten your handstand", src:"YouTube", url:"https://www.youtube.com/watch?v=s25mnmEjpTg"},
    {t:"video", label:"Handstand Body Line Drills (front + back + chest-to-wall)", src:"YouTube", url:"https://www.youtube.com/watch?v=xf3wyGo373Y"},
    {t:"article",label:"The Bodyline Drills mini-routine", src:"Antranik Kizirian", url:"https://antranik.org/the-bodyline-drills/"},
  ]},
{ id:"wf-hold", name:"Wall-facing handstand hold", cats:["line","flexion","rib"], fatigue:"high", level:2,
  targets:"Full-body line: open shoulders, ribs down, posterior tilt, toes reaching.",
  why:"The single best transfer drill — it *is* the handstand line, with the wall as honest feedback on your stack. GMB Fitness calls chest-to-wall the \"preferred and often overlooked prerequisite\" before any free-balancing work.",
  when:["before","skill"],
  dosage:"3–5 × 20–40 s, nose-and-toes as close to the wall as your line allows.",
  progression:"Once you can hold 20–30 s for 3+ clean sets, move to toe pulls and finger pulls (Level 3) to start training the balance point itself.",
  regression:"Feet higher up the wall in a pike-ish angle; shorter holds further from the wall.",
  mistakes:"Ribs flaring off the wall; sagging into passive shoulders; holding the breath and grinding through it.",
  cues:"Push the floor away, ribs to the wall, squeeze glutes, reach the ceiling with your toes.",
  pairs:"Cap your prep block with this — mobility work first, then express it here.",
  source:"GMB Fitness's freestanding-handstand progression explicitly names chest-to-wall as the key prerequisite drill; also taught the same way across most hand-balancing coaching.",
  upgrades:[
    {type:"measurable", label:"Log every set, not your best", detail:"Three real 20-second holds beats one lucky 40-second one for tracking honest progress."},
    {type:"harder", label:"Walk in, or add pulls", detail:"Walk your hands closer to the wall, or add toe pulls once holds feel automatic."},
  ],
  media:[
    {t:"video", label:"Chest to Wall Handstand Hold — tutorial", src:"YouTube", url:"https://www.youtube.com/watch?v=w5bzsMWLdm8"},
    {t:"video", label:"Chest To Wall Handstand — setup", src:"YouTube", url:"https://www.youtube.com/watch?v=sfPsRW0eypU"},
    {t:"article",label:"Why chest-to-wall matters + entry technique", src:"GMB Fitness", url:"https://gmb.io/freestanding-handstand/"},
  ]},
{ id:"wall-toe-finger-pulls", name:"Wall toe & finger pulls", cats:["line","rib"], fatigue:"high", level:3,
  targets:"The balance point itself — shifting weight through the line without breaking it.",
  why:"This is where a held line becomes a controlled handstand. Chest-to-wall toe pulls teach you to shift weight forward without collapsing the shoulders; back-to-wall finger pulls teach the same shift from the other direction. Both are staples in intermediate wall-handstand coaching.",
  when:["skill"],
  dosage:"3 sets × 5–8 pulls each direction (chest-to-wall and back-to-wall), 10–30 s per attempt.",
  progression:"Once toe pulls feel controlled rather than lucky, this directly feeds into freestanding balance attempts — the mobility and line work has done its job by this point.",
  regression:"Stick with plain wall-facing holds (Level 2) until 30 s feels easy before adding the weight shift.",
  mistakes:"Leaning too far forward and dumping weight into the shoulders; yanking instead of a slow controlled shift; losing rib position mid-pull.",
  cues:"Push tall through the shoulders first, then shift the hips slightly to let the toes leave the wall — don't just lean.",
  pairs:"The natural follow-up to wall-facing holds once those feel stable.",
  source:"A named progression drill in handstand coaching (e.g. Momentum Training's handstand phase-3 breakdown) for the transition from held line to active balance.",
  upgrades:[
    {type:"measurable", label:"Count clean pulls per set", detail:"A controlled pull that returns to the wall without collapse — not a lucky one."},
    {type:"harder", label:"Hold longer, or rest less", detail:"Hold the pulled-away position longer before returning, or reduce how much you rest against the wall between pulls."},
  ],
  media:[
    {t:"video", label:"Chest To Wall Handstand Toe Pull", src:"YouTube", url:"https://www.youtube.com/watch?v=YkwI6ujTwmw"},
    {t:"article",label:"Toe pulls + finger pulls, full context", src:"Momentum Training", url:"https://momentum-training.com/2017/01/09/gymnastics-handstand-phase-3-mobility-re-balancing-back-strength/"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("handstand toe pulls back to wall finger pulls")},
  ]},

/* ---- WRIST ---- */
{ id:"wrist-prep", name:"Wrist prep circuit", cats:["wrist"], fatigue:"low", level:1,
  targets:"Wrist extension range, forearm tissue, and general loading tolerance before bearing weight.",
  why:"Stiff wrists shift weight into the heel of the hand and wreck balance corrections. Prepped wrists let you push through the whole hand — every serious handstand program opens with some version of this circuit.",
  when:["before","skill"],
  dosage:"~2 min: 10 rocks each in front/back/side leans + 10 wrist circles each direction + 10 finger presses.",
  progression:"Once this feels easy and pain-free, add first-knuckle push-ups (Level 2) for the strength side of wrist prep.",
  regression:"Work on fists or an elevated surface; reduce the lean.",
  mistakes:"Collapsing into end range instead of loading gradually; skipping it when short on time — this is the one thing not to cut.",
  cues:"Claw the floor lightly, move slow, chase warmth not pain.",
  pairs:"Always first in any block that includes inverted work.",
  source:"Cross-checked against GMB Fitness's wrist-strengthening guide and Dani Winks Flexibility's handstand wrist warm-up — both converge on the same core sequence.",
  upgrades:[
    {type:"measurable", label:"Time to warmth", detail:"Note how long it takes before your wrists feel genuinely open — that number shrinking is a real tissue-quality signal."},
    {type:"harder", label:"Load gradually, or move up", detail:"Lean further into the rocks for more bodyweight, or move to first-knuckle push-ups for the strength component."},
  ],
  media:[
    {t:"article",label:"Wrist Strengthening Exercises — full routine", src:"GMB Fitness", url:"https://gmb.io/wrists/"},
    {t:"article",label:"Wrist Warm Up for Handstands", src:"Dani Winks Flexibility", url:"https://www.daniwinksflexibility.com/bendy-blog/wrist-warm-up-for-handstands"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("wrist warm up circuit handstand")},
  ]},
{ id:"first-knuckle-pushups", name:"First knuckle push-ups", cats:["wrist"], fatigue:"low", level:2,
  targets:"Wrist flexion strength — the exact strength you need to catch a balance correction that drifts your weight forward.",
  why:"Described by wrist-prep coaches as the strength piece that complements mobility work: if your feet drift too far forward or back in a handstand, this is the strength that lets your wrists absorb and correct it instead of buckling.",
  when:["before","skill"],
  dosage:"3 × 8–10 reps. Start on knees or against a wall if full plank is too much load.",
  progression:"Pair with reverse wrist push-ups (also Level 2) to balance flexor and extensor strength together.",
  regression:"Perform against a wall, lifting one hand at a time before progressing to both together.",
  mistakes:"Loading the pinky-side edge instead of the index/middle knuckles; going too fast instead of controlling the descent.",
  cues:"Weight into the big two knuckles (index and middle), slow controlled lower, no collapsing at the bottom.",
  pairs:"Pair with reverse wrist push-ups in the same wrist-prep block.",
  source:"A staple hand-balancing and gymnastics wrist-conditioning drill (Movement Fix, Agatsu Fitness) specifically cited for handstand balance corrections.",
  upgrades:[
    {type:"measurable", label:"Count clean reps from full plank", detail:"Not from the knees — that's your honest strength number."},
    {type:"harder", label:"Slow it down", detail:"Slow the descent to 3 seconds, or add a brief pause at the bottom."},
  ],
  media:[
    {t:"video", label:"Wrist Mobility — First Knuckle Push-Ups", src:"YouTube", url:"https://www.youtube.com/watch?v=g2UPqe5fAzI"},
    {t:"article",label:"Why this drill matters for handstand balance", src:"Movement Fix", url:"https://themovementfix.com/how-to-strengthen-your-wrists/"},
    {t:"article",label:"Full technique + scaling", src:"Agatsu Fitness", url:"https://agatsu.com/blogs/blog/first-knuckle-push-up-a-must-have-tool-for-handbalancing"},
  ]},
{ id:"reverse-wrist-pushups", name:"Reverse wrist push-ups", cats:["wrist"], fatigue:"low", level:2,
  targets:"Wrist extensor strength — the opposing muscle group to first-knuckle push-ups.",
  why:"Handstand training loads wrist flexion heavily. Without direct extensor work, that imbalance is a common source of wrist strain — this drill exists specifically to balance it out.",
  when:["before","skill"],
  dosage:"3 × 8–10 reps, back of the hand on the floor, fingers pointing toward each other.",
  progression:"Once comfortable both hands together, this pairs permanently alongside first-knuckle push-ups as routine maintenance — there isn't a heavier progression, the point is balance, not overload.",
  regression:"One hand at a time, or reduce range of motion.",
  mistakes:"Forcing range before the wrist is warm; loading too much bodyweight forward too soon.",
  cues:"Lift the wrist off the floor, control the lower, keep the motion slow throughout.",
  pairs:"Always paired with first-knuckle push-ups — flexor and extensor strength together.",
  source:"Standard complement to first-knuckle push-ups in hand-balancing wrist-prep circuits (Movement Fix, Energy for Life Fitness).",
  upgrades:[
    {type:"measurable", label:"Count reps with both hands together", detail:"Instead of alternating — full bilateral reps are the harder, more honest number."},
    {type:"harder", label:"Slow the tempo", detail:"Slow the whole rep down, or add a short pause at full extension."},
  ],
  media:[
    {t:"article",label:"6 must-do wrist exercises for handstands", src:"Energy for Life Fitness", url:"https://www.energyforlifefitness.com/look-after-your-wrists-with-these-mobility-and-strengthening-drills/"},
    {t:"article",label:"Reverse wrist push-ups explained", src:"Movement Fix", url:"https://themovementfix.com/how-to-strengthen-your-wrists/"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("reverse wrist push ups handstand prep")},
  ]},
/* ---- COMPRESSION / PIKE (press prerequisites) ---- */
{ id:"pancake", name:"Pancake / straddle fold", cats:["compression"], fatigue:"low", level:1,
  targets:"Hamstrings and adductors in a wide seated fold — the passive range the press starts from.",
  why:"The press begins from a compressed straddle. If your hips can't fold forward, you can't get them over your hands, and no amount of shoulder strength fixes that — it just makes you press from a crooked planche instead.",
  when:["after","recovery"],
  dosage:"3 × 45–60 s. Flat back first — depth is worthless if you're rounding the lower back to get there.",
  progression:"Once your chest reaches the floor with a flat back, switch the emphasis to active work (straddle lift-offs, Level 2) — passive pancake range without active strength doesn't transfer.",
  regression:"Sit on a folded towel or block to tilt the pelvis forward, narrow the straddle, or bend the knees slightly.",
  mistakes:"Rounding the lower back to fake depth; letting the knees roll inward instead of kneecaps up; bouncing.",
  cues:"Hinge from the hips with a flat back. Kneecaps point at the ceiling. Chest leads, not the head.",
  pairs:"Do before compression strength work — open the range, then train it actively.",
  source:"The consensus mobility prerequisite for press handstand across coaching sources (The Movement Athlete's press mobility guide, Dani Winks Flexibility) — both name the pancake as the main position to own.",
  upgrades:[
    {type:"measurable", label:"Measure chest height", detail:"Stack books or blocks under your chest at max depth and log how many — a shrinking stack is unarguable progress."},
    {type:"both", label:"Switch to active pancake", detail:"Instead of resting in the fold, press your heels down and lift your torso back up under your own hamstring strength. Harder, and the reps you can do become a trackable number."},
  ],
  media:[
    {t:"video", label:"How to Pancake Stretch (Beginner to Advanced)", src:"YouTube", url:"https://www.youtube.com/watch?v=CHRUb43S6RM"},
    {t:"video", label:"Flexibility for Straddle — more than hamstrings", src:"YouTube", url:"https://www.youtube.com/watch?v=fjKT1VPJh6I"},
    {t:"article",label:"6 Active Flexibility Drills for Straddle Pancake", src:"Dani Winks Flexibility", url:"https://www.daniwinksflexibility.com/bendy-blog/6-active-flexibility-drills-for-a-flatter-straddle-pancake"},
  ]},
{ id:"seated-pike-lifts", name:"Seated pike leg lifts", cats:["compression"], fatigue:"med", level:1,
  targets:"Hip flexors and lower abs — active compression, i.e. pulling the legs toward the chest under your own power.",
  why:"This is the engine of the press takeoff. Passive pancake range gets your hips forward; active compression is what actually peels your feet off the floor. It's the most commonly cited weak link in a stalled press.",
  when:["skill","recovery"],
  dosage:"3 × 8–10 lifts, sitting tall with legs straight. Hands off the floor if you can.",
  progression:"Progress to straddle lift-offs on parallettes (Level 2), where you support bodyweight through the hands as well.",
  regression:"Lift one leg at a time (one-leg pike pulses), or place hands lightly on the floor for support.",
  mistakes:"Rocking the torso backward to generate momentum; bending the knees; using the hands to push rather than just stabilise.",
  cues:"Torso completely still — only the legs move. Think of pulling the thighs toward your face, not kicking upward.",
  pairs:"Do straight after pancake work while the hamstrings are already lengthened.",
  source:"Antranik Kizirian's active pike compression tutorial, which explicitly frames this as the compression needed for a pike press handstand; corroborated by Calixpert's one-leg pike pulse breakdown.",
  upgrades:[
    {type:"measurable", label:"Log height and hold", detail:"Count reps where your heels actually clear the floor, or time a static lift hold — both give a hard number that grows."},
    {type:"harder", label:"Elevate or add ankle weight", detail:"Sit on a low parallette so the legs have further to travel, or add light ankle weights once bodyweight reps hit 10 clean."},
  ],
  media:[
    {t:"video", label:"How to Improve Active Pike Compression", src:"Antranik · YouTube", url:"https://www.youtube.com/watch?v=yQXnOuQqKYc"},
    {t:"video", label:"Core Compression, Seated Pike, Leg Lifts", src:"YouTube", url:"https://www.youtube.com/watch?v=6w4gmF0NUX0"},
    {t:"article",label:"Full write-up and progressions", src:"Antranik Kizirian", url:"https://antranik.org/active-pike-compression/"},
  ]},
{ id:"straddle-liftoffs", name:"Straddle lift-offs (parallettes)", cats:["compression"], fatigue:"med", level:2,
  targets:"Compression strength with bodyweight loaded through the hands — the exact takeoff position of a press.",
  why:"This is the press takeoff, isolated and held. Your low parallettes are the ideal tool: they give your legs clearance to lift without needing a full floor-level pancake first.",
  when:["skill"],
  dosage:"4–5 sets × 5 lifts, or hold 3–5 s at the top of each. Hands on low parallettes, straddle wide.",
  progression:"Hold longer at the top, then start leaning the shoulders forward at the top of the lift — that lean is the press itself beginning.",
  regression:"Use higher parallettes (medium set) so there's more clearance, or lift one leg at a time.",
  mistakes:"Jumping off the floor rather than lifting; letting the shoulders stay behind the hands instead of leaning forward; rounding the back to force clearance.",
  cues:"Lean the shoulders forward past the hands as the hips rise — the lean is what makes the legs feel light, not raw hip flexor effort.",
  pairs:"The direct bridge from seated compression work to actual press attempts.",
  source:"A named drill in gymnastics press progressions (Gym Momentum's press compilation lists straddle pulses and lift-offs; The Movement Athlete's progression guide uses the same position as the press entry point).",
  upgrades:[
    {type:"measurable", label:"Time the top hold", detail:"Seconds held at the top of the lift is your cleanest press-readiness metric — log it every session."},
    {type:"both", label:"Lower the parallettes", detail:"Move from medium to low parallettes, then eventually to the floor. Less clearance is harder, and the height itself is a progress log."},
  ],
  media:[
    {t:"article",label:"Press progressions incl. straddle lifts", src:"The Movement Athlete", url:"https://themovementathlete.com/press-to-handstand-progressions/"},
    {t:"article",label:"Straddle pulse and lift drills", src:"Gym Momentum", url:"https://gymmomentum.com/video-drills/press-handstands/"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("straddle lift off parallettes press handstand")},
  ]},
{ id:"lsit-parallettes", name:"L-sit on parallettes", cats:["compression"], fatigue:"med", level:2,
  targets:"Static compression endurance plus straight-arm support strength — hip flexors, abs, triceps, shoulders.",
  why:"Builds the straight-arm support and compression endurance the press needs, in one hold. It's also honest feedback: if the L-sit collapses, your press takeoff will too.",
  when:["skill"],
  dosage:"4–5 × 10–20 s holds on low parallettes. Legs straight, toes pointed, shoulders depressed then actively pushed down.",
  progression:"Work toward a straddle-L, then a V-sit — each raises the compression demand toward what a press requires.",
  regression:"Tuck L-sit (knees bent), or one leg extended at a time.",
  mistakes:"Shrugging into the shoulders instead of pushing down; letting the hips sag below the hands; bent knees creeping in as fatigue hits.",
  cues:"Push the parallettes down hard, lift the hips, then reach the heels forward away from you.",
  pairs:"Pairs naturally with straddle lift-offs in the same compression block.",
  source:"A standard calisthenics compression staple; parallettes are the conventional tool for it since the raised grip gives leg clearance.",
  upgrades:[
    {type:"measurable", label:"Time it strictly", detail:"Stop the clock the moment the knees bend or hips drop — the honest number, not the generous one."},
    {type:"harder", label:"Progress the shape", detail:"Tuck → one-leg → full L → straddle-L → V-sit. Each step is a clear, nameable level."},
  ],
  media:[
    {t:"article",label:"Compression training for press", src:"The Movement Athlete", url:"https://themovementathlete.com/how-to-press-to-handstand/"},
    {t:"video", label:"Pike compression and L-sit context", src:"Antranik · YouTube", url:"https://www.youtube.com/watch?v=yQXnOuQqKYc"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("L-sit parallettes form")},
  ]},

{ id:"skin-the-cat", name:"Skin the cat", cats:["overhead","lats"], fatigue:"med", level:3,
  targets:"Shoulder extension mobility, lats, and core compression, in a full rotating hang on rings or a bar.",
  why:"This is the overhead-mobility ceiling test turned upside down: if your shoulders can't reach full extension behind you in a hang, they won't stack cleanly in a handstand either. It's also the entry skill for the back lever and German hang.",
  when:["skill"],
  dosage:"3–5 slow reps. Rings set low enough that your feet can touch the floor at the bottom for assistance and a safe bail.",
  progression:"Once tucked reps are smooth and controlled, straighten the legs for a straddle or full-leg version — considerably more demanding on compression and shoulder mobility. From there, a slow straddle negative (lowering only, no return) is the version most often used to build press and back-lever strength.",
  regression:"Keep the rings low enough that your feet stay near the floor throughout, keep the knees tucked tight, and only rotate as far as feels controlled — partial reps are the standard way to build range gradually.",
  mistakes:"Bending the arms during the rotation, which shifts load onto the biceps and removes the shoulder-mobility benefit that's the whole point; using a kip or swing to force the rotation instead of a slow, controlled tuck; forcing full shoulder extension before you actually have the range for it.",
  cues:"Straight arms the entire time. Depress the shoulder blades before you start, then let the rotation come from a tight tuck, not a kick.",
  pairs:"A good bridge between your overhead lat stretch work and real ring strength skills — do it once your shoulders are already warm.",
  source:"Cross-checked across Calixpert, Caliverse, GymnastGem and Movement Athlete — all converge on the same setup (low rings for a safe bail), the same primary fault (bent arms), and the same regression (partial range, tucked knees) and progression path (straight legs, then negatives).",
  upgrades:[
    {type:"harder", label:"Straddle negative", detail:"Lower slowly into the straddled position instead of returning to the start — this is the version that builds real press and back-lever strength, and the one your coach is already programming."},
    {type:"measurable", label:"Log how far you rotate", detail:"Note whether you reach full shoulder extension or stop partway — the range itself is the number to track."},
  ],
  media:[
    {t:"video", label:"SKIN the CAT tutorial & progression exercises on rings", src:"YouTube", url:"https://www.youtube.com/watch?v=eAHkE3BfcAg"},
    {t:"article",label:"How To Do Skin The Cat", src:"Calixpert", url:"https://www.calixpert.com/exercises/skin-the-cat"},
    {t:"article",label:"Skin the Cat Exercise — ring & bar progressions", src:"GymnastGem", url:"https://gymnastgem.com/skin-the-cat/"},
  ]},


{ id:"bar-pullover", name:"Bar pullover", cats:["lats","compression"], fatigue:"med", level:3,
  targets:"Pulling strength, straight-leg compression, and shoulder rotation, combined into one continuous movement from a hang to a front support above the bar.",
  why:"This is a coordination test as much as a strength one — it demands the same pull-compress-rotate sequence your press and lever work builds separately, chained into a single skill. It's also a direct measure of whether your shoulders can rotate through the top of a pull without losing tension.",
  when:["skill"],
  dosage:"3–5 reps. Use a low bar or a mat to shorten the hang distance while you're learning.",
  progression:"Once you can complete it with a light spot at the hips, reduce the assistance until you can do it fully unassisted. From there, work for a slow, controlled reverse (lowering back through the same path) rather than dropping out of it.",
  regression:"Use a bar low enough that your feet can push off the floor to assist, or have a spotter give a light push under your hips as your legs pass over the top.",
  mistakes:"Letting your chin drift away from the bar as you pull, which kills momentum through the rotation; lifting the legs without rolling the hips around the bar — a lift alone won't get you over; rushing the wrist shift at the top, which is what actually lets your hands rotate into support.",
  cues:"Chin stays glued to the bar the whole way up. Once your legs are roughly parallel to the floor, drive your hips toward the bar and let your torso follow.",
  pairs:"Do after your shoulders are warm — this loads the shoulder in rotation under tension, not a cold-start movement.",
  source:"Cross-checked across GymnasticBodies, CrossFit's technique breakdown, and GymnastGem — all converge on the same fault (chin drifting from the bar) and the same regression (feet-assisted or spotter push at the hips), matching how your coach assisted you in class.",
  upgrades:[
    {type:"measurable", label:"Log how much spot you needed", detail:"None, light touch, or a real push — track this alongside reps. Needing less spot is real progress even before your rep count changes."},
    {type:"harder", label:"Slow the reversal", detail:"Once the pullover itself is clean, control the return through the same path instead of just dropping back to a hang."},
  ],
  media:[
    {t:"video", label:"How To Do a Pullover on a Gymnastics bar!", src:"YouTube", url:"https://www.youtube.com/watch?v=axMBASXBWUQ"},
    {t:"article",label:"Achieve The Perfect Pullover", src:"GymnasticBodies", url:"https://www.gymnasticbodies.com/exercises/pullover/"},
    {t:"article",label:"How To Do A Pullover On A Gymnastics Bar", src:"GymnastGem", url:"https://gymnastgem.com/pullover-bar/"},
  ]},

{ id:"tuck-back-lever", name:"Tuck back lever", cats:["lats","scap"], fatigue:"med", level:3,
  targets:"Shoulder extension strength, lats, and scapular protraction, held horizontal and face-down with the knees tucked to the chest.",
  why:"This is the entry point for the whole back lever line, and it teaches the exact scapular position — protracted, not retracted — that keeps the shoulders safe under extension load. Get this wrong here and every later lever inherits the fault.",
  when:["skill"],
  dosage:"3–5 × 10–15 s. Enter from a tucked inverted hang (the same rotation as skin the cat) rather than swinging into it.",
  progression:"Once 15 s feels controlled, open one hip to extend a single leg, then both knees to 90°, working toward the straddle and full back lever.",
  regression:"Hold the tucked inverted hang itself without lowering to horizontal, or shorten the hold time before form breaks down.",
  mistakes:"Not tucking the knees tightly enough — a loose tuck is a much harder hold, not an easier one; retracting the shoulder blades instead of protracting, which lets the body arch and sag; letting momentum carry the entry instead of controlling it.",
  cues:"Pull the knees hard into your chest. Push the rings or bar away — shoulders protracted, not shrugged toward each other.",
  pairs:"Pairs naturally after skin the cat, which is the same rotation without the horizontal hold at the bottom.",
  source:"Cross-checked across Steel Supplements, BERG Movement, and Caliverse — consistent on the entry (tuck inverted hang), the primary fault (shoulders retracting into an arch), and the progression path (tuck → one-leg → straddle → full).",
  upgrades:[
    {type:"measurable", label:"Time the hold strictly", detail:"Stop the clock the moment the shoulders retract or the tuck loosens — a strict 10 s beats a loose 20 s."},
    {type:"harder", label:"Open one hip", detail:"Extend a single leg while keeping the other tucked — this is the direct next step and a much smaller jump than going straight to straddle."},
  ],
  media:[
    {t:"video", label:"Tuck Back Lever Hold (Rings)", src:"YouTube", url:"https://www.youtube.com/watch?v=SZV1-ts76CM"},
    {t:"article",label:"How To Back Lever — tutorial & progression plan", src:"Steel Supplements", url:"https://steelsupplements.com/blogs/steel-blog/how-to-back-lever-tutorial-progression-plan"},
    {t:"article",label:"Back Lever Tutorial", src:"BERG Movement", url:"https://www.bergmovement.com/calisthenics-blog/back-lever-tutorial"},
  ]},

{ id:"skin-the-cat-straddle-negative", name:"Skin the cat straddle negative", cats:["overhead","lats"], fatigue:"high", level:4,
  targets:"Loaded shoulder extension and compression, lowering slowly through a straddle instead of a tuck, on rings.",
  why:"This is skin the cat with the assistance removed — a straddle gives you far less mechanical advantage than a tuck, and lowering it slowly is what actually builds the strength your press and back lever work need, not just the mobility.",
  when:["skill"],
  dosage:"3–5 slow reps. Aim to control the entire descent — no free-falling into the bottom position.",
  progression:"As control improves, slow the descent further and narrow the straddle toward a stalder (legs together) for a significantly harder version.",
  regression:"Keep the legs tucked (the regular skin the cat) until that's fully controlled, or use a lower ring height so your feet stay near the floor as a safety net.",
  mistakes:"Dropping through the middle of the range instead of controlling it, which is where most of the value is; forcing the bottom position before you have the shoulder range for it; rushing back up instead of treating the reversal with the same control.",
  cues:"Straddle wide for more leverage while you're learning. Lower like you're fighting gravity the whole way, not falling into it.",
  pairs:"The natural extension once your regular skin the cat is smooth and controlled — don't skip straight here.",
  source:"Cross-checked against Calisthenics-101's advanced skin-the-cat notes (straight legs, slow long reps) and Calixpert's negative-press-to-straddle guidance, which explicitly ranks straddle as the easier entry before stalder.",
  upgrades:[
    {type:"measurable", label:"Time the descent", detail:"Seconds from top to bottom, controlled. This is the number that tracks real strength here, more than reps."},
    {type:"harder", label:"Narrow toward a stalder", detail:"Bring the legs closer together as you lower instead of wide — considerably more compression and shoulder demand."},
  ],
  media:[
    {t:"article",label:"Skin The Cat — Calisthenics Exercise Technique Tutorial", src:"Calisthenics-101", url:"https://www.calisthenics-101.co.uk/skin-the-cat-calisthenics-exercise-tutorial"},
    {t:"article",label:"How To Do Negative Handstand Press To Stalder", src:"Calixpert", url:"https://www.calixpert.com/exercises/negative-handstand-press-to-stalder"},
    {t:"video", label:"SKIN the CAT tutorial & progression exercises on rings", src:"YouTube", url:"https://www.youtube.com/watch?v=eAHkE3BfcAg"},
  ]},

{ id:"ring-shoulder-stand", name:"Ring shoulder stand", cats:["compression","scap"], fatigue:"high", level:4,
  targets:"Pressing strength and compression, folding from a support hold through an inverted pike into a straight vertical shoulder stand.",
  why:"This is a direct stepping stone to ring handstands and the planche line — it demands the same pike-to-vertical strength as a handstand press, without also needing freestanding balance, so it isolates the pressing and compression piece on its own.",
  when:["skill"],
  dosage:"3–5 attempts, holding the top position for a few seconds once you reach it.",
  progression:"Once the fold-through is controlled, work on holding the final vertical position longer and reducing how much you bend the elbows to get there.",
  regression:"Practise the pike-and-dip entry only, without completing the full rotation to vertical, or work the equivalent shoulder stand on parallel bars first — the fixed rails are more forgiving than rings that can swing.",
  mistakes:"Rushing the fold instead of controlling it through the pike; letting the rings swing rather than staying stacked underneath you; trying this before ring support holds and dips are solid — those are the real prerequisite strength.",
  cues:"Pike the hips to 90° first, then let the shoulders dip forward and down as you invert. Straighten the hip angle last, once you're already upside down.",
  pairs:"Build ring support holds and ring dips first — this drill assumes that strength already exists.",
  source:"Cross-checked against GymDrillPro's technical breakdown (pike-then-invert-then-straighten sequence) and Calisthenics Nerd's rings progression, which places this directly before the ring handstand in difficulty.",
  upgrades:[
    {type:"measurable", label:"Time the top hold", detail:"Seconds held stacked and vertical at the top — this is your real strength number here."},
    {type:"harder", label:"Reduce the elbow bend", detail:"Work toward reaching the top position with straighter arms rather than a deep elbow bend through the fold."},
  ],
  media:[
    {t:"video", label:"Gymnastic Rings Shoulder Stand Tutorial (Beginner to Advanced)", src:"YouTube", url:"https://www.youtube.com/watch?v=mCjtBrYFIZA"},
    {t:"video", label:"Shoulder Stand on Rings", src:"YouTube", url:"https://www.youtube.com/watch?v=PTW_c05GXdg"},
    {t:"article",label:"Shoulderstand — Still Rings technique", src:"Gym Drill Pro", url:"http://www.gymdrills4profs.com/gymnastics-events/skill-drills-still-rings/gymnastics-still-rings-shoulder-stand.php"},
  ]},


{ id:"bodyweight-squat", name:"Bodyweight squat", cats:["legs"], fatigue:"low", level:1,
  targets:"Quads, glutes, and hamstrings, through a full-range squat — the foundation every other leg drill builds on.",
  why:"If the two-leg pattern isn't clean, every single-leg progression built on top of it inherits the same faults. This is worth owning properly before chasing anything harder.",
  when:["skill"],
  dosage:"3 × 12–15, controlled tempo.",
  progression:"Once 15 clean reps feel easy, move toward single-leg work — split squat, then Bulgarian split squat.",
  regression:"Reduce depth to where you can keep good form, or hold a support lightly for balance.",
  mistakes:"Knees caving inward rather than tracking over the toes; breaking at the knees before the hips, which tips the torso forward; chest collapsing forward as you descend.",
  cues:"Push the hips back first, like reaching for a chair. Knees out, tracking over the toes. Chest stays tall.",
  pairs:"The reference pattern for everything else in this category — revisit it whenever a harder variation feels off.",
  source:"Cross-checked across Nerd Fitness, GMB Fitness, and multiple physiotherapy technique guides — near-universal agreement on hip-hinge-first sequencing and knee tracking as the two things worth watching.",
  upgrades:[
    {type:"measurable", label:"Log your depth", detail:"Note how close to full depth you're getting with clean form — depth without losing the knee-track or a flat back is real progress."},
    {type:"harder", label:"Sumo stance, or move up", detail:"Turn the feet out and widen the stance for a sumo squat, which biases the inner thighs — or progress to a single-leg pattern."},
  ],
  media:[
    {t:"video", label:"Bodyweight Squat Tutorial: Mobility & Technique", src:"GMB Fitness · YouTube", url:"https://www.youtube.com/watch?v=zJBLDJMJiDE"},
    {t:"article",label:"5 Common Mistakes When Doing a Bodyweight Squat", src:"Nerd Fitness", url:"https://www.nerdfitness.com/blog/5-common-mistakes-when-doing-a-proper-squat/"},
    {t:"article",label:"Bodyweight squats: benefits, mistakes, progressions", src:"Exakt Health", url:"https://www.exakthealth.com/en/blog/bodyweight-squats-benefits-common-mistakes-and-progressions"},
  ]},

{ id:"bulgarian-split-squat", name:"Bulgarian split squat", cats:["legs"], fatigue:"med", level:3,
  targets:"Quads and glutes on one leg at a time, with the rear foot elevated behind you for a deeper range and real single-leg load.",
  why:"This is the bridge between a bodyweight squat and a true single-leg squat — you get most of the unilateral demand of a pistol without needing the ankle mobility and balance a pistol requires.",
  when:["skill"],
  dosage:"3 × 8–10 per leg.",
  progression:"Increase range of motion, slow the tempo, or add a weight held at the chest.",
  regression:"Regular split squat with the back foot on the floor rather than elevated — same pattern, less range and less single-leg load.",
  mistakes:"Placing the front foot too close to the bench, which drives the front knee too far past the toes; letting the front knee cave inward; rushing the descent instead of controlling it.",
  cues:"Most of your weight stays on the front leg. Drop straight down, back knee tracking toward the floor.",
  pairs:"A strong single-session pairing with hip thrust — quad-dominant unilateral work plus glute-dominant hinge work.",
  source:"Cross-checked against PowerliftingTechnique.com's pistol squat progression (which places this directly before the pistol) and Healthline's technique breakdown.",
  upgrades:[
    {type:"measurable", label:"Log the bench height", detail:"A lower or higher rear-foot surface changes the demand — note what you're using and track range over time."},
    {type:"harder", label:"Add load, or slow the tempo", detail:"Hold a light weight at your chest, or add a 3-second lowering phase for more time under tension."},
  ],
  media:[
    {t:"video", label:"How To Do A Bulgarian Split Squat", src:"Coach Kelly Cues · YouTube", url:"https://www.youtube.com/watch?v=9FOMyxA3Lw4"},
    {t:"article",label:"Pistol Squat Progression: From Basic to Advanced", src:"PowerliftingTechnique.com", url:"https://powerliftingtechnique.com/pistol-squat-vs-shrimp-squat/"},
    {t:"article",label:"Bulgarian Split Squat: Muscles Worked & Good Form", src:"Healthline", url:"https://www.healthline.com/nutrition/kang-squat"},
  ]},

{ id:"shrimp-squat", name:"Shrimp squat", cats:["legs"], fatigue:"med", level:3,
  targets:"A full single-leg squat with the rear leg held bent behind you — the more balance-friendly of the two advanced single-leg squats.",
  why:"GMB's coaching specifically recommends starting single-leg squat work here rather than with the pistol: the weight stays over the midfoot, which is more forgiving on balance, even though it demands real quad strength and ankle range to come out of the bottom.",
  when:["skill"],
  dosage:"3 × 5–8 per leg. Hold something for light support while you're learning.",
  progression:"Reduce how much support you use, work toward touching the rear knee lightly to the floor, or add a weighted vest.",
  regression:"Hold onto a support with both hands, or reduce the range so the rear knee doesn't need to travel as far.",
  mistakes:"Letting the standing knee cave inward under the load; rushing out of the bottom instead of driving through with control; losing the grip on the rear foot and letting the leg drop.",
  cues:"Weight stays centered over the middle of your foot, not rocked back on the heel. Chest stays reasonably upright.",
  pairs:"GMB recommends this before the pistol squat for most people — start here.",
  source:"GMB Fitness's direct comparison of shrimp vs pistol squats, which explicitly recommends shrimp first for most trainees due to better balance and less demanding hip flexor mobility.",
  upgrades:[
    {type:"measurable", label:"Log how much support you used", detail:"None, one hand, or two — track this alongside reps, since needing less support is real progress before your depth changes."},
    {type:"harder", label:"Touch the knee down", detail:"Work toward lightly tapping the rear knee to the floor at the bottom before standing back up."},
  ],
  media:[
    {t:"video", label:"Shrimp Squat vs Pistol Squat: Progressions", src:"GMB Fitness · YouTube", url:"https://www.youtube.com/watch?v=Ibp8yWerUgc"},
    {t:"video", label:"Shrimp Squat Tutorial", src:"YouTube", url:"https://www.youtube.com/watch?v=qZKrBVP_pIs"},
    {t:"article",label:"Shrimp Squat vs. Pistol Squat: Which To Start With", src:"GMB Fitness", url:"https://gmb.io/shrimp-squats-vs-pistol-squats/"},
  ]},

{ id:"pistol-squat", name:"Pistol squat", cats:["legs"], fatigue:"med", level:4,
  targets:"A full single-leg squat with the free leg extended out in front — the more demanding of the two advanced single-leg squats, needing real hip flexor mobility and balance.",
  why:"This is the single-leg squat everyone knows by name, and a genuine strength and mobility benchmark. GMB's guidance is honest that it's usually harder to start with than the shrimp squat — shifting your weight back toward the heel demands more from your hips.",
  when:["skill"],
  dosage:"3 × 3–5 per leg.",
  progression:"Reduce assistance, work toward a full unassisted rep, then add a slow negative-only version to build the bottom range.",
  regression:"A slow negative from standing to the bottom, using a box or bench to control the descent, or holding a support for balance.",
  mistakes:"Losing balance because the free leg drops instead of staying extended; heels lifting off the floor at the bottom, which usually means an ankle mobility limit rather than a strength one; leaning too far forward to compensate.",
  cues:"Reach the arms forward as a counterbalance. Sit back like you're lowering onto a low box, keeping the heel down.",
  pairs:"Consider the shrimp squat first if this feels like a balance problem more than a strength one.",
  source:"Cross-checked against GMB Fitness and PowerliftingTechnique.com's progression guide, both agreeing pistol demands more ankle and hip flexor mobility than the shrimp variant.",
  upgrades:[
    {type:"measurable", label:"Time the negative", detail:"If the full rep isn't there yet, time how long you can control the lowering phase — that number is your real progress marker."},
    {type:"harder", label:"Add load", detail:"Once bodyweight reps are clean, hold a light weight at your chest."},
  ],
  media:[
    {t:"video", label:"Shrimp Squat vs Pistol Squat: Progressions", src:"GMB Fitness · YouTube", url:"https://www.youtube.com/watch?v=Ibp8yWerUgc"},
    {t:"article",label:"Pistol Squat Progression: From Basic to Advanced", src:"PowerliftingTechnique.com", url:"https://powerliftingtechnique.com/pistol-squat-vs-shrimp-squat/"},
    {t:"article",label:"Building Lower Body Strength: Pistol, Shrimp, Bulgarian", src:"All About Calisthenics", url:"https://www.allaboutcalisthenics.com/blogs/building-lower-body-strength-pistol-squats-shrimp-squats-and-bulgarian-split-squats"},
  ]},

{ id:"jump-squat", name:"Jump squat", cats:["legs"], fatigue:"med", level:3,
  targets:"Explosive quad, glute and calf power, through a squat that finishes with a vertical jump.",
  why:"This is the one genuinely explosive drill in your leg work — everything else here is controlled and strength-focused. Power output fades fast without some plyometric work to maintain it.",
  when:["skill"],
  dosage:"3 × 8–12. Quality reps, not to exhaustion — this is a power drill, not a conditioning one.",
  progression:"Add a pause at the bottom of each rep before jumping, to remove any rebound and force pure concentric power.",
  regression:"A regular bodyweight squat, or a smaller, lower-intensity hop instead of a full vertical jump.",
  mistakes:"Landing stiff-legged instead of absorbing the landing by bending the knees; rushing the squat portion instead of controlling it before exploding up; letting the knees cave in on landing, which is where most of the injury risk in this drill actually sits.",
  cues:"Smooth into the squat, then explode straight up. Land soft — knees bent, absorbing the impact.",
  pairs:"Do this early in a session, before fatigue sets in — power output drops fast once you're tired.",
  source:"Cross-checked against Calixpert's calisthenics-specific coaching and Hevy's exercise library, both flagging the same two faults: rushing the eccentric, and adding load before the pattern is solid.",
  upgrades:[
    {type:"measurable", label:"Log reps that felt genuinely explosive", detail:"Once reps start feeling merely tired rather than powerful, the set is done — track how many quality reps you get."},
    {type:"harder", label:"Pause at the bottom", detail:"Add a full stop at the bottom of the squat before jumping, removing any stretch-reflex assistance."},
  ],
  media:[
    {t:"video", label:"How To Do Jumping Squats", src:"Calixpert · YouTube", url:"https://www.youtube.com/watch?v=vF2aEkQq2w8"},
    {t:"article",label:"Jump Squat — How to Instructions & Form", src:"Hevy Exercise Library", url:"https://www.hevyapp.com/exercises/how-to-jump-squat/"},
    {t:"article",label:"How to Do A Jump Squat", src:"REP Fitness", url:"https://repfitness.com/blogs/training/how-to-do-a-jump-squat"},
  ]},

{ id:"wall-sit", name:"Wall sit", cats:["legs"], fatigue:"low", level:1,
  targets:"Isometric quad endurance, holding a seated position with your back against a wall.",
  why:"The one purely isometric hold in this category — a different demand than the dynamic squats, and genuinely useful on a day you want leg work without any impact or eccentric loading.",
  when:["skill","recovery"],
  dosage:"3 × 30–45 s.",
  progression:"Hold longer, lower the angle closer to a full 90° at the knees and hips, or lift one leg briefly for single-leg loading.",
  regression:"A higher angle — less knee bend — makes this substantially easier while keeping the same pattern.",
  mistakes:"Letting the lower back arch away from the wall; knees drifting past the toes; only pressing the shoulders into the wall while the lower back and head lose contact.",
  cues:"Three points of contact: head, upper back, and lower back all touching the wall throughout.",
  pairs:"A good finisher after the dynamic squat work — different demand, low additional joint stress.",
  source:"Cross-checked against Garage Gym Reviews and Cleveland Clinic's technique guides — both name the same fault (losing wall contact) as the main thing to watch.",
  upgrades:[
    {type:"measurable", label:"Time it strictly", detail:"Stop the clock the moment contact breaks anywhere along your back — a strict 30 s beats a loose 60 s."},
    {type:"harder", label:"Add calf raises", detail:"While holding the sit, raise and lower your heels for a combined quad-and-calf finisher."},
  ],
  media:[
    {t:"video", label:"How To Do a Wall Sit | The Right Way", src:"Well+Good · YouTube", url:"https://www.youtube.com/watch?v=JaZNYM3zAP0"},
    {t:"article",label:"Wall Sit Exercise: How To Do It And Variations", src:"Garage Gym Reviews", url:"https://www.garagegymreviews.com/wall-sit-exercise"},
    {t:"article",label:"9 Reasons You Should Do Wall Sits", src:"Cleveland Clinic", url:"https://health.clevelandclinic.org/wall-sits"},
  ]},

{ id:"glute-bridge", name:"Glute bridge", cats:["legs"], fatigue:"low", level:1,
  targets:"Glutes, trained at the very top of hip extension — the position where they produce the most force.",
  why:"This is the foundation move for the whole posterior-chain line, and it's the honest starting point before hip thrust — same muscle, less setup, and it's where most people should actually begin.",
  when:["skill","recovery"],
  dosage:"3 × 12–15.",
  progression:"Once bodyweight reps feel easy, move to single-leg glute bridges, or progress to the hip thrust for greater range.",
  regression:"Reduce range — a smaller hip lift with a strict squeeze at the top is still effective.",
  mistakes:"Overextending the lower back to gain height instead of stopping at full hip extension; feet placed too far from the hips, which shifts the work into the hamstrings.",
  cues:"Drive through the heels, squeeze the glutes hard at the top. Stop at a straight line from knees to shoulders — don't arch past it.",
  pairs:"The natural warm-up before hip thrust, or a lower-impact substitute on a day you want less loading.",
  source:"Cross-checked against Nordic Performance Training's physiotherapist-written breakdown, which specifically explains why glute bridge — not hip thrust — is often the better default: it trains the glutes at their strongest range with less setup and less strain risk.",
  upgrades:[
    {type:"measurable", label:"Log the squeeze duration", detail:"Time how long you hold the top contraction — longer holds with good form build real end-range strength."},
    {type:"harder", label:"Single leg, or move to hip thrust", detail:"Lift one foot off the floor for a single-leg bridge, or progress to the hip thrust for more range and load."},
  ],
  media:[
    {t:"article",label:"Glute Bridge: Technique, Benefits and Variations", src:"Nordic Performance Training", url:"https://www.nordicperformancetraining.com/blog/glute-bridge"},
    {t:"article",label:"The Ultimate Glute Bridge (Hip Thrust) Progressions", src:"Brookbush Institute", url:"https://brookbushinstitute.com/articles/Ultimate-glute-bridge-hip-thrust"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("glute bridge exercise form")},
  ]},

{ id:"hip-thrust", name:"Hip thrust", cats:["legs"], fatigue:"med", level:2,
  targets:"Glutes and hamstrings, through a much larger range than the glute bridge — shoulders on a bench, hips driving up from a deeper start.",
  why:"The bench gives you a genuinely bigger range of hip extension to work through than the floor-based bridge allows, which is why it's the heavier, more complete version once the pattern is owned.",
  when:["skill"],
  dosage:"3 × 10–12.",
  progression:"Add a pause at the top, then progress to single-leg hip thrusts or add external load.",
  regression:"Drop back to the glute bridge until the hip-extension pattern is solid.",
  mistakes:"Hyperextending the lower back at the top instead of stopping at neutral hip extension; pushing through the toes rather than the heels; letting the bench slip or setting up too high or low relative to your shoulder blades.",
  cues:"Chin tucked, ribs down, drive through the heels. Full hip extension, then a hard squeeze — no further.",
  pairs:"The main strength piece of a leg day; pair with a quad-dominant single-leg move like the Bulgarian split squat.",
  source:"Cross-checked against Nordic Performance Training's technique breakdown and the widely-cited work of Bret Contreras, the strength coach most associated with popularizing and researching this movement.",
  upgrades:[
    {type:"measurable", label:"Log the pause at the top", detail:"Add a timed squeeze at full extension and track how long you can hold it with good form."},
    {type:"harder", label:"Single leg, or add load", detail:"Perform one leg at a time for a significant jump in demand, or hold weight across the hips."},
  ],
  media:[
    {t:"article",label:"Hip Thrust: Technique, Muscles and Variations", src:"Nordic Performance Training", url:"https://www.nordicperformancetraining.com/blog/hip-thrust"},
    {t:"article",label:"The Ultimate Glute Bridge (Hip Thrust) Progressions", src:"Brookbush Institute", url:"https://brookbushinstitute.com/articles/Ultimate-glute-bridge-hip-thrust"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("hip thrust exercise form")},
  ]},

{ id:"single-leg-deadlift", name:"Single-leg deadlift", cats:["legs"], fatigue:"med", level:3,
  targets:"Hamstrings, glutes, and balance, hinging at the hip on one leg while the other reaches back behind you.",
  why:"This is the one drill in your leg work that trains hip-hinge strength and balance together — most other movements here are squat-pattern. Hamstrings specifically are underrepresented without it.",
  when:["skill"],
  dosage:"3 × 6–8 per leg.",
  progression:"Reach further toward the floor, slow the tempo, or hold a light weight in the opposite hand.",
  regression:"Keep light fingertip contact with a wall or chair for balance while you build the pattern.",
  mistakes:"Rounding the lower back instead of hinging with a flat back; rotating the hips open instead of keeping them square to the floor; bending the standing knee too much, which turns it into a squat rather than a hinge.",
  cues:"Hips square, reach the back leg straight behind you as your torso lowers. Flat back the entire way.",
  pairs:"The hamstring-focused complement to the mostly quad-and-glute squat pattern work.",
  source:"A standard unilateral hinge movement; technique consensus (flat back, square hips, controlled reach) is consistent across strength coaching sources.",
  upgrades:[
    {type:"measurable", label:"Log how close to parallel you reach", detail:"Track how close your torso gets to the floor while keeping a flat back and square hips."},
    {type:"harder", label:"Add load or slow the tempo", detail:"Hold a light weight in the hand opposite your standing leg, or add a 3-second lowering phase."},
  ],
  media:[
    {t:"article",label:"22 Best At-Home Leg Exercises", src:"Signos", url:"https://www.signoshealth.com/blog/leg-exercises-at-home"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("single leg deadlift form")},
    {t:"article",label:"Bodyweight Leg Exercises", src:"Healthgrades", url:"https://resources.healthgrades.com/right-care/lifestyle-and-wellness/bodyweight-leg-exercises"},
  ]},

{ id:"nordic-curl", name:"Nordic curl", cats:["legs"], fatigue:"high", level:4,
  targets:"Hamstrings, trained eccentrically — kneeling with the feet anchored, lowering your torso toward the floor under control.",
  why:"This is the single most evidence-backed exercise for hamstring injury prevention, and it trains the hamstrings in a way almost nothing else in a normal program does — through a long eccentric under real load.",
  when:["skill"],
  dosage:"3 × 3–5. Quality over quantity — this is demanding on tissue that recovers slowly.",
  progression:"Extend how far down you can control the lowering before catching yourself, working toward a full unassisted rep.",
  regression:"A partner or a fixed anchor holding your ankles, with a smaller range you can fully control, and using your hands to help push back up.",
  mistakes:"Letting the hips flex or hinge backward during the lowering — the hips must stay extended and in line with the torso the whole way; free-falling instead of controlling the descent, which defeats the entire purpose of the drill.",
  cues:"Squeeze the glutes to keep the hips locked straight. Lower as slowly as you can control — 3 to 5 seconds is the target, not a race to the floor.",
  pairs:"The direct hamstring complement to the mostly quad-and-glute squat work elsewhere in this category.",
  source:"Cross-checked against Syatt Fitness's widely-referenced technique breakdown and the peer-reviewed literature on Nordic curls for hamstring injury prevention in athletes.",
  upgrades:[
    {type:"measurable", label:"Time the controlled descent", detail:"Seconds from upright to the point you lose control — this is the number that tracks real hamstring strength here."},
    {type:"harder", label:"Reduce the hand-catch", detail:"Use less push-off from your hands to return to the top, relying more on the hamstrings themselves."},
  ],
  media:[
    {t:"video", label:"Nordic Curl | Glute Ham Raise | Bodyweight Hamstring", src:"YouTube", url:"https://www.youtube.com/watch?v=X-j0ZMDy-QE"},
    {t:"article",label:"The Best Nordic Hamstring Curl Instructional Video", src:"Syatt Fitness", url:"https://www.syattfitness.com/coaches-and-coaching-tips-for-trainers/nordic-hamstring-curl/"},
    {t:"article",label:"Nordic Hamstring Curl (Bodyweight) — Video Guide", src:"Muscle & Strength", url:"https://www.muscleandstrength.com/exercises/nordic-hamstring-curl-bodyweight"},
  ]},

{ id:"reverse-lunge", name:"Reverse lunge", cats:["legs"], fatigue:"low", level:2,
  targets:"Quads, glutes, and hamstrings on one leg, stepping backward into a split stance and lowering the back knee toward the floor.",
  why:"Stepping backward rather than forward is considerably kinder on the front knee, which is why coaches generally recommend it as the lunge pattern to start with before other variations.",
  when:["skill"],
  dosage:"3 × 10–12 per leg.",
  progression:"Add a walking version — stepping through into the next rep instead of returning to standing — for more balance and coordination demand, or add load.",
  regression:"Use a shorter step and a smaller range while the balance and pattern develop.",
  mistakes:"Letting the front knee travel past the toes excessively; leaning the torso too far forward; pushing off the back foot to stand rather than driving through the front heel.",
  cues:"Step back far enough that the front shin stays close to vertical. Drive up through the front heel.",
  pairs:"Pairs naturally with step-up as the two opposite-direction single-leg patterns.",
  source:"Cross-checked against Peloton's coaching breakdown and Coach Web's lunge-variation guide, both naming reverse lunge as the beginner-friendly, lower-back-friendly starting point before other lunge variations.",
  upgrades:[
    {type:"measurable", label:"Log the step length", detail:"A longer step changes the demand — note what you're using and increase it as control improves."},
    {type:"harder", label:"Walking lunge, or add load", detail:"Step through into the next rep instead of returning to standing, or hold a light weight at your chest."},
  ],
  media:[
    {t:"video", label:"How To Perform The Reverse Lunge", src:"YouTube", url:"https://www.youtube.com/watch?v=Ry-wqegeKlE"},
    {t:"article",label:"Reverse Lunge: How to Do It, Benefits & Variations", src:"The Output by Peloton", url:"https://www.onepeloton.com/blog/reverse-lunge"},
    {t:"article",label:"How To Do The Reverse Lunge", src:"Coach Web", url:"https://www.coachweb.com/leg-exercises/2336/how-to-do-the-reverse-lunge"},
  ]},

{ id:"step-up", name:"Step-up", cats:["legs"], fatigue:"med", level:2,
  targets:"Quads and glutes, driving your whole bodyweight up onto a raised surface using one leg.",
  why:"This is a vertical drive pattern rather than the forward-and-down pattern of a lunge or squat — genuinely different demand, and one that carries over directly to stairs and everyday movement.",
  when:["skill"],
  dosage:"3 × 10 per leg.",
  progression:"Raise the step height, slow the tempo, or minimize how much you push off the trailing leg.",
  regression:"Lower step height, and allow more assistance from the trailing leg's push.",
  mistakes:"Pushing off the bottom leg to help drive up, which defeats the point of the drill; letting the working knee cave inward; leaning the torso forward to generate momentum instead of driving through the working leg.",
  cues:"Plant the whole foot on the step. Drive up through that leg alone — the back foot barely helps.",
  pairs:"Pairs naturally with the reverse lunge as the two opposite-direction single-leg patterns.",
  source:"Standard unilateral strength movement; technique consensus (full foot plant, minimal push from the trailing leg) is consistent across coaching sources including Runna's technique breakdown.",
  upgrades:[
    {type:"measurable", label:"Log the step height", detail:"A taller step is a harder step — track what height you're using and raise it as strength improves."},
    {type:"harder", label:"Slow the descent, or add load", detail:"Control the lowering back down for 3 seconds instead of just stepping off, or hold weight at your sides."},
  ],
  media:[
    {t:"video", label:"Step Up Tutorial — Proper Form and Technique", src:"YouTube", url:"https://www.youtube.com/watch?v=vOiHvzj5XhA"},
    {t:"article",label:"22 Best At-Home Leg Exercises", src:"Signos", url:"https://www.signoshealth.com/blog/leg-exercises-at-home"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("step up exercise form")},
  ]},

{ id:"calf-raise", name:"Calf raise", cats:["legs"], fatigue:"low", level:1,
  targets:"Calves, through a full range from a deep stretch at the bottom to a hard squeeze on the toes at the top.",
  why:"The most commonly neglected muscle group in bodyweight training, and genuinely relevant to you specifically — strong, mobile calves and ankles matter for landing kick-ups and controlling handstand balance corrections through the feet.",
  when:["skill","recovery"],
  dosage:"3 × 15–20.",
  progression:"Move to single-leg calf raises, slow the tempo, or add a deficit by standing on a step so the heel can drop below the toes.",
  regression:"Hold a support for balance, and use a smaller range if the ankle feels stiff.",
  mistakes:"Rushing through reps using momentum rather than a controlled squeeze at the top; not using the full range, especially skipping the stretch at the bottom; letting the ankles roll outward.",
  cues:"Push through the balls of the feet, squeeze hard at the top, then lower under control to a full stretch at the bottom.",
  pairs:"An easy addition to the end of any leg session — low fatigue cost, frequently skipped.",
  source:"Cross-checked against Children's Hospital Colorado's athletic-trainer technique guide — the same source already used elsewhere in your library for scapular push-ups.",
  upgrades:[
    {type:"measurable", label:"Log single-leg reps", detail:"Once double-leg feels easy, count how many clean single-leg reps you can do per side."},
    {type:"harder", label:"Add a deficit", detail:"Stand on the edge of a step so your heel can drop below your toes, adding significant extra range."},
  ],
  media:[
    {t:"video", label:"Exercises with an Athletic Trainer: Standing Calf Raises", src:"Children's Hospital Colorado · YouTube", url:"https://www.youtube.com/watch?v=k8ipHzKeAkQ"},
    {t:"video", label:"Standing Calf Raise — Proper Form & Technique", src:"YouTube", url:"https://www.youtube.com/watch?v=ndQc4mz4mBU"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("standing calf raise form")},
  ]},

{ id:"glute-activation-circuit", name:"Glute activation circuit", cats:["legs"], fatigue:"low", level:1,
  targets:"Gluteus medius and minimus — the smaller hip-stabilizing muscles that a heavy squat or lunge session doesn't reliably wake up on their own.",
  why:"A peer-reviewed study found a glute activation warm-up measurably changed how the glutes were recruited in a subsequent explosive movement — this is the wake-up call before your main lifts, not a workout in itself.",
  when:["before"],
  dosage:"1 round of each: 15 fire hydrants, 12 clamshells, 15 kickbacks, 20 steps of banded lateral walk, all per side.",
  progression:"Add a light resistance band around the thighs or ankles to increase the demand on each movement.",
  regression:"Drop the band, and reduce reps if any position is uncomfortable rather than pushing through it.",
  mistakes:"Letting the hips rock or the lower back arch to fake range — every one of these should move only at the hip, nothing else; rushing through for volume instead of a controlled squeeze at the top of each rep.",
  cues:"Small, controlled range. You should feel the outer hip working, not the lower back.",
  pairs:"Always goes first, before your main squat, lunge, or hinge work for the day.",
  source:"Individual techniques cross-checked against Healthline and Fitbod's glute-activation guides; the rationale for doing this before heavy lifting is supported by a peer-reviewed EMG study (Parr, Price & Cleather, BMJ Open Sport & Exercise Medicine, 2017) on gluteal activation warm-ups.",
  upgrades:[
    {type:"measurable", label:"Note which side is weaker", detail:"Almost everyone has a clear weaker side here — track which one and give it slightly more attention."},
    {type:"harder", label:"Add a band", detail:"A light band above the knees or around the ankles adds resistance to every movement in the circuit at once."},
  ],
  media:[
    {t:"article",label:"How to Activate Glutes: 11 Best Exercises", src:"Back Muscle Solutions", url:"https://backmusclesolutions.com/blogs/the-ql-blawg/how-to-activate-glutes"},
    {t:"article",label:"9 Banded Kickback Variations", src:"Fitbod", url:"https://fitbod.me/blog/banded-kickback-variations/"},
    {t:"article",label:"Effect of a gluteal activation warm-up on explosive exercise performance", src:"BMJ Open Sport & Exercise Medicine (peer-reviewed)", url:"https://pmc.ncbi.nlm.nih.gov/articles/PMC5530111"},
  ]},


/* ---- PRESS-SPECIFIC ---- */
{ id:"press-walks", name:"Press walks (weight-shift drill)", cats:["compression","line"], fatigue:"low", level:2,
  targets:"The shoulder lean and counterbalance that starts every press — without needing to leave the floor.",
  why:"Teaches the single most misunderstood part of the press: it's a forward weight shift, not a leg lift. Most stalled presses are people trying to muscle their legs up while their shoulders stay behind their hands.",
  when:["skill","before"],
  dosage:"3 × 5–8 shifts. From a wide straddle stand, hands to the floor, lean forward until the feet get light — then back.",
  progression:"Lean further each week until the heels actually leave the floor, at which point this becomes a press attempt.",
  regression:"Reduce the lean; keep more weight in the feet; widen the straddle for a lower start.",
  mistakes:"Bending the arms as you lean; hopping instead of shifting; stopping the lean the instant it feels unstable — that instability is the drill.",
  cues:"Shoulders travel forward past the hands. Feet get light on their own — don't lift them.",
  pairs:"Best done immediately before press attempts, as a technical primer.",
  source:"Named as a press progression by BERG Movement's press tutorial and echoed in gymnastics compilations — training the entry weight shift in isolation before the full skill.",
  upgrades:[
    {type:"measurable", label:"Film from the side", detail:"Record it and check whether your shoulders actually pass your hands. Most people believe they lean much further than they do."},
    {type:"harder", label:"Hold the light point", detail:"Pause where your feet are barely weighted and hold 3–5 s instead of shifting straight back."},
  ],
  media:[
    {t:"article",label:"Press walks + entry technique", src:"BERG Movement", url:"https://www.bergmovement.com/calisthenics-blog/how-to-press-handstand"},
    {t:"article",label:"Shoulder lean and counterbalance", src:"Power Monkey Fitness", url:"https://www.powermonkeyfitness.com/blogs/techniquematters/training-your-press-to-handstand"},
    {t:"gif",   label:"Form reference", src:"Image search", url:gg("press walk drill press to handstand")},
  ]},
{ id:"straddle-negatives", name:"Straddle press negatives", cats:["compression","line"], fatigue:"high", level:2,
  targets:"The entire press pattern, trained eccentrically — shoulders, compression, and the lowering path.",
  why:"You already own this half: you can straddle down from a handstand and close back. Doing it slowly, with intent, is widely called the single best press drill — it builds strength through the exact path you'll later press up through.",
  when:["skill"],
  dosage:"3–5 sets × 3–5 reps. From a handstand, straddle and lower as slowly as you can control — aim for 4+ seconds of descent.",
  progression:"Slow the descent further, pause partway down for 2 s, or move to lowering to a stalder (legs closer together) which demands more compression.",
  regression:"Do it chest-to-wall so balance isn't a variable, and let the wall catch you.",
  mistakes:"Dropping through the middle instead of controlling it; losing shoulder push as the legs descend; bending the arms.",
  cues:"Keep pushing the floor away the whole way down. Peel the descent out slowly — the slower it is, the more it builds.",
  pairs:"Do these after your compression work, when the pattern is warm but you're not yet fatigued.",
  source:"GMB Fitness's press handstand guide calls this the HS Straddle Negative and treats it as core; multiple coaches independently describe negatives as the highest-value press drill. Calixpert notes straddle is the easier version and stalder the progression.",
  upgrades:[
    {type:"measurable", label:"Time the descent", detail:"Seconds from handstand to floor, controlled. This one number tracks your press strength better than anything else."},
    {type:"harder", label:"Lower to stalder", detail:"Bring the legs closer together as you lower instead of wide — far more compression demand, and the natural next step."},
  ],
  media:[
    {t:"video", label:"Straddle Negative Press Drills", src:"YouTube", url:"https://www.youtube.com/watch?v=rBT4ziR4TC4"},
    {t:"video", label:"Straddle Press Down / Negative Press", src:"YogaSlackers · YouTube", url:"https://www.youtube.com/watch?v=qlf4JMlJCbc"},
    {t:"article",label:"HS Straddle Negative — full breakdown", src:"GMB Fitness", url:"https://gmb.io/press-handstand/"},
  ]},
{ id:"elevated-press", name:"Elevated press (feet raised)", cats:["compression","line"], fatigue:"high", level:3,
  targets:"The full press pattern with the hardest few inches removed.",
  why:"The most widely endorsed way to actually find your first press. Starting with feet elevated puts your hips over your shoulders from the outset, which removes the takeoff problem and lets you feel the real pressing action — then you lower the height over months.",
  when:["skill"],
  dosage:"4–6 attempts per session with feet on a box, chair, or your medium parallettes. Quality over quantity — stop when the pattern degrades.",
  progression:"Lower the starting height incrementally. This is a months-long progression, not a weekly one — each drop in height is a real milestone.",
  regression:"Raise the height. If you can't press from any height, go back to straddle negatives and compression work.",
  mistakes:"Dropping height too fast and turning it into a jump; letting the arms bend; rushing rather than pressing smoothly.",
  cues:"Hips stack over shoulders before anything lifts. Lean, then rise — the legs follow the hips, they don't lead.",
  pairs:"Your medium parallettes work well as the elevated surface; drop to the low set as you progress.",
  source:"Power Monkey Fitness's high-to-low progression and GorNation's handstand press guide both build the skill this way; BERG Movement recommends the same, using the elevated entry plus a negative on the way down.",
  upgrades:[
    {type:"measurable", label:"Log the height in cm", detail:"The single best long-term press metric you have. Same drill, shrinking number, over months."},
    {type:"harder", label:"Add a negative on the way down", detail:"After pressing up, lower all the way to the floor slowly — you get a press and a negative from one rep."},
  ],
  media:[
    {t:"video", label:"Press to Handstand Progression: Box Drill", src:"Coach David Durante · YouTube", url:"https://www.youtube.com/watch?v=A6ddrB2MDt0"},
    {t:"video", label:"Press Progression: Plate Drill (small elevation)", src:"Coach David Durante · YouTube", url:"https://www.youtube.com/watch?v=bwvfCR27czo"},
    {t:"article",label:"Training the press from high to low", src:"Power Monkey Fitness", url:"https://www.powermonkeyfitness.com/blogs/techniquematters/training-your-press-to-handstand"},
  ]},
{ id:"full-straddle-press", name:"Full straddle press from floor", cats:["compression","line"], fatigue:"high", level:4,
  targets:"The complete skill — floor to handstand, straight arms, no jump.",
  why:"The goal itself. Everything below feeds this: compression gets the feet up, the lean gets the hips over, and shoulder strength holds the line together on the way.",
  when:["skill"],
  dosage:"5–8 quality attempts at the start of a session, while fresh. This is a skill, not conditioning — never grind it tired.",
  progression:"Once straddle press is consistent, pike press (legs together) is the next milestone — significantly more compression demand.",
  regression:"Back to elevated press at whatever height still lets you press cleanly.",
  mistakes:"Jumping off the floor; bending the arms; rushing the attempt before the hips are stacked over the shoulders.",
  cues:"Slow is faster here. Hips over shoulders, lean, then float — if it feels like effort in the legs, the lean came too late.",
  pairs:"Attempt at the start of a skill session, then do compression and negatives afterward as the work.",
  source:"Cross-referenced across The Movement Athlete, GorNation, BERG Movement and GMB — all converge on straddle-before-pike, elevation-before-floor, and negatives as the strength driver.",
  upgrades:[
    {type:"measurable", label:"Log success rate", detail:"Attempts made vs. clean presses, e.g. 2/8. Watching that ratio climb is the clearest possible progress signal."},
    {type:"harder", label:"Progress to pike press", detail:"Legs together instead of straddled — the next real milestone, and a significant jump in compression demand."},
  ],
  media:[
    {t:"article",label:"Technique & prerequisites", src:"The Movement Athlete", url:"https://themovementathlete.com/how-to-press-to-handstand/"},
    {t:"article",label:"The Ultimate Guide to Handstand Press", src:"GorNation", url:"https://www.gornation.com/blogs/news/guide-to-handstand-press"},
    {t:"video", label:"Pike press setup and drills", src:"YouTube", url:"https://www.youtube.com/watch?v=4QQ2iKQxo5Y"},
  ]},

/* ---- FREESTANDING BALANCE ---- */
{ id:"kickup-practice", name:"Kick-up consistency practice", cats:["line"], fatigue:"med", level:2,
  targets:"A repeatable, low-energy entry into the handstand.",
  why:"If you only catch your balance a few times out of ten, you're spending your session practising kick-ups, not handstands — and burning the energy you wanted for holds. Fixing entry consistency is the cheapest way to get more actual handstand time.",
  when:["skill"],
  dosage:"8–10 deliberate attempts, treated as their own drill — not as failed handstands. Rest fully between.",
  progression:"Work toward catching balance 8 out of 10 attempts, then reduce the force used — the goal is a quiet, effortless entry.",
  regression:"Practise mini kick-ups only an inch or two off the floor, focusing on the shape rather than getting all the way up.",
  mistakes:"Kicking too hard and over-shooting; treating every miss as a failure rather than a rep; letting the shoulders drift behind the hands on entry.",
  cues:"Hips over shoulders before the kick. Kick light — most people use two or three times the force they need.",
  pairs:"Do at the start of a balance session while fresh, before max-hold work.",
  source:"Handstand Factory's Kick-Up program uses the 8-out-of-10 benchmark; Yuri Marmerstein and BERG Movement both frame entry as a precision problem rather than a strength one.",
  upgrades:[
    {type:"measurable", label:"Log your hit rate", detail:"Catches out of 10 attempts. When you're reliably at 8/10, entry has stopped being your limiter."},
    {type:"harder", label:"Kick up with less force", detail:"Try to arrive with almost no momentum, or aim to hover the heel without touching the wall at all."},
  ],
  media:[
    {t:"article",label:"9 Methods for Training the Kickup", src:"Yuri Marmerstein", url:"https://www.yuri-mar.com/blog/2024/7/17/9-methods-for-training-the-kickup-to-handstand"},
    {t:"article",label:"How to Handstand Kick Up", src:"BERG Movement", url:"https://www.bergmovement.com/calisthenics-blog/how-to-handstand-kick-up"},
    {t:"article",label:"Kick-Up program rationale (8/10 rule)", src:"Handstand Factory", url:"https://handstandfactory.com/kick-up/"},
  ]},
{ id:"finger-balance", name:"Finger balance corrections", cats:["line","wrist"], fatigue:"med", level:3,
  targets:"The two corrections that keep a handstand alive — fingertip press for overbalance, palm press for underbalance.",
  why:"Balance isn't holding still; it's constant micro-correction. This drill isolates the actual mechanism so it becomes reflexive instead of panicked. It's the difference between a few seconds and genuinely holding.",
  when:["skill"],
  dosage:"3–4 sets: from back-to-wall about a hand's distance away, press fingertips to pull the heels off the wall, hold, then ease back. 5–8 pulls per set.",
  progression:"Progress from touching the wall, to hovering off it, to holding the hover for several seconds — then take it freestanding.",
  regression:"Chest-to-wall toe pulls first, which are the same mechanism with a friendlier failure direction.",
  mistakes:"Setting up too far from the wall, which forces an arched banana shape and overloads the wrists; pushing off with the feet instead of pulling with the fingers.",
  cues:"Squeeze the fingertips to pull the heels off. Ease the pressure to let them drift back. Nothing else moves.",
  pairs:"Do right before freestanding hold attempts — it primes the exact reflex you need.",
  source:"Handstand Factory's article on hand use teaches this in three explicit stages; Suby Handstands recommends a 30–60 s chest-to-wall hold as the prerequisite before working it seriously.",
  upgrades:[
    {type:"measurable", label:"Time the hover", detail:"Seconds held off the wall using fingers alone — the direct precursor to freestanding hold time."},
    {type:"harder", label:"Take it off the wall", detail:"Once you can hover several seconds reliably, run the same corrections freestanding in the open."},
  ],
  media:[
    {t:"article",label:"The Hand that Balances — 3 stages", src:"Handstand Factory", url:"https://handstandfactory.com/articles/hand/"},
    {t:"article",label:"How To Do Toe Pulls Correctly", src:"Suby Handstands", url:"https://www.subyhandstands.com/suby-handstands-blog/2024/1/24/how-to-do-toe-pulls-correctly"},
    {t:"article",label:"Balance, body line and corrections", src:"ScienceInsights", url:"https://scienceinsights.org/how-to-balance-a-handstand-body-line-hands-and-drills/"},
  ]},
{ id:"freestanding-holds", name:"Freestanding max holds", cats:["line","rib"], fatigue:"high", level:4,
  targets:"Accumulated time upside down, unsupported — balance, line, and the stamina to keep both.",
  why:"There's no substitute for this. Wall work builds the shape and the corrections; only freestanding time teaches your nervous system to use them in real time. This is the thing your classes alone won't give you enough of.",
  when:["skill"],
  dosage:"8–10 attempts, holding as long as you can each time. Short and frequent beats long and rare — 5–10 focused minutes most days outperforms one long weekly session.",
  progression:"Chase total accumulated time rather than a single best hold; once holds are consistent, start playing with shape variations.",
  regression:"Back-to-wall holds with finger corrections, or tuck handstand — the tucked shape is easier to balance because the centre of mass sits lower.",
  mistakes:"Grinding attempts while fatigued, which builds bad patterns; only chasing a personal best instead of accumulating quality time; skipping a bail plan.",
  cues:"Fingers do the work. Ribs closed, glutes on, reach tall. Know your cartwheel bail before you need it.",
  pairs:"Front-load these in a session while fresh — never after conditioning work.",
  source:"Frequency-over-volume guidance is consistent across hand-balancing coaching (ScienceInsights, Camilla Mia's freestanding guide); the cartwheel bail is the standard recommended exit.",
  upgrades:[
    {type:"measurable", label:"Log total accumulated seconds", detail:"Add up every attempt in the session, not just your best. Total volume drives adaptation and it's a far less frustrating number to watch."},
    {type:"harder", label:"Add shape work", detail:"Once holds are stable, work tuck, straddle, or one-leg shapes — each demands re-finding balance from a new position."},
  ],
  media:[
    {t:"article",label:"Create Balance In A Freestanding Handstand", src:"Camilla Mia", url:"https://camillamia.com/free-standing-handstand-chg-pt4/"},
    {t:"article",label:"Balance drills and frequency guidance", src:"ScienceInsights", url:"https://scienceinsights.org/how-to-balance-a-handstand-body-line-hands-and-drills/"},
    {t:"article",label:"Handstand progression context", src:"Bodyweight Warrior", url:"https://www.bodyweightwarrior.co.uk/blog/learn-how-to-handstand/"},
  ]},
/* ---- DESK RESETS — chair, ball, standing. 60-90s, no floor needed ---- */
{ id:"desk-chair-tspine", name:"Chair-back thoracic extension", cats:["thoracic"], fatigue:"low", level:1, desk:true, deskType:"chair",
  targets:"Thoracic extension, using the chair back as a fulcrum.",
  why:"The direct antidote to eight hours of rounding. Same joint action as your foam-roller drill, available at your desk — and t-spine extension is what stops your lower back doing the arching in a handstand.",
  when:["recovery"], dosage:"2 × 20–30 s, or 8 slow extensions. Hands behind head, elbows wide.",
  progression:"Hold longer, or add a gentle side-bend at end range.", regression:"Smaller range; support the head more with the hands.",
  mistakes:"Arching the lower back instead of the mid-back; letting the ribs flare; forcing past comfort.",
  cues:"Sit tall, hands behind head, lean back over the chair edge — extend where the chair touches, not lower.",
  pairs:"Follow with the seated hip flexor to hit both desk problems in one go.",
  source:"Named as one of the three highest-value desk drills by GMB Fitness's desk mobility routine; the chair-as-fulcrum technique is standard PT guidance.",
  upgrades:[{type:"measurable",label:"Count sessions per day",detail:"Frequency beats duration here — three short resets beat one long one."},
            {type:"harder",label:"Add an overhead reach",detail:"Reach both arms overhead as you extend for more lat and shoulder involvement."}],
  media:[{t:"article",label:"Desk Mobility Routine",src:"GMB Fitness",url:"https://gmb.io/desk-mobility/"},
         {t:"article",label:"Desk exercises for posture",src:"PostureDoc",url:"https://posturedoc.net/health/desk-exercises-posture/"}]},

{ id:"desk-hipflexor-seated", name:"Seated hip flexor (chair edge)", cats:["hips"], fatigue:"low", level:1, desk:true, deskType:"chair",
  targets:"Hip flexors and quad of the trailing leg, without leaving the chair.",
  why:"This is the one that matters most for your handstand. Sitting shortens the hip flexors; short hip flexors tilt the pelvis forward; that tilt is the banana back. You can't out-stretch a chair with shoulder work alone.",
  when:["recovery"], dosage:"20–30 s per side. Scoot to the chair edge, let one leg slide back below seat level.",
  progression:"Press the hips further forward, or squeeze the glute of the back leg to deepen it.",
  regression:"Less scoot, smaller range, or do the standing version instead.",
  mistakes:"Arching the lower back to fake range — the stretch should be felt at the front of the hip, not the spine.",
  cues:"Torso upright, tuck the tailbone under, then press the hip forward. Glute on.",
  pairs:"Pairs naturally with the chair-back extension — front of hip, then mid-back.",
  source:"Standard desk hip-flexor protocol; PostureDoc and BTOD both describe this exact chair-edge version for office use.",
  upgrades:[{type:"measurable",label:"Note the tilt at day's end",detail:"Check whether your standing posture feels different after a week of doing this 3x daily."},
            {type:"harder",label:"Add the glute squeeze",detail:"Actively contracting the glute deepens the stretch and starts retraining the pattern."}],
  media:[{t:"article",label:"12 Desk Stretches That Work",src:"BTOD",url:"https://www.btod.com/blog/12-stretches-back-pain-desk/"},
         {t:"article",label:"Desk exercises for posture",src:"PostureDoc",url:"https://posturedoc.net/health/desk-exercises-posture/"}]},

{ id:"desk-fig4", name:"Seated figure-4", cats:["hips"], fatigue:"low", level:1, desk:true, deskType:"chair",
  targets:"Glutes and deep hip rotators.",
  why:"Sitting leaves the glutes long and switched off while the rotators stiffen. This restores hip rotation, which matters for a square pelvis in your line.",
  when:["recovery"], dosage:"30 s per side. Ankle across the opposite knee, hinge forward with a flat back.",
  progression:"Hinge further forward, or press gently down on the crossed knee.",
  regression:"Less forward lean; keep the hands on the thigh for support.",
  mistakes:"Rounding the back instead of hinging at the hip; forcing the knee down.",
  cues:"Flat back, chest toward the shin. Stretch belongs in the glute, not the knee.",
  pairs:"Good after the hip flexor stretch — front then back of the hip.",
  source:"A staple in desk-mobility guidance; Optimal Sports PT and BTOD both list it as the highest-value seated hip drill.",
  upgrades:[{type:"measurable",label:"Compare sides",detail:"Most desk workers are notably tighter on one side — track whether the gap closes."},
            {type:"harder",label:"Deepen the hinge",detail:"Walk the chest further toward the shin while keeping the back flat."}],
  media:[{t:"article",label:"7 Easy Stretches to Counteract Sitting",src:"Optimal Sports PT",url:"https://optimalsportspt.com/7-easy-stretches-to-counteract-sitting-all-day/"},
         {t:"article",label:"12 Desk Stretches",src:"BTOD",url:"https://www.btod.com/blog/12-stretches-back-pain-desk/"}]},

{ id:"desk-twist", name:"Seated spinal twist", cats:["thoracic"], fatigue:"low", level:1, desk:true, deskType:"chair",
  targets:"Thoracic rotation.",
  why:"Rotation is the mobility desk work steals quietest. Keeping it stops the mid-back stiffening into one fixed shape.",
  when:["recovery"], dosage:"20 s per side, 2 rounds. Hips stay square and facing forward.",
  progression:"Use the chair arm for gentle leverage at end range.", regression:"Smaller rotation; hands on the thighs.",
  mistakes:"Twisting from the lower back or letting the hips turn — the rotation should come from the mid-back.",
  cues:"Sit tall first, then rotate. Hips locked forward, eyes follow the turn.",
  pairs:"Quick pairing with the chair-back extension.",
  source:"Recommended for thoracic stiffness from slouching by Northwest Orthopaedic Specialists among others.",
  upgrades:[{type:"measurable",label:"Pick a reference point",detail:"Note what you can see behind you at end range — a fixed object makes progress visible."},
            {type:"harder",label:"Exhale into it",detail:"A long exhale at end range typically buys several more degrees."}],
  media:[{t:"article",label:"Sit, Stand, Stretch",src:"Northwest Orthopaedic Specialists",url:"https://www.nworthopaedicspecialists.com/about-us/blog/sit-stand-stretch-habits-for-a-healthier-workday/"},
         {t:"article",label:"25 stretches for desk work",src:"Quartz",url:"https://qz.com/stretches-to-counteract-sitting-all-day"}]},

{ id:"desk-chest-opener", name:"Chair chest opener", cats:["pecs"], fatigue:"low", level:1, desk:true, deskType:"chair",
  targets:"Pecs and anterior shoulder, using the backrest.",
  why:"Counters the rounded-shoulder position directly — and pecs are already one of your tracked bottlenecks, so this is the same work you do at home, just more often.",
  when:["recovery"], dosage:"2 × 10–15 s. Hands behind the neck, elbows wide, lean back over the backrest.",
  progression:"Widen the elbows further; hold longer.", regression:"Narrower elbows, less lean.",
  mistakes:"Letting the elbows drift forward, which removes the stretch; arching the lumbar spine.",
  cues:"Elbows wide, chest through, breathe.",
  pairs:"The seated cousin of your doorway pec stretch.",
  source:"Optimal Sports PT's seated back extension / chest opener; GMB names the chest opener among the top three desk drills.",
  upgrades:[{type:"measurable",label:"Do one per call",detail:"Tie it to audio-only meetings — the easiest habit anchor there is."},
            {type:"harder",label:"Add a small rotation",detail:"Open toward one side at end range for an oblique pec stretch."}],
  media:[{t:"article",label:"7 Easy Stretches",src:"Optimal Sports PT",url:"https://optimalsportspt.com/7-easy-stretches-to-counteract-sitting-all-day/"},
         {t:"article",label:"Desk Mobility Routine",src:"GMB Fitness",url:"https://gmb.io/desk-mobility/"}]},

{ id:"desk-chin-tucks", name:"Chin tucks", cats:["thoracic"], fatigue:"low", level:1, desk:true, deskType:"chair",
  targets:"Deep neck flexors, countering forward head position.",
  why:"Screen posture pushes the head forward, which drags the upper back into flexion. Fixing it upstream helps everything below it stack.",
  when:["recovery"], dosage:"10 reps, 3 s hold each.",
  progression:"Hold longer; add gentle resistance with two fingers on the chin.", regression:"Fewer reps, shorter holds.",
  mistakes:"Tipping the head down instead of gliding it back; overdoing the force.",
  cues:"Glide the head straight back — make a double chin. Eyes stay level.",
  pairs:"Do alongside the chest opener; forward head and rounded shoulders travel together.",
  source:"Standard cervical retraction exercise from physical therapy, widely prescribed for desk-related neck posture.",
  upgrades:[{type:"measurable",label:"Track end-of-day neck feel",detail:"Note whether the usual afternoon neck ache shows up less often."},
            {type:"harder",label:"Add finger resistance",detail:"Press two fingers lightly against the chin and glide back against it."}],
  media:[{t:"article",label:"Desk exercises for posture",src:"PostureDoc",url:"https://posturedoc.net/health/desk-exercises-posture/"},
         {t:"article",label:"25 stretches for desk work",src:"Quartz",url:"https://qz.com/stretches-to-counteract-sitting-all-day"}]},

{ id:"desk-wrist-reset", name:"Desk wrist & finger reset", cats:["wrist"], fatigue:"low", level:1, desk:true, deskType:"chair",
  targets:"Wrist and forearm tissue after sustained typing.",
  why:"Typing holds the wrists in one position for hours. Since your wrists take full bodyweight in handstands, keeping them healthy through the workday is direct protection for training.",
  when:["recovery"], dosage:"10 wrist circles each way, then spread fingers 5 s / fist 5 s × 5.",
  progression:"Add a gentle prayer stretch and reverse prayer.", regression:"Circles only.",
  mistakes:"Forcing into pain; rushing through it.",
  cues:"Slow circles, full finger spread, chase warmth.",
  pairs:"Pairs with anything — this one costs nothing and can be done mid-sentence.",
  source:"Standard typing-strain countermeasure; PostureDoc's desk routine specifies this exact sequence.",
  upgrades:[{type:"measurable",label:"Note morning stiffness",detail:"If your wrists feel better at the start of training, this is why."},
            {type:"harder",label:"Add loaded extension",detail:"Press the palm gently on the desk to load wrist extension at end range."}],
  media:[{t:"article",label:"Desk exercises for posture",src:"PostureDoc",url:"https://posturedoc.net/health/desk-exercises-posture/"},
         {t:"article",label:"Wrist Strengthening",src:"GMB Fitness",url:"https://gmb.io/wrists/"}]},

{ id:"ball-tspine-drape", name:"Ball thoracic drape", cats:["thoracic","pecs"], fatigue:"low", level:1, desk:true, deskType:"ball",
  discreet:"obvious", discreetNote:"You'll be lying back over a ball — do this somewhere private, or at home.",
  targets:"Thoracic extension and chest opening over the ball.",
  why:"The best thing your yoga ball does. Draping backward over it gives a bigger, better-supported extension than any chair can — effectively your foam-roller drill with more range.",
  when:["recovery","after"], dosage:"2–3 × 20–30 s. Walk the feet out, let the upper back drape over, arms wide or overhead.",
  progression:"Straighten the knees to roll further back; arms fully overhead.", regression:"Stay more upright; keep hands behind the head for support.",
  mistakes:"Going too far too fast; holding the breath; letting the lower back take the extension.",
  cues:"Walk out slowly, let the mid-back melt over the ball, breathe into the chest.",
  pairs:"The single best desk-adjacent drill for your banana back. Do it daily if you can.",
  source:"Physitrack's thoracic extension and chest opening on exercise ball; the same position appears across PT ball protocols.",
  upgrades:[{type:"measurable",label:"Track how far you roll",detail:"Note where the ball sits on your back — further down means more range."},
            {type:"harder",label:"Arms overhead",detail:"Taking the arms fully overhead adds lat and shoulder flexion to the extension."}],
  media:[{t:"video",label:"Thoracic extension & chest opening on ball",src:"Physitrack",url:"https://ca.physitrack.com/home-exercise-video/thoracic-extension-and-chest-opening-on-exercise-ball"},
         {t:"article",label:"Stability ball T-spine extension",src:"Bellingham Athletic Club",url:"https://bellinghamathleticclub.com/2019/fitness/workout-library/stability-ball-t-spine-extension"}]},

{ id:"ball-pelvic-tilts", name:"Ball pelvic tilts & circles", cats:["hips","rib"], fatigue:"low", level:1, desk:true, deskType:"ball",
  targets:"Pelvic control — anterior/posterior tilt and rotation.",
  why:"Directly trains the pelvic tilt you need to control upside down. Learning to find posterior tilt on demand while sitting is the same skill that shuts down a banana back.",
  when:["recovery"], dosage:"10–15 slow tilts, then 10 circles each direction.",
  progression:"Hands on hips or off the ball entirely; slower and more controlled.", regression:"Hands on the ball for support; smaller range.",
  mistakes:"Moving the whole torso instead of just the pelvis; rushing.",
  cues:"Only the pelvis moves — head and shoulders stay still. Exhale into the tuck.",
  pairs:"A genuinely useful one to do while working, not just as a break.",
  source:"Standard postural-control ball protocol (Tanya Andrews Physiotherapy); pelvic tilt sequencing is consistent across PT sources.",
  upgrades:[{type:"measurable",label:"Find the tuck without hands",detail:"Being able to hit posterior tilt with no hand support is the milestone."},
            {type:"harder",label:"Add lateral tilts",detail:"Tilt side to side as well, then combine into full circles."}],
  media:[{t:"article",label:"Postural Control Ball Exercises",src:"Tanya Andrews Physiotherapy",url:"https://www.tanyaandrewsphysiotherapy.co.uk/postural-control-ball-exercises"},
         {t:"article",label:"Ball seat exercises",src:"Bloon Paris",url:"https://bloon-paris.com/blogs/active/easy-ball-seat-exercices"}]},

{ id:"ball-side-bend", name:"Ball overhead side bend", cats:["lats"], fatigue:"low", level:1, desk:true, deskType:"ball",
  targets:"Lats and side body, seated.",
  why:"Your lats are a primary bottleneck, and this is the cheapest way to touch them during the workday — the ball's instability also makes you sit up rather than slouch into it.",
  when:["recovery"], dosage:"8–10 per side, or hold 15 s each.",
  progression:"Hold longer at end range; reach further over.", regression:"Smaller bend; keep the free hand on the ball.",
  mistakes:"Collapsing forward instead of bending sideways; letting the hip lift.",
  cues:"Reach long out of the armpit first, then bend. Sit bones stay planted.",
  pairs:"Complements your overhead lat stretch at home.",
  source:"Bloon's ball-seat routine and standard seated lat protocols.",
  upgrades:[{type:"measurable",label:"Compare sides",detail:"Note which side is tighter — usually the mouse-hand side."},
            {type:"harder",label:"Add a slight rotation",detail:"Turn the chest slightly upward at end range to bias the lat further."}],
  media:[{t:"article",label:"Ball seat exercises",src:"Bloon Paris",url:"https://bloon-paris.com/blogs/active/easy-ball-seat-exercices"},
         {t:"article",label:"Stability ball guidance",src:"BodySpec",url:"https://www.bodyspec.com/blog/post/ball_exercises_stability_medicine_slam_ball_workouts"}]},

{ id:"ball-marching", name:"Ball marching & hip circles", cats:["hips"], fatigue:"low", level:1, desk:true, deskType:"ball",
  targets:"Hip mobility and light core engagement while seated.",
  why:"Keeps the hips moving through the workday rather than locked at 90°. Low value per rep, but it's something you can do continuously while working.",
  when:["recovery"], dosage:"30–60 s marching, then 10 hip circles each way.",
  progression:"Hands off the ball; slower and higher knees.", regression:"Hands on the ball; smaller movement.",
  mistakes:"Bouncing rather than controlling; slumping as you go.",
  cues:"Sit tall, lift from the hip, keep the ball still underneath you.",
  pairs:"Good between focused work blocks.",
  source:"Common ball-chair movement protocols (Trideer, Bloon).",
  upgrades:[{type:"measurable",label:"Time your ball stints",detail:"Track how long you sit on the ball before wanting the chair back."},
            {type:"harder",label:"Hands off",detail:"Removing hand support makes the trunk do the stabilising."}],
  media:[{t:"article",label:"Exercise ball chair exercises",src:"Trideer",url:"https://trideer.com/blogs/expert-advice/best-exercise-ball-chair-exercises-for-office-workers"},
         {t:"article",label:"Ball seat exercises",src:"Bloon Paris",url:"https://bloon-paris.com/blogs/active/easy-ball-seat-exercices"}]},

{ id:"desk-standing-hipflexor", name:"Standing hip flexor (lunge)", cats:["hips"], fatigue:"low", level:1, desk:true, deskType:"stand",
  discreet:"obvious", discreetNote:"This is a visible lunge. Best in a corridor, empty room, or at home.",
  targets:"Hip flexors and quads, standing.",
  why:"A deeper version of the seated stretch when you can step away from the desk. Named across desk-mobility sources as one of the three highest-value office drills.",
  when:["recovery"], dosage:"20–30 s per side. Split stance, tuck the tailbone, press the hips forward.",
  progression:"Rear foot elevated on the chair; add an overhead reach on the same side.", regression:"Shorter stance; hold the desk for balance.",
  mistakes:"Arching the lower back instead of tucking the pelvis — this removes the stretch entirely.",
  cues:"Tuck the tailbone first, then press forward. Glute of the back leg switched on.",
  pairs:"The standing upgrade of the chair-edge version.",
  source:"GMB Fitness names the hip flexor stretch in its three-minute minimum desk routine; BTOD describes the chair-assisted variant.",
  upgrades:[{type:"measurable",label:"Note the tuck",detail:"If you can't feel it, you're arching instead of tucking — that correction is the progress."},
            {type:"harder",label:"Overhead reach",detail:"Reach the same-side arm overhead and slightly across for a full anterior-chain line."}],
  media:[{t:"article",label:"Desk Mobility Routine",src:"GMB Fitness",url:"https://gmb.io/desk-mobility/"},
         {t:"article",label:"12 Desk Stretches",src:"BTOD",url:"https://www.btod.com/blog/12-stretches-back-pain-desk/"}]},
];
const EX_ALL = () => EXERCISES.concat(state.customDrills||[]);
const exById = id => EX_ALL().find(e=>e.id===id);
const catProgression = catId => EX_ALL().filter(e=>e.cats.includes(catId)).sort((a,b)=>a.level-b.level);
/* Suggested level in a category, from how much you have actually logged in it. */
function recommendedLevel(catId){
  const recent = state.logs.filter(l=>l.date>=todayISO(-27));
  const done = {};
  recent.forEach(l=> (l.done||[]).forEach(id=>{ const e=exById(id);
    if(e && e.cats.includes(catId)) done[e.level]=(done[e.level]||0)+1; }));
  const lvls = Object.keys(done).map(Number);
  if(!lvls.length) return 2;
  const top = Math.max(...lvls);
  return (done[top]||0) >= 4 ? Math.min(4, top+1) : top;
}

/* ============================================================
   SKILLS layer — opt-in sessions, appended to (never replacing)
   the day's scheduled support block. Adding a future skill = one
   more object here; nothing else needs restructuring.
   Each level's drills are stored in PRIORITY ORDER, so a shorter
   preset keeps the non-negotiables rather than a random subset.
============================================================ */
const SKILL_PRESETS = [
  {id:"quick", name:"Quick", mins:10, take:3, note:"The non-negotiables only."},
  {id:"full",  name:"Full",  mins:20, take:5, note:"The standard session."},
  {id:"long",  name:"Long",  mins:30, take:7, note:"Everything, with room to play."},
];
const SKILLS = [
{ id:"press", name:"Press handstand", short:"Press",
  goal:"Floor to handstand with straight arms, no jump.",
  metric:{key:"pressHeight", label:"Elevation height used (cm)", hint:"0 = from the floor. Lower over months — this is your main press metric.", type:"number"},
  metric2:{key:"pressReps", label:"Clean press attempts (e.g. 2/8)", hint:"Successes out of attempts, or seconds of your slowest negative.", type:"text"},
  debate:"Coaches genuinely disagree on the entry point here. Some build compression first, some build straight-arm strength first, some go straddle-first vs pike-first. What is near-universal: straddle before pike, elevated before floor, and negatives as the main strength driver. This chain is built straddle-first and elevation-first because that matches where you already are.",
  yourEdge:"You can already straddle down from a handstand and close back — that means you own the top half of the press. The missing piece is the takeoff: compression plus the forward shoulder lean. The chain below is weighted accordingly.",
  levels:{
    1:{name:"Build the compression base", drills:[
      {ex:"seated-pike-lifts", sets:3, reps:"8–10", hold:"", note:"the press engine"},
      {ex:"pancake", sets:3, reps:"—", hold:"45–60 s", note:"flat back, no rounding"},
      {ex:"wrist-prep", sets:1, reps:"~2 min", hold:"", note:"always first"},
      {ex:"lsit-parallettes", sets:4, reps:"—", hold:"10–20 s", note:"low parallettes"},
      {ex:"hollow-line", sets:2, reps:"—", hold:"25 s", note:"rib control under load"},
      {ex:"oh-lat-stretch", sets:2, reps:"—", hold:"30 s/side", note:"overhead range still matters"},
      {ex:"scapular-pushups", sets:2, reps:"10", hold:"", note:"serratus prep"},
    ]},
    2:{name:"Own the takeoff", drills:[
      {ex:"straddle-liftoffs", sets:4, reps:"5", hold:"3 s top", note:"low parallettes"},
      {ex:"press-walks", sets:3, reps:"5–8", hold:"", note:"lean, don't lift"},
      {ex:"straddle-negatives", sets:3, reps:"3–5", hold:"4 s descent", note:"your strongest asset"},
      {ex:"seated-pike-lifts", sets:3, reps:"10", hold:"", note:""},
      {ex:"pancake", sets:2, reps:"—", hold:"45 s", note:""},
      {ex:"lsit-parallettes", sets:3, reps:"—", hold:"15 s", note:""},
      {ex:"wrist-prep", sets:1, reps:"~2 min", hold:"", note:""},
    ]},
    3:{name:"Find the first press", drills:[
      {ex:"elevated-press", sets:5, reps:"1", hold:"", note:"log the height every time"},
      {ex:"straddle-negatives", sets:4, reps:"3–5", hold:"slow", note:"strength driver"},
      {ex:"press-walks", sets:2, reps:"5", hold:"", note:"technical primer"},
      {ex:"straddle-liftoffs", sets:3, reps:"5", hold:"5 s top", note:""},
      {ex:"lsit-parallettes", sets:3, reps:"—", hold:"20 s", note:""},
      {ex:"seated-pike-lifts", sets:2, reps:"10", hold:"", note:""},
      {ex:"pancake", sets:2, reps:"—", hold:"60 s", note:"finish open"},
    ]},
    4:{name:"Own the skill", drills:[
      {ex:"full-straddle-press", sets:6, reps:"1", hold:"", note:"fresh, at the start"},
      {ex:"elevated-press", sets:3, reps:"1", hold:"", note:"lower height each block"},
      {ex:"straddle-negatives", sets:4, reps:"3", hold:"to stalder", note:"harder variant"},
      {ex:"straddle-liftoffs", sets:3, reps:"5", hold:"5 s", note:""},
      {ex:"lsit-parallettes", sets:3, reps:"—", hold:"20 s+", note:"straddle-L if you can"},
      {ex:"press-walks", sets:2, reps:"5", hold:"", note:""},
      {ex:"pancake", sets:2, reps:"—", hold:"60 s", note:""},
    ]},
  }},
{ id:"handstand", name:"Freestanding handstand", short:"Handstand",
  goal:"Consistent entry and accumulated time upside down, unsupported.",
  metric:{key:"hsBest", label:"Longest freestanding hold (s)", hint:"Your best single hold this session.", type:"number"},
  metric2:{key:"hsTotal", label:"Total accumulated time (s) / kick-up hit rate", hint:"e.g. 95 total, or 6/10 catches. Total volume matters more than the PB.", type:"text"},
  debate:"Less contested than press, but one point matters: frequency beats volume. Short daily practice consistently outperforms one long weekly session, because balance is a nervous-system skill. Your Monday and Thursday classes cover some of this — these sessions are for the freestanding time class doesn't give you.",
  yourEdge:"You hold a few seconds already, so the foundation exists. The gap is entry consistency and accumulated unsupported time — not learning to be upside down.",
  levels:{
    1:{name:"Line and shape", drills:[
      {ex:"wrist-prep", sets:1, reps:"~2 min", hold:"", note:"never skip"},
      {ex:"wf-hold", sets:4, reps:"—", hold:"20–30 s", note:"honest line feedback"},
      {ex:"hollow-line", sets:3, reps:"—", hold:"25 s", note:"ribs shut"},
      {ex:"bodyline-drill", sets:2, reps:"—", hold:"15–20 s", note:"front + back line"},
      {ex:"scapular-pushups", sets:2, reps:"10", hold:"", note:""},
      {ex:"pike-shrugs", sets:2, reps:"10", hold:"", note:""},
      {ex:"oh-lat-stretch", sets:2, reps:"—", hold:"30 s/side", note:""},
    ]},
    2:{name:"Entry and corrections", drills:[
      {ex:"kickup-practice", sets:1, reps:"8–10 attempts", hold:"", note:"log your hit rate"},
      {ex:"wall-toe-finger-pulls", sets:3, reps:"5–8", hold:"", note:"both directions"},
      {ex:"wf-hold", sets:3, reps:"—", hold:"30 s", note:""},
      {ex:"wrist-prep", sets:1, reps:"~2 min", hold:"", note:""},
      {ex:"hollow-line", sets:2, reps:"—", hold:"25 s", note:""},
      {ex:"wf-shrugs", sets:3, reps:"5", hold:"", note:"active elevation"},
      {ex:"bodyline-drill", sets:2, reps:"—", hold:"20 s", note:""},
    ]},
    3:{name:"Take it off the wall", drills:[
      {ex:"finger-balance", sets:4, reps:"5–8", hold:"", note:"the actual mechanism"},
      {ex:"freestanding-holds", sets:1, reps:"8–10 attempts", hold:"max", note:"fresh, front-loaded"},
      {ex:"kickup-practice", sets:1, reps:"8 attempts", hold:"", note:"quiet entries"},
      {ex:"wall-toe-finger-pulls", sets:3, reps:"5", hold:"", note:""},
      {ex:"wrist-prep", sets:1, reps:"~2 min", hold:"", note:""},
      {ex:"wf-shrugs", sets:3, reps:"5", hold:"", note:""},
      {ex:"hollow-line", sets:2, reps:"—", hold:"25 s", note:""},
    ]},
    4:{name:"Accumulate and refine", drills:[
      {ex:"freestanding-holds", sets:1, reps:"10 attempts", hold:"max", note:"chase total time"},
      {ex:"finger-balance", sets:3, reps:"8", hold:"", note:"keep it sharp"},
      {ex:"free-handstand-shrug", sets:3, reps:"3–5", hold:"", note:"loaded elevation"},
      {ex:"kickup-practice", sets:1, reps:"8 attempts", hold:"", note:"minimal force"},
      {ex:"wrist-prep", sets:1, reps:"~2 min", hold:"", note:""},
      {ex:"wall-toe-finger-pulls", sets:2, reps:"5", hold:"", note:""},
      {ex:"bodyline-drill", sets:2, reps:"—", hold:"20 s", note:""},
    ]},
  }},
];
const skillById = id => SKILLS.find(s=>s.id===id);
// Which skills reference a given exercise (derived, so exercises need no skill tags)
function exSkills(exId){
  return SKILLS.filter(s=> Object.values(s.levels).some(l=> l.drills.some(d=>d.ex===exId)));
}
// Estimate the user's level in a skill from their logged skill sessions.
// Deliberately conservative: without evidence it starts you at level 1.
function skillLevel(skillId){
  const manual = (state.prefs.skillLevels||{})[skillId];
  if(manual) return manual;
  const t = treeById(skillId);
  if(t) return Math.min(4, treeProgress(t).current);
  const done = state.logs.filter(l=> (l.skills||[]).some(s=>s.skill===skillId)).length;
  if(done>=24) return 3; if(done>=10) return 2;
  return 1;
}
function skillSession(skillId, presetId){
  const sk = skillById(skillId); if(!sk) return null;
  const lvl = skillLevel(skillId);
  const preset = SKILL_PRESETS.find(p=>p.id===presetId) || SKILL_PRESETS[1];
  const all = (sk.levels[lvl]||sk.levels[1]).drills;
  return {skill:sk, level:lvl, levelName:(sk.levels[lvl]||sk.levels[1]).name, preset, drills:all.slice(0, preset.take)};
}

/* ============================================================
   PRIMARY VIDEO per drill.
   status "ok"     = dedicated clip, starts at 0, nothing to verify
   status "review" = compilation / imperfect match — needs Nikos to
                     confirm a start time or swap the video.
   Timestamps are NEVER guessed: unset means 0 until confirmed.
============================================================ */
const VIDEO = {
  "wall-slides":          {yt:"ab2pQvk8utE", title:"Wall Slide Shoulder Blade Exercise", src:"Physiotherapist Coulton Roe", status:"ok"},
  "dislocates":           {yt:"riVxa9By-pM", title:"How To Do Band Dislocates / Pass-Throughs", src:"YouTube", status:"ok"},
  "scap-wall-slides":     {yt:"ab2pQvk8utE", title:"Wall Slide — general demo", src:"Physiotherapist Coulton Roe", status:"review", why:"Same clip as basic wall slides. Needs a lift-off–specific video, or a timestamp if the hover is shown later."},
  "pails-rails-flexion":  {yt:"IxKMX6818lY", title:"Shoulder Flexion — PAILs/RAILs", src:"YouTube", status:"ok"},
  "oh-lat-stretch":       {yt:"UvZMX-cDqZg", title:"Overhead Lat Stretch for Handstands", src:"YouTube", status:"ok"},
  "bench-lat-opener":     {yt:"_jg2fJ7FnGI", title:"Elevated Bent Elbow Puppy Pose (aka the Butcher Block Stretch)", src:"YouTube", status:"ok"},
  "lat-pnf":              {yt:"8sJHzn4MIJc", title:"Fix Your Overhead Reach with This Lat PNF Stretch", src:"YouTube", status:"ok"},
  "lat-pails-rails":      {yt:"9yYClQLPoVM", title:"Lat Stretch with PAILs/RAILs", src:"YouTube", status:"ok"},
  "pec-doorway":          {yt:"Yh5HQiz8Bkw", title:"Guided Motion: Doorway Pec Stretch", src:"YouTube", status:"ok"},
  "pec-doorway-upgraded": {yt:"l5nMszaaJ28", title:"The Doorway Pec Stretch UPGRADED", src:"YouTube", status:"ok"},
  "tspine-ext":           {yt:"J1-aNR1yby0", title:"Thoracic Extension on Foam Roller", src:"YouTube", status:"ok"},
  "wall-angels":          {yt:"1UU4VvklQ44", title:"How to Perform Wall Angel", src:"YouTube", status:"ok"},
  "scapular-pushups":     {yt:"5YHZnEsE9hA", title:"Scapula Pushup — form breakdown", src:"YouTube", status:"ok"},
  "pike-shrugs":          {yt:"akgQbxhrhOc", title:"Pike position reference", src:"YouTube", status:"review", why:"This shows pike push-up positioning, not shrugs specifically. Worth swapping for a dedicated pike shrug clip."},
  "wf-shrugs":            {yt:"dtJ0-LNwIQk", title:"Drastically increase your scapular elevation", src:"YouTube Shorts", status:"ok"},
  "free-handstand-shrug": {yt:"dtJ0-LNwIQk", title:"Scapular elevation (wall version)", src:"YouTube Shorts", status:"review", why:"Shows the wall version, not the freestanding one. Needs a free-handstand shrug clip."},
  "hollow-line":          {yt:"LlDNef_Ztsc", title:"Hollow Body Hold Progression", src:"YouTube", status:"ok"},
  "bodyline-drill":       {yt:"s25mnmEjpTg", title:"BODYLINE DRILL — Straighten your handstand", src:"YouTube", status:"ok"},
  "wf-hold":              {yt:"w5bzsMWLdm8", title:"Chest to Wall Handstand Hold — tutorial", src:"YouTube", status:"ok"},
  "wall-toe-finger-pulls":{yt:"je3asGr5kHg", title:"Handstand, Toe Pull", src:"YouTube", status:"ok"},
  "first-knuckle-pushups":{yt:"g2UPqe5fAzI", title:"Wrist Mobility — First Knuckle Push-Ups", src:"YouTube", status:"ok"},
  "pancake":              {yt:"CHRUb43S6RM", title:"How to Pancake Stretch (Beginner to Advanced)", src:"YouTube", status:"ok"},
  "seated-pike-lifts":    {yt:"yQXnOuQqKYc", title:"How to Improve Active Pike Compression", src:"Antranik", status:"ok"},
  "lsit-parallettes":     {yt:"yQXnOuQqKYc", title:"Active Pike Compression (L-sit section)", src:"Antranik", status:"review", why:"The L-sit portion sits inside a longer compression video — needs the start time where it begins."},
  "straddle-negatives":   {yt:"rBT4ziR4TC4", title:"Straddle Negative PRESS Drills", src:"YouTube", status:"ok"},
  "elevated-press":       {yt:"A6ddrB2MDt0", title:"Press to Handstand Progression: Box Drill", src:"Coach David Durante", status:"ok"},
  "full-straddle-press":  {yt:"4QQ2iKQxo5Y", title:"Press setup and drills", src:"YouTube", status:"review", why:"May cover the pike press rather than straddle. Worth confirming or swapping."},
  "wrist-prep":           {yt:"mSZWSQSSEjE", title:"Wrist Prep Routine — Handstand Warm-Up", src:"GMB Fitness", status:"ok"},
  "reverse-wrist-pushups":{yt:"SAQgs_HnoIE", title:"Full Wrist Warmup For Handstands", src:"YouTube", status:"review", why:"Chaptered compilation — the reverse wrist push-up section starts partway in. Needs its start time."},
  "straddle-liftoffs":    {yt:"rBT4ziR4TC4", title:"Press drills (related)", src:"YouTube", status:"review", why:"No dedicated straddle lift-off clip found. Placeholder — worth replacing with a better one."},
  "desk-chair-tspine":    {yt:"kdLSJuzRNUw", title:"5 Minute Desk Stretches — Without Getting Up", src:"YouTube", status:"review", why:"Compilation covering several desk stretches — set the start time where the back extension begins."},
  "desk-hipflexor-seated":{yt:"U5VtjFywhIA", title:"5 Stretches That Instantly Undo Sitting", src:"YouTube", status:"review", why:"Compilation — find the hip flexor section and set the start time."},
  "desk-fig4":            {yt:"kdLSJuzRNUw", title:"5 Minute Desk Stretches — Without Getting Up", src:"YouTube", status:"review", why:"Compilation — set the start time at the figure-4 section."},
  "desk-twist":           {yt:"xRH1To_xyr8", title:"5 min Seated Stretch — chair yoga work break", src:"YouTube", status:"review", why:"Compilation — set the start time at the seated twist."},
  "desk-chest-opener":    {yt:"kdLSJuzRNUw", title:"5 Minute Desk Stretches — Without Getting Up", src:"YouTube", status:"review", why:"Compilation — set the start time at the chest opener."},
  "desk-chin-tucks":      {yt:"BdfTuxdfIE8", title:"Quick and Easy Stretches While Sitting at Your Desk", src:"YouTube", status:"review", why:"Compilation — set the start time at the neck retraction."},
  "desk-wrist-reset":     {yt:"BdfTuxdfIE8", title:"Quick and Easy Stretches While Sitting at Your Desk", src:"YouTube", status:"review", why:"Compilation — set the start time at the wrist section."},
  "desk-standing-hipflexor":{yt:"U5VtjFywhIA", title:"5 Stretches That Instantly Undo Sitting", src:"YouTube", status:"review", why:"Compilation — set the start time at the standing lunge stretch."},
  "ball-pelvic-tilts":    {yt:"Y2TLxsGVcU4", title:"How to do a pelvic tilt sitting on a Swiss ball", src:"YouTube", status:"ok"},
  "ball-tspine-drape":    {yt:"j4YjiFdRtGw", title:"Stability ball — spinal work", src:"YouTube", status:"review", why:"Not specific to the backward drape. Worth swapping for a dedicated clip."},
  "ball-side-bend":       {yt:"", title:"", src:"", status:"missing", why:"No dedicated clip found for the seated overhead side bend on a ball."},
  "ball-marching":        {yt:"", title:"", src:"", status:"missing", why:"No dedicated clip found for seated ball marching."},
  "press-walks":          {yt:"", title:"", src:"", status:"missing", why:"No good dedicated clip found for the press walk / weight-shift drill. Needs one picking."},
  "skin-the-cat":       {yt:"eAHkE3BfcAg", title:"SKIN the CAT tutorial & progression exercises on rings", src:"YouTube", status:"ok"},
  "bar-pullover":         {yt:"axMBASXBWUQ", title:"How To Do a Pullover on a Gymnastics bar!", src:"YouTube", status:"ok"},
  "tuck-back-lever":      {yt:"SZV1-ts76CM", title:"Tuck Back Lever Hold (Rings)", src:"YouTube", status:"ok"},
  "skin-the-cat-straddle-negative": {yt:"eAHkE3BfcAg", title:"SKIN the CAT tutorial & progression exercises on rings", src:"YouTube", status:"ok"},
  "ring-shoulder-stand":  {yt:"mCjtBrYFIZA", title:"Gymnastic Rings Shoulder Stand Tutorial (Beginner to Advanced)", src:"YouTube", status:"ok"},
  "bodyweight-squat":     {yt:"zJBLDJMJiDE", title:"Bodyweight Squat Tutorial: Mobility & Technique", src:"GMB Fitness", status:"ok"},
  "bulgarian-split-squat":{yt:"9FOMyxA3Lw4", title:"How To Do A Bulgarian Split Squat", src:"Coach Kelly Cues", status:"ok"},
  "shrimp-squat":         {yt:"Ibp8yWerUgc", title:"Shrimp Squat vs Pistol Squat: Progressions", src:"GMB Fitness", status:"ok"},
  "pistol-squat":         {yt:"Ibp8yWerUgc", title:"Shrimp Squat vs Pistol Squat: Progressions", src:"GMB Fitness", status:"ok"},
  "jump-squat":           {yt:"vF2aEkQq2w8", title:"How To Do Jumping Squats", src:"Calixpert", status:"ok"},
  "wall-sit":             {yt:"JaZNYM3zAP0", title:"How To Do a Wall Sit — The Right Way", src:"Well+Good", status:"ok"},
  "glute-bridge":         {yt:"", title:"", src:"", status:"missing", why:"No dedicated bodyweight glute bridge video found — the article sources are strong, a video is worth adding."},
  "hip-thrust":           {yt:"", title:"", src:"", status:"missing", why:"No dedicated bodyweight hip thrust video found without weight — worth finding one."},
  "single-leg-deadlift":  {yt:"", title:"", src:"", status:"missing", why:"No dedicated clip found and confirmed — needs one picking."},
  "nordic-curl":          {yt:"X-j0ZMDy-QE", title:"Nordic Curl | Glute Ham Raise | Bodyweight Hamstring", src:"YouTube", status:"ok"},
  "reverse-lunge":        {yt:"Ry-wqegeKlE", title:"How To Perform The Reverse Lunge", src:"YouTube", status:"ok"},
  "step-up":              {yt:"vOiHvzj5XhA", title:"Step Up Tutorial — Proper Form and Technique", src:"YouTube", status:"ok"},
  "calf-raise":           {yt:"k8ipHzKeAkQ", title:"Exercises with an Athletic Trainer: Standing Calf Raises", src:"YouTube", status:"ok"},
  "glute-activation-circuit": {yt:"", title:"", src:"", status:"missing", why:"This bundles four small movements — worth finding one combined circuit video rather than four separate ones."},
  "kickup-practice":      {yt:"mfHcZQ-H_W4", title:"Nail Your Kick Up To Handstand! (Simple Drill)", src:"Bodyweight Warrior", status:"ok"},
  "finger-balance":       {yt:"OYehg2ruMN0", title:"How to Balance a Handstand: Heel pulls", src:"YouTube", status:"ok"},
  "freestanding-holds":   {yt:"Z1BEEzg5L6Q", title:"Handstand Kick Up Tutorial — All the Levels", src:"YouTube", status:"review", why:"Broad tutorial rather than freestanding-hold specific. Needs a timestamp or a better clip."}
};
function vidFor(exId){
  const cd = (state.customDrills||[]).find(d=>d.id===exId);
  const base = cd ? (cd.yt? {yt:cd.yt, title:cd.videoTitle||cd.name, src:cd.videoSrc||"Your link", status:"ok"}
                          : {yt:"", title:"", src:"", status:"missing", why:"No video added for this drill yet."})
                  : VIDEO[exId];
  if(!base) return null;
  const ov = (state.prefs.videoOverride||{})[exId];
  const yt = ov || base.yt;
  if(!yt) return Object.assign({}, base, {yt:""});
  const start = ((state.prefs.videoStart||{})[exId]) || 0;
  const confirmed = !!(state.prefs.videoConfirmed||{})[exId];
  return Object.assign({}, base, {yt:yt, start:start, confirmed:confirmed,
    status: (confirmed || ov) ? "ok" : base.status});
}
function needsReview(){
  return EX_ALL().filter(function(e){ if(e.desk) return false; const v=vidFor(e.id); return v && v.status!=="ok"; });
}

/* Thumbnail fallback: maxres -> hqdefault -> styled local placeholder.
   Some environments (sandboxed previews, strict CSP, ad-blockers) block
   youtube.com entirely; in that case we render our own placeholder so the
   sheet never shows a broken image, and lean on the external link instead. */
function vidThumbFail(img){
  const yt=img.getAttribute("data-yt"), nm=img.getAttribute("data-nm")||"";
  if(img.src.indexOf("maxresdefault")>-1){ img.src="https://img.youtube.com/vi/"+yt+"/hqdefault.jpg"; return; }
  img.onerror=null;
  const box=img.closest(".vidbox"); if(!box) return;
  box.classList.add("blocked");
  img.remove();
  const ph=document.createElement("div");
  ph.className="vidph";
  ph.innerHTML='<div class="vidph-in">'+ICONS.vid+'<b>'+nm+'</b><span>Preview unavailable here — tap to watch on YouTube</span></div>';
  box.insertBefore(ph, box.firstChild);
}
function mmss(s){ s=Math.max(0,Math.floor(s||0)); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); }
function parseTime(t){
  t=(t||"").trim(); if(!t) return 0;
  if(/^\d+$/.test(t)) return parseInt(t,10);
  const m=t.match(/^(\d+):(\d{1,2})$/); return m? (+m[1])*60+(+m[2]) : 0;
}

/* ============================================================
   CALISTHENICS CATALOG — for class logging.
   Lightweight on purpose: name + family + progression order.
   Full coaching detail lives on the 46 training drills instead.
   Variations are modifiers (banded, weighted, tuck…) so the same
   movement stays one trackable line as it progresses.
============================================================ */
const CATALOG = {
"Pull — bar":[["Dead hang",1],["Scapular pull-up",1],["Arch hang",2],["Negative pull-up",2],["Pull-up",3],["Chin-up",3],["Commando pull-up",3],["Wide-grip pull-up",4],["L-sit pull-up",4],["Archer pull-up",4],["Typewriter pull-up",4],["Weighted pull-up",4],["One-arm pull-up negative",5],["One-arm pull-up",5],["Bar pullover",3],["Chest-to-bar pull-up",4],["Kipping pull-up",2]],
"Pull — rows":[["Incline body row",1],["Body row",2],["Feet-elevated body row",3],["Wide body row",3],["Archer body row",4],["One-arm body row",5],["Front lever row",5]],
"Push — floor":[["Incline push-up",1],["Knee push-up",1],["Push-up",2],["Diamond push-up",3],["Wide push-up",2],["Decline push-up",3],["Archer push-up",4],["Pseudo planche push-up",4],["One-arm push-up negative",4],["One-arm push-up",5]],
"Push — dips":[["Bench dip",1],["Support hold (bars)",1],["Negative dip",2],["Dip",3],["Weighted dip",4],["Bulgarian dip",5],["Straight-bar dip",3]],
"Push — vertical":[["Pike push-up",2],["Feet-elevated pike push-up",3],["Wall-supported HSPU negative",3],["Wall handstand push-up",4],["Deficit wall HSPU",5],["Freestanding HSPU",5],["Wall walk",2]],
"Muscle-up":[["High pull-up (chest to bar)",4],["Explosive pull-up",4],["Baby muscle-up (low bar)",3],["Jumping muscle-up",3],["Negative muscle-up",4],["Bar muscle-up",5],["Ring muscle-up transition",4],["Ring muscle-up",5],["False grip hang",3],["False grip pull-up",4]],
"Front lever":[["Tuck front lever",2],["Tuck front lever raise",3],["Advanced tuck front lever",3],["One-leg front lever",4],["Straddle front lever",4],["Half-lay front lever",5],["Full front lever",5],["Front lever pull-out",4],["Ice cream maker",5]],
"Back lever":[["Skin the cat",2],["Tuck back lever",3],["Advanced tuck back lever",3],["One-leg back lever",4],["Straddle back lever",4],["Full back lever",5],["German hang",2],["Skin the cat straddle negative",3]],
"Planche":[["Planche lean",2],["Frog stand",2],["Tuck planche",3],["Advanced tuck planche",4],["One-leg planche",4],["Straddle planche",5],["Full planche",5],["Planche push-up",5],["Pseudo planche hold",3]],
"Human flag":[["Vertical flag hold",2],["Chamber hold (tuck flag)",3],["Spotted flag hold",3],["Straddle flag",4],["Full human flag",5],["Flag negative",4]],
"Handstand":[["Wall plank",1],["Chest-to-wall handstand",2],["Back-to-wall handstand",2],["Handstand kick-up",2],["Toe pulls",3],["Heel pulls",3],["Freestanding handstand hold",3],["Handstand shrug",3],["Handstand walk",4],["Tuck handstand",3],["Straddle handstand",4],["One-arm handstand prep",5],["Handstand pirouette",4]],
"Press handstand":[["Pancake compression",2],["Seated pike lift",2],["Straddle lift-off",3],["Press walk",3],["Box press",3],["Straddle press negative",3],["Stalder press negative",4],["Straddle press",4],["Pike press",5],["Stalder press",5],["Elevated press",3]],
"Core — compression":[["Hollow body hold",1],["Hollow rock",2],["Tuck L-sit",2],["One-leg L-sit",2],["L-sit",3],["Straddle L-sit",4],["V-sit",5],["Manna",5],["Toes to bar",3],["Hanging leg raise",3],["Hanging knee raise",2],["Windshield wipers",4]],
"Core — other":[["Plank",1],["Side plank",1],["Arch hold (superman)",1],["Dragon flag negative",4],["Dragon flag",5],["Ab wheel from knees",3],["Ab wheel standing",5],["Dead bug",1],["Copenhagen plank",3],["Hanging windshield wipers",5]],
"Legs & glutes":[["Bodyweight squat",1],["Split squat",2],["Bulgarian split squat",3],["Pistol squat negative",3],["Pistol squat",4],["Shrimp squat",4],["Glute bridge",1],["Single-leg glute bridge",2],["Hip thrust",2],["Weighted hip thrust",3],["Nordic curl negative",4],["Nordic curl",5],["Reverse lunge",2],["Walking lunge",2],["Step-up",2],["Calf raise",1],["Single-leg deadlift",2],["Frog pump",1],["Fire hydrant",1],["Clamshell",1],["Kickback",1],["Banded lateral walk",1],["Curtsy lunge",2],["Sumo squat",1],["Jump squat",3],["Wall sit",1]],
"Rings":[["Ring support hold",2],["Ring row",2],["Ring push-up",3],["Ring dip",4],["Ring L-sit",4],["Ring turned-out support",4],["Ring flye",4],["Ring archer row",4]],
"Warm-up & prep":[["Band pull-apart",1],["Shoulder dislocate (stick)",1],["Arm circles",1],["Wrist circles",1],["Cat-cow",1],["Jumping jacks",1],["Hip circles",1],["Leg swings",1],["Inchworm",1],["World's greatest stretch",1],["Band face pull",1],["Ring support scap work",2]],
"Grip & hangs":[["Passive hang",1],["Active hang",1],["One-arm hang",3],["Towel hang",3],["Fingertip hang",4],["Rope climb (legs)",3],["Rope climb (legless)",5],["Plate pinch",2],["Bar hang shrug",2]],
"Bridging":[["Table top bridge",1],["Bridge (short)",2],["Full bridge",3],["Bridge push-up",4],["Wall walk down",3],["Stand-to-bridge",5],["One-arm bridge",5]],
"Explosive":[["Clap push-up",4],["Explosive push-up",3],["Bar pop-up",3],["Muscle-up pop",4],["Box jump",2],["Broad jump",2],["Burpee",2],["Kip swing",2],["Plyo pull-up",4]],
"Rings — extra":[["Inverted hang",2],["Ring roll",4],["Ring shoulder stand",4],["Ring hollow hold",3],["Bulgarian ring dip",5],["Ring handstand",5],["False grip row",3]],
"Neck & forearm":[["Neck bridge",3],["Wrist curl",1],["Reverse wrist curl",1],["Forearm plank",1],["Wrist rotation",1]],
"Handstand entries":[["Kick-up",2],["Tuck-up to handstand",4],["Straddle-up to handstand",4],["Pike-up to handstand",5],["Frog stand to handstand",4],["Crow to handstand",4]],
"Mobility & stretch":[["Pancake",2],["Pike fold",1],["Couch stretch",2],["Pigeon pose",2],["Downward dog",1],["Puppy pose",1],["Thoracic extension",1],["Doorway pec stretch",1],["Overhead lat stretch",1],["Wall angel",1],["Hip flexor lunge stretch",1],["Butterfly stretch",1],["Hamstring stretch",1],["Wrist stretch",1],["Shoulder flexion PAILs/RAILs",3],["Middle split",3],["Front split",3],["Bridge",3]]
};
/* modifiers that keep one movement one trackable line */
const VARIATIONS = ["strict","banded (assist)","banded (resist)","weighted","tempo / slow","negative only","tuck","advanced tuck","one leg","straddle","half lay","full","paused","explosive","rings","parallettes","elevated","deficit","assisted","spotted","one arm","L-sit","archer","false grip","wide grip","close grip"];
const ASSIST = [["none","Unassisted"],["light","Light spot"],["heavy","Heavy spot"],["band","Band assist"],["box","Box / elevated"]];
function catalogFlat(){
  const out=[];
  Object.keys(CATALOG).forEach(fam=> CATALOG[fam].forEach(x=> out.push({name:x[0], lvl:x[1], fam:fam})));
  (state.customMoves||[]).forEach(m=> out.push({name:m.name, lvl:m.lvl||0, fam:m.fam||"Mine", custom:true}));
  return out;
}
function searchCatalog(q){
  const s=(q||"").toLowerCase().trim();
  const all=catalogFlat();
  if(!s) return [];
  return all.filter(x=> x.name.toLowerCase().includes(s) || x.fam.toLowerCase().includes(s)).slice(0,24);
}
function recentMoves(n){
  const seen=new Map();
  (state.classLogs||[]).slice().reverse().forEach(cl=> (cl.items||[]).forEach(it=>{
    if(!seen.has(it.name)) seen.set(it.name, it);
  }));
  return [...seen.values()].slice(0, n||12);
}

/* ============================================================
   SKILL TREES — a ladder per skill, easiest to hardest.
   Your position is derived from what you log, not self-reported.
   "match" lists the movement names (class log or catalog) that
   count as evidence for a stage.
   Handstand is fully detailed; the rest carry structure now and
   get enriched as you train them.
============================================================ */
const TREES = [
{ id:"handstand", name:"Freestanding handstand", fam:"Handstand", depth:"full",
  goal:"A controlled 30-second freestanding handstand with a straight line.",
  prereq:"Wrists that tolerate bodyweight, and the shoulder range to get your arms fully overhead without arching.",
  reality:"Most people without a gymnastics background reach a 5–10 second hold in 2–4 months of near-daily practice, and 30 seconds in 4–12 months. Frequency matters far more than session length — short daily practice beats one long weekly session.",
  stages:[
   {n:1, name:"Own the shape on the floor", target:"Hold a clean hollow and a clean arch for 30 s",
    match:["Hollow body hold","Plank","Arch hold (superman)","Wall plank"],
    crit:"30 s hollow with the lower back flat, and 30 s arch without lumbar pinching.",
    why:"If the line breaks on the floor, it will break upside down — you just cannot see it there.",
    drills:["hollow-line","bodyline-drill","wrist-prep","scapular-pushups","tspine-ext","hollow-line"]},
   {n:2, name:"Hold the line on the wall", target:"3 × 30 s chest-to-wall with ribs closed",
    match:["Chest-to-wall handstand","Wall walk","Back-to-wall handstand"],
    crit:"30 s chest-to-wall, hips and ribs close to the wall, shoulders pushing tall.",
    why:"The wall gives honest feedback. This is where your shoulder line actually gets built.",
    drills:["wf-hold","wf-shrugs","pike-shrugs","wall-slides","oh-lat-stretch","scap-wall-slides","bench-lat-opener","wrist-prep"]},
   {n:3, name:"Find the balance point", target:"Toe pulls and heel pulls held 3–5 s",
    match:["Toe pulls","Heel pulls","Handstand kick-up"],
    crit:"Pull the heels off the wall with your fingers and hold 3–5 s, repeatedly and on purpose.",
    why:"Balance is fingertip pressure, not hip correction. This is where you learn the actual mechanism.",
    drills:["wall-toe-finger-pulls","finger-balance","kickup-practice","first-knuckle-pushups","wf-hold","wrist-prep","reverse-wrist-pushups"]},
   {n:4, name:"Freestanding holds", target:"Consistent 10 s freestanding, kick-up 8/10",
    match:["Freestanding handstand hold","Handstand kick-up","Tuck handstand"],
    crit:"Catch balance 8 times out of 10 attempts, and hold 10 s or more without a wall.",
    why:"Entry consistency is what turns practice time into handstand time rather than kick-up time.",
    drills:["freestanding-holds","kickup-practice","finger-balance","wf-shrugs","hollow-line","wrist-prep","bodyline-drill"]},
   {n:5, name:"Own it", target:"30 s freestanding, straight line, calm",
    match:["Freestanding handstand hold","Handstand walk","Handstand pirouette","Straddle handstand"],
    crit:"30 s held with a straight line and relaxed breathing, most attempts.",
    why:"From here progress is shapes, walking and one-arm work rather than more mobility.",
    drills:["freestanding-holds","free-handstand-shrug","bodyline-drill","finger-balance","wf-shrugs","wrist-prep"]}],
  support:{
    strength:["Handstand shrug","Scapular push-up","Pike push-up","Hollow body hold","Plank"],
    mobility:["Shoulder flexion PAILs/RAILs","Overhead lat stretch","Thoracic extension","Doorway pec stretch","Wrist stretch"]},
  volume:"20–30 freestanding attempts per session, 4 days a week. Around 60–90 minutes of handstand practice across the week, split into short frequent doses.",
  plateau:"A plateau of two weeks or more is normal. Cut volume by about 30% for a week, then build back — grinding through it usually makes it worse."},

{ id:"press", name:"Press handstand", fam:"Press handstand", depth:"full",
  goal:"Straddle press from the floor to handstand with straight arms and no jump.",
  prereq:"A reasonably stable handstand, plus enough pancake range to get your hips over your hands.",
  reality:"Most people need 6–12 months of dedicated work after a stable handstand. Coaches genuinely disagree on the entry point, but straddle-before-pike, elevated-before-floor and negatives-as-the-strength-driver are near universal.",
  stages:[
   {n:1, name:"Build compression", target:"Pancake chest low, seated pike lifts 3×10",
    match:["Pancake","Pancake compression","Seated pike lift","Pike fold"],
    crit:"Chest close to the floor in a flat-backed pancake, and 10 clean seated pike lifts.",
    why:"Passive range gets your hips forward; active compression is what peels your feet off the floor.",
    drills:["pancake","seated-pike-lifts","lsit-parallettes","hollow-line","oh-lat-stretch","wrist-prep"]},
   {n:2, name:"Own the takeoff", target:"Straddle lift-off held 5 s",
    match:["Straddle lift-off","Press walk","L-sit","Straddle L-sit"],
    crit:"Lift both feet off the floor from a straddle and hold 5 s with straight arms.",
    why:"This is the press takeoff isolated. The forward shoulder lean does the work, not the legs.",
    drills:["straddle-liftoffs","press-walks","lsit-parallettes","seated-pike-lifts","pancake","scapular-pushups"]},
   {n:3, name:"Control the descent", target:"4+ second straddle negative, 3×3",
    match:["Straddle press negative","Stalder press negative","Skin the cat straddle negative"],
    crit:"Lower from handstand to floor in 4 seconds or more with locked arms, repeatedly.",
    why:"The strongest single press builder — you build strength through the exact path you will press up.",
    drills:["straddle-negatives","elevated-press","straddle-liftoffs","pancake","wf-shrugs","lsit-parallettes"]},
   {n:4, name:"Press from height", target:"Box press, lowering the height over months",
    match:["Box press","Elevated press"],
    crit:"Press smoothly from an elevated surface without jumping, and log the height each time.",
    why:"Removes the hardest few centimetres so you can feel the real pressing action.",
    drills:["elevated-press","straddle-negatives","press-walks","lsit-parallettes","pancake","seated-pike-lifts"]},
   {n:5, name:"Full press", target:"Straddle press from the floor",
    match:["Straddle press","Pike press","Stalder press"],
    crit:"Floor to handstand, straight arms, no jump, more than half of attempts.",
    why:"Pike press is the next milestone once straddle is consistent.",
    drills:["full-straddle-press","elevated-press","straddle-negatives","pancake","lsit-parallettes","wf-shrugs"]}],
  support:{
    strength:["L-sit","Handstand shrug","Pike push-up","Hanging leg raise","Straddle L-sit"],
    mobility:["Pancake","Pike fold","Hamstring stretch","Shoulder flexion PAILs/RAILs","Overhead lat stretch"]},
  volume:"2–3 press sessions a week, always at the start of a session while fresh. Compression work can be near-daily since it is low fatigue.",
  plateau:"Height on the elevated press is the metric to watch. If it has not dropped in two months, the limiter is usually compression, not strength."},

{ id:"front-lever", name:"Front lever", fam:"Front lever", depth:"structure",
  goal:"A horizontal full-body hold under the bar with straight arms.",
  prereq:"Solid pull-ups and a strong hollow body position.",
  reality:"Typically a year or more from first tuck to full lever. Straight-arm strength builds slowly and tendons adapt slower than muscle — patience matters more here than effort.",
  stages:[
   {n:1, name:"Tuck", target:"Tuck front lever 3×10 s", match:["Tuck front lever"],
    crit:"10 s tucked with the back parallel to the floor and arms straight.",
    why:"Teaches straight-arm scapular retraction, which is the whole skill in miniature.",
    drills:["hollow-line","scapular-pushups","bodyline-drill"]},
   {n:2, name:"Advanced tuck", target:"Advanced tuck 3×8 s", match:["Advanced tuck front lever","Tuck front lever raise"],
    crit:"Hips open toward horizontal, back flat, 8 s.",
    why:"The first real jump in leverage.",
    drills:["hollow-line","bodyline-drill"]},
   {n:3, name:"One leg", target:"One-leg front lever 5 s each side", match:["One-leg front lever"],
    crit:"5 s per side without the hips dropping.",
    why:"Half the leverage of straddle, and it exposes side-to-side differences.",
    drills:["hollow-line"]},
   {n:4, name:"Straddle", target:"Straddle front lever 5 s", match:["Straddle front lever","Front lever pull-out"],
    crit:"5 s straddled and horizontal.",
    why:"The last step before full.",
    drills:["pancake","hollow-line"]},
   {n:5, name:"Full", target:"Full front lever 5 s", match:["Full front lever","Half-lay front lever","Front lever row","Ice cream maker"],
    crit:"5 s fully extended and horizontal.",
    why:"From here it becomes rows, pull-outs and dynamic work.",
    drills:[]}],
  support:{strength:["Pull-up","Weighted pull-up","Body row","Hanging leg raise","Hollow body hold","Scapular pull-up"],
           mobility:["Thoracic extension","Overhead lat stretch","Doorway pec stretch"]},
  volume:"2–3 sessions a week, short holds with full rest. Straight-arm work is hard on elbows — stop well before failure.",
  plateau:"If a stage stalls for a month, add weighted pull-ups and hanging leg raises rather than more lever holds."},

{ id:"muscle-up", name:"Muscle-up", fam:"Muscle-up", depth:"structure",
  goal:"Pull to the bar and transition over it into a dip, in one movement.",
  prereq:"Around 8–10 strict pull-ups and 8–10 dips.",
  reality:"With the strength prerequisites in place it is often a matter of weeks, because the transition is largely technique. Without them it can be many months.",
  stages:[
   {n:1, name:"Strength base", target:"8 strict pull-ups, 8 dips", match:["Pull-up","Dip","Chin-up"],
    crit:"8 strict pull-ups and 8 clean dips in a set.", why:"Below this the transition is not a technique problem, it is a strength problem.",
    drills:["scapular-pushups"]},
   {n:2, name:"Explosive pull", target:"Pull to sternum height", match:["High pull-up (chest to bar)","Explosive pull-up","Chest-to-bar pull-up"],
    crit:"Pull the bar to sternum level, not just chin.", why:"You need height to have time to transition.",
    drills:[]},
   {n:3, name:"Learn the transition", target:"Baby or jumping muscle-up", match:["Baby muscle-up (low bar)","Jumping muscle-up","False grip hang"],
    crit:"Get over the bar with legs assisting, repeatedly.", why:"The transition is a distinct skill and worth drilling on its own.",
    drills:[]},
   {n:4, name:"Negatives", target:"Slow negative muscle-up ×3", match:["Negative muscle-up"],
    crit:"Lower from support back under the bar under control.", why:"Builds strength through the exact transition path.",
    drills:[]},
   {n:5, name:"Full", target:"Strict bar muscle-up", match:["Bar muscle-up","Ring muscle-up","Ring muscle-up transition"],
    crit:"Clean muscle-up without kipping.", why:"Rings are the next step, and considerably harder.",
    drills:[]}],
  support:{strength:["Pull-up","Weighted pull-up","Dip","Straight-bar dip","Ring row","False grip pull-up"],
           mobility:["Doorway pec stretch","Overhead lat stretch","Wrist stretch","Thoracic extension"]},
  volume:"2 sessions a week. Transition practice while fresh, strength work after.",
  plateau:"Almost always a pull-height problem. Add weighted pull-ups rather than more attempts."},

{ id:"planche", name:"Planche", fam:"Planche", depth:"structure",
  goal:"Hold the body horizontal and off the floor on straight arms.",
  prereq:"Strong straight-arm scapular protraction, healthy wrists and elbows.",
  reality:"One of the slowest calisthenics skills — commonly two years or more to straddle. Connective tissue is the limiting factor, so consistency beats intensity by a wide margin.",
  stages:[
   {n:1, name:"Lean", target:"Planche lean 3×20 s", match:["Planche lean","Pseudo planche hold","Frog stand"],
    crit:"20 s with shoulders well past the hands and hips level.", why:"Builds the straight-arm loading the whole skill depends on.",
    drills:["scapular-pushups","wrist-prep","first-knuckle-pushups","reverse-wrist-pushups","pec-doorway"]},
   {n:2, name:"Tuck", target:"Tuck planche 3×15 s", match:["Tuck planche"],
    crit:"15 s tucked, back rounded, hips at shoulder height.", why:"First time the whole bodyweight sits on straight arms.",
    drills:["scapular-pushups"]},
   {n:3, name:"Advanced tuck", target:"Advanced tuck 3×10 s", match:["Advanced tuck planche"],
    crit:"10 s with the back flat and hips opening.", why:"The step where most people stall for months. That is normal.",
    drills:[]},
   {n:4, name:"Straddle", target:"Straddle planche 5 s", match:["Straddle planche","One-leg planche"],
    crit:"5 s straddled and horizontal.", why:"Requires significant additional straight-arm strength.",
    drills:["pancake"]},
   {n:5, name:"Full", target:"Full planche 5 s", match:["Full planche","Planche push-up"],
    crit:"5 s fully extended.", why:"Elite level. Years, not months.",
    drills:[]}],
  support:{strength:["Pseudo planche push-up","Scapular push-up","Ring support hold","Dip","L-sit"],
           mobility:["Wrist stretch","Doorway pec stretch","Thoracic extension","Shoulder flexion PAILs/RAILs"]},
  volume:"3 sessions a week, short holds, long rests. Total time under tension per session is small — 60–90 s of actual holding.",
  plateau:"Wrists and elbows are usually the real limiter. If they ache, reduce volume immediately rather than pushing on."},

{ id:"human-flag", name:"Human flag", fam:"Human flag", depth:"structure",
  goal:"Hold the body horizontal off a vertical pole.",
  prereq:"Strong lateral core, plus solid pressing and pulling strength.",
  reality:"Typically 6–18 months. Grip and the top-arm press are the usual limiters rather than core strength, which surprises most people.",
  stages:[
   {n:1, name:"Vertical hold", target:"Vertical flag 3×15 s", match:["Vertical flag hold"],
    crit:"Hold the body vertical alongside the pole, feet off the ground.", why:"Teaches the press-pull setup with minimal leverage.",
    drills:["scapular-pushups","hollow-line"]},
   {n:2, name:"Chamber hold", target:"Tuck flag 3×10 s", match:["Chamber hold (tuck flag)","Spotted flag hold"],
    crit:"Knees tucked, hips level with the shoulders, 10 s.", why:"First real lateral load.",
    drills:["hollow-line","bodyline-drill"]},
   {n:3, name:"One leg out", target:"One leg extended 5 s each side", match:["Chamber hold (tuck flag)"],
    crit:"Extend one leg while holding position.", why:"Gradual leverage increase without jumping to straddle.",
    drills:[]},
   {n:4, name:"Straddle", target:"Straddle flag 5 s", match:["Straddle flag","Flag negative"],
    crit:"5 s straddled and horizontal.", why:"Shortened lever version of the full skill.",
    drills:["pancake"]},
   {n:5, name:"Full", target:"Full human flag 5 s", match:["Full human flag"],
    crit:"5 s fully extended and horizontal.", why:"From here it is holds for time and dynamic entries.",
    drills:[]}],
  support:{strength:["Pull-up","Dip","Side plank","Hanging leg raise","Copenhagen plank","Ring row"],
           mobility:["Thoracic extension","Overhead lat stretch","Doorway pec stretch"]},
  volume:"2 sessions a week, both sides evenly. Grip usually fails before the core does.",
  plateau:"Train the top-arm press and grip separately — they are the usual limiters, not lateral core strength."}
];
const treeById = id => TREES.find(t=>t.id===id);

/* Position on a ladder, derived from logged evidence rather than self-report. */
function stageEvidence(tree, stage){
  const names = (stage.match||[]).map(s=>s.toLowerCase());
  const hits = [];
  (state.classLogs||[]).forEach(cl=> (cl.items||[]).forEach(it=>{
    if(names.includes((it.name||"").toLowerCase())) hits.push({date:cl.date, it:it});
  }));
  (state.logs||[]).forEach(l=> (l.skills||[]).forEach(s=>{
    if(s.skill===tree.id && s.metric) hits.push({date:l.date, it:{name:tree.name, numbers:String(s.metric)}});
  }));
  return hits;
}
function treeProgress(tree){
  const out = tree.stages.map(st=>{
    const ev = stageEvidence(tree, st);
    const best = ev.reduce((b,h)=>{
      const n=(String(h.it.numbers||"").match(/\d+(\.\d+)?/g)||[]).map(Number);
      const top=n.length?Math.max(...n):0;
      return top>(b?b.top:0) ? {top:top, raw:h.it.numbers, date:h.date} : b;
    }, null);
    return {stage:st, count:ev.length, best:best, last:ev.length?ev[ev.length-1].date:null};
  });
  let cur = 1;
  out.forEach(s=>{ if(s.count>0) cur = Math.max(cur, s.stage.n); });
  const manual = (state.prefs.treeStage||{})[tree.id];
  return {stages:out, current: manual || cur, manual: !!manual};
}

/* ============================================================
   ONE TAXONOMY for both libraries — the standard calisthenics
   grouping (push / pull / legs / core / skills) with mobility
   and prep alongside. Every drill and every catalog movement
   resolves into exactly one top-level category.
============================================================ */
const TAXONOMY = [
 {id:"push", name:"Push", blurb:"Pressing away from you — floor, bars, overhead.",
  muscles:["pecs","triceps","delts","serratus"],
  subs:[{id:"push-h", name:"Horizontal", fams:["Push — floor"]},
        {id:"push-v", name:"Vertical",   fams:["Push — vertical","Push — dips"]},
        {id:"push-sa",name:"Straight-arm",fams:["Planche"]}],
  cats:["scap"]},
 {id:"pull", name:"Pull", blurb:"Pulling toward you — bars, rings, levers.",
  muscles:["lats","biceps","traps","forearms"],
  subs:[{id:"pull-v", name:"Vertical",   fams:["Pull — bar","Muscle-up"]},
        {id:"pull-h", name:"Horizontal", fams:["Pull — rows","Rings","Rings — extra"]},
        {id:"pull-sa",name:"Straight-arm",fams:["Front lever","Back lever"]},
        {id:"pull-g", name:"Grip",       fams:["Grip & hangs"]}],
  cats:["lats"]},
 {id:"legs", name:"Legs", blurb:"Squat, hinge and single-leg work.",
  muscles:["quads","glutes","hamstrings","adductors","calves"],
  subs:[{id:"legs-all", name:"All", fams:["Legs & glutes"]}],
  cats:["legs"]},
 {id:"core", name:"Core", blurb:"Compression, anti-extension and rotation.",
  muscles:["abs","obliques","hipflexors","erectors"],
  subs:[{id:"core-c", name:"Compression", fams:["Core — compression"]},
        {id:"core-a", name:"Anti-extension / holds", fams:["Core — other"]}],
  cats:["rib","compression"]},
 {id:"skills", name:"Skills", blurb:"Balance and the named calisthenics skills.",
  muscles:["delts","abs","traps","forearms"],
  subs:[{id:"sk-hs", name:"Handstand", fams:["Handstand","Handstand entries"]},
        {id:"sk-pr", name:"Press",     fams:["Press handstand"]},
        {id:"sk-fl", name:"Flag",      fams:["Human flag"]},
        {id:"sk-br", name:"Bridging",  fams:["Bridging"]},
        {id:"sk-ex", name:"Explosive", fams:["Explosive"]}],
  cats:["line"]},
 {id:"mobility", name:"Mobility", blurb:"Opening the tissue that limits your positions.",
  muscles:["lats","pecs","erectors","hipflexors","hamstrings"], stretch:true,
  subs:[{id:"mb-sh", name:"Shoulders & overhead", cats:["flexion","overhead","lats","pecs"]},
        {id:"mb-sp", name:"Spine & chest",        cats:["thoracic"]},
        {id:"mb-hp", name:"Hips & compression",   cats:["hips"]},
        {id:"mb-wr", name:"Wrists",               cats:["wrist"], fams:["Neck & forearm"]}],
  fams:["Mobility & stretch"], cats:["flexion","overhead","pecs","thoracic","hips","wrist"]},
 {id:"prep", name:"Prep & desk", blurb:"Warm-ups and the resets that undo sitting.",
  muscles:["delts","forearms","erectors"],
  subs:[{id:"pr-wu", name:"Warm-up", fams:["Warm-up & prep"]},
        {id:"pr-dk", name:"Desk resets", desk:true}],
  cats:[]}
];
const taxById = id => TAXONOMY.find(t=>t.id===id);

/* which top-level category a drill or catalog movement belongs to */
function taxOfDrill(e){
  if(e.desk) return "prep";
  for(const t of TAXONOMY){
    const own = (t.cats||[]).concat(...(t.subs||[]).map(s=>s.cats||[]));
    if(e.cats.some(c=>own.includes(c))) return t.id;
  }
  return "mobility";
}
function taxOfFamily(fam){
  for(const t of TAXONOMY){
    if((t.fams||[]).includes(fam)) return t.id;
    for(const s of (t.subs||[])) if((s.fams||[]).includes(fam)) return t.id;
  }
  return null;
}
function taxContents(taxId, subId){
  const t = taxById(taxId); if(!t) return {drills:[], moves:[]};
  const subs = subId ? (t.subs||[]).filter(s=>s.id===subId) : (t.subs||[]);
  const cats = subId ? [].concat(...subs.map(s=>s.cats||[])) : (t.cats||[]).concat(...(t.subs||[]).map(s=>s.cats||[]));
  const fams = subId ? [].concat(...subs.map(s=>s.fams||[])) : (t.fams||[]).concat(...(t.subs||[]).map(s=>s.fams||[]));
  const wantDesk = subs.some(s=>s.desk) || (!subId && (t.subs||[]).some(s=>s.desk));
  const drills = EX_ALL().filter(e=>{
    if(e.desk) return wantDesk;
    if(taxOfDrill(e)!==taxId) return false;
    return subId ? e.cats.some(c=>cats.includes(c)) : true;
  }).sort((a,b)=>a.level-b.level);
  const drillNames = new Set(EX_ALL().map(d=>d.name.toLowerCase()));
  const moves = catalogFlat().filter(m=>{
    if(drillNames.has(m.name.toLowerCase())) return false;
    return subId ? fams.includes(m.fam) : (taxOfFamily(m.fam)===taxId);
  }).sort((a,b)=>(a.lvl||0)-(b.lvl||0));
  return {drills, moves};
}
/* small front+back body map for a category card */
function taxMap(t, h){
  const SM = window.SL_MUSCLES; if(!SM||!SM.ready) return "";
  const on = new Set([].concat(...(t.muscles||[]).map(k=> SM.groups[k]||[])));
  const col = t.stretch ? "var(--amber)" : "var(--teal)";
  const fig = (defs, vb) => {
    const paths = defs.map(d=>`<path d="${d.path}" fill="${on.has(d.id)?col:"var(--figure)"}"/>`).join("");
    return `<svg viewBox="${vb}" style="height:${h}px;width:auto" xmlns="http://www.w3.org/2000/svg">${paths}</svg>`;
  };
  const F = SM.defs.filter(d=>d.view===SM.ViewSide.FRONT);
  const B = SM.defs.filter(d=>d.view===SM.ViewSide.BACK);
  return fig(F,"0 0 35 93")+fig(B,"37 0 35 93");
}

/* ============================================================
   WEEKLY SCHEDULE — user-owned, not hardcoded.
   DEFAULT_SCHEDULE seeds a new install; state.schedule is what
   the app actually reads, and the user can edit every field.
   Kinds drive how the day behaves, so any split works.
============================================================ */
/* ============================================================
   WORKOUTS — full prescribed sessions (exercise + sets + reps),
   distinct from the mobility-focused Routines. Seeded examples
   plus anything the user builds. "Start" feeds straight into the
   session builder, so logging and personal bests just work.
============================================================ */
const WORKOUTS = [
 { id:"w-legs", name:"Full Leg Day", tax:"legs", seeded:true,
   blurb:"Activation first, then a full compound-to-isolation spread across quads, glutes and hamstrings.",
   items:[
     {ref:"glute-activation-circuit", sets:1, reps:"full circuit"},
     {ref:"bulgarian-split-squat", sets:3, reps:"10 each leg"},
     {ref:"hip-thrust", sets:3, reps:"12"},
     {ref:"reverse-lunge", sets:3, reps:"10 each leg"},
     {ref:"nordic-curl", sets:3, reps:"5"},
     {ref:"calf-raise", sets:3, reps:"15"},
   ]},
 { id:"w-back", name:"Back Day", tax:"pull", seeded:true,
   blurb:"Vertical and horizontal pulling, a straight-arm hold, and a lat stretch to close it out.",
   items:[
     {ref:"Pull-up", sets:4, reps:"6-8"},
     {ref:"bar-pullover", sets:3, reps:"5"},
     {ref:"Ring row", sets:3, reps:"10"},
     {ref:"tuck-back-lever", sets:3, reps:"10s hold"},
     {ref:"oh-lat-stretch", sets:2, reps:"30s each side"},
   ]},
];
function workoutById(id){ return (WORKOUTS.concat(state.customWorkouts||[])).find(w=>w.id===id); }
function workoutRef(ref){
  const d = exById(ref); if(d) return {name:d.name, isDrill:true};
  return {name:ref, isDrill:false};
}

const DAY_KINDS = [
  {id:"skill",    name:"Skill class",   note:"Handstand, skills — loads the shoulders hard"},
  {id:"strength", name:"Strength",      note:"Pulling, pushing, weighted work"},
  {id:"lower",    name:"Lower body",    note:"Legs, glutes — upper body stays fresh"},
  {id:"mobility", name:"Mobility class",note:"Stretching, yoga — already covers opening"},
  {id:"rest",     name:"Rest",          note:"No class"},
  {id:"other",    name:"Other",         note:"Anything else"}
];
const DEFAULT_SCHEDULE = [
 {dow:0, day:"Sunday",    cls:"Optional recovery / rest", kind:"rest",
  focus:"Recovery flow (optional)", time:"8 min", fatigue:"Very low",
  goal:"Restore tissue, keep the overhead pattern warm", routine:"r-recovery",
  why:"No class load today. A gentle flow keeps range from stiffening without spending recovery."},
 {dow:1, day:"Monday",    cls:"Handstands", kind:"skill",
  focus:"Light primer only", time:"6 min", fatigue:"Low",
  goal:"Open the joint enough to enter class ready", routine:"r-primer",
  why:"Class is about to load your shoulders hard. A medium block on top competes with class quality — the real dose lands on the days nothing else loads them."},
 {dow:2, day:"Tuesday",   cls:"Glutes", kind:"lower",
  focus:"Developmental block — shoulders are fresh", time:"15 min", fatigue:"Medium",
  goal:"Bank real range on a day nothing else touches your shoulders", routine:"r-tue-dev",
  why:"Lower-body class means zero shoulder load. Best day for the heavier end-range work, with a full day of recovery after."},
 {dow:3, day:"Wednesday", cls:"Calisthenics skills", kind:"skill",
  focus:"Short support block", time:"8 min", fatigue:"Low",
  goal:"Light opener that leaves full energy for skills", routine:"r-opener",
  why:"Skill day already loads the shoulders in varied ways. A short opener helps; more competes."},
 {dow:4, day:"Thursday",  cls:"Handstands", kind:"skill",
  focus:"Light primer only", time:"6 min", fatigue:"Low",
  goal:"Prime it, don't pre-fatigue it", routine:"r-primer",
  why:"Same as Monday — activation only before a class that will load these tissues hard."},
 {dow:5, day:"Friday",    cls:"Strengthening", kind:"strength",
  focus:"Short support block", time:"8 min", fatigue:"Low",
  goal:"Open what strength work tightens", routine:"r-opener",
  why:"Pulling and pressing shortens lats and pecs. A brief opener after class stops the week's range eroding."},
 {dow:6, day:"Saturday",  cls:"Stretching", kind:"mobility",
  focus:"Class covers it — top-up only", time:"6 min", fatigue:"Very low",
  goal:"Add only what a general stretching class misses", routine:"r-primer",
  why:"Your class is already a mobility session. Stacking a long block on top is redundant — this is a short handstand-specific top-up, nothing more."}
];
function getSchedule(){
  const s = state.schedule;
  return (Array.isArray(s) && s.length===7) ? s : DEFAULT_SCHEDULE;
}
function planFor(dow){ return getSchedule().find(s=>s.dow===dow) || DEFAULT_SCHEDULE[dow]; }
function setPlan(dow, patch){
  if(!Array.isArray(state.schedule) || state.schedule.length!==7)
    state.schedule = JSON.parse(JSON.stringify(DEFAULT_SCHEDULE));
  const i = state.schedule.findIndex(s=>s.dow===dow);
  Object.assign(state.schedule[i], patch);
  state.meta_schedU = Date.now();
  save();
}
/* Does the day's class already cover what the support block would do? */
function classCovers(kind){
  return kind==="mobility" ? ["mobility"] : kind==="skill" ? ["skill"] : [];
}

/* ---------- seed routines ---------- */
function seedRoutines(){ return [
 {id:"r-opener", name:"Daily Shoulder Opener", minutes:8, fatigue:"low", days:[3,5], seeded:true,
  useCase:"The everyday default — passive open + light activation, before or after anything.",
  items:[
   {ex:"dislocates", sets:2, reps:"10", hold:"—", note:"slow, wide grip"},
   {ex:"wall-angels", sets:2, reps:"8", hold:"—", note:"t-spine + scap in one move"},
   {ex:"oh-lat-stretch", sets:2, reps:"—", hold:"30 s/side", note:""},
   {ex:"wall-slides", sets:2, reps:"8", hold:"2 s top", note:""},
  ]},
 {id:"r-primer", name:"Light Primer", minutes:6, fatigue:"low", days:[1,4], seeded:true,
  useCase:"Monday & Thursday default — activation only, since class is about to load your shoulders hard.",
  items:[
   {ex:"wrist-prep", sets:1, reps:"~1 min", hold:"—", note:"quick pass only"},
   {ex:"dislocates", sets:1, reps:"8", hold:"—", note:"just enough to open, not to tire"},
   {ex:"wall-slides", sets:1, reps:"6", hold:"—", note:"activation, not a session"},
  ]},
 {id:"r-tue-dev", name:"Tuesday Development Block", minutes:15, fatigue:"med", days:[2], seeded:true,
  useCase:"Tuesday's real dose — zero shoulder load from class, so this carries the loaded work that used to be split across Monday/Thursday.",
  items:[
   {ex:"wrist-prep", sets:1, reps:"~2 min", hold:"—", note:""},
   {ex:"dislocates", sets:2, reps:"10", hold:"—", note:""},
   {ex:"pails-rails-flexion", sets:1, reps:"2–3 rounds", hold:"—", note:"the loaded end-range work"},
   {ex:"bench-lat-opener", sets:2, reps:"—", hold:"45 s", note:""},
   {ex:"scap-wall-slides", sets:2, reps:"6", hold:"3 s hover", note:"convert the range"},
  ]},
 {id:"r-prep-a", name:"Handstand Prep A (extended)", minutes:10, fatigue:"med", days:[], seeded:true,
  useCase:"Optional — a bigger Monday session if you have extra time before class. The default is now the Light Primer.",
  items:[
   {ex:"wrist-prep", sets:1, reps:"~2 min", hold:"—", note:"always first"},
   {ex:"dislocates", sets:2, reps:"10", hold:"—", note:""},
   {ex:"scapular-pushups", sets:2, reps:"10", hold:"—", note:"wake up serratus"},
   {ex:"hollow-line", sets:2, reps:"—", hold:"20 s", note:"arms by ears"},
   {ex:"wf-hold", sets:3, reps:"—", hold:"20–30 s", note:"quality over time"},
  ]},
 {id:"r-prep-b", name:"Handstand Prep B (extended)", minutes:11, fatigue:"med", days:[], seeded:true,
  useCase:"Optional — a bigger Thursday session if you have extra time before class. The default is now the Light Primer.",
  items:[
   {ex:"wrist-prep", sets:1, reps:"~2 min", hold:"—", note:""},
   {ex:"tspine-ext", sets:1, reps:"6/seg", hold:"—", note:""},
   {ex:"scap-wall-slides", sets:2, reps:"6", hold:"3 s hover", note:""},
   {ex:"pike-shrugs", sets:2, reps:"10", hold:"—", note:"feet elevated"},
   {ex:"wf-shrugs", sets:3, reps:"5", hold:"—", note:"inside wall hold"},
  ]},
 {id:"r-reset", name:"Low-Fatigue Reset", minutes:5, fatigue:"low", days:[], seeded:true,
  useCase:"The universal fallback — auto-suggested on any day when energy or adherence is low, not tied to one weekday.",
  items:[
   {ex:"dislocates", sets:1, reps:"10", hold:"—", note:"easy tempo"},
   {ex:"pec-doorway", sets:1, reps:"—", hold:"30 s/side", note:""},
   {ex:"oh-lat-stretch", sets:1, reps:"—", hold:"30 s/side", note:""},
  ]},
 {id:"r-long", name:"Saturday Long Mobility Session", minutes:20, fatigue:"low", days:[6], seeded:true,
  useCase:"The weekly deep dose — long holds, PAILs/RAILs, then re-pattern the line.",
  items:[
   {ex:"tspine-ext", sets:2, reps:"8/seg", hold:"3 s ends", note:""},
   {ex:"bench-lat-opener", sets:3, reps:"—", hold:"60 s", note:"the main course"},
   {ex:"pec-doorway-upgraded", sets:2, reps:"—", hold:"—", note:"contract-relax"},
   {ex:"lat-pails-rails", sets:1, reps:"2–3 rounds/side", hold:"—", note:"loaded lat range"},
   {ex:"scap-wall-slides", sets:2, reps:"6", hold:"2 s hover", note:"convert the range"},
   {ex:"bodyline-drill", sets:2, reps:"—", hold:"15–20 s", note:"front + back line"},
   {ex:"hollow-line", sets:1, reps:"—", hold:"25 s", note:"seal it into the line"},
  ]},
 {id:"r-recovery", name:"Sunday Recovery Flow", minutes:8, fatigue:"low", days:[0], seeded:true,
  useCase:"Gentle circulation and easy range — nothing that costs recovery.",
  items:[
   {ex:"dislocates", sets:2, reps:"8", hold:"—", note:"floaty"},
   {ex:"tspine-ext", sets:1, reps:"6/seg", hold:"—", note:""},
   {ex:"bench-lat-opener", sets:2, reps:"—", hold:"40 s", note:"easy depth"},
   {ex:"wrist-prep", sets:1, reps:"~2 min", hold:"—", note:"light"},
  ]},
];}
/* ============================================================
   State + storage (window.storage → localStorage → memory)
============================================================ */
let state = {
  routines: seedRoutines(),
  customDrills: [],
  deskLogs: [],
  schedule: null,   // null = use DEFAULT_SCHEDULE
  classLogs: [],   // {date, cls, items:[{name,variation,assist,numbers}], notes}
  customMoves: [],
  daySwaps: {},   // {"YYYY-MM-DD": {originalExId: replacementExId}} — today only, never edits the routine
  logs: [],            // {date, routineId, done:[exIds], dosage:{}, line, mob, energy, tight:[], pain, notes, mediaNote}
  milestones: [],      // {date, text}
  prefs: { theme:"dark", media:{}, customMedia:{}, favs:[], upgradesInUse:{} },
};
const APP_VERSION = "2026.08.05";
const SKEY = "stackline-v1";
async function loadState(){
  let raw = null;
  try{ if(window.storage && window.storage.get){ const r = await window.storage.get(SKEY); if(r && r.value) raw = r.value; } }catch(e){}
  if(!raw){ try{ raw = localStorage.getItem(SKEY); }catch(e){} }
  if(raw){ try{
    const d = JSON.parse(raw);
    state.logs = d.logs||[]; state.milestones = d.milestones||[];
    state.meta_routinesU = d.meta_routinesU||0; state.meta_milestonesU = d.meta_milestonesU||0;
    state.customDrills = d.customDrills||[]; state.meta_drillsU = d.meta_drillsU||0;
    state.deskLogs = d.deskLogs||[]; state.meta_deskU = d.meta_deskU||0;
    state.daySwaps = d.daySwaps||{};
    state.classLogs = d.classLogs||[]; state.customMoves = d.customMoves||[]; state.meta_classU = d.meta_classU||0;
    state.prefs = Object.assign(state.prefs, d.prefs||{});
    if(Array.isArray(d.routines)){
      // keep seeds fresh but preserve user edits/custom routines
      const seeds = seedRoutines();
      state.routines = d.routines.map(r => r.seeded && !r.edited ? (seeds.find(s=>s.id===r.id)||r) : r);
      seeds.forEach(s=>{ if(!state.routines.some(r=>r.id===s.id)) state.routines.push(s); });
    }
  }catch(e){} }
}
// localStorage.setItem is fast and synchronous, so we write it immediately on every
// save() call rather than debouncing — a debounced write can be silently dropped if
// a mobile browser suspends/backgrounds the tab before the timer fires. window.storage
// (only present inside Claude's own preview) is best-effort and fire-and-forget on top.
function saveLocalOnly(){
  const raw = JSON.stringify({routines:state.routines, logs:state.logs, milestones:state.milestones,
                              prefs:state.prefs, customDrills:state.customDrills, deskLogs:state.deskLogs, meta_deskU:state.meta_deskU, daySwaps:state.daySwaps, classLogs:state.classLogs, customMoves:state.customMoves, meta_classU:state.meta_classU,
                              meta_routinesU:state.meta_routinesU, meta_milestonesU:state.meta_milestonesU, meta_drillsU:state.meta_drillsU});
  try{ localStorage.setItem(SKEY, raw); }catch(e){}
  try{ if(window.storage && window.storage.set){ window.storage.set(SKEY, raw).catch(()=>{}); } }catch(e){}
}
let pushTimer=null;
function save(){
  state.prefs._u = Date.now();
  saveLocalOnly();
  if(typeof SYNC!=="undefined" && SYNC.on){
    clearTimeout(pushTimer);
    pushTimer = setTimeout(()=>{ syncPush(); }, 900);   // debounce cloud writes only
  }
}
// Belt-and-suspenders: force a flush the instant the page is hidden/closed/backgrounded,
// in case some future change reintroduces buffering.
document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="hidden") save(); });
window.addEventListener("pagehide", save);
