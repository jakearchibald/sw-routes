import Router from '../';
/**
 * Shorthand to create a new router from items.
 *
 * @param items
 */
export default function sequence(...items) {
    const router = new Router();
    router.add(...items);
    return router;
}
