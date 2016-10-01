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
    let message = utils.parseMessage(data);
    elasticClient.create({
      index: config.elasticsearch.index,
      type: 'message',
      id: data.id_str,
      body: utils.parseMessage(data)
    }, function (err) {
      if(err) {
        console.error('Elasticsearch errored!');
        console.error(err);
      }
    });
  } else if(data.deleted) {
    console.log(data.deleted)
    elasticClient.create({
      index: config.elasticsearch.index,
      type: 'deleted',
      id: data.id_str,
      body: data
    }, function (err) {
      if(err) {
        console.error('Twitter errored!');
        console.error(err);
      }
    });
  }
});

console.log('Server started.');
