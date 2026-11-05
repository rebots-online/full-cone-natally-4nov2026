#!/usr/bin/env bash
# Extract the web ZIP, then run this script. Defaults to a non-mutating preview.
set -euo pipefail
server= domain= destination= apply=0
package=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
while (( $# )); do
  case "$1" in
    --server) server=$2; shift 2;;
    --domain) domain=$2; shift 2;;
    --destination) destination=$2; shift 2;;
    --package) package=$2; shift 2;;
    --apply) apply=1; shift;;
    --dry-run) apply=0; shift;;
    *) echo 'Usage: install-web.sh --server nginx|apache --domain HOST --destination /absolute/path [--package DIR] [--apply]' >&2; exit 2;;
  esac
done
[[ "$server" == nginx || "$server" == apache ]]
[[ "$domain" =~ ^[A-Za-z0-9][A-Za-z0-9.-]*$ ]]
[[ "$destination" =~ ^/[A-Za-z0-9/_.-]+$ && "$destination" != / && "$destination" != /etc && "$destination" != /var ]]
[[ -f "$package/site/index.html" && -f "$package/version.json" ]]
version=$(sed -nE 's/^[[:space:]]*"version":[[:space:]]*"([0-9]+\.[0-9]+\.[0-9]+)",?[[:space:]]*$/\1/p' "$package/version.json")
[[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]
release="$destination/releases/v$version"
if [[ "$server" == nginx ]]; then
  config="server {
    listen 80;
    server_name $domain;
    root $release;
    index index.html;
    location / { try_files \$uri \$uri/ /index.html; }
    location ~* \\.(?:js|css|wasm|webp|png|woff2)$ { try_files \$uri =404; }
    add_header X-Content-Type-Options nosniff;
}"
  config_path="/etc/nginx/sites-available/natally-ai-studio-$domain.conf"
else
  config="<VirtualHost *:80>
    ServerName $domain
    DocumentRoot $release
    <Directory $release>
        Require all granted
        Options -Indexes
        AllowOverride None
        FallbackResource /index.html
    </Directory>
</VirtualHost>"
  config_path="/etc/apache2/sites-available/natally-ai-studio-$domain.conf"
fi
printf 'Natally v%s\nDestination: %s\nConfig: %s\n%s\n' "$version" "$release" "$config_path" "$config"
(( apply )) || { echo 'Preview only. Add --apply on the target server to install.'; exit 0; }
[[ $(id -u) == 0 ]] || { echo '--apply requires root on the target server' >&2; exit 1; }
command -v "$( [[ "$server" == nginx ]] && echo nginx || echo apache2ctl )" >/dev/null
if [[ -e "$release" ]]; then
  diff -qr "$package/site" "$release" >/dev/null || { echo 'Existing version differs; refusing overwrite' >&2; exit 1; }
else
  mkdir -p "$release"
  cp -a "$package/site/." "$release/"
fi
[[ ! -f "$config_path" ]] || cp -a "$config_path" "$config_path.backup-v$version-$(date +%s)"
printf '%s\n' "$config" > "$config_path"
if [[ "$server" == nginx ]]; then
  enabled="/etc/nginx/sites-enabled/$(basename "$config_path")"
  [[ -e "$enabled" ]] || ln -s "$config_path" "$enabled"
  nginx -t
  systemctl reload nginx
else
  a2ensite "$(basename "$config_path")"
  apache2ctl configtest
  systemctl reload apache2
fi
printf 'Installed Natally v%s for %s; previous release directories and configuration backups retained.\n' "$version" "$domain"
