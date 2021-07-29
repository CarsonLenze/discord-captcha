# What is this?

Have your users verify with a captcha using the new discord buttons

# Installation

`npm i discord-button-captcha`

Then ...

```
const Captcha = require('discord-button-captcha')

const captcha = new Captcha(client, {
    roleID: "869659381040574515",
    channelID: "869671043650957312",
});
```