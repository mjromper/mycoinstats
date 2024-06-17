# Stage 1: 
FROM node:20.14-alpine AS sources
    
WORKDIR /app
ADD . ./

EXPOSE 3000

CMD ["node", "server.js"]