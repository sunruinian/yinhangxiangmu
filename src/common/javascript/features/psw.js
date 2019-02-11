/**
 * 密码加密控件相关函数
 * @create 2018-01-11
 * @author cl
 * @version 1.0
 */

 /*eslint-disable */
 // ar _fld_ = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();

var PE_INVALID_STATUS = "服务器无效响应。状态码: ";
var PE_INVALID_CONTENT = "服务器无响应";
var PE_INVALID_TIMEOUT = "请求超时。可能是网络出现问题或其他问题。不能确定系统是否已处理刚才提交的请求。";

var PE_STATE_LOADING = "装载中...";
var PE_STATE_LOADED = "正在发送...";
var PE_STATE_INTERACTIVE = "正在接收...";

var PE_DIGITAL_SIGN_ERROR = "请先下载安全控件，再从新做此交易。";
var PE_SECURITY_INPUT_ERROR = "输入控件错误：";

var PE_TIMEOUT= 300000

var WIN_32_ACTIVEX_VERSION = 2003009011;																//Windows系统下32位控件版本号，例如2.4.1.3版本号则为2004001003
var WIN_64_ACTIVEX_VERSION = 2003009011;																//Windows系统下64位控件版本号，例如2.4.1.3版本号则为2004001003
var WIN_PLUGIN_VERSION = 2003009011;																	//Windows系统下插件版本号，例如2.4.1.3版本号则为2004001003
var MAC_PLUGIN_VERSION = 2003009011;																	//Mac系统下插件版本号，例如2.4.1.3版本号则为2004001003
var WIN_SETUP_PATH = "/static/BankGY_Input.exe";														//Windows系统安装程序下载路径
var MAC_SETUP_PATH = "ocx/gyccb/PowerEnterGYCCB.zip";													//Mac系统安装程序下载路径
var _app = navigator.appName;
var LocalObjVersion="";
var UtilCtrlClsid = "clsid:69E4A833-B450-41DB-BAF5-4BE0153B9D22";
var CtlName = "POWERENTERGYCCB.PowerUtilityXGYCCBCtrl.1";
var MIME = "application/x-vnd-csii-powerenter-gyccb";
var PowerEnterPluginDescription = "PowerEnter Plug-in for GYCCB";
var _pk = "2F4C1418B45360CB74092C1D20F5FFEEECBA200F2762BB00E306B2EF25E350310CCD7FA76A85BCA61614199F2C7BDDC4181C0F75F15C5CC7FF610B3433C3953E";

// 组装object对象所需参数
var ocodeBase = "ocx/gyccb/PowerEnterGYCCB.CAB#version=2.3.9.18";
var oclsId = "clsid:989186FD-801F-4FD7-AB65-4139E0A0E704";
var ocfg = {"width":330,"height":32,"minLength":6,"maxLength":25,"maskChar":"#","backColor":"#FFFFFF","textColor":"#FF0000","borderColor":"#7F9DB9","accepts":"[\\w!@#\\$%\\^&\\*\\(\\)\\-=\\+\\|\\[\\]\\{\\};:'`\\?\\/.,<>~]{6,}"};
var ooid = "powerpass"

 // 是否是ie浏览器
 function isIE() {
 	if (navigator.appName == 'Microsoft Internet Explorer' || navigator.userAgent.indexOf("Trident")>0)
 		return true;
 	else
 		return false;
 }

// 不同系统下载路径
 function getDownLoadPath()
 {
 	if((navigator.platform == "Win32") || (navigator.platform == "Win64") || (navigator.platform == "Windows"))
 	{
 		return WIN_SETUP_PATH;		//Windows OS
 	}
 	else if((navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel"))
 		return MAC_SETUP_PATH;		    	//MAC OS

 	return WIN_SETUP_PATH;
 }

 // 获取不同系统下控件的版本号
 function getObjVersion()
{
    if((navigator.platform == "Win64" || navigator.cpuClass == "x64")){
        if (isIE())
            return WIN_64_ACTIVEX_VERSION;         // Windows系统下64位控件版本
        else
            return WIN_PLUGIN_VERSION;             // Windows系统下插件版本
     }else if((navigator.platform == "Win32") || (navigator.platform == "Windows")){
        if (isIE())
            return WIN_32_ACTIVEX_VERSION;         // Windows系统下32位控件版本
        else
            return WIN_PLUGIN_VERSION;             // Windows系统下插件版本
     }else if((navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel")){
     	return MAC_PLUGIN_VERSION;		  		  // Mac系统下插件版本
     }
     return "";
}

// 获取本地安装控件的版本
function  getLocalObjVersion()
{
	if(LocalObjVersion == "")
	{
		try{
			LocalObjVersion = PEGetElement("versionObj").getVersion();
		}catch(e){
			LocalObjVersion = getObjVersion();
		}
	}
	return LocalObjVersion;
}

function isRegisteredPowerEnter(){
	try{
		if (isIE()){
			new ActiveXObject(CtlName);
		}else{
			var powerEnterPlugin = navigator.plugins[PowerEnterPluginDescription];
			if(powerEnterPlugin == null)
				return false;
		}
	}catch(e){
    alert(e)
		return false;
	}
	return true;
}

// 没有安装控件情况下的下载路径
 function getPEXSetupUrl(oid)
{
	var DownloadPath = getDownLoadPath();
	var ObjVersion = getObjVersion();

	var tempSetupUrl = "";
	if(isRegisteredPowerEnter()==false){
    tempSetupUrl = "<a href='"+DownloadPath+"' id='"+oid+"'  style='font:12px sans-serif;line-height:18px;color:#06F!important;width:162px;height:22px;display:inline-block;text-align:center;cursor:pointer;text-decoration:none;outline:none;'>请点击下载安全控件</a>";
	}else{
		var LocalObjVersion = PSWTools.getLocalObjVersion();
		if(LocalObjVersion < ObjVersion){
			tempSetupUrl = '<a href="'+DownloadPath+'" id="'+oid+'" onmouseover="downloadLinkOver(this.id);" onmouseout="downloadLinkOut(this.id);" style="font:12px sans-serif;border:1px solid #7F9DB9;line-height:22px;color:#06F!important;width:162px;height:22px;display:inline-block;text-align:center;cursor:pointer;text-decoration:none;outline:none;">点击此处更新安全控件</a>';
		}
	}
  return tempSetupUrl;
}

// ie下组装object内容
function PEWriteObject(codeBase, clsId, oid, cfg) {
	var htmlContent= '<object id="' + oid + '" classid="' + clsId
		+ '" width="' + cfg.width + '" height="' + cfg.height
		+ '" style="width:' + cfg.width + 'px;height:' + cfg.height + 'px">';
	for (var name in cfg)
		htmlContent+='<param name="' + name + '" value="' + cfg[name] + '">';
	htmlContent+='</object>';
	return htmlContent;
};
// 非ie下组装object内容
function PEWritePluginObject(type, oid, cfg) {
	var htmlContent = '<object id="' + oid + '" type="' + type
		+ '" width="' + cfg.width + '" height="' + cfg.height
		+ '" style="width:' + cfg.width + 'px;height:' + cfg.height + 'px">';
	for (var name in cfg)
		htmlContent = htmlContent + '<param name="' + name + '" value="' + cfg[name] + '">';
	htmlContent += '</object>';

	return htmlContent;
}
// 控件样式参数的处理
function powerConfig(args) {
  var defaults = { "width":150, "height":22, "maxLength":12, "minLength":6, "maskChar":"#", "backColor":"#ECE9D8", "textColor":"#FF0000", "borderColor":"#7F9DB9", "accepts":"\\w{0,}" };
 for (var p in args)
   if (args[p] != null) defaults[p] = args[p];
 return defaults;
}

// 返回object对象
 function PEWritePassObject(codeBase, clsId, oid, cfg) {
   codeBase = codeBase || ocodeBase
   clsId = clsId || oclsId
   oid = oid || ooid
   cfg = powerConfig(cfg || ocfg)

	if (!oid || typeof(oid) != "string") {
		alert("writePassObj Failed: oid is required!");
		return "";
	} else {
    var tempPassHtml = getPEXSetupUrl(oid);
		// var tempPassHtml = "";
		if(tempPassHtml == "")
		{
			if (isIE())
			{
        tempPassHtml = PEWriteObject(codeBase, clsId, oid, cfg);
			}
			else
			{
				tempPassHtml = PEWritePluginObject(MIME, oid, powerConfig(cfg));
			}
		}
		return tempPassHtml;
	}
};
// 密码加密
function getSM2IBSPassword (powerpass, pubKey) {
  pubKey = pubKey || _pk
  var ts = new Date().getTime()
  powerpass.setTimestamp(ts)
  console.log('pk', powerpass.sm2PublicKey(pubKey))
  var nresult = powerpass.verify()
  if(nresult<0) {
    let msg = '密码中包含不规范字符或长度少于六位'
    alert(msg)
    throw msg
  }
  console.log('nresult', nresult)
  var psw = powerpass.getPinValueForHSM().replace(/\+/g, '-')
  return psw
}

const PSWTools = {
  powerConfig: powerConfig,
  PEWritePluginObject: PEWritePluginObject,
  PEWriteObject: PEWriteObject,
  getLocalObjVersion: getLocalObjVersion,
  PEWritePassObject: PEWritePassObject,
  getSM2IBSPassword: getSM2IBSPassword
}

export default PSWTools
