# What is this?

Have your users verify with a captcha using the new discord buttons

# Installation

`npm i discord-button-captcha`

Then ...

```
const Captcha = require('discord-button-captcha')

const captcha = new Captcha(client, {
    roleID: 'Role ID Here',
    channelID: 'Text Channel ID Here',
});
```

# Events

You can see when a user has failed or compleated a captcha whith these events

```
captcha.on('success', (info) => {
  console.log(info);
});

captcha.on('failure', (info) => {
  console.log(info);
});
```

The info will look somthing like this

```
{
  succeeded: true,
  trys: 1,
  response: 'jhhbq',
  correct_response: 'jhhbq',
  user: User {
    id: '404336524491227149',
    system: null,
    locale: null,
    flags: UserFlags { bitfield: 256 },
    username: 'Carson',
    bot: false,
    discriminator: '6473',
    avatar: 'ff2cb240891c52d597f75e4fd412a6d7',
    lastMessageID: '871206024835661834',
    lastMessageChannelID: '869671043650957312'
  }
}
```