"use strict";

const sentiment = require('sentiment');

exports.parseMessage = (data) => {
  let message = {};
  message.date = parseDate(data.created_at);
  message.id = data.id_str;
  message.text = data.text;
  message.sentiment = sentiment(data.text);
  if(data.coordinates) {
    message.location = data.coordinates;
  }
  if(data.entities) {
    message.entities = parseEntities(data.entities);
  }
  message.source = parseSource(data.source);
  message.user = parseUser(data.user);
  if(data.retweeted_status) {
    message.retweet = true;
    message.retweetData = {};
    message.retweetData.date = parseDate(data.retweeted_status.created_at);
    message.retweetData.text = data.retweeted_status.text,
    message.retweetData.sentiment = sentiment(data.retweeted_status.text),
    message.retweetData.source = parseSource(data.retweeted_status.source),
    message.retweetData.user = parseUser(data.retweeted_status.user)
    if(data.retweeted_status.coordinates) {
      message.location = data.coordinates;
    }
    if(data.retweeted_status.entities) {
      message.retweetData.entities = parseEntities(data.retweeted_status.entities);
    }
    message.retweetData.retweets = data.retweeted_status.retweet_count;
    message.retweetData.favorites = data.retweeted_status.favorite_count;
    message.retweetData.lang = data.retweeted_status.lang;
  } else {
    message.retweet = false;
  }
  return message;
};

const sourceAndroid = /(Android)|(android)/g;
const sourceApple = /(iphone)|(iPhone)|(iPad)|(ipad)|(Tweetlogix)|(iOS)/g
const sourceWP = /(Windows Phone)/g
const sourceDesktopWeb = /(Web Client)/g
const sourceMobileWeb = /(Mobile Web)/g
const sourceTweetDeck = /(TweetDeck)/g
const sourceFacebook = /(Facebook)/g
const sourceInstagram = /(Instagram)/g
const sourceGoogle = /(Google)/g

const parseSource = (source) => {
  if(source.match(sourceApple)) {
    return 'Apple';
  } else if(source.match(sourceAndroid)) {
    return 'Android';
  } else if(source.match(sourceWP)) {
    return 'WindowsPhone';
  } else if(source.match(sourceDesktopWeb)) {
    return 'Desktop';
  } else if(source.match(sourceMobileWeb)) {
    return 'MobileWeb';
  } else if(source.match(sourceTweetDeck)) {
    return 'TweetDeck';
  } else if(source.match(sourceFacebook)) {
    return 'FaceBook';
  } else if(source.match(sourceInstagram)) {
    return 'Instagram';
  } else if(source.match(sourceGoogle)) {
    return 'Google ';
  } else {
    return 'Bot';
  }
};

const parseUser = (user) => {
  return {
    created: user.created_at,
    description: user.description,
    favorites: user.favourites_count,
    followers: user.followers_count,
    friends: user.friends_count,
    id: user.id,
    lang: user.lang,
    displayName: user.screen_name,
    name: user.name,
    timezone: user.time_zone,
    location: user.location,
    verified: user.verified
  }
};

const parseEntities = (entities) => {
  let message = {};
  message.hasHashtags = entities.hashtags;
  if(message.hasHashtags) {
    message.hashtags = Object.keys(entities.hashtags);
    message.hashtagAmount = message.hashtags.length;
  }
  message.hasMentions = entities.user_mentions;
  if(message.hasMentions) {
    message.mentions = Object.keys(entities.user_mentions);
    message.mentionsAmount = message.mentions.length;
  }
  message.hasUrls = entities.urls;
  if(message.hasUrls) {
    message.urls = Object.keys(entities.urls);
    message.urlsAmount = message.urls.length;
  }
  message.hasSymbols = entities.symbols;
  if(message.hasSymbols) {
    message.symbols = Object.keys(entities.symbols);
    message.symbolsAmount = message.symbols.length;
  }
  return message;
};

const parseDate = (date) => {
  return {
    type: 'epoch_millis',
    format: new Date(date)
  }
}
