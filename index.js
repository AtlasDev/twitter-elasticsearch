"use strict";

const Twitter = require('twitter');
const elasticsearch = require('elasticsearch');
const utils = require('./utils.js');
const config = require('./config.json');

var twitterClient = new Twitter(config.twitter);
var elasticClient = new elasticsearch.Client(config.elasticsearch);

let stream = twitterClient.stream('statuses/sample');

stream.on('data', (data) => {
  if(data.id_str && data.text) {
    elasticClient.get({
      index: config.elasticsearch.index,
      type: 'tweets',
      id: data.id_str
    }).then(function () {}, function (err) {
      let message = utils.parseMessage(data)
      elasticClient.create({
        index: config.elasticsearch.index,
        type: 'tweets',
        id: data.id_str,
        body: message
      }, function (err) {
        console.log(JSON.stringify(message));
        if(err) {
          console.error('Elasticsearch errored!');
          console.error(err);
        }
      });
    });
  }
});

console.log('Server started.');
