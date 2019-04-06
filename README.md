![](http://en.gravatar.com/userimage/107370100/a08594145564536138dfaaf072c7b241.png?size=200)

# Campus Manager

[![CircleCI](https://circleci.com/gh/AustinCodingAcademy/campus-manager/tree/master.svg?style=svg)](https://circleci.com/gh/AustinCodingAcademy/campus-manager/tree/master)

## Development
You first need to setup your environment.

### Machine Dependencies
1. Download and install [Node.js](https://nodejs.org/en/) (at least version 8.9.4)

2.
  * Mac OSX
    1. Install [Xcode](https://itunes.apple.com/us/app/xcode/id497799835)
      * Open it and accept the terms
    1. Install [Homebrew](http://brew.sh/)
    1. Install MongoDB `brew install mongodb`
    1. Create MongoDB data directory `sudo mkdir -p /data/db`
    1. Correct permissions `sudo chmod -R 0755 /data/db && sudo chown $USER /data/db`
    1. Start MongoDB `mongod`
      * Leave this running or just close the terminal window while running
      * You'll have to do this step every time you restart your computer
    1. Install Python 2 `brew install python@2`
  * Windows
    1. Install [Chocolatey](https://chocolatey.org/install)
    1. Install MongoDB `choco install mongodb -y`
    1. Create MongoDB data directory `mkdir /data/db`
    1. Start MongoDB `mongod.exe`
      * Leave this running or just close the terminal window while running
      * You'll have to do this step every time you restart your computer
    1. Install VCBuild Tools `choco install vcbuildtools -y`
    1. Install Python 2 `choco install python2 -y`
  * Linux
    1. Install MongoDB `sudo apt install mongodb`
    1. Create MongoDB data directory `sudo mkdir -p /data/db`
    1. Correct permissions `sudo chmod -R 0755 /data/db && sudo chown $USER /data/db`
    1. Start MongoDB `mongod`
      * Leave this running or just close the terminal window while running
      * You'll have to do this step every time you restart your computer

### App Dependencies
After forking, cloning, and navigating into repository:

1. Check to see if `python --version` returns Python 2.*
  * If not and on Mac, run `alias python=python2` and try again
1. Install dependencies `yarn`
1. Duplicate `.env.example` and name it `.env`
1. Leave `npx gulp` running in one terminal session
1. Navigate to `http://localhost:3000/register` to create a user

## Testing

1. Download [Google Chrome](https://www.google.com/chrome/browser/desktop/index.html)
1. Install Java JDK
  * Mac OSX `brew cask install java`
  * Windows `choco install jdk7`
  * Linux `sudo apt install openjdk-8-jdk-headless`
1. Run `yarn test`
