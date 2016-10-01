const sentiment = require('sentiment');

const sourceAndroid = /(Android)|(android)/g;
const sourceApple = /(iphone)|(iPhone)|(iPad)|(ipad)|(Tweetlogix)|(iOS)/g
const sourceWP = /(Windows Phone)/g
const sourceWP = /(Windows Phone)/g
const sourceDesktopWeb = /(Web Client)/g
const sourceMobileWeb = /(Mobile Web)/g
const sourceTweetDeck = /(TweetDeck)/g
const sourceFacebook = /(Facebook)/g
const sourceInstagram = /(Instagram)/g
const sourceGoogle = /(Google)/g

exports.parsemessage = (data) => {
  let message = {};
  message.date = Date.parse(data.created_at);
  message.id = data.id_str;
  message.text = data.text;
  message.sentiments = sentiment(data.text);
  switch (data.source) {
    case data.source.match(sourceApple):
      message.source = 'Apple';
      break;
    case data.source.match(sourceAndroid):
      message.source = 'Android';
      break;
    case data.source.match(sourceWP):
      message.source = 'Windows Phone';
      break;
    case data.source.match(sourceDesktopWeb):
      message.source = 'Twitter Desktop Web';
      break;
    case data.source.match(sourceMobileWeb):
      message.source = 'Twitter Mobile Web';
      break;
    case data.source.match(sourceTweetDeck):
      message.source = 'TweetDeck';
      break;
    case data.source.match(sourceFacebook):
      message.source = 'FaceBook';
      break;
    case data.source.match(sourceInstagram):
      message.source = 'Instagram';
      break;
    case data.source.match(sourceGoogle):
      message.source = 'Google ';
      break;
    default:
      message.source = 'Bot';
  }
  message.user = {
    created: data.user.created_at,
    description: data.user.description,
    favorites: data.user.favorites_count,
    followers: data.user.followers_count,
    friends: data.user.friends_count,
    id: data.user.id,
    lang: data.user.lang,
    displayName: data.user.name,
    name: data.user.screen_name,
    timezone: data.user.time_zone,
    verified: data.user.verified
  }
}
