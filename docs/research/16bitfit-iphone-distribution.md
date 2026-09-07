# Private iPhone distribution and Expo options

Research date: September 7, 2026. Repository baseline: `a3f2f74`.
Research branch: `research/16bitfit-iphone-distribution`.

This answers the Wayfinder research question about distribution facts and technical options. It does not choose Sean's account ownership, spending, dates, or final SDK, and does not establish that a native build works. The current main-working-tree agreed scope and completed audit supersede the older committed overview: automatic recorded workouts are required; the pilot is iPhone only, uses local saves without player sign-up, starts with two observed testers, then roughly 5–8 people for two weeks. Presets lead; personalization is conditional later work.

## Findings and recommendation

**Recommend a custom native development build for engineering and a release build shared through email-invited external TestFlight for the pilot.** TestFlight does not require public App Store release. Ad hoc distribution is a viable alternative for the first observed sessions if its device-registration work is acceptable. These are recommendations for the later live decision, not approvals to enroll or distribute.

**Keeping Expo is compatible with native HealthKit. A major SDK upgrade is not required merely to satisfy Apple's current upload minimum.** SDK 54 has documented Xcode 26 support, but its maintenance window is nearly over. A supported SDK 57 baseline is therefore a justified candidate for implementation planning; a short SDK 54 alignment can be useful for a bounded native feasibility check. The HealthKit bridge and retained native dependencies must be verified before selecting the final combination. [Expo SDK 54 release](https://expo.dev/changelog/sdk-54), [Expo SDK 57 release and maintenance window](https://expo.dev/changelog/sdk-57).

## Native access and build types

