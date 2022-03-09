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
            return [`# Name:${alert.labels.alertname}`, "## Labels:"]
            .concat(Object.entries(alert.labels).map(label => `<font color="comment">${label[0]}:</font>${label[1]}`))
            .concat("## Annotations:")
            .concat(Object.entries(alert.annotations).map(annotation => `<font color="comment">${annotation[0]}:</font>${annotation[1]}`))
            .concat(`###### 故障时间:<font color="warning">${formatTimeStamp((Date.parse(alert.startsAt)))}</font>`)
            .concat(`###### 恢复时间:<font color="info">${formatTimeStamp((Date.parse(alert.endsAt)))}</font>`)
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