export const getDomainName = (hostName:string) => {
    if (hostName.toLowerCase() === 'localhost') return hostName;
  
    const hostNameArray = hostName.split('.');
  
    return hostNameArray[hostNameArray.length - 2];
  };
  