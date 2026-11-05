"""Verify the AAB native libraries and native-symbols ZIP have identical build IDs."""
import json, pathlib, re, subprocess, sys, tempfile, zipfile

if sys.argv[1] == '--manifest-only':
    with zipfile.ZipFile(sys.argv[2]) as bundle:
        if sys.argv[3].encode() not in bundle.read('base/manifest/AndroidManifest.xml'):
            raise ValueError('AAB manifest does not contain the canonical versionName')
    print('AAB canonical versionName verified')
    sys.exit(0)

aab, symbols, readelf, version = sys.argv[1:]
def build_id(data, destination):
    destination.write_bytes(data)
    result = subprocess.run([readelf, '--notes', str(destination)], check=True, capture_output=True, text=True)
    match = re.search(r'Build ID:\s*([0-9a-fA-F]+)', result.stdout)
    if not match:
        raise ValueError('Native library lacks a build ID')
    return match.group(1).lower()

with zipfile.ZipFile(aab) as bundle, zipfile.ZipFile(symbols) as debug, tempfile.TemporaryDirectory(prefix='natally-symbol-check-') as directory:
    manifest = bundle.read('base/manifest/AndroidManifest.xml')
    if version.encode() not in manifest:
        raise ValueError('AAB manifest does not contain the canonical versionName')
    native = [x for x in bundle.namelist() if x.startswith('base/lib/') and x.endswith('.so')]
    if not native:
        raise ValueError('AAB has no native libraries')
    results = []
    for name in native:
        abi, lib = name.split('/')[-2:]
        candidates = [x for x in debug.namelist() if abi in x and pathlib.PurePosixPath(x).name in [lib, lib+'.dbg', lib+'.sym']]
        if len(candidates) != 1:
            raise ValueError('Exactly one matching symbol library is required for '+name)
        left = build_id(bundle.read(name), pathlib.Path(directory)/'bundle.so')
        right = build_id(debug.read(candidates[0]), pathlib.Path(directory)/'symbols.so')
        if left != right:
            raise ValueError('Symbols do not match '+name)
        sections = subprocess.run([readelf, '--section-headers', '--wide', str(pathlib.Path(directory)/'symbols.so')], check=True, capture_output=True, text=True).stdout
        if not re.search(r'\.debug_(line|info)\b', sections):
            raise ValueError('Matching ELF contains no debug line/info sections: '+name)
        results.append({'library': name, 'symbol': candidates[0], 'buildId': left})
    print(json.dumps({'version': version, 'matchingNativeBuildIds': results}))