HealthKit is an on-device framework, not a feature that a JavaScript-only preview can add. Apple requires the HealthKit capability and read-purpose text for access; background delivery has an additional entitlement when used. Request only the chosen data permissions. A read-only workout import does not inherently require writing workout records. The exact query, trust, and background behavior belong to the companion workout investigation. [Apple: configuring HealthKit access](https://developer.apple.com/documentation/Xcode/configuring-healthkit-access), [HealthKit overview](https://developer.apple.com/documentation/healthkit).

| Build type | What it can establish for this pilot |
| --- | --- |
| Expo Go | Its native libraries are fixed. Adding a HealthKit package to JavaScript cannot add its native implementation or 16BitFit's entitlements. It is unsuitable for validating the required integration or the final release. |
| Custom development build | Can contain the selected native bridge and app configuration. Used for real-device integration/debugging; typical development loads JavaScript from a development server. Native library/configuration changes require rebuilding. |
| Release/preview build | Contains its application bundle and native integration. Use a release-style build for independent participant use, so return-use testing does not depend on Sean keeping a development server running. |

The first two rows follow Expo's distinction between a fixed Expo Go binary and a custom native build; the final row is the pilot recommendation based on Expo's bundled-production-code description. [Expo development-build FAQ](https://docs.expo.dev/develop/development-builds/faq/), [development-build setup](https://docs.expo.dev/develop/development-builds/introduction/).

Apple's capabilities table marks **HealthKit available to free Apple Developer accounts as well as paid program members**. Its HTML checkmarks were inspected directly because the text-only table loses those symbols. Do not claim HealthKit itself requires paid enrollment. Free personal-device development remains different from distributing a pilot. [Apple supported iOS capabilities](https://developer.apple.com/help/account/reference/supported-capabilities-ios/).

## Distribution comparison

| Route | Developer/setup requirements | Tester experience | Fit |
| --- | --- | --- | --- |
| Local Xcode, free Personal Team | Mac with full Xcode and Apple Account; Xcode handles personal signing. Profiles expire after seven days, with at most three devices and three apps per device. | Device connected/configured for development; periodic rebuild/reinstall. | Sean's own feasibility work in principle; poor fit for the two-week larger cohort. |
| Ad hoc / EAS internal distribution | Paid Apple Developer membership, App ID, distribution certificate, profile with each device UDID. Portal profile creation requires Account Holder or Admin. | Register device, then install the shared build. Additional devices require a new profile and rebuild or re-sign. No beta App Review. | Plausible for two closely assisted people; more onboarding work for the larger cohort. |
| Internal TestFlight | Paid membership, App Store Connect app/build and internal group. Testers need app access and an Account Holder, Admin, App Manager, Developer, or Marketing role. | TestFlight app and invitation; no per-device UDID registration. | Good for Sean/development team; avoid granting team privileges just to make friends/family “internal.” |
| External TestFlight | Paid membership, App Store Connect app, internal group before external group, release build, beta test information and first-build review. Account Holder, Admin, or App Manager manages external testing. | Email invitation and TestFlight installation; no developer-team role. | Recommended default for both pilot stages once the build is reviewable. |

Sources for the rows: [Apple Personal Team limits](https://developer.apple.com/help/account/basics/about-your-developer-account), [Apple ad hoc profile setup](https://developer.apple.com/help/account/provisioning-profiles/create-an-ad-hoc-provisioning-profile), [Expo internal distribution](https://docs.expo.dev/build/internal-distribution/), [Apple internal testers](https://developer.apple.com/help/app-store-connect/test-a-beta-version/add-internal-testers), [Apple external testers](https://developer.apple.com/help/app-store-connect/test-a-beta-version/invite-external-testers/).

TestFlight permits 100 internal testers or 10,000 external testers; builds are usable for up to 90 days. This comfortably covers a two-week study if sufficient build lifetime remains. Apple processes uploads; the first external beta build requires review and subsequent builds may also require it. Do not promise a review completion date. TestFlight provides feedback/crash reporting, but it does not by itself answer every custom activation/return-use question. [Apple TestFlight overview](https://developer.apple.com/help/app-store-connect/test-a-beta-version/testflight-overview), [external review and test information](https://developer.apple.com/help/app-store-connect/test-a-beta-version/invite-external-testers/).

For ad hoc distribution, the membership has a limit of 100 iPhones per membership year, not 100 per app. EAS share URLs allow unauthenticated download by default, though the provisioning profile still restricts installation to registered devices; requiring Expo login is an optional project setting. Newly registered devices on new/recently renewed memberships can take 24–72 hours to become provisionable. Registration therefore is not a guaranteed instant substitute for beta review. [Apple device limits](https://developer.apple.com/help/account/devices/devices-overview/), [Expo device registration and link access](https://docs.expo.dev/build/internal-distribution/).

Development installations require Developer Mode; account for this in assisted device setup. Use the chosen release distribution on an actual tester device before writing final installation instructions. [Expo iPhone development-build tutorial](https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/).

Expo's review guide distinguishes release builds for store test tracks from development builds shared internally. **“EAS internal distribution” means ad hoc here; it is not “internal TestFlight.”** A release-style ad hoc preview is possible. [Expo review distribution overview](https://docs.expo.dev/review/overview/).

Enterprise employee distribution does not match this friends/family pilot. There is no requirement to create a public repository or publicly release the app to use the recommended path. Enterprise's stated audience is private employee use; the recommendation stays with ordinary developer-program testing routes. [Apple account overview](https://developer.apple.com/help/account/basics/about-your-developer-account).

## Accounts, cost, and tooling

Apple Developer Program membership is **US$99 annually**, with local pricing where offered. Enrollment requires an Apple Account with two-factor authentication and legal-age eligibility. Individual enrollment uses the person's legal name; organization enrollment requires legal-entity verification and generally a D‑U‑N‑S number. Sean's existing membership and preferred owner have not been checked. Testers do not each buy developer memberships. Apple/TestFlight account setup is separate from the agreed absence of a 16BitFit player account. [Apple program enrollment](https://developer.apple.com/help/account/membership/program-enrollment), [external tester definition](https://developer.apple.com/help/app-store-connect/test-a-beta-version/invite-external-testers/).

Expo's current Free tier lists **15 iOS builds per month**, a low-priority queue, one concurrency and a 45-minute build timeout. Starter lists **US$19/month plus additional usage**, including US$45 build credit. These are service options, not a budget choice or a promise that all pilot iteration fits the free quota. Apple membership is separate. Recheck the live plan at the build decision. [Expo pricing](https://expo.dev/pricing).

Cloud EAS builds avoid installing the native compiler on Sean's Mac. Local Expo builds require full Xcode/native tooling; EAS local builds also run the compiler locally. The audit found only Command Line Tools selected and no standard Xcode installation, so the existing successful JavaScript export does not demonstrate local native readiness. [Expo development-build setup](https://docs.expo.dev/develop/development-builds/introduction/), [completed audit in the main working tree](/Users/seanwinslow/Code-Brain/16BitFit-App/docs/audits/2026-09-07-existing-app-audit.md).

For EAS/TestFlight, later setup needs an Expo account/project, unique iOS bundle identifier, signing credentials, App Store Connect app record, and production `.ipa`. EAS Submit can upload it from macOS, Linux, or Windows; upload to TestFlight does not automatically release it publicly. Local Xcode archive/upload is an alternative. Credentials must be configured by the authorized owner when build work starts. [Expo iOS submission](https://docs.expo.dev/submit/ios/).

## Requirements as of September 7, 2026

**Already effective:** Apple announced the exact deadline on February 3, 2026: since **April 28, 2026**, iPhone uploads to App Store Connect require **Xcode 26 or later with iOS 26 SDK or later**. TestFlight uploads go through App Store Connect, so plan around this minimum. This is the SDK used to compile; it does not mean every tester must run iOS 26. [Apple dated announcement](https://developer.apple.com/news/?id=ueeok6yw), [Apple current requirements](https://developer.apple.com/news/upcoming-requirements/).

**Allowed beta tooling is not a new minimum:** Apple's August 25, 2026 release notes allow Xcode 27 beta 6/iOS 27 beta 6 builds for internal/external testing. That announcement does not require the pilot to use beta Xcode or iOS 27. No replacement iOS 27 upload-minimum date was established by the requirements pages checked for this note. Recheck at actual submission. [App Store Connect release notes](https://developer.apple.com/help/app-store-connect/release-notes/).

| Expo candidate | React Native | Minimum supported iOS | Documented build baseline | Planning implication |
| --- | --- | --- | --- | --- |
| SDK 54 alignment | 0.81 | 15.1 | Expo minimum Xcode 16.1; EAS documents Xcode 26.0 for `sdk-54` | Choose Xcode 26 for upload compatibility; Xcode 16.x's historical ability to compile is insufficient for current uploads. |
| SDK 55 | 0.83 | 15.1 | Xcode 26.2+ | Intermediate upgrade, or candidate if the selected bridge/retained code provides a specific reason. |
| SDK 56 | 0.85 | 16.4 | Xcode 26.4+ | Intermediate upgrade; raises tester OS floor. |
| SDK 57 | 0.86 | 16.4 | Xcode 26.4+; current EAS `sdk-57` image uses Xcode 26.6 | Current stable SDK; a candidate for a maintained pilot baseline. Requires dependency and device validation. |

Version/OS minimums: [Expo SDK reference](https://docs.expo.dev/versions/latest/). Images: [EAS build infrastructure](https://docs.expo.dev/build-reference/infrastructure/). The currently listed SDK 54 image is `macos-sequoia-15.6-xcode-26.0`; SDK 57 is `macos-tahoe-26.5-xcode-26.6`. Prefer a deliberately verified image; `auto` depends on project configuration and `latest` moves. Documentation availability is not a successful build result.

SDK 57 was released June 30, 2026. Its maintenance notes say SDK 54 receives critical fixes until the next SDK release, expected September or October 2026—not a fixed September 7 cutoff. SDK 57's known-regression notes describe memory/startup fixes through `expo@57.0.17`; this repo uses Reanimated, so those notes matter if upgraded. Do not pin the unpatched initial SDK 57 release. [Expo SDK 57 release](https://expo.dev/changelog/sdk-57).

The audit's mixed SDK 54/55 development packages need alignment whichever path is chosen. Upgrading is not just changing `expo`: follow Expo's incremental 54 → 55 → 56 → 57 guidance, matching dependencies and checking each step. SDK 55 onward requires the New Architecture; the audited config already enables it, but that does not establish every native package is compatible. [Expo upgrade guidance](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/), [Expo architecture requirements](https://docs.expo.dev/guides/new-architecture/).

## Unresolved checks and handoff

No build, package installation/update, enrollment, purchase, upload, invitation, or credential inspection was performed. Only this research note is committed in the research worktree.

Later planning/build gates:

1. Confirm Sean's existing Apple membership, individual/organization ownership, available Mac/Xcode route, acceptable services cost, and real tester devices/OS versions. These are live choices or account facts, not research conclusions.
2. Select and inspect the HealthKit bridge/config plugin against the chosen Expo/React Native version. Prove native compilation, signing entitlements, permission UI, and import of a real Apple Watch workout on a physical iPhone. WHOOP compatibility is separate evidence.
3. Align or upgrade dependencies in an isolated implementation change. Verify retained native modules, fonts/assets, release startup, and persistence. The audit's six compatibility findings remain the baseline, not fixed future version prescriptions.
4. During app configuration, reconcile `supportsTablet: true` with the agreed iPhone-only scope; add the missing bundle identifier, HealthKit configuration and build profiles. These are observed baseline gaps in `app.json`/`package.json`; no files were changed here.
5. Before TestFlight sharing, verify an actual upload is accepted, beta metadata/review instructions make the workout-dependent experience testable, and the reviewed release works on a tester device without a development server. Confirm local progress survives the intended update path; do not direct testers to delete their app to update.
6. Record the final SDK, compiler image, supported tester OS floor, distribution route, release lifetime, installation instructions and ownership in the downstream decision. Recheck Apple/Expo requirements at that time; research does not guarantee approval or a delivery date.

Proposed research-ticket disposition: **resolved as factual options and constraints**, with the above native feasibility and human choices retained as explicit downstream gates. Recommended map gist: “Native HealthKit requires a custom app build. External TestFlight is a suitable private-pilot route; ad hoc is a viable assisted-test alternative. Paid membership is required for those sharing routes. SDK 54/Xcode 26 alignment can meet today's upload minimum, but SDK 54's approaching maintenance end justifies evaluating supported SDK 57 before the pilot.”
