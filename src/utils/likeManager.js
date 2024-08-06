// src/utils/likeManager.js

export class LikeManager {
  constructor() {
    // Initialize with default values
    this.authorization = null;
    this.ua = null;
    this.clientTid = null;
    this.clientUuid = null;
    this.csrfToken = null;
    this.userId = null;
    this.username = null;
    this.randomResource = "P_BKPwbhf2pWGbVaoBo7fg";
    this.tweetsToUnlike = [];
    this.deleteOptions = {
      force_unlike: false,
      tweets_to_ignore: [],
      tweets_from_accounts_to_ignore: []
    };
  }

  initialize(config) {
    this.authorization = config.authorization;
    this.ua = config.ua;
    this.clientTid = config.clientTid;
    this.clientUuid = config.clientUuid;
    this.csrfToken = config.csrfToken;
    this.userId = config.userId;
    this.username = config.username;
  }

  setUnlikeOptions(options) {
    this.deleteOptions = { ...this.deleteOptions, ...options };
  }
  buildAcceptLanguageString() {
    const languages = navigator.languages;
    if (!languages || languages.length === 0) {
      return "en-US,en;q=0.9";
    }
    let q = 1;
    const decrement = 0.1;
    return languages.map(lang => {
      if (q < 1) {
        const result = `${lang};q=${q.toFixed(1)}`;
        q -= decrement;
        return result;
      }
      q -= decrement;
      return lang;
    }).join(',');
  }

  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async fetchLikes(cursor, retry = 0) {
    let count = "20";
    let finalCursor = cursor ? `%22cursor%22%3A%22${cursor}%22%2C` : "";
    let baseUrl = `https://x.com/i/api/graphql/${this.randomResource}/Likes`;

    let variable = `?variables=%7B%22userId%22%3A%22${this.userId}%22%2C%22count%22%3A${count}%2C${finalCursor}%22includePromotedContent%22%3Afalse%2C%22withClientEventToken%22%3Afalse%2C%22withBirdwatchNotes%22%3Afalse%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D`;
    let feature = `&features=%7B%22rweb_lists_timeline_redesign_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
    let finalUrl = `${baseUrl}${variable}${feature}`;
    
    try {
      const response = await fetch(finalUrl, {
        headers: {
          "accept": "*/*",
          "accept-language": this.buildAcceptLanguageString(),
          "authorization": this.authorization,
          "content-type": "application/json",
          "sec-ch-ua": this.ua,
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-client-transaction-id": this.clientTid,
          "x-client-uuid": this.clientUuid,
          "x-csrf-token": this.csrfToken,
          "x-twitter-active-user": "yes",
          "x-twitter-auth-type": "OAuth2Session",
          "x-twitter-client-language": "fr"
        },
        "referrer": `https://x.com/${this.username}/likes`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        "method": "GET",
        "mode": "cors",
        "credentials": "include"
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.log("Rate limit reached. Waiting 3 minutes.");
          await this.sleep(1000 * 60 * 3);
          return this.fetchLikes(cursor, retry + 1);
        }
        if (retry == 5) {
          throw new Error("Max retries reached");
        }
        console.log(`Network response was not ok, retrying in ${10 * (1 + retry)} seconds`);
        await this.sleep(10000 * (1 + retry));
        return this.fetchLikes(cursor, retry + 1);
      }

      const data = await response.json();
      let entries = data.data.user.result.timeline_v2.timeline.instructions;
      for (let item of entries) {
        if (item.type == "TimelineAddEntries") {
          entries = item.entries;
          break;
        }
      }
      return entries;
    } catch (error) {
      console.error('Error fetching likes:', error);
      throw error;
    }
  }

  async logTweets(entries) {
    for (let item of entries) {
      if (item.entryId.startsWith("profile-conversation") || item.entryId.startsWith("tweet-")) {
        this.findTweetIds(item);
      } else if (item.entryId.startsWith("cursor-bottom") && entries.length > 2) {
        return item.content.value;
      }
    }
    return "finished";
  }

  checkFilter(tweet) {
    if (tweet.legacy?.id_str &&
      (this.deleteOptions.tweets_to_ignore.includes(tweet.legacy.id_str) ||
        this.deleteOptions.tweets_to_ignore.includes(parseInt(tweet.legacy.id_str)))) {
      return false;
    }
    for (let user of this.deleteOptions.tweets_from_accounts_to_ignore) {
      if ((tweet.legacy?.screen_name && tweet.legacy.screen_name.toLowerCase() === user.toLowerCase()) ||
        (tweet.core?.user_results?.result?.legacy?.screen_name &&
          tweet.core.user_results.result.legacy.screen_name.toLowerCase() === user.toLowerCase())) {
        return false;
      }
    }
    return true;
  }

  tweetFound(obj) {
    // console.log(`Found tweet: ${obj.legacy.full_text}`);
  }

  findTweetIds(obj) {
    const recurse = (currentObj) => {
      if (typeof currentObj !== 'object' || currentObj === null) {
        return;
      }

      if (((currentObj.__typename === 'Tweet') || currentObj.hasOwnProperty('rest_id')) &&
        currentObj.hasOwnProperty('legacy') &&
        this.checkFilter(currentObj) &&
        currentObj.legacy.favorited === true) {
        this.tweetsToUnlike.push(currentObj.id_str || currentObj.legacy.id_str);
        this.tweetFound(currentObj);
      }

      for (let key in currentObj) {
        if (currentObj.hasOwnProperty(key)) {
          recurse(currentObj[key]);
        }
      }
    };

    recurse(obj);
  }

  async unlikeTweets(idList) {
    const deleteTid = "LuSa1GYxAMxWEugf+FtQ/wjCAUkipMAT3jpjkil3ujj7oq6munDCtNaMaFmZ8bcm7CaNvi4GIXj32jp7q32nZU8zc5CyLw";
    const idListSize = idList.length;
    let retry = 0;

    for (let i = 0; i < idListSize; ++i) {
      try {
        const response = await fetch("https://x.com/i/api/graphql/ZYKSe-w7KEslx3JhSIk5LA/UnfavoriteTweet", {
          headers: {
            "accept": "*/*",
            "accept-language": this.buildAcceptLanguageString(),
            "authorization": this.authorization,
            "content-type": "application/json",
            "sec-ch-ua": this.ua,
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-client-transaction-id": deleteTid,
            "x-client-uuid": this.clientUuid,
            "x-csrf-token": this.csrfToken,
            "x-twitter-active-user": "yes",
            "x-twitter-auth-type": "OAuth2Session",
            "x-twitter-client-language": "fr"
          },
          "referrer": `https://x.com/${this.username}/likes`,
          "referrerPolicy": "strict-origin-when-cross-origin",
          "body": JSON.stringify({ "variables": { "tweet_id": idList[i] }, "queryId": "ZYKSe-w7KEslx3JhSIk5LA" }),
          "method": "POST",
          "mode": "cors",
          "credentials": "include"
        });

        if (!response.ok) {
          if (response.status === 429) {
            console.log("Rate limit reached. Waiting 3 minutes.");
            await this.sleep(1000 * 60 * 3);
            i -= 1;
            continue;
          }
          if (retry == 5) {
            throw new Error("Max retries reached");
          }
          console.log(`Network response was not ok, retrying in ${10 * (1 + retry)} seconds`);
          i -= 1;
          await this.sleep(10000 * (1 + retry));
          retry++;
          continue;
        }
        retry = 0;
        console.log(`Unliked ${i + 1}/${idListSize}`);
        await this.sleep(100);
      } catch (error) {
        console.error(`Error unliking tweet ${idList[i]}:`, error);
      }
    }
  }

  async startUnliking() {
    let next = null;
    let entries;

    while (next !== "finished") {
      entries = await this.fetchLikes(next);
      next = await this.logTweets(entries);
      await this.unlikeTweets(this.tweetsToUnlike);
      this.tweetsToUnlike = [];
      await this.sleep(3000);
    }

    console.log("UNLIKING COMPLETE (if no errors occurred)");
  }

  async startUnlikingProcess() {
    console.log("Starting unliking process");
    await this.startUnliking();
    return "Unliking process completed";
  }
}