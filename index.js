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
    elasticClient.search({
      index: config.elasticsearch.index,
      type: 'tweets',
      body: {
        query: {
          match: {
            id: data.id_str
          }
        }
      }
    }).then(function (res) {
      if(res.hits.total == 0) {
        elasticClient.create({
          index: config.elasticsearch.index,
          type: 'tweets',
          id: data.id_str,
          body: utils.parseMessage(data)
        }, function (err) {
          if(err) {
            console.error('Elasticsearch errored!');
            console.error(err);
          }
        });
      }
    }, function (err) {
      console.error("Error looking up id's", err);
    });
  }
});

console.log('Server started.');
