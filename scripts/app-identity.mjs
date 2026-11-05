import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Application identity is deliberately configured in .env, never inherited from a fallback. */
export function loadAppIdentity(root = repository) {
  const envFile = path.join(root, '.env');
  if (!existsSync(envFile)) throw new Error('Configure APP_NAME and APP_IDENTIFIER in .env before using this application.');
  const values = parseEnv(readFileSync(envFile, 'utf8'));
  const name = values.APP_NAME?.trim();
  const identifier = values.APP_IDENTIFIER?.trim();
  if (!name || /[\u0000-\u001f\u007f]/.test(name)) throw new Error('APP_NAME in .env must be a nonempty application name on one line.');
  if (!identifier || !/^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*){2,}$/.test(identifier)) {
    throw new Error('APP_IDENTIFIER in .env must be an explicit reverse-domain Android package identifier.');
  }
  const reserved = new Set(['example', 'test', 'testing', 'placeholder', 'your', 'yourcompany', 'yourdomain']);
  const javaKeywords = new Set(['abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally', 'float', 'for', 'goto', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long', 'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'try', 'void', 'volatile', 'while', 'true', 'false', 'null']);
  if (identifier.split('.').some(segment => reserved.has(segment) || javaKeywords.has(segment))) {
    throw new Error('APP_IDENTIFIER cannot contain example, test, placeholder or Java-reserved package segments. Configure the publisher-owned identity.');
  }
  return Object.freeze({ name, identifier });
}

export function escapeIdentityHtml(value) {
  return value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
}

export function projectAppHtml(html, identity) {
  return html.replaceAll('__APP_NAME_HTML__', escapeIdentityHtml(identity.name))
    .replace('</head>', `<meta name="application-name" content="${escapeIdentityHtml(identity.name)}"><meta name="application-identifier" content="${identity.identifier}"></head>`);
}

export function projectAppManifest(template, identity) {
  return { ...template, name: identity.name, short_name: identity.name, id: identity.identifier };
}

function contained(root, relative) {
  const file = path.resolve(root, relative);
  const fromRoot = path.relative(path.resolve(root), file);
  if (fromRoot.startsWith('..') || path.isAbsolute(fromRoot)) throw new Error('Identity projection path must remain inside its repository.');
  return file;
}

function sourceFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(file) : entry.isFile() && /\.(?:kt|java|kts|xml|pro|properties)$/.test(entry.name) ? [file] : [];
  });
}

/** Identity-only projection. Does not initialize, build, stamp, or change signing. */
export function syncNativeIdentity(root = repository) {
  const identity = loadAppIdentity(root);
  const configFile = contained(root, 'src-tauri/tauri.conf.json');
  const config = JSON.parse(readFileSync(configFile, 'utf8'));
  const previous = config.identifier;
  if (!/^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)+$/.test(previous)) throw new Error('Existing native identifier cannot be projected into a package path.');
  const changes = [];
  const write = (file, content) => {
    if (readFileSync(file, 'utf8') !== content) {
      writeFileSync(file, content);
      changes.push(path.relative(root, file).split(path.sep).join('/'));
    }
  };
  const android = 'src-tauri/gen/android';
  const sourceRoots = [`${android}/app/src`, `${android}/buildSrc/src`];
  const moves = [];
  if (previous !== identity.identifier) {
    for (const sourceRoot of sourceRoots) {
      for (const language of ['java', 'kotlin']) {
        const base = `${sourceRoot}/main/${language}`;
        const from = contained(root, `${base}/${previous.replaceAll('.', '/')}`);
        const to = contained(root, `${base}/${identity.identifier.replaceAll('.', '/')}`);
        if (!existsSync(from)) continue;
        if (existsSync(to)) throw new Error(`Identity destination already exists: ${path.relative(root, to)}`);
        moves.push({ from, to });
      }
    }
  }
  const gradleFile = contained(root, `${android}/app/build.gradle.kts`);
  const stringsFile = contained(root, `${android}/app/src/main/res/values/strings.xml`);
  const appDirectory = contained(root, `${android}/app`);
  const proguardFiles = existsSync(appDirectory) ? readdirSync(appDirectory)
    .filter(name => name.endsWith('.pro')).map(name => path.join(appDirectory, name)) : [];
  const references = [...sourceRoots.flatMap(relative => sourceFiles(contained(root, relative))),
    contained(root, `${android}/buildSrc/build.gradle.kts`), ...proguardFiles];
  if (previous !== identity.identifier) {
    for (const file of references.filter(existsSync)) {
      const text = readFileSync(file, 'utf8');
      write(file, text.replaceAll(previous, identity.identifier).replaceAll(previous.replaceAll('.', '/'), identity.identifier.replaceAll('.', '/')));
    }
  }
  if (existsSync(gradleFile)) {
    const text = readFileSync(gradleFile, 'utf8');
    write(gradleFile, text.replace(/(\b(?:namespace|applicationId)\s*=\s*)"[^"]*"/g, `$1${JSON.stringify(identity.identifier)}`));
  }
  if (existsSync(stringsFile)) {
    const androidName = escapeIdentityHtml(identity.name.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll("'", "\\'"));
    write(stringsFile, readFileSync(stringsFile, 'utf8').replace(/(<string\s+name="(?:app_name|main_activity_title)"[^>]*>)[\s\S]*?(<\/string>)/g, (_, start, end) => `${start}"${androidName}"${end}`));
  }
  for (const { from, to } of moves) {
    mkdirSync(path.dirname(to), { recursive: true });
    renameSync(from, to);
    changes.push(`${path.relative(root, from)} -> ${path.relative(root, to)}`);
  }
  config.productName = identity.name;
  config.identifier = identity.identifier;
  config.app.windows[0].title = `${identity.name} v${config.version}`;
  config.bundle.shortDescription = `${identity.name} personal astrology and exploration`;
  write(configFile, JSON.stringify(config, null, 2) + '\n');
  const cargoFile = contained(root, 'src-tauri/Cargo.toml');
  write(cargoFile, readFileSync(cargoFile, 'utf8').replace(/^description = ".*"/m, `description = ${JSON.stringify(config.bundle.shortDescription)}`));
  return { ...identity, changes };
}
