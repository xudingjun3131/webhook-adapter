# webhook-adapter  node启动
```bash
node index.js --port=8080 --adapter=./prometheusalert/wx.js=/wx=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key={key} --adapter=./prometheusalert/dingtalk.js=/dingtalk=https://oapi.dingtalk.com/robot/send?access_token={token}#{secret}
```

## docker 启动
```bash
docker run --name webhook-adapter -p 8080:80 -d guyongquan/webhook-adapter \
--adapter=/app/prometheusalert/wx.js=/wx=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key={key} \
--adapter=/app/prometheusalert/wx_jvm.js=/jvm=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key={key} \
--adapter=/app/prometheusalert/wx_nginx.js=/nginx=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key={key} \
--adapter=/app/prometheusalert/dingtalk.js=/dingtalk=https://oapi.dingtalk.com/robot/send?access_token={token}#{secret} 
```

## alertmanager 配置
```bash
route:
  receiver: "wechat"
  group_wait: 3s
  group_interval: 5m
  repeat_interval: 60s
  group_by: ["alertname", "job"]
  routes:
  - match_re:
      name: "jmx"
    receiver: "wechat_jvm"
    group_wait: 10s
  - match:
      env: "me"
    receiver: "webhook_me"
    group_wait: 10s
  - match_re:
      name: "nginx"
    receiver: "wechat_nginx"
    group_wait: 10s
receivers:
- name: "wechat"
  webhook_configs:
  - url: http://192.168.0.45:8080/adapter/wx
    send_resolved: true
- name: "wechat_jvm"
  webhook_configs:
  - url: http://192.168.0.45:8080/adapter/jvm
    send_resolved: true
- name: "wechat_nginx"
  webhook_configs:
  - url: http://192.168.0.45:8080/adapter/nginx
    send_resolved: true
```
