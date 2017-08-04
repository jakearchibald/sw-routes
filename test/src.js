import Router from './../src';
import staleWhileRevalidate from '../src/handlers/stalewhilerevalidate';

addEventListener('install', () => {
  skipWaiting();
});

const router = new Router();

router.get('/sw-router/test/:type/', ({ params }) => {
  return new Response(JSON.stringify(params));
});

router.add(staleWhileRevalidate('dynamic'));

addEventListener('fetch', event => router.handleFetchEvent(event));
