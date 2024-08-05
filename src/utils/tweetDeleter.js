// src/utils/tweetDeleter.js

import { getRequestInfo, getUsername } from './storage.js';

export class TweetDeleter {
    constructor() {
        this.authorization = '';
        this.clientTid = '';
        this.clientUuid = '';
        this.csrfToken = '';
        this.userId = '';
        this.username = '';
        this.tweetsToDelete = [];
        this.stopSignal = false;
        this.ua = navigator.userAgent;
        this.languageCode = navigator.language.split('-')[0];
        this.deleteOptions = {
            fromArchive: false,
            unretweet: false,
            doNotRemovePinnedTweet: true,
            deleteMessageWithUrlOnly: false,
            deleteSpecificIdsOnly: [""],
            matchAnyKeywords: [""],
            tweetsToIgnore: [],
            oldTweets: false,
            afterDate: new Date('1900-01-01'),
            beforeDate: new Date('2100-01-01')
        };
        this.tweetsToDelete = new Set();
        this.deleteTid = "LuSa1GYxAMxWEugf+FtQ/wjCAUkipMAU3jpjkil3ujj7oq6munDCtNaMaFmZ8bcm7CaNvi4GIXj32jp7q32nZU8zc5CyLw";
        this.deleteTweetsResponseLink = "https://x.com/i/api/graphql/VaenaVgh5q5ih7kvyVjgtg/DeleteTweet"

    }
    async initialize(enteredUsername) {
        try {
            const requestInfo = await getRequestInfo();
            this.authorization = requestInfo.authorization;
            this.clientTid = requestInfo['x-client-transaction-id'];
            this.clientUuid = requestInfo['x-client-uuid'];

            // Extract csrfToken and userId from cookies
            const cookies = requestInfo.cookies.split('; ');
            for (let cookie of cookies) {
                const [name, value] = cookie.split('=');
                if (name === 'ct0') {
                    this.csrfToken = value;
                } else if (name === 'twid') {
                    this.userId = value.split('%3D')[1]; // Extract user ID from twid
                }
            }

            if (!this.csrfToken || !this.userId) {
                throw new Error('Failed to extract csrfToken or userId from cookies');
            }

            // Use the entered username
            this.username = enteredUsername;

            if (!this.username) {
                throw new Error('Username is required');
            }

        } catch (error) {
            console.error('Error initializing TweetDeleter:', error);
            throw error;
        }
    }
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async fetchTweets(cursor, retry = 0) {
        try {
            const count = "20";
            const finalCursor = cursor ? `%22cursor%22%3A%22${cursor}%22%2C` : "";
            const resource = this.deleteOptions.oldTweets ? 'H8OOoI-5ZE4NxgRr8lfyWg' : 'uYU5M2i12UhDvDTzN6hZPg';
            const endpoint = this.deleteOptions.oldTweets ? "UserTweets" : "UserTweetsAndReplies";
            const baseUrl = `https://x.com/i/api/graphql/${resource}/${endpoint}`;

            let variable, feature;
            if (this.deleteOptions.oldTweets == false) {
                variable = `?variables=%7B%22userId%22%3A%22${this.userId}%22%2C%22count%22%3A${count}%2C${finalCursor}%22includePromotedContent%22%3Atrue%2C%22withCommunity%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D`;
                feature = `&features=%7B%22rweb_lists_timeline_redesign_enabled%22%3Atrue%2C%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`;
            }
            else {
                variable = `?variables=%7B%22userId%22%3A%22${this.userId}%22%2C%22count%22%3A${count}%2C${finalCursor}%22includePromotedContent%22%3Atrue%2C%22withQuickPromoteEligibilityTweetFields%22%3Atrue%2C%22withVoice%22%3Atrue%2C%22withV2Timeline%22%3Atrue%7D`
                feature = `&features=%7B%22responsive_web_graphql_exclude_directive_enabled%22%3Atrue%2C%22verified_phone_label_enabled%22%3Afalse%2C%22creator_subscriptions_tweet_preview_api_enabled%22%3Atrue%2C%22responsive_web_graphql_timeline_navigation_enabled%22%3Atrue%2C%22responsive_web_graphql_skip_user_profile_image_extensions_enabled%22%3Afalse%2C%22tweetypie_unmention_optimization_enabled%22%3Atrue%2C%22responsive_web_edit_tweet_api_enabled%22%3Atrue%2C%22graphql_is_translatable_rweb_tweet_is_translatable_enabled%22%3Atrue%2C%22view_counts_everywhere_api_enabled%22%3Atrue%2C%22longform_notetweets_consumption_enabled%22%3Atrue%2C%22responsive_web_twitter_article_tweet_consumption_enabled%22%3Afalse%2C%22tweet_awards_web_tipping_enabled%22%3Afalse%2C%22freedom_of_speech_not_reach_fetch_enabled%22%3Atrue%2C%22standardized_nudges_misinfo%22%3Atrue%2C%22tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled%22%3Atrue%2C%22longform_notetweets_rich_text_read_enabled%22%3Atrue%2C%22longform_notetweets_inline_media_enabled%22%3Atrue%2C%22responsive_web_media_download_video_enabled%22%3Afalse%2C%22responsive_web_enhance_cards_enabled%22%3Afalse%7D`
            }

            const finalUrl = `${baseUrl}${variable}${feature}`;

            console.log("Final URL:", finalUrl);  // Log the final URL for debugging

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
                    "x-twitter-client-language": this.languageCode
                },
                "referrer": `https://x.com/${this.username}/with_replies`,
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": null,
                "method": "GET",
                "mode": "cors",
                "credentials": "include"
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.log("Rate limit reached. Waiting 1 minute");
                    await this.sleep(60000);
                    return this.fetchTweets(cursor, retry + 1);
                }
                if (retry === 5) {
                    throw new Error("Max retries reached");
                }
                console.log(`Network response was not ok, retrying in ${10 * (1 + retry)} seconds`);
                console.log(await response.text());  // Log the response text for debugging
                await this.sleep(10000 * (1 + retry));
                return this.fetchTweets(cursor, retry + 1);
            }

            const data = await response.json();

            let entries = data.data.user.result.timeline_v2.timeline.instructions;
            for (let item of entries) {
                if (item.type === "TimelineAddEntries") {
                    entries = item.entries;
                    break;
                }
            }
            return entries;
        } catch (error) {
            console.error('Error fetching tweets:', error);
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

    findTweetIds(obj) {
        const recurse = (currentObj) => {
            if (typeof currentObj !== 'object' || currentObj === null) {
                return;
            }

            if (currentObj['__typename'] === 'TimelineTweet' || currentObj['__typename'] === 'Tweet') {
                let tweetObj = currentObj['__typename'] === 'TimelineTweet' ? currentObj.tweet_results?.result : currentObj;

                if (this.checkTweetOwner(tweetObj, this.userId) && this.checkFilter(tweetObj)) {
                    const tweetId = tweetObj.rest_id || tweetObj.id_str || tweetObj.legacy?.id_str;
                    if (tweetId && !this.tweetsToDelete.has(tweetId)) {
                        this.tweetsToDelete.add(tweetId);
                        this.tweetFound(tweetObj);
                    }
                }
            }

            for (let key in currentObj) {
                if (currentObj.hasOwnProperty(key)) {
                    recurse(currentObj[key]);
                }
            }
        };

        recurse(obj);
    }

    checkFilter(tweet) {

        if (!tweet || !tweet.legacy) {
            return false;
        }

        const { id_str, full_text, entities } = tweet.legacy;

        // Check if tweet is in the ignore list
        if (id_str && (this.deleteOptions.tweetsToIgnore.includes(id_str) ||
            this.deleteOptions.tweetsToIgnore.includes(parseInt(id_str)))) {
            return false;
        }

        const keywordCheck = this.checkKeywords(full_text);
        const dateCheck = this.checkDate(tweet);


        // Check for URL-only deletion option
        if (this.deleteOptions.deleteMessageWithUrlOnly) {
            const hasUrls = entities && entities.urls && entities.urls.length > 0;
            return hasUrls && keywordCheck && dateCheck;
        }

        return keywordCheck && dateCheck;
    }
    checkKeywords(text) {
        if (!text) {
            return false;
        }

        if (this.deleteOptions.matchAnyKeywords.length === 0) {
            return true;
        }

        const result = this.deleteOptions.matchAnyKeywords.some(word => text.includes(word));
        return result;
    }

    checkDate(tweet) {
        if (!tweet.legacy || !tweet.legacy.created_at) {
            return false;
        }

        const tweetDate = new Date(tweet.legacy.created_at);
        tweetDate.setHours(0, 0, 0, 0);

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (tweetDate.getTime() === currentDate.getTime()) {
            return true;
        }

        if (tweetDate > currentDate) {
            return true;
        }

        if (tweetDate >= this.deleteOptions.afterDate && tweetDate <= this.deleteOptions.beforeDate) {
            return true;
        } else if (tweetDate < this.deleteOptions.afterDate) {
            this.stopSignal = true;
        }

        return false;
    }
    checkTweetOwner(obj, uid) {
        if (!obj) {
            return false;
        }

        if (obj.legacy && obj.legacy.retweeted === true && !this.deleteOptions.unretweet) {
            return false;
        }

        const directMatch = obj.user_id_str === uid;
        const legacyMatch = obj.legacy && obj.legacy.user_id_str === uid;
        const result = directMatch || legacyMatch;
        return result;
    }
    parseTweetsFromArchive(data) {
        try {
            return data.filter(item => {
                if (item.tweet && item.tweet.id_str) {
                    const isInReplyToExcludedUser = item.tweet.in_reply_to_user_id_str === this.userId;
                    const startsWithRT = item.tweet.full_text.startsWith('RT ');

                    const tweetObj = {
                        id: item.tweet.id_str,
                        text: item.tweet.full_text,
                        date: item.tweet.created_at
                    };

                    if (!isInReplyToExcludedUser
                        && ((this.deleteOptions.unretweet && startsWithRT) || (!this.deleteOptions.unretweet && !startsWithRT))
                        && this.checkFilterArchive(tweetObj)) {
                        console.log("DELETING:", item.tweet.full_text);
                        return true;
                    }
                }
                return false;
            }).map(item => item.tweet.id_str);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return [];
        }
    }

    getTwitterCookies() {
        return {
            ct0: this.csrfToken,
            twid: `u=${this.userId}`
        };
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

    setDeleteOptions(options) {
        this.deleteOptions = { ...this.deleteOptions, ...options };
    }

    async deleteTweets(idList) {
        const maxRetries = 1;
        const baseDelay = 100; // 10 seconds
        let deletedCount = 0;

        for (let index = 0; index < idList.length; index++) {
            const tweetId = idList[index];
            let retries = 0;

            while (retries < maxRetries) {
                try {
                    console.log(`Attempting to delete tweet ${tweetId} (Attempt ${retries + 1}/${maxRetries})`);
                    const response = await fetch(this.deleteTweetsResponseLink, {
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
                            "x-client-transaction-id": this.deleteTid,
                            "x-client-uuid": this.clientUuid,
                            "x-csrf-token": this.csrfToken,
                            "x-twitter-active-user": "yes",
                            "x-twitter-auth-type": "OAuth2Session",
                            "x-twitter-client-language": this.languageCode
                        },
                        "referrer": `https://x.com/${this.username}/with_replies`,
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": `{\"variables\":{\"tweet_id\":\"${tweetId}\",\"dark_request\":false},\"queryId\":\"VaenaVgh5q5ih7kvyVjgtg\"}`,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    });

                    const responseText = await response.text();
                    console.log(`Response for tweet ${tweetId}:`, responseText);

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}, response: ${responseText}`);
                    }

                    console.log(`Successfully deleted tweet ${tweetId}`);
                    this.tweetsToDelete.delete(tweetId);
                    deletedCount++;
                    break; // Exit the retry loop if successful
                } catch (error) {
                    console.error(`Error deleting tweet ${tweetId}:`, error);
                    retries++;
                    if (retries < maxRetries) {
                        const delay = baseDelay * Math.pow(2, retries);
                        console.log(`Retrying deletion of tweet ${tweetId} in ${delay / 1000} seconds...`);
                        await this.sleep(delay);
                    } else {
                        console.log(`Failed to delete tweet ${tweetId} after ${maxRetries} attempts. Moving to next tweet.`);
                    }
                }
            }

            console.log(`Processed ${index + 1}/${idList.length} tweets`);
            await this.sleep(5000); // Add a 5-second delay between tweet deletions
        }

        return deletedCount;
    }

    tweetFound(tweet) {
        console.log(`Tweet found - ID: ${tweet.rest_id}, Text: ${tweet.legacy.full_text}, Date: ${tweet.legacy.created_at}`);
    }

    checkFilterArchive(tweetObj) {
        const tweetDate = new Date(tweetObj.date);
        tweetDate.setHours(0, 0, 0, 0);

        if (tweetDate <= this.deleteOptions.afterDate || tweetDate >= this.deleteOptions.beforeDate) {
            return false;
        }

        if (this.deleteOptions.tweetsToIgnore.includes(tweetObj.id) ||
            this.deleteOptions.tweetsToIgnore.includes(parseInt(tweetObj.id))) {
            return false;
        }

        if (this.deleteOptions.deleteMessageWithUrlOnly) {
            const urlRegex = /(https?:\/\/[^\s]+)/g;
            if (!urlRegex.test(tweetObj.text)) {
                return false;
            }
        }

        return this.checkKeywords(tweetObj.text);
    }

    async startDeletionProcess() {
        try {
            if (this.deleteOptions.fromArchive) {
                console.log("Processing from archive...");
                // Implement archive processing logic here
            } else if (this.deleteOptions.deleteSpecificIdsOnly.length > 1 ||
                (this.deleteOptions.deleteSpecificIdsOnly.length === 1 && this.deleteOptions.deleteSpecificIdsOnly[0] !== "")) {
                await this.deleteTweets(this.deleteOptions.deleteSpecificIdsOnly);
            } else {
                let cursor = null;
                let isFinished = false;
                while (!isFinished && !this.stopSignal) {
                    const entries = await this.fetchTweets(cursor);
                    const result = await this.logTweets(entries);
                    if (result === "finished") {
                        isFinished = true;
                    } else {
                        cursor = result;
                    }
                    if (this.tweetsToDelete.size > 0) {
                        const deletedCount = await this.deleteTweets(Array.from(this.tweetsToDelete));
                        console.log(`Deleted ${deletedCount} tweets in this batch.`);

                        // Fetch tweets again to check for any remaining
                        console.log("Fetching tweets again to check for any remaining...");
                        cursor = null; // Reset cursor to start from the beginning
                        const checkEntries = await this.fetchTweets(cursor);
                        await this.logTweets(checkEntries);

                        if (this.tweetsToDelete.size > 0) {
                            console.log(`Found ${this.tweetsToDelete.size} more tweets to delete. Continuing the process.`);
                        } else {
                            console.log("No more tweets found to delete.");
                            isFinished = true;
                        }
                    }
                    await this.sleep(3000);
                }
            }
            return "Deletion process completed";
        } catch (error) {
            console.error("Error in deletion process:", error);
            return "Deletion process failed";
        }
    }
}