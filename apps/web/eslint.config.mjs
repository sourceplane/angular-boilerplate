import shared from "../../tooling/eslint/index.js";

// The shared config lints TypeScript: the app's sources (components, the
// module, the router config, the specs) and the Worker. Angular's build cache
// (.angular/) and the build output (dist/) are not sources.
export default [...shared, { ignores: ["dist/**", ".angular/**", "out-tsc/**"] }];
