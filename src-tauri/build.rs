fn main() {
  let stamp: serde_json::Value = serde_json::from_str(
    &std::fs::read_to_string("../version.json").expect("canonical version.json"),
  ).expect("valid canonical version");
  assert_eq!(stamp["version"].as_str().unwrap(), std::env::var("CARGO_PKG_VERSION").unwrap());
  println!("cargo:rerun-if-changed=../version.json");
  // Android's linker does not otherwise emit a GNU build ID here. Preserve
  // one in the application and debug sections for exact symbol matching.
  if std::env::var("CARGO_CFG_TARGET_OS").ok().as_deref() == Some("android") {
    println!("cargo:rustc-link-arg=-Wl,--build-id=sha1");
  }
  tauri_build::build()
}
