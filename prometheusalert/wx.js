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
        .concat(`###### <font color="warning">告警级别:${alert.labels.severity}</font>`)
        .concat(`###### 告警容器:<font color="warning">${alert.labels.container}</font>`)
        .concat(`###### 实例信息:<font color="warning">${alert.labels.instance}</font>`)
		.concat(`###### 节点信息:<font color="warning">${alert.labels.node}</font>`)
        .concat(`###### Pod信息:<font color="comment">${alert.labels.pod}</font>`)
        .concat(`###### 命名空间:<font color="comment">${alert.labels.namespace}</font>`)
        .concat(`###### 故障时间:<font color="warning">${formatTimeStamp((Date.parse(alert.startsAt)))}</font>`)
        .concat(`###### 恢复时间:<font color="info">${formatTimeStamp((Date.parse(alert.endsAt)))}</font>`)
        .concat(`###### 告警原因:<font color="warning">${alert.annotations.summary}</font>`)
        .concat(`###### 告警描述:<font color="warning">${alert.annotations.description}</font>`)
        .concat(`###### 告警说明:<font color="warning">${alert.annotations.runbook_ur}</font>`)
        .join("\n")
        }
    ).concat(`<font color="comment">Status:</font><font color="${body.status === 'firing' ? 'warning' : 'info'}">${body.status}</font>`).join("\n\n");
    return {
        
        msgtype: "markdown",
        markdown: {
            content: content
        }
    }
}
