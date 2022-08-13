const Parser = require('rss-parser');
const { WebhookClient } = require('discord.js');
const Config = require('./config.json')
const parser = new Parser();
var SaveTime;

const WebClient = new WebhookClient({ id: Config.ID, token: Config.Token });

// Main function
const CheckRSS = async() => {
    parser.parseURL(Config.NewsURL).then((NewsFeed) => {
        const NewsItems = NewsFeed.items[0]
        let date = new Date().toLocaleString('fi-FI')

        if (NewsItems.enclosure?.url == false) {
            var FixedURL = NewsItems.enclosure.url.substring(
                NewsItems.enclosure.url.lastIndexOf("/") + 1
            );
        }

        if (SaveTime !== NewsItems.pubDate) {
            const Embed = {
                color: 46280,
                title: NewsItems.title,
                url: NewsItems.link,
                author: {
                    name: NewsItems.categories[0].replace(/\b\w/g, e => e.toUpperCase()),
                    icon_url: Config.EmbedImageURL
                },
                description: NewsItems.content,
                Image: {
                    url: NewsItems.enclosure?.url ? `https://images.cdn.yle.fi/image/upload/${FixedURL}` : 'https://societaldesign.aalto.fi/wp-content/uploads/2021/03/share_image_v1-1024x532.png',
                },
                footer: {
                    text: date,
                    icon_url: Config.EmbedImageURL,
                },
            };
        
            WebClient.send({
                username: 'Yle Uutiset',
                avatarURL: Config.AvatarURL,
                embeds: [Embed],
            }).catch((e) => {
                console.log(e)
            })
            SaveTime = NewsItems.pubDate;
        }

    }).catch((e) => {
        console.log(e)
    });
}

// Installation
const Init = () => {
    CheckRSS();
    setInterval(CheckRSS, Config.RefreshTime * 60000)
}

Init();