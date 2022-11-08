import { test } from 'tap';
import { fastify } from 'fastify';
import Support from '../../src/plugins/support';

test('support works standalone', async (t) => {
  const app = fastify();
  app.register(Support);
  await app.ready();

  t.equal(app.someSupport(), 'hugs');
});
