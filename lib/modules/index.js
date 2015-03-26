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

      var callback = function(){
        repo.packages.info(function(err, data){
          res.removeListener('ready', callback);
          
          if (err) return next(err);
          
          res.json(data);
        });
      };

      repo.once('ready', callback);

      repo.read();

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

      cb && cb(null, new Epm(info.path));
    });
  }
};