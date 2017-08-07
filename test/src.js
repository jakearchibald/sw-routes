import Router from './../src';
import staleWhileRevalidate from '../src/handlers/stalewhilerevalidate';
import isNavigation from '../src/handlers/isnavigation';

addEventListener('install', () => {
  skipWaiting();
});

const router = new Router();

router.get('/sw-router/test/:type/', isNavigation(), ({ params }) => {
  return new Response(JSON.stringify(params));
});

router.add(staleWhileRevalidate('dynamic'));

router.addFetchListener();
