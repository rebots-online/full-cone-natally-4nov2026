fn main() {
  let status = std::process::Command::new("node")
    .args(["scripts/release-state.mjs", "context"])
    .current_dir("..")
    .status().expect("Node is required for the complete build context");
  assert!(status.success(), "Use npm run build:all; individual native builds are not release invocations");
  println!("cargo:rerun-if-env-changed=NATALLY_RELEASE_ID");
  let stamp: serde_json::Value = serde_json::from_str(
    &std::fs::read_to_string("../version.json").expect("canonical version.json"),
  ).expect("valid canonical version");
  let package_version = stamp["semverVersion"].as_str().or_else(|| stamp["version"].as_str()).unwrap();
  assert_eq!(package_version, std::env::var("CARGO_PKG_VERSION").unwrap());
  println!("cargo:rerun-if-changed=../version.json");
  // Android's linker does not otherwise emit a GNU build ID here. Preserve
  // one in the application and debug sections for exact symbol matching.
  if std::env::var("CARGO_CFG_TARGET_OS").ok().as_deref() == Some("android") {
    println!("cargo:rustc-link-arg=-Wl,--build-id=sha1");
  }
  tauri_build::build()
}
