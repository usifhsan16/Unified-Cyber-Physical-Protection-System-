# UCPPS Golden Dataset Scenario Storyboard & Recording Schedule

- **Document ID:** `D-01-Script` (`UCPPS-15`)
- **Target File Path:** `docs/evaluation/golden_scenarios_storyboard.md`
- **Owner:** Youssef Ragheb (`GSOC Frontend & Dataset Coordinator`)
- **Status:** Draft for Team Sign-Off (Sprint 1 Exit Gate)
- **Target Video Specs:** `1080p @ 30 FPS`, H.264 MP4, Unified UTC Clock Synchronization (`NTP / Chrony < 10ms drift`)

---

## 1. Team Actor & Role Assignments (6-Member Cast)

To ensure clean subject-disjoint splits (`Train / Val / Test`) and realistic multi-subject interactions across all 8 scenarios, the 6 team members are mapped to standardized test profiles in PostgreSQL (`employees` & `employee_zones`):

| Member Name | Assigned Profile ID | System Role & Clearance | Primary Acting Roles in Recordings |
| :--- | :--- | :--- | :--- |
| **Ebid** | `EMP-001` (`ebid`) | Authorized IT Admin (`SERVER_ROOM` + `EMPLOYEE` + `PUBLIC`) | Authorized Server Room Entry (Scenario 1, 8), Badge Owner (Scenario 5), Camera Rigging |
| **Hesham** | `EMP-002` (`hesham`) | Authorized Host (`EMPLOYEE` + `PUBLIC`) | Authorized Badge Holder in Tailgating (Scenario 4), Door Tampering Actor (Scenario 7) |
| **Ayman** | `EMP-003` (`ayman`) | Regular Employee (`EMPLOYEE` + `PUBLIC` only; **NO** `SERVER_ROOM`) | Unauthorized Zone Entry Actor (Scenario 2), Fight Participant B (Scenario 7) |
| **Hassan** | `EMP-004` (`hassan`) | Regular Employee (`EMPLOYEE` + `PUBLIC`) | Tailgater / Second Body (Scenario 4), SSH External Attack Trigger (Scenario 8) |
| **Shahd** | `EMP-005` (`shahd`) | Facility Admin (`ALL ZONES`) | Camera Tripod & Lighting Alignment, Badge Reader Simulator Operator |
| **Ragheb** | `UNENROLLED` (`unknown`) | **Unenrolled / Stranger** (Zero Trust Subject) | Unknown Intruder (Scenario 3), Badge Impersonator (Scenario 5), Loiterer/Recon (Scenario 6) |

> **Note on Subject-Disjoint Splitting:** Having **Ragheb** act as the unenrolled stranger (`unknown`) ensures zero biometric leakage between enrolled employee profiles and unknown-intruder evaluation clips.

---

## 2. Camera Rigging & Spatial Calibration Setup

Before recording any scenario clip, the physical testbed corridor and mock Server Room door must satisfy:

1. **Camera 1 (`CAM-01` — Corridor & Door Overview):** Mounted at `2.6m - 3.0m` height, tilted `~30°–35°` downward, capturing the approach corridor (`>= 5m` depth), the door threshold line, the badge reader, and the door handle (`handle_pixel_roi`).
2. **Camera 2 (`CAM-02` — Interior / Secondary Zone View):** Positioned inside the restricted zone or intersecting corridor to validate cross-camera Re-ID (`OSNet-AIN`) and multi-camera deduplication (`dedup_key = zone_id:employee_id`).
3. **Floor Reference Markers (4-Point Homography):** Four high-contrast tape markers placed on the floor at known metric coordinates `(X, Y)` visible in `CAM-01` for `3x3` planar homography calibration (`< 5 cm` metric error).
4. **Clock Synchronization:** All recording devices, badge swipe triggers (`access_control_sim.py`), and simulated SSH logs (`cyber_source_sim.py`) must synchronize to UTC (`ISO-8601` millisecond timestamps).

---

## 3. Second-by-Second Choreography & Timelines (8 Scenarios)

### Scenario 1: Normal Authorized Entry (`SCEN-01`)
- **Objective:** Verify silent presence logging (`ZONE_ENTER`, `authorized: true`) routed exclusively to `topic-presence` and archived in Wazuh (`Rule 100201`) with **zero alerts** on the GSOC console.
- **Actors:** Ebid (`EMP-001`, Authorized for `SERVER_ROOM`).
- **Camera Angle:** `CAM-01` (Corridor + Server Room Door).
- **Duration:** `18 seconds` (`540 frames @ 30 FPS`).

| Timecode (UTC Offset) | Frame # | Physical Action & Movement Choreography | Simulator / System Event | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `00:00 – 00:03` | `0 – 90` | Empty corridor baseline (`delta < 3%`). | `door_state = LOCKED` | Camera remains in Tier 1 (Idle). |
| `00:03 – 00:06` | `91 – 180` | Ebid enters frame from left corridor, walking calmly toward Server Room door. | None | Motion `delta > 3%` triggers Tier escalation; YOLO11 + ByteTrack assign `track_id`. |
| `00:06 – 00:08` | `181 – 240` | Ebid stops at reader (`r <= 0.35m`), faces `CAM-01` clearly, and taps valid badge `BADGE-001`. | `SWIPE_GRANTED (EMP-001)` at `t = 00:07.000` | ArcFace match `>= 0.65` + badge bound (`dt <= 3.0s`); `door_state = UNLOCKED`. |
| `00:08 – 00:12` | `241 – 360` | Ebid opens door, crosses threshold into `SERVER_ROOM` polygon, and remains inside (`> 1.0s` debounce). | `door_state = LOCKED` at `t = 00:11.500` | Ray-Casting confirms inside `SERVER_ROOM`; emits silent `ZONE_ENTER` to `topic-presence`. |
| `00:12 – 00:18` | `361 – 540` | Ebid remains inside; buffer captures clean post-entry state. | None | Wazuh archives `PRS-2026-XXXXX` (Rule `100201`); **GSOC Console stays quiet**. |

---

### Scenario 2: Unauthorized Zone Entry (`SCEN-02`)
- **Objective:** Verify `UNAUTHORIZED_ZONE_ENTRY` when an enrolled employee without `SERVER_ROOM` clearance enters the restricted zone.
- **Actors:** Ayman (`EMP-003`, cleared for `EMPLOYEE` corridors only, **not** `SERVER_ROOM`).
- **Camera Angle:** `CAM-01` + `CAM-02` (overlapping view for deduplication check).
- **Duration:** `20 seconds` (`600 frames @ 30 FPS`).

| Timecode (UTC Offset) | Frame # | Physical Action & Movement Choreography | Simulator / System Event | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `00:00 – 00:03` | `0 – 90` | Empty scene baseline. | `door_state = UNLOCKED` (propped/open test state) | Tier 1 baseline. |
| `00:03 – 00:07` | `91 – 210` | Ayman walks down corridor facing `CAM-01` so face is captured clearly. | None | ArcFace identifies `EMP-003` (`similarity >= 0.65`). |
| `00:07 – 00:10` | `211 – 300` | Ayman steps across threshold into `SERVER_ROOM` polygon and stays inside (`> 1.0s`). | None | Zone Engine checks `employee_zones` -> `authorized = False`. |
| `00:10 – 00:15` | `301 – 450` | Ayman walks 2 meters inside room (`5s` post-roll window active). | None | Fires `UNAUTHORIZED_ZONE_ENTRY` (`INC-2026-XXXXX`); GSOC card flashes RED; SVG map pulses. |
| `00:15 – 00:20` | `451 – 600` | Clip extraction completes; Ayman exits room. | None | `UPDATE` event emitted with `clip_status: READY` & `sha256` hash. |

---

