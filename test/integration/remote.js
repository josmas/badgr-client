'use strict';

var Index = require('../../index');
var expect = require('chai').expect;
var env = require('../../src/environments');
var apiEndpoint = env.get('badgrApiEndpoint');
var goodTestAuth = { username: env.get('badgrUser'), password: env.get('badgrPass')};
var badAuth = { username: '', password: ''};

describe('A remote instance using low level _remote calls', function() {

  it('should return an auth error with bad authentication data', function (done) {
    var library = new Index(apiEndpoint, badAuth);

    var opts = {
      path: '/json-ld/v1'
    };
    library._remote.get(opts, function(err, data){
      expect(err).not.to.be.null;
      expect(data).to.be.undefined;
      expect(library._remote.token).to.be.undefined;
      done();
    });
  });

  it('should return the openbadges v1 url', function (done) {
    var library = new Index(apiEndpoint, goodTestAuth);

    var opts = {
      path: '/json-ld/v1'
    };
    library._remote.get(opts, function(error, data){
      expect(error).to.be.null;
      expect(data).not.to.be.undefined;
      expect(data['@context'][0]).to.be.equal('https://w3id.org/openbadges/v1');
      expect(library._remote.token).not.to.be.undefined;
    });
    // After about 1 second (arbitrary value), we wouldn't expect to need to ask for a token again
    setTimeout(function() {
      expect(library._remote.token).not.to.be.undefined;
      done();
    }, 1000);
  });

});
