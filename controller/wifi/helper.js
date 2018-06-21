

const keyValueRgx = new RegExp("[a-zA-Z0-9_]*=[a-zA-Z0-9:_-]*")
const KEY_STATE = "wpa_state";
const STATUS = {
    CONNECTED: "CONNECTED",
    DISCONNECTED: "DISCONNECTED",
    OTHER: "OTHER"
}
/**
 * 
 * @param {string} status
 * @returns {status: CONNECTED | DISCONNECTED | OTHER, data} 
 */
const parseWifiStatus = (status) => {
    let statusOb = status.split('\n').filter((value) => keyValueRgx.test(value)).reduce((res, value) => {
        let values = value.split("=");
        res[values[0]] = values[1];
        return res;
    }, {});
    switch(statusOb[KEY_STATE]) {
        case "COMPLETED": return connected(statusOb, status);
        case "DISCONNECTED": return disconenected(statusOb, status);
        default: return other(statusOb, status)
    }
}

const connected = (statusObj) => {
    return {
        status: STATUS.CONNECTED,
        data: {
            ssid: statusObj[ssid],
            key_mgmt: statusObj[key_mgmt],
            address: statusObj[address],
        }
    }
}
const disconenected = (statusObj, status) => {
    return {
        status: STATUS.DISCONNECTED,
        data: status
    }
}
const other = (statusObj, status) => {
    return {
        status: STATUS.OTHER,
        data: status
    }
}


module.exports = {
    parseWifiStatus: parseWifiStatus
}