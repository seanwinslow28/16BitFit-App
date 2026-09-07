# Automatic recorded-workout capture: planning evidence

Researched September 7, 2026. Question: **Which recorded workouts can the iPhone MVP capture automatically and trust?**

This is evidence for [the canonical workout-capture ticket](https://github.com/seanwinslow28/16BitFit-App/issues/2), not an implementation or a decision about reward eligibility. It follows the current main-worktree scope and the completed audit at `a3f2f74`. No app changes, package installation, device testing, credentials, or personal health data were involved.

## Proposed research resolution

Apple HealthKit is a viable common read interface for saved Apple Watch workouts and workouts that compatible third-party apps export to Health. A separate 16BitFit watch app is not indicated for importing existing records. WHOOP documents workout export, so it is a candidate through this same route; its exact exported metadata and behavior still require a device check. **Automatic import does not establish that someone actually exercised.** Provenance and user-entered metadata support filtering, with material limits described below.

`@kingstinct/react-native-healthkit` is a maintained React Native/Expo candidate exposing the required workout fields and incremental queries. Source inspection supports feasibility, not proven compatibility with this app. A signed native development build and a real iPhone paired with Apple Watch are the next technical validation prerequisites. The product can automatically reconcile when opened without promising that rewards arrive instantly while closed; the timing promise remains Sean's decision.

## What the sources document

### Apple Watch and other workout apps

- Apple documents automatic Health-data synchronization between iPhone, iPad, and Apple Watch. HealthKit supplies the common store and query API. This supports an iPhone reader of already-recorded workouts; it does not provide an end-to-end sync deadline. [Apple HealthKit updates](https://developer.apple.com/documentation/Updates/HealthKit), [Reading data from HealthKit](https://developer.apple.com/documentation/healthkit/reading-data-from-healthkit).
- `HKWorkout` represents a saved workout summary and associated samples. Readable information includes activity type, duration, dates (inherited from `HKSample`), events, activities within a workout, and available statistics such as energy or distance. Associated heart-rate and route data require their own relevant access and queries; their existence is not guaranteed for every source or workout. [HKWorkout](https://developer.apple.com/documentation/healthkit/hkworkout), [HKSample](https://developer.apple.com/documentation/healthkit/hksample), [Reading route data](https://developer.apple.com/documentation/healthkit/reading-route-data).
- Duration is not universally equal to end minus start. Apple describes duration supplied by the writer or calculated from workout events; paused workouts can therefore differ from elapsed wall-clock time. Rewards based on minutes need an explicit duration definition. [Workout duration](https://developer.apple.com/documentation/healthkit/hkworkout/duration).
- Compatible apps can share categories of data with Health after the user enables sharing; some need their own integration settings enabled too. “An Apple workout app” is not a specific vendor or compatibility promise. Each actual pilot app needs confirmation that it exports **workout records**, not merely calories or heart-rate samples. [Apple: Manage Health data](https://support.apple.com/en-lamr/108779).

**Inference for planning:** the smallest candidate path is a read-only HealthKit integration for workouts already available on the iPhone. It need not record workouts, schedule WorkoutKit plans, or build a companion watch app. “Automatically captured by 16BitFit” still depends on the upstream wearable/app recording and saving a workout; it does not mean the game detects every gym visit by itself.

### WHOOP

WHOOP's first-party integration article, dated April 16, 2026, documents exported workouts from auto-detected activities, active energy, and heart rate. Users must connect Apple Health and enable the relevant sharing permissions. WHOOP also imports workouts; overlapping imported activities may replace its auto-detected activity. The article explicitly warns about duplicate workouts when multiple sources write to Health, and says WHOOP edits/deletions update the corresponding Health entry. Recovery activities such as meditation and stretching are not exported. It also permits manual activity logging inside WHOOP. [WHOOP: Apple Health Integration](https://support.whoop.com/s/article/Apple-Health-Integration?language=en_US).

**Not established by that article:** exported source identifiers; whether manually logged or subsequently edited activities carry `HKWasUserEntered`; exact UUID/version behavior; reliable export latency; the precise fields of every workout type. Do not assume a WHOOP-source record proves auto-detection. A direct WHOOP API integration is not yet justified if its Health export meets the agreed eligibility rules; that is an architectural inference, not a verified integration.

### Provenance and trust

| Signal | Documented meaning | Limit for this pilot |
| --- | --- | --- |
| `HKObject.uuid` | HealthKit object's unique identifier. | Identifies a record, not a universal real-world exercise session. |
| `sourceRevision` | HealthKit sets the creating app/device revision when saving; includes source and version information. | Identifies the writer, which may have imported data from somewhere else. |
| Source bundle identifier | App bundle identifier, or UUID for supported Bluetooth LE sources. | Use observed identifiers, not a display-name guess or a made-up Apple Watch bundle pattern. |
| `device` and source product type | Device information and product type may accompany a sample. | Presence alone is not documented proof of sensor-measured exercise. |
| `HKMetadataKeyWasUserEntered` | Writers should set true for user-entered samples and false otherwise. | Optional metadata; absence is unknown. A false value is a writer's assertion, not a documented attestation. |

Sources: [HKObject](https://developer.apple.com/documentation/healthkit/hkobject), [sourceRevision](https://developer.apple.com/documentation/healthkit/hkobject/sourcerevision), [HKSourceRevision](https://developer.apple.com/documentation/healthkit/hksourcerevision), [bundleIdentifier](https://developer.apple.com/documentation/healthkit/hksource/bundleidentifier), [WasUserEntered](https://developer.apple.com/documentation/healthkit/hkmetadatakeywasuserentered).

Apple explicitly allows users to add workouts manually in Health, including times and calories. Therefore “came from Apple Health” cannot be the entire eligibility rule. [Apple: Manually add a workout](https://support.apple.com/en-mide/101952).

**Inference:** a source policy plus user-entered filtering can discourage simple fabrication and avoid unintended imports. None of the reviewed APIs attests that a body performed the claimed exercise. Automatic capture solves entry friction; it should not be described as cheat-proof. Whether to restrict initially to verified Apple Watch sources, allow other sources, reject missing flags, or apply plausibility limits is a human product decision. Requiring heart rate is also a product/data-access tradeoff, not a documented universal authenticity test.

### Repeated imports, edits, deletions, and duplicates

HealthKit objects are mostly immutable. A writer can replace a sample using sync-identifier/version metadata: a higher version replaces the older object. `HKAnchoredObjectQuery` returns added samples, deleted objects, and a new anchor, allowing incremental reads after a persisted sync position. [HKObject](https://developer.apple.com/documentation/healthkit/hkobject), [Sync identifier](https://developer.apple.com/documentation/healthkit/hkmetadatakeysyncidentifier), [Anchored object query](https://developer.apple.com/documentation/healthkit/hkanchoredobjectquery).

**Design implications, not approved implementation:** retain workout identity and a reward ledger so the same UUID cannot earn twice; retain the anchor consistently with processed records so interruption/retry is safe. A replacement may present a new UUID, and two apps can write separate records for the same session. UUID deduplication alone therefore does not solve cross-source duplicates. Sync/external identifiers can help only when supplied consistently; do not assume they are universal or shared across apps. Temporal overlap can identify candidates but cannot by itself prove duplication. A multisport workout may contain multiple activities, so counting each child as a separate reward also needs an explicit policy.

Sean still needs to choose historical-import cutoff, eligible types/sources, duplicate precedence, replacement treatment, and whether edits/deletions affect previously earned progress. Missing data after permission changes must not silently be treated as deletion. Apple's Health app source-priority display does not establish a deduplicated reward feed for raw workout queries.

### Permissions, empty results, and timing

HealthKit requires separate authorization by read/write data type, a HealthKit capability, relevant usage descriptions, and an availability check. Read denial is intentionally concealed: an app cannot distinguish denied read access from no externally readable records merely from an empty query. Completing the permission request is not proof that read access was granted. Permissions can change later. [Authorizing access](https://developer.apple.com/documentation/healthkit/authorizing-access-to-health-data), [Protecting privacy](https://developer.apple.com/documentation/healthkit/protecting-user-privacy).

Current Apple docs also describe time-limited read access. The earliest-authorized-date API is marked **iOS 27+**; it must not be assumed available on the pilot's chosen minimum iOS version. Missing older records can be unknown rather than absent. [Earliest authorized sample date](https://developer.apple.com/documentation/healthkit/hkhealthstore/getearliestauthorizedsampledate(for:completion:)).

An observer query signals changes and requires a follow-up query to retrieve them. Background delivery is available for workouts, requires its entitlement on iOS 15+, native launch-time observer registration, and completion handling. Its frequency is a maximum notification frequency, not a service deadline. Apple requires real-device testing for background delivery. Locked-device encryption can prevent background reads. [Observer queries](https://developer.apple.com/documentation/healthkit/executing-observer-queries), [Background delivery](https://developer.apple.com/documentation/healthkit/hkhealthstore/enablebackgrounddelivery(for:frequency:withcompletion:)), [Encrypted data](https://developer.apple.com/documentation/healthkit/protecting-user-privacy).

**Recommendation for the later timing decision:** guarantee reconciliation on launch/foreground after records reach Health, with best-effort background updates only after verification. Offer understandable “no readable workouts yet” and retry/help behavior; don't assert permission denial from zero results. This can satisfy automatic import without manual workout entry, but Sean must accept the experience and freshness target.

## Maintained integration candidate and prerequisites

On the research date, the npm registry reports `@kingstinct/react-native-healthkit` **14.1.0**. Its peer requirements are React >=19, React Native >=0.79, and `react-native-nitro-modules` >=0.35. The audited app declares React 19.1.0 and RN 0.81.5, which meet those two ranges; this is not a full native compatibility test. [npm package metadata](https://registry.npmjs.org/@kingstinct/react-native-healthkit/latest), [source package manifest](https://github.com/kingstinct/react-native-healthkit/blob/b78bdb322cb85823a3a303b95beb2d456016e001/packages/react-native-healthkit/package.json).

The maintained repository had a September 7, 2026 version commit at `b78bdb322cb85823a3a303b95beb2d456016e001`. These immutable source links establish the inspected revision; they are not a recommendation to install unretested latest code:

- Workout queries return workouts, deleted samples, and anchors; the types include dates, duration, UUID, source revision, device, and metadata. [Workout types](https://github.com/kingstinct/react-native-healthkit/blob/b78bdb322cb85823a3a303b95beb2d456016e001/packages/react-native-healthkit/src/types/Workouts.ts), [Shared types](https://github.com/kingstinct/react-native-healthkit/blob/b78bdb322cb85823a3a303b95beb2d456016e001/packages/react-native-healthkit/src/types/Shared.ts).
- Expo support requires its native config plugin and a new development client; Expo Go cannot add this native library. [Maintainer README](https://github.com/kingstinct/react-native-healthkit), [Expo native code](https://docs.expo.dev/workflow/customizing/).
- The plugin adds HealthKit entitlement and usage descriptions. Background delivery defaults on and adds launch-time setup unless disabled. Its source warns when setup insertion fails. Inspect generated configuration for the selected SDK; do not equate enabling a plugin with proven closed-app delivery. [Config plugin](https://github.com/kingstinct/react-native-healthkit/blob/b78bdb322cb85823a3a303b95beb2d456016e001/packages/react-native-healthkit/app.plugin.ts).
- Native background code queues events until JavaScript subscribes and opens a bounded execution window. The code is useful evidence of support, but remains subject to OS scheduling and bridge startup. [Background manager](https://github.com/kingstinct/react-native-healthkit/blob/b78bdb322cb85823a3a303b95beb2d456016e001/packages/react-native-healthkit/ios/BackgroundDeliveryManager.swift).

The completed audit found no usable local Xcode/simulator setup and no installed working HealthKit integration. Later verification needs an agreed SDK/build route, appropriate signing and HealthKit capabilities, and a real iPhone/paired Watch. Cloud or local build/account choices belong to the separate distribution ticket. HealthKit's required privacy disclosure and fitness-purpose presentation should feed the later release/measurement decisions; game-save locality does not automatically make every derived measurement event acceptable to send elsewhere. [Apple privacy requirements](https://developer.apple.com/documentation/healthkit/protecting-user-privacy).

## Bounded empirical checks remaining

These are future authorized feasibility checks, not work performed here:

1. Build the chosen Expo/RN/bridge combination; inspect native entitlements, permission descriptions, and background observer setup.
2. Import a newly completed Apple Watch workout on an actual iPhone; confirm type, duration/pauses, source identifiers, metadata, and time-to-availability.
3. Compare an explicitly manual Health workout and each proposed third-party source. For WHOOP, inspect auto-detected, manual, edited, deleted, and overlapping exports before promising eligibility or compatibility.
4. Exercise repeated import, interruption/restart, delayed sync, replacements, deletions, and cross-source duplicates against the subsequently agreed reward policy.
5. Verify denial/revocation, empty history, relevant limited-history access, lock/unlock, background, cold launch, user force-quit, and foreground recovery. Set a freshness promise only from observed behavior.

The research ticket can close with these documented feasibility constraints. Source eligibility, reward rules, import history, and timing guarantees remain unresolved human decisions; native success remains unverified.
