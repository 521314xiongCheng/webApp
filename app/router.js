'use strict';
module.exports = app => {
  const { router, controller } = app;

  router.get('/getAccessToken', controller.index.getToken);

  router.get('/healthcheck', controller.app.health);

  router.get('/(.+)?', controller.app.index);
};