### Scenario 3: Unknown Person Intrusion (`SCEN-03`)
- **Objective:** Verify Zero Trust policy (`ZONE_INTRUSION`) when an unenrolled stranger enters an `EMPLOYEE`-only corridor/office.
- **Actors:** Ragheb (`UNENROLLED` / `unknown`).
- **Camera Angle:** `CAM-01` (Employee Office Corridor).
- **Duration:** `18 seconds` (`540 frames @ 30 FPS`).

| Timecode (UTC Offset) | Frame # | Physical Action & Movement Choreography | Simulator / System Event | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `00:00 – 00:02` | `0 – 60` | Empty corridor baseline. | None | Tier 2 active. |
| `00:02 – 00:06` | `61 – 180` | Ragheb enters from public lobby into `EMPLOYEE` zone without swiping any badge. | None | ArcFace similarity `< 0.65` -> `person_type = "unknown"`. |
| `00:06 – 00:11` | `181 – 330` | Ragheb walks along employee corridor (`> 1.0s` inside `EMPLOYEE` polygon). | None | Rules Engine triggers `ZONE_INTRUSION` (`OPEN`); live marker + trajectory drawn on SVG map. |
| `00:11 – 00:18` | `331 – 540` | Ragheb continues walking to end of corridor (`5s` post-roll recording completes). | None | 15s MP4 clip saved & hashed; card stays pinned RED on GSOC console. |

---

### Scenario 4: Tailgating (`SCEN-04`)
- **Objective:** Verify `TAILGATING_DETECTED` when two distinct physical bodies cross the door threshold within `4.0s` of a single valid badge swipe.
- **Actors:** Hesham (`EMP-002`, Authorized Host) + Hassan (`EMP-004`, Tailgater).
- **Camera Angle:** `CAM-01` (Top-angled view clearly separating both bodies at threshold).
- **Duration:** `20 seconds` (`600 frames @ 30 FPS`).

| Timecode (UTC Offset) | Frame # | Physical Action & Movement Choreography | Simulator / System Event | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `00:00 – 00:03` | `0 – 90` | Empty door area. | `door_state = LOCKED` | Baseline. |
| `00:03 – 00:06` | `91 – 180` | Hesham approaches door; Hassan walks closely `~1.0m` behind him. | None | ByteTrack assigns two distinct IDs (`track_id: 10`, `track_id: 11`). |
| `00:06 – 00:07` | `181 – 210` | Hesham swipes valid badge `BADGE-002`. | `SWIPE_GRANTED (EMP-002)` at `t = 00:06.500` | `4.0s` tailgating crossing window opens (`00:06.500` to `00:10.500`). |
| `00:07 – 00:09` | `211 – 270` | Hesham crosses threshold at `t = 00:07.400`; Hassan slips through right behind at `t = 00:08.800` (`dt = 2.3s <= 4.0s`). | `door_state = LOCKED` at `t = 00:10.500` | Virtual tripwire counts `2` bodies on `1` swipe -> fires `TAILGATING_DETECTED` with both subjects in `subjects[]`. |
| `00:09 – 00:20` | `271 – 600` | Both walk inside; post-roll completes and `10s` cooldown observed. | None | Alert card displays `authorized_host` (Hesham) + `primary_violator` (Hassan). |

---

