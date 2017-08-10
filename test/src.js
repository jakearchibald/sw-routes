import Router from './../index.js';
import { ifNavigation } from '../handlers';
import fromNetwork from '../lib/handlers/fromnetwork';

addEventListener('install', () => {
  skipWaiting();
});

const router = new Router();

router.get('/sw-router/test/:type/', ({ params }) => {
  return new Response(JSON.stringify(params));
});

router.get('https://example.com/foo', () => {
  return new Response('example');
});

router.get('/sw-router/whatever/', ifNavigation(), fromNetwork());

router.addFetchListener();
