# What is this?

Have your users verify with a captcha using the new discord buttons

# Installation

`npm i discord-button-captcha`

Then ...

```
const Captcha = require('discord-button-captcha')

const captcha = new Captcha(client, {
    roleID: "Role ID Here",
    channelID: "Text Channel ID Here",
});
```