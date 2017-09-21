FROM node:boron
EXPOSE 3000
RUN npm install
CMD ["npm", "start"]
