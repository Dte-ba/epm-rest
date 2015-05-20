/*!
 * This file is part of EPM.
 *
 * please see the LICENSE
 */

var Epm = require('epm');
var path = require('path');

module.exports = modules = {};

modules.configure = function(router, dir, instances){

  instances = instances || {};

  router.get('/repository/:reponame', function(req, res, next){
    var rname = req.params.reponame;
    getRepository(rname, function(err, repo){
      if (err) return next(err);

      repo
        .get('info')
        .fail(function(err){
          if (err) return next(err);
        })
        .done(function(pkgs){
          //console.log(Object.keys(pkgs.packages));
          res.json(pkgs);
      });

    });

  });

  router.get('/query/:repository/:query', function(req, res, next){
    var rname = req.params.repository;
    var query = req.params.query;
    getRepository(rname, function(err, repo){
      if (err) return next(err);

      repo
        .get(query)
        .fail(function(err){
          if (err) return next(err);
        })
        .done(function(pkgs){
          //console.log(Object.keys(pkgs.packages));
          res.json(pkgs);
      });

    });

  });

  return router;

  function getRepository(name, cb){
    Epm.finder.find(dir, function(err, repos){
      var list = repos.filter(function(r){
        return r.name === name;
      });
      
      if (list.length === 0) {
        return cb && cb(new Error('Unknown repository ' + name));
      }

      if (list.length > 1) {
        return cb && cb(new Error('Multiple matches for ' + name + ' in the repository list'));
      }

      var info = list[0];
      var repo = new Epm(info.path);
      repo.init();
      cb && cb(null, repo);
    });
  }
};