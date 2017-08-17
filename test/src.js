import Router from '../';
import { ifNavigation, race, fromNetwork, sequence, toCache, fromCache, wait } from '../handlers';

addEventListener('install', () => skipWaiting());

const router = new Router();
router.addFetchListener();

router.get(ifNavigation(),
  race(
    sequence(wait(3000), fromNetwork(), toCache('nav'), () => console.log('from network')),
    sequence(fromCache(), wait(2000), () => console.log('from cache'))
  )
);
