import config from 'common/config/config'
import stringTools from 'common/javascript/tools/stringTools'
import Vue from 'vue'

/*eslint-disable */
var CryptoAgent = "";

// Create ActiveX object according to the platform
function initCryptoAgent() {
    if (!config.cfcaEnable) return ''
    try {
        var eDiv = document.createElement("div");
        if (navigator.appName.indexOf("Internet") >= 0 || navigator.appVersion.indexOf("Trident") >= 0) {
            if (window.navigator.cpuClass == "x86") {
                eDiv.innerHTML = "<object id=\"CryptoAgent\" codebase=\"/static/CryptoKit.BuBi.x86.cab\" classid=\"clsid:7DCE86AA-3547-4D07-91BE-E688B04E0B12\" ></object>";
            }
            else {
                eDiv.innerHTML = "<object id=\"CryptoAgent\" codebase=\"/static/CryptoKit.BuBi.x64.cab\" classid=\"clsid:72507E64-C723-4320-BFFC-056F02B9DCDC\" ></object>";
            }
        } else {
            alert("仅支持IE浏览器");
            return;
        }
        // else {
        //     eDiv.innerHTML = "<embed id=\"CryptoAgent\" type=\"/static/npCryptoKit.Ultimate.x86\" style=\"height: 0px; width: 0px\">";
        // }
        document.body.appendChild(eDiv);
        CryptoAgent = document.getElementById("CryptoAgent");
    }
    catch (e) {
    	if (typeof e == 'string') {
    		throw e;
	    } else if (e.name == 'TypeError') {
	    	if (confirm('请下载、安装证书控件，并重启浏览器')) {
	    		if (navigator.appName.indexOf('Internet') >= 0 || navigator.appVersion.indexOf('Trident') >= 0) {
	    		if (window.navigator.cpuClass == 'x86') {
	    			window.open('/static/CryptoKit.BuBi.x86.cab');
	    			} else {
	    				window.open('/static/CryptoKit.BuBi.x64.cab');
	    			}
	    		} else {
	    			window.open('/static/npCryptoKit.Ultimate.x86.exe');
	    		}
	    	}
	    	return false;
	    } else {
	    	var message = CryptoAgent.CFCA_GetLastErrorDesc();
	    	throw message.indexOf('0x00000000') == -1 ? message : (e.number + '\n' + e.message);
	    }
    }
}

function setSM2CSPList(cspList){
	var bResult = CryptoAgent.SetSM2CSPList(cspList);
	return bResult;
}

// Select certificate
function selectCert(subjectDNFilter, issuerDNFilter, serialNumFilter, certFilter) {
    if (!config.cfcaEnable) return true
    certFilter = certFilter === false ? false : true
    if (certFilter) {
      // issuerDNFilter = sessionStorage.getItem('issuerDn') || ''
      // serialNumFilter = (sessionStorage.getItem('serialNo') || '').replace(/\D+/g,'')
    }
    try {
        subjectDNFilter  = subjectDNFilter || ''
        issuerDNFilter = issuerDNFilter || ''
        serialNumFilter = serialNumFilter || ''
        var bSelectCertResult = CryptoAgent.SelectCertificate(subjectDNFilter, issuerDNFilter, serialNumFilter);
        // Opera浏览器，NPAPI函数执行结果为false时，不能触发异常，需要自己判断返回值。
        if (!bSelectCertResult)
        {
            throw CryptoAgent.GetLastErrorDesc();
        }
        return true
    }
    catch (e) {
    	if (typeof e == 'string') {
    		throw e;
	    } else {
	    	var message = CryptoAgent.GetLastErrorDesc();
        if (e.number == -1610149887) {
          let info = {message: '请插入证书后登录'}
          new Vue().$bus.$emit('dialog-error', info)
        } else {
          alert(message)
        }
        throw message
	    }
    }
}

// Get certificate information
function getCertInfo(InfoTypeID) {
    if (!config.cfcaEnable) return ''
    try {
        var InfoContent = "";
        InfoContent = CryptoAgent.GetSignCertInfo(InfoTypeID);
        // Opera浏览器，NPAPI函数执行结果为false时，不能触发异常，需要自己判断返回值。
        if (!InfoContent) {
            var errorDesc = CryptoAgent.GetLastErrorDesc();
            alert(errorDesc);
            return;
        }
        return InfoContent;
    } catch (e) {
      var message = CryptoAgent.GetLastErrorDesc();
      alert(message)
      throw message
    }
}

// Get certificate information
function getInfo(InfoTypeID) {
  if (!config.cfcaEnable) {
    return {
        issuerDN: '',
        serialNumber: '',
        subjectDN: '',
        SubjectCN: ''
    }

  }
  const SubjectDN = CFCATools.getCertInfo('SubjectDN')
  const SerialNumber = CFCATools.getCertInfo('SerialNumber')
  const IssuerDN = CFCATools.getCertInfo('IssuerDN')
  const SubjectCN = CFCATools.getCertInfo('SubjectCN')

  return  {
    issuerDN: IssuerDN,
    serialNumber: SerialNumber,
    subjectDN: SubjectDN,
    SubjectCN: SubjectCN
  }
}

// Sign message
function sign(selectedAlg, source, signType) {
    if (!config.cfcaEnable) return ''
    try {
        var signature = "";

        if ("Attach" == signType) {
            // PKCS#7 Attach
            signature = CryptoAgent.SignMsgPKCS7(source, selectedAlg, true);
        }
        else if ("Detach" == signType) {
            // PKCS#7 Detach
            signature = CryptoAgent.SignMsgPKCS7(source, selectedAlg, false);
        }
        else {
            // PKCS#1
            signature = CryptoAgent.SignMsgPKCS1(source, selectedAlg);
        }
        if (!signature) {
          var errorDesc = CryptoAgent.GetLastErrorDesc();
          alert(errorDesc);
          return;
        }
        return signature;
    } catch (e) {
      var message = CryptoAgent.GetLastErrorDesc();
      alert(message)
      throw message
    }
}

function verifyPKCS7(signature, signaturetype) {
    try {
    	var bResult = false;
        bResult = CryptoAgent.VerifyMsgSignaturePKCS7Attached(signature, signaturetype);
        if (!bResult) {
            throw CryptoAgent.GetLastErrorDesc();
        }
		// Opera浏览器，NPAPI函数执行结果为false时，不能触发异常，需要自己判断返回值。
        if (!signature) {
            throw CryptoAgent.GetLastErrorDesc();
        }
        return bResult;
    } catch (e) {
    	if (typeof e == 'string') {
    		throw e;
	    } else {
	    	var message = CryptoAgent.GetLastErrorDesc();
	    	throw message.indexOf('0x00000000') == -1 ? message : (e.number + '\n' + e.message);
	    }
    }
}

function verifyPKCS7Detached(signature, signaturetype, source) {
    try {
    	var bResult = false;
        bResult = CryptoAgent.VerifyMsgSignaturePKCS7Detached(signature, signaturetype, source);
        if (!bResult) {
            throw CryptoAgent.GetLastErrorDesc();
        }
        return bResult;
    }
    catch (e) {
    	if (typeof e == 'string') {
    		throw e;
	    } else {
	    	var message = CryptoAgent.GetLastErrorDesc();
	    	throw message.indexOf('0x00000000') == -1 ? message : (e.number + '\n' + e.message);
	    }
    }
    return bResult;
}

function verifyPKCS1(signatureAlg, signature, source, base64cert, hashAlg) {
    try {
    	var bResult = false;
        var bWithZValue = true;

        bResult = CryptoAgent.VerifyMsgSignaturePKCS1(signature, signatureAlg, source, hashAlg, base64cert);
        if (!bResult) {
            throw CryptoAgent.GetLastErrorDesc();
        }
        return bResult;
    } catch (e) {
    	if (typeof e == 'string') {
    		throw e;
	    } else {
	    	var message = CryptoAgent.GetLastErrorDesc();
	    	throw message.indexOf('0x00000000') == -1 ? message : (e.number + '\n' + e.message);
	    }
    }
}

function initRadio(rName,rValue){
    var rObj = document.getElementsByName(rName);

    for(var i = 0;i < rObj.length;i++){
        if(rObj[i].value == rValue){
            rObj[i].checked =  'checked';
        }
    }
}

function getSelectedItemValue(itemName) {
    var ele = document.getElementsByName(itemName);
    for (i = 0; i < ele.length; i++) {
        if (ele[i].checked) {
            return ele[i].value;
        }
    }
}

function defaultSign (source, noBase64, selectedAlg, signType) {
  signType = signType || 'Detach'
  selectedAlg = selectedAlg || 'SHA-256'
  noBase64 = noBase64 || false // 不传，默认为base64编码
  source =  noBase64 ? stringTools.strToBase64(source) : source.replace(/\-/g, '+')
  let signStr = sign(selectedAlg, source, signType)
  return signStr.replace(/\+/g, '-')
}

const CFCATools = {
  initCryptoAgent: initCryptoAgent,
  setSM2CSPList: setSM2CSPList,
  selectCert: selectCert,
  getCertInfo: getCertInfo,
  sign: sign,
  defaultSign: defaultSign,
  verifyPKCS7: verifyPKCS7,
  verifyPKCS1: verifyPKCS1,
  initRadio: initRadio,
  getSelectedItemValue: getSelectedItemValue,
  getInfo: getInfo
}

export default CFCATools
