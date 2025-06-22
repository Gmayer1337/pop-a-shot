# Quiz & Swish

A modded Pop-A-Shot game for Center Grove FTC Robotics outreach using a Raspberry Pi.

This program is uses:
 * [Raspberry Pi OS](https://www.raspberrypi.com/software/) and Chromium web browser for the game server and UI
 * [Node.js](https://nodejs.org/en) for the server application framework
 * [Node.js Express](https://expressjs.com/), a web server host framework
 * [Socket.IO](https://socket.io/) to send real-time messages between Node (server) and web-based game (client)
 * [OnOff](https://github.com/fivdi/onoff) for Raspberry Pi GPIO access and interrupt detection
 * [p5.JS](https://p5js.org/) to draw the game graphics


Start this project using
```
npx supervisor ./bin/www
```

Webserver runs on http://localhost:3000/

Remote the files over to the Raspberry Pi using (change ~/src/pop-a-shot to your source code location)
```
rsync -avz --exclude 'node_modules' ~/src/pop-a-shot  user@pi_ip_address:/home/user/
```

Observe Raspberry Pi GPIO using
```
watch -n.2 gpio readall
```

Command line to launch Chromium in 'kiosk mode'
```
Microsoft Edge on Mac % "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge" http://localhost:3000 --kiosk  --edge-kiosk-type=public-browsing --no-first-run
```

## Team game brainstorming ideas
* 8-bit graphics & fonts
* Loading screens for no reason
  * With loading screen tips & animation!
    * Such as "Only shoot basket when correct answer is displayed"
   * With DLC!
* Call it "Pop-a-shot: Math Edition"
  * Or "Disaster Pop-a-shot"
* Other game ideas
  * Science & STEM trivia
  * Robotics trivia
* Switch between 1 or 2 players screen
* Single player ideas
  * T/F or right/wrong baskets
    * Wrong - lose a point
* Two player ideas
    * Points when basket is made & correct answer is shown
    * Use keyboard to make selection & then shoot
    * Back-and-forth gameplay vs. rapidfire
• You win screen
* Leader board

## Useful links we used
* https://raspberrypi-guide.github.io/filesharing/filesharing-raspberry-pi
* https://stackoverflow.com/questions/78173749/use-raspberry-pi-4-gpio-with-node-js/78184108#78184108
* https://raspberrypi.stackexchange.com/questions/40631/setting-up-a-kiosk-with-chromium
* https://stackoverflow.com/questions/21542304/how-to-start-a-node-js-app-on-system-boot
* https://stackoverflow.com/questions/36172442/how-can-i-get-npm-start-at-a-different-directory


