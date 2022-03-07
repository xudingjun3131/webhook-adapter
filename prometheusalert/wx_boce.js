const formatTimeStamp = (timeStamp) => {
    var date = new Date(timeStamp);
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
    h = (date.getHours() < 10 ? '0'+(date.getHours()) : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? '0'+(date.getMinutes()) : date.getMinutes()) + ':';
    s = (date.getSeconds() < 10 ? '0'+(date.getSeconds()) : date.getSeconds());
    return Y+M+D+h+m+s
}


exports.template = function(body) {
    //企业微信群机器人API，https://work.weixin.qq.com/help?person_id=1&doc_id=13376#markdown%E7%B1%BB%E5%9E%8B
    //prometheus alert manager webhook ： https://prometheus.io/docs/alerting/configuration/#webhook_config
    var alerts = body.alerts;
    var content = alerts.map(
        alert => {
        return [`> # ${alert.status === 'firing' ? `告警通知`:`恢复通知`}`,`###### 告警类型:<font color="warning">${alert.labels.alertname}</font>`]
        .concat(`###### 告警级别:<font color="warning">${alert.labels.severity}</font>`)
        .concat(`###### 告警环境:<font color="warning">${alert.labels.exported_env}</font>`)
        .concat(`###### 容器区域:<font color="warning">${alert.labels.area}</font>`)
        .concat(`###### 告警服务:<font color="comment">${alert.labels.service_name}</font>`)
        .concat(`###### 告警地址:<font color="comment">${alert.labels.api_uri}</font>`)
        .concat(`###### 告警实例:<font color="comment">${alert.labels.node}</font>`)
        .concat(`###### 故障时间:<font color="warning">${formatTimeStamp((Date.parse(alert.startsAt)))}</font>`)
        .concat(`###### 恢复时间:<font color="info">${formatTimeStamp((Date.parse(alert.endsAt)))}</font>`)
        .concat(`###### 告警来源:<font color="comment">${alert.labels.monitor}</font>`)
        .concat(`###### 告警原因:<font color="warning">${alert.annotations.summary}</font>`)
        .concat(`###### 告警描述:${alert.annotations.description}`)
        .join("\n")
        }
    ).concat(`<font color="comment">告警状态:</font><font color="${body.status === 'firing' ? 'warning' : 'info'}">${body.status}</font>`).join("\n\n");
    return {
        
        msgtype: "markdown",
        markdown: {
            content: content
        }
    }
}
