FROM node:14.18.2-alpine
# 修正字符集，以及设置时间
ENV LANG=en_US.utf8
ADD localtime /etc/
ADD package.json /app/dockerbase/
RUN cd /app/dockerbase && npm install --only=prod -g --registry=https://registry.npmmirror.com && ln -s /app/dockerbase/node_modules /app/node_modules

