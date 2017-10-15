# Pull base image.
FROM ubuntu:14.04

# Install debug tools
RUN \
  sed -i 's/# \(.*multiverse$\)/\1/g' /etc/apt/sources.list && \
  apt-get update && \
  apt-get -y upgrade && \
  apt-get install -y build-essential && \
  apt-get install -y software-properties-common && \
  apt-get install -y byobu curl git htop man unzip vim wget && \
# Install Python.
  apt-get install -y python python-dev python-pip python-virtualenv && \
# Install Java.
  apt-get install -y openjdk-7-jdk && \
  rm -rf /var/lib/apt/lists/*

# Install NodeJS
RUN \
  curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash - && \
  sudo apt-get install -y nodejs

# Define commonly used JAVA_HOME variable
ENV JAVA_HOME /usr/lib/jvm/java-7-openjdk-amd64

WORKDIR /usr/src/app
COPY package.json .
RUN npm install

# Bundle app source
COPY . .
RUN npm rebuild && npm run favicon && npm run gulp build
CMD [ "npm", "start" ]
