FROM node:boron
COPY . .
EXPOSE 3000
RUN npm install
CMD ["npm", "start"]
