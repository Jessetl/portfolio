import assert from 'node:assert/strict';
import { test } from 'node:test';

import { makeSendContactMessage } from '@/core/application/contact/send-contact-message';
import type { ContactMessage } from '@/core/domain/contact/contact-message';

const valid = {
  name: '  María López ',
  email: 'maria@empresa.com',
  projectType: 'web-app',
  body: 'Necesito un portal de cotización para mi empresa.',
};

// Fakes en memoria de los puertos: registran qué se llamó.
const setup = (human = true) => {
  const sent: ContactMessage[] = [];
  const tokens: string[] = [];
  const send = makeSendContactMessage({
    sender: { send: async (message) => void sent.push(message) },
    verifier: { verify: async (token) => (tokens.push(token), human) },
  });
  return { send, sent, tokens };
};

test('envía el mensaje validado cuando el captcha aprueba', async () => {
  const { send, sent, tokens } = setup();
  const result = await send(valid, { trap: '', token: 'token' });
  assert.equal(result.ok, true);
  assert.deepEqual(tokens, ['token']);
  assert.equal(sent[0]?.name, 'María López');
});

test('el campo trampa lleno es spam: no consulta el captcha ni envía', async () => {
  const { send, sent, tokens } = setup();
  const result = await send(valid, { trap: 'https://spam.example', token: 'token' });
  assert.deepEqual(result, { ok: false, spam: true });
  assert.deepEqual([tokens.length, sent.length], [0, 0]);
});

test('un formulario inválido no consulta el captcha ni envía', async () => {
  const { send, sent, tokens } = setup();
  const result = await send({ ...valid, body: 'corto' }, { trap: '', token: 'token' });
  assert.deepEqual(result, { ok: false, errors: ['invalid-body'] });
  assert.deepEqual([tokens.length, sent.length], [0, 0]);
});

test('si el captcha rechaza, es spam y no envía', async () => {
  const { send, sent } = setup(false);
  const result = await send(valid, { trap: '', token: 'token' });
  assert.deepEqual(result, { ok: false, spam: true });
  assert.equal(sent.length, 0);
});
