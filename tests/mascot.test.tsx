import React from 'react';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { NatallyAvatar } from '../src/components/NatallyAvatar';
import { NatallyIcon } from '../src/components/NatallyIcon';

test('official animated mascot is the default portrait', () => {
  const markup = renderToStaticMarkup(<NatallyAvatar />);
  assert.match(markup, /src="\/natally-mascot.webp"/);
  assert.match(markup, /alt="Natally Mascot"/);
});

test('brand icon provides a keyboard-accessible chart guiding action', () => {
  const markup = renderToStaticMarkup(<NatallyIcon />);
  assert.match(markup, /<button[^>]*type="button"/);
  assert.match(markup, /aria-label="Watch Natally point to her natal chart"/);
  assert.match(markup, /src="\/branding\/192x192.png"/);
});

test('disabled animation renders the existing static vector fallback', () => {
  const markup = renderToStaticMarkup(<NatallyAvatar isAnimated={false} />);
  assert.match(markup, /<svg/);
  assert.doesNotMatch(markup, /animate-spin|animate-pulse|src="\/natally-mascot.webp"/);
});

test('header portrait is larger without enlarging ordinary small icons', () => {
  assert.match(renderToStaticMarkup(<NatallyIcon size="header" />), /width:72px;height:72px/);
  assert.match(renderToStaticMarkup(<NatallyIcon size="sm" />), /width:36px;height:36px/);
});

test('favicon references the shipped Natally/chart ICO and PNG fallback', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const asset = readFileSync(new URL('../public/favicon.ico', import.meta.url));
  assert.match(html, /rel="icon"[^>]*href="\/favicon.ico"/);
  assert.match(html, /href="\/favicon-32.png"/);
  assert.equal(asset.readUInt16LE(2), 1);
});
