## Description
Severless Social Media App using Lambda, API Gateway, DynamoDB and Cognito

### Features
ALL V1, V2, V3 Features

Tagging function added during posts, with notifications\
Profile Descriptions Added

## Current Feature list
Posts, Profile Pictures, Likes/ Unlikes, Notifications, Following/unfollowing, Profiles, post feed, Descriptions, Tagging

## Technology used
React FrontEnd, Cognito authentication, API Gateway, DynamoDB, Lambda, S3

## Issues
Duplicate API requests on unlike\
Profile page relies on a post to be created (gets friendlyname from first post)\
Feed page currently gets all post, working lambda function to get posts from only the followed users but I believe this lambda could be done a better way as this requires a large amount of api calls and queries to complete

## Features in next release
Chat
