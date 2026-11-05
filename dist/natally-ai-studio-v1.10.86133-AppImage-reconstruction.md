# v1.10.86133 Linux AppImage reconstruction

The original AppImage is 111,524,344 bytes, above GitHub's 100 MiB single-file
limit. It is preserved losslessly in three standard 7-Zip volumes; no Git LFS
is used. Keep all three `natally-ai-studio-v1.10.86133-linux-x64-AppImage.7z.00N`
files in the same directory. Open `.001` in 7-Zip and extract, or run:

```sh
7zz x natally-ai-studio-v1.10.86133-linux-x64-AppImage.7z.001
sha256sum Natally_1.10.86133_amd64.AppImage
chmod +x Natally_1.10.86133_amd64.AppImage
```

Expected SHA256:
`95596667f8dcffd3286fa2b9948faf7fb3aa248af2ac87050de9afcc0686cc9c`.

Archive testing and extraction both passed; the extracted file's SHA256 matched
the original. For local release-inventory verification, place those exact bytes at
`dist/natally-ai-studio-v1.10.86133-linux-amd64.AppImage` (the coordinator's staged
filename). The build machine retains that original already. Other Linux formats
are committed directly as DEB and RPM. These checks prove package integrity,
not Linux desktop execution or completed application acceptance.
