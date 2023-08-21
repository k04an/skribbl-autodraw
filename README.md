# Skribbl.io autodraw

Autodraw software for [Skribbl.io](https://skribbl.io/). 

## How to use

First, you need to copy this repo and install dependencies
```bash
git clone https://github.com/k04an/skribbl-autodraw.git
cd skribbl-autodraw
npm install
```

After it's done, you can launch the built-in browser with all scripts set
```bash
npm start
```
or
```bash
node server
```

Also you can specify link, that browser will open. Use that to connect to private rooms
```bash
node server <private_room_link>
```

When browser started, it will open skribbl page and inject client code, which will draw following window
![Client window](https://i.imgur.com/z8r1lkS.png)

Then, find an image you want to draw, right click on it, and choose "Copy image" or copy an image from you computer. Go back to skribbl page and press `ctrl + v`

![Successful upload](https://i.imgur.com/9DlfeVE.png)

If you get an error, then you probably copied not a `.jpg` or `.png` file.

Then wait for your turn and click "Start drawing" and enjoy.