const IP_REQUEST = 'MY_IP_SEND_USER_IP';

const iframeElemStyles = `
  position: fixed;
  top: 0;
  right: 0;
  z-index: 5040;

  display: flex;
  justify-content: center;
  align-items: center;
  
  width: 120px;
  height: 50px;
  
  background-color: transparent;
  border: none;
  
  overflow: hidden;
`;  

const ipElemStyles = `
  position: absolute;
  top:0;
  right:0;
  padding: 5px 5px;
  background: #001f3f;
  color: #80bfff;
  cursor: pointer;
`;

const tooltipElemStyles = `
  display: none;
  position: absolute;
  top:25px;
  right: 0;

  padding: 5px 5px;
  background: #001f3f;
  color: #80bfff;
`;

const bodyStyles = `
  width: 100%;
  height: 100%
  overflow: hidden;
`;

const createTooltipElem = () => {
    const elem = document.createElement('div');
    elem.style.cssText = tooltipElemStyles;
    elem.innerHTML = 'Скопировать';       
    return elem;
}

const createIpElem = (content) => {
    const elem = document.createElement('div');
    elem.style.cssText = ipElemStyles;
    elem.innerHTML = content;   
    return elem;
}

const bindElem = (ipElem, tooltip, content) => {    

    ipElem.addEventListener('mouseenter', () => {
        tooltip.innerHTML = 'Копировать'; 
        tooltip.style.display = 'block';
    });

    ipElem.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });

    ipElem.addEventListener('click', () => {
        navigator.clipboard.writeText(content).then(() => {
            tooltip.innerHTML = 'Успешно!'
        }).catch(() => {
            tooltip.innerHTML = 'Ошибка!'
        });
    });
}

const fillIframe = (elem, content) => {    
    const doc = elem.contentDocument ? elem.contentDocument : elem.contentWindow.document;
    doc.body.style.cssText = bodyStyles;
    doc.querySelector('html').style.overflow = 'hidden';

    const ipElem = createIpElem(content);
    const tooltipElem = createTooltipElem(content);
    bindElem(ipElem, tooltipElem, content);
    doc.body.append(ipElem);
    doc.body.append(tooltipElem);
}

const addWidget = (content) => {
    const elem = document.createElement('iframe');
    elem.style.cssText = iframeElemStyles;
    elem.addEventListener('load', () => {
        fillIframe(elem, content);
    });

    document.body.append(elem);
};

chrome.runtime.sendMessage(IP_REQUEST, function (response) {    
    const { ip, errorMsg } = response;  
    const content = ip || errorMsg;
    addWidget(content);
});
  
