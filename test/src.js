import Router from './../src';

addEventListener('install', () => {
  skipWaiting();
});

const router = new Router();

router.get('/sw-router/test/:type/', ({ params }) => {
  return new Response(JSON.stringify(params));
});

router.get('https://example.com/foo', () => {
  return new Response('example');
})

router.addFetchListener();