### Scenario 5: Badge Swapping / Impersonation (`SCEN-05`)
- **Objective:** Verify `BADGE_SWAPPING_DETECTED` when a person swipes an enrolled employee's badge, but facial similarity against the badge owner is `< 0.65`.
- **Actors:** Ragheb (`UNENROLLED`, acting as `impersonator`) using Ebid's badge (`BADGE-001`, `card_owner = EMP-001`).
- **Camera Angle:** `CAM-01` (Clear frontal capture of Ragheb's face at reader).
- **Duration:** `18 seconds` (`540 frames @ 30 FPS`).

| Timecode (UTC Offset) | Frame # | Physical Action & Movement Choreography | Simulator / System Event | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `00:00 – 00:03` | `0 – 90` | Empty reader area; Ebid is completely off-camera. | `door_state = LOCKED` | Baseline. |
| `00:03 – 00:06` | `91 – 180` | Ragheb approaches reader holding Ebid's physical badge `BADGE-001`. | None | Ragheb tracked within `r <= 0.35m` of reader. |
| `00:06 – 00:08` | `181 – 240` | Ragheb looks toward camera and swipes `BADGE-001` at `t = 00:07.000`. | `SWIPE_GRANTED (BADGE-001 / EMP-001)` | ArcFace compares Ragheb's face against `EMP-001` -> `similarity < 0.65`. |
| `00:08 – 00:18` | `241 – 540` | System flags mismatch immediately; post-roll clip recorded. | None | Fires `BADGE_SWAPPING_DETECTED` logging `impersonator` (`track_id` + `bbox`) & `card_owner` (`EMP-001`, `track_id: null`). |

---

### Scenario 6: Loitering & Reconnaissance (`SCEN-06`)
- **Objective:** Verify `RECONNAISSANCE_SUSPECTED` (`>= 3` approach/retreat oscillations within `180s`) and `LOITERING_DETECTED` (`dwell_time >= 120s` within `<= 3.0m` of a sensitive door), merged onto a single incident ticket (`UPDATE`).
- **Actors:** Ragheb (`UNENROLLED` / `unknown`).
- **Camera Angle:** `CAM-01` (Full view of `3.0m` perimeter around Server Room door).
- **Duration:** `165 seconds` (`4,950 frames @ 30 FPS` — single continuous take).

| Timecode (UTC Offset) | Frame # | Physical Action & Movement Choreography | Simulator / System Event | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `00:00 – 00:05` | `0 – 150` | Empty corridor baseline. | `door_state = LOCKED` | Tier 1/2 baseline. |
| `00:05 – 00:35` | `151 – 1,050` | **Reconnaissance Phase:** Ragheb walks up to `1.5m` from Server Room door, glances around, retreats beyond `4.0m`, and repeats this approach-retreat cycle **3 consecutive times** (`t=08s`, `t=18s`, `t=28s`). | None | At 3rd oscillation (`< 180s`), `RECONNAISSANCE_SUSPECTED` fires (`OPEN`, `sequence_number: 1`). |
| `00:35 – 02:38` (`158s`) | `1,051 – 4,740` | **Loitering Phase:** At `t = 00:35`, Ragheb stops at `2.0m` (`<= 3.0m`) from the door and lingers continuously for `123 seconds` (`t = 00:35` to `02:38`) without swiping a badge. | None | At `t = 02:35` (`dwell_time == 120s`), `LOITERING_DETECTED` fires and **merges in-place** (`UPDATE`, `sequence_number: 2`) onto the existing alert card. |
| `02:38 – 02:45` | `4,741 – 4,950` | Ragheb walks away beyond `3.0m` perimeter. | None | Post-roll completes; card remains pinned on GSOC console. |

---

### Scenario 7: Door Tampering & Physical Violence (`SCEN-07`)
- **Objective:** Verify `DOOR_TAMPERING_DETECTED` (2D wrist keypoint contact with `LOCKED` door handle ROI) followed by in-place escalation to `CRITICAL` (`UPDATE`) upon `PHYSICAL_VIOLENCE` (VideoMAE behind `delta > 15%` motion gate).
- **Actors:** Hesham (`EMP-002`) + Ayman (`EMP-003`).
- **Camera Angle:** `CAM-01` (Clear side-angle view of door handle `handle_pixel_roi` and open floor area for altercation).
- **Duration:** `25 seconds` (`750 frames @ 30 FPS`).

| Timecode (UTC Offset) | Frame # | Physical Action & Movement Choreography | Simulator / System Event | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `00:00 – 00:03` | `0 – 90` | Empty door area. | `door_state = LOCKED` | Tier 1/2 baseline. |
| `00:03 – 00:08` | `91 – 240` | **Door Tampering Phase:** Hesham approaches locked Server Room door, reaches out with right hand, and pulls/shakes handle (`(u_wrist, v_wrist) in handle_pixel_roi`) for `3 seconds`. | `door_state = LOCKED` | RTMO-m / MediaPipe wrist keypoint intersects `handle_pixel_roi` -> fires `DOOR_TAMPERING_DETECTED` (`OPEN`, `HIGH`). |
| `00:08 – 00:11` | `241 – 330` | Ayman enters frame and confronts Hesham `2m` in front of door. | None | ByteTrack tracks both subjects (`track_id` A & B). |
| `00:11 – 00:18` | `331 – 540` | **Simulated Physical Violence:** Hesham and Ayman perform rapid simulated pushing, shoving, and striking motions (`delta > 15%` pixel variance for `7 seconds`). | None | Motion gate wakes VideoMAE; 2 consecutive 16-frame windows confirm `prob >= 0.80` -> fires `PHYSICAL_VIOLENCE` (`UPDATE` in-place, escalates card to `CRITICAL`, tags both as `role: participant`). |
| `00:18 – 00:25` | `541 – 750` | Both actors stop and separate; post-roll finishes. | None | Single unified `CRITICAL` card with both rules in `rules_violated[]`. |

---

### Scenario 8: Golden Scenario — Cyber-Physical Correlation (`SCEN-08`)
- **Objective:** Demonstrate simultaneous physical entry into `SERVER_ROOM` by `EMP-001` (`ebid`) and a remote SSH login (`if_sid: 5715`) from an external IP (`203.0.113.45`) using the same account (`dstuser: ebid`) within `60s`, triggering Wazuh **Rule 100202** (`CRITICAL CYBER-PHYSICAL THREAT`).
- **Actors:** Ebid (`EMP-001` / `ebid`) + Hassan (triggering `cyber_source_sim.py`).
- **Camera Angle:** `CAM-01` (Server Room Entrance).
- **Duration:** `20 seconds` (`600 frames @ 30 FPS`).

| Timecode (UTC Offset) | Frame # | Physical Action & Movement Choreography | Simulator / System Event | Expected System Output |
| :--- | :--- | :--- | :--- | :--- |
| `00:00 – 00:04` | `0 – 120` | Empty corridor; Ebid approaches Server Room door. | `door_state = LOCKED` | Tier escalation active. |
| `00:04 – 00:07` | `121 – 210` | Ebid faces camera, swipes valid badge `BADGE-001` at `t = 00:05.000`, and steps inside `SERVER_ROOM` at `t = 00:06.500`. | `SWIPE_GRANTED (EMP-001)` at `t = 00:05.000` | Silent `ZONE_ENTER` sent to `topic-presence` -> Forwarder injects `dstuser: "ebid"` -> Wazuh logs **Rule 100201** (`level 3`). |
| `00:07 – 00:11` | `211 – 330` | Ebid remains physically standing inside `SERVER_ROOM` in full camera view. | **At `t = 00:10.000` (`+3.5s` after physical entry):** `cyber_source_sim.py` injects SSH login log for `dstuser=ebid` from `srcip=203.0.113.45` (`if_sid: 5715`). | Wazuh Correlation Engine matches `Rule 100201` + `if_sid 5715` on `<same_field>dstuser</same_field>` within `60s` -> fires **Rule 100202 (Level 13): `CRITICAL CYBER-PHYSICAL THREAT`**. |
| `00:11 – 00:20` | `331 – 600` | Ebid remains inside until end of clip; SOC Wazuh Dashboard displays live correlated threat alert. | None | Live end-to-end committee proof verified. |

---

## 4. Auxiliary Negative / Motion-Gate Baseline Recordings (`D-01` Supplement)

To guarantee zero false positives during evaluation (`A-02` Motion Gate & `X-05` Feedback Loop), the following auxiliary footage is scheduled alongside the 8 scenarios:

1. **Empty Corridor Baseline (`AUX-01`):** `30 minutes` continuous recording (loopable to 10h benchmark) of empty corridor under varying lighting -> verifies Tier 1 idle state (`delta < 3%`, `< 5%` GPU load).
2. **Normal Multi-Person Corridor Traffic (`AUX-02`):** `15 minutes` of 3–5 team members walking normally, crossing paths, and carrying bags -> verifies `0%` false violence triggers (`delta` between `3%` and `15%`, VideoMAE `prob < 0.20`).
3. **100 Physical Badge-Tap Trials (`AUX-03`):** `100` controlled badge-tap recordings at varying approach angles (`0°`, `15°`, `30°`) -> validates `r <= 0.35m` and `dt <= 3.0s` bipartite matching accuracy (`A-06`).

---

## 5. Dataset Split Manifest Plan (`Train / Val / Test` Partitioning)

To prevent frame-level data leakage (`zero frame-shuffle leakage`), dataset splits are strictly partitioned **by recording session and scenario take** (never by random frame sampling):

| Split Partition | Share | Recording Takes Included | Primary Usage Across Project |
| :--- | :--- | :--- | :--- |
| **`train` (Calibration)** | `50%` | Take 1 of Scenarios 1–8 + `AUX-01` (15m) + `AUX-03` (50 taps) | Threshold calibration (`A-02` to `A-09`), homography validation (`A-03`), and heuristic tuning. |
| **`val` (Validation)** | `20%` | Take 2 of Scenarios 1–8 + `AUX-02` (5m) + `AUX-03` (20 taps) | Hyperparameter verification, false-alarm rate (FAR) checks, and confidence threshold locking (`0.65` face / `0.80` violence). |
| **`test` (Held-Out E2E)** | `30%` | Take 3 (Final Unseen Takes) of Scenarios 1–8 + `AUX-01` (15m) + `AUX-02` (10m) + `AUX-03` (30 taps) | Official `B-HS8` automated E2E verification suite and `X-01..X-05` ablation benchmarks. |

---

## 6. Sprint 2 Recording Schedule & Team Sign-Off Checklist

### Proposed Recording Sessions (Sprint 2 — Weeks 3–4: Nov 29 – Dec 12, 2026)
- **Session 1 (Nov 30, 2026 — 2 hrs):** Camera tripod mounting, 4-point floor homography measurement (`Ayman` & `Shahd`), NTP clock sync check, and recording `SCEN-01`, `SCEN-02`, `SCEN-03` (3 takes each).
- **Session 2 (Dec 3, 2026 — 2.5 hrs):** Recording multi-actor & temporal scenarios `SCEN-04`, `SCEN-05`, `SCEN-06` (3 takes each) + `AUX-03` (100 badge-tap trials).
- **Session 3 (Dec 6, 2026 — 2 hrs):** Recording `SCEN-07` (Door Tampering + Simulated Violence), `SCEN-08` (Golden Cyber-Physical Correlation with live `cyber_source_sim.py`), and `AUX-01 / AUX-02` baseline clips.
- **Session 4 (Dec 9, 2026 — 1.5 hrs):** Quality audit of all raw MP4 takes (`30 FPS` check, lighting check, timestamp verification) before Sprint 3 labeling (`ground_truth_labels.json`).

### Team Sign-Off Table (DoD Requirement #2)
- [ ] **Ebid** (Edge Vision Lead & Primary Actor `EMP-001`)
- [ ] **Hesham** (Identity/Pose Lead & Actor `EMP-002`)
- [ ] **Shahd** (Infra Lead, Camera Rigging & Actor `EMP-005`)
- [ ] **Ayman** (Backend/Homography Lead & Actor `EMP-003`)
- [ ] **Hassan** (SIEM/Simulators Lead & Actor `EMP-004`)
- [ ] **Ragheb** (Storyboard Author, Recording Coordinator & Actor `UNENROLLED`)