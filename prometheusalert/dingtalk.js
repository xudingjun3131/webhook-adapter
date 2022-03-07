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



var CryptoJS = require("crypto-js");
exports.template = function(body) {
    //钉钉群机器人 webhook api 文档 https://ding-doc.dingtalk.com/doc#/serverapi2/qf2nxq
    var alerts = body.alerts;
    var content = alerts.map(
        alert => {
            return [`# Name:${alert.labels.alertname}`, "## Labels:"]
            .concat(Object.entries(alert.labels).map(label => `- ${label[0]}:${label[1]}`))
            .concat("## Annotations:")
            .concat(Object.entries(alert.annotations).map(annotation => `- ${annotation[0]}:${annotation[1]}`))
            .concat(`## 故障时间:${formatTimeStamp((Date.parse(alert.startsAt)))}`)
            .concat(`## 恢复时间:${formatTimeStamp((Date.parse(alert.endsAt)))}`)
            .join("\n")
        }
    ).concat(`**Status:${body.status}**`).join("\n\n");
    return {
        msgtype: "markdown",
        markdown: {
            title: "ALERT",
            text: content
        }
    }
}

exports.signUrl = function(strurl) {
    var url = new URL(strurl);
    if(!url.hash.startsWith("#")) {
        return strurl;
    }
    var secret = url.hash.substr(1);
    var timestamp = new Date().getTime();
    var stringToSign = `${timestamp}\n${secret}`;
    var hash = CryptoJS.HmacSHA256(stringToSign, secret);
    var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
    url.hash = "";
    return `${url.toString()}&timestamp=${timestamp}&sign=${encodeURIComponent(hashInBase64)}`;
}