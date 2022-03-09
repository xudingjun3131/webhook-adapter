FROM xudingjun3131/webhook-adapter-base:v20220307
ADD index.js /app/
ADD prometheusalert /app/prometheusalert
EXPOSE 80
ENTRYPOINT ["node", "/app/index.js", "--port=80"]
