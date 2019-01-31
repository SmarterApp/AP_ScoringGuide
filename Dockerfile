FROM node:8.4
ENV NODE_ENV="production"

# Install wkhtmltopdf
COPY wkhtmltopdf /usr/bin/
WORKDIR /usr/bin
RUN chmod a+x wkhtmltopdf
RUN apt-get update
RUN apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
    libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
    libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
    libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
    ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget

# Install server deps
COPY server/package.json /usr/src/server/
WORKDIR /usr/src/server
RUN npm install --production
RUN npm install cheerio

# Install client deps
COPY client/package.json /usr/src/client/
WORKDIR /usr/src/client
RUN npm install --production

# Copy files (already compiled)
WORKDIR /usr/src
COPY . .

EXPOSE 3000:3000

# Run
WORKDIR /usr/src/server
CMD ["npm", "run", "start"]
