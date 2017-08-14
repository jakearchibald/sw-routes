import Router from './index.js';
import * as handlers from './handlers.js';
import * as handlerTypes from './handler-types.js';

Router.handlers = handlers;
Router.handlerTypes = handlerTypes;

self.Router = Router;
