"""Package ARM64 debug sections when Gradle retains symbols but emits no ZIP."""
import pathlib
import subprocess
import sys
import tempfile
import zipfile

aab, native_directory, objcopy, output = sys.argv[1:]
with zipfile.ZipFile(aab) as bundle, tempfile.TemporaryDirectory(prefix='natally-native-symbols-') as directory:
    libraries = [n for n in bundle.namelist() if n.startswith('base/lib/') and n.endswith('.so')]
    if not libraries:
        raise ValueError('AAB has no native libraries')
    with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
        for name in libraries:
            abi, library = name.split('/')[-2:]
            if abi != 'arm64-v8a':
                raise ValueError('This test build only declares ARM64: ' + abi)
            source = pathlib.Path(native_directory) / library
            debug = pathlib.Path(directory) / (library + '.dbg')
            subprocess.run([objcopy, '--only-keep-debug', str(source), str(debug)], check=True)
            archive.write(debug, abi + '/' + debug.name)
print('Packaged native debug sections: ' + output)
