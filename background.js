
const ipRequestAddress = 'https://api.myip.com/';
const IP_REQUEST = 'MY_IP_SEND_USER_IP';
let userIp = null;
let errorMsg = '';


const checkStatus = response => {
    const responseStatus = +response.status;
    if (responseStatus >= 200 && responseStatus < 300) return response;    
    return null;
};
  

const getDataFromAPI = async address => {
    try {
      let response = await window.fetch(address);     
      response = checkStatus(response);
      if (response) {        
        response = await response.json();
        return response;
      }      
      return null;
    } catch (error) { 
      return null;
    }
};
  
const init = async () => {
  const data = await getDataFromAPI(ipRequestAddress);
  if (data) {
    userIp = data.ip
  } else {
    errorMsg = 'Ошибка!';
  };
}

chrome.runtime.onInstalled.addListener(() => {    
    init();
});

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {   
    if (request == IP_REQUEST) {
      if (userIp) {        
        sendResponse({ ip: userIp, errorMsg: errorMsg })
      } else {
        init().finally(() => sendResponse({ ip: userIp, errorMsg: errorMsg }));               
      }
    };
    return true;
  });
