FROM node:24-alpine
WORKDIR /app
COPY src ./src
RUN mkdir -p /data && chown node:node /data
USER node
ENV DATA_DIR=/data NODE_ENV=production
CMD ["node", "--disable-warning=ExperimentalWarning", "src/main.mjs"]
