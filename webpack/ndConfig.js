const path = require('path');
const os = require('os');
const fs = require('fs');
const dotenv = require('dotenv');

var ndConfig={};
{ // try read config from ".env"
  const configFile=".env";
  if (fs.existsSync(configFile)) {
    console.log("[ND] Loading config from "+JSON.stringify(configFile));
    const config=dotenv.parse(fs.readFileSync(configFile));
    ndConfig=Object.assign(ndConfig, {
      "service_url": config.ND_SERVICE_URL,
      "dev_id": config.ND_DEV_ID,
      "dev_secret": config.ND_DEV_SECRET,
      "api_ver": config.ND_API_VER || config.ND_DEPLOY_TAG
    });
  }
}
{ // try to read config from config
  const ND_CONFIG_USER=process.env.npm_config_nd_user;
  if (ND_CONFIG_USER && ND_CONFIG_USER.startsWith("{")) {
    try {
      const USER=JSON.parse(ND_CONFIG_USER);
      console.log("ND_CONFIG_USER="+JSON.stringify(USER));
      Object.assign(ndConfig, USER);
    } catch(e) {
      console.error(e);
    }
  } else {
    const configFile=path.join(os.homedir(), ".ndapi", "config"+(ND_CONFIG_USER?"."+ND_CONFIG_USER:""));
    if (fs.existsSync(configFile)) {
      console.log("[ND] Loading config from "+JSON.stringify(configFile)+". Use --nd-user to override the user.");
      const configRaw=fs.readFileSync(configFile);
      const config=JSON.parse(configRaw);
      ndConfig=Object.assign(ndConfig, config);
    } else {
      console.log("[ND] Config file "+JSON.stringify(configFile)+" does not exist. Use --nd-user to override the user.");
    }
  }
}

function stringifyWhenNotNull(v) {
  return v?JSON.stringify(v):undefined
}


module.exports={
  "process.env.ND_SERVICE_URL": stringifyWhenNotNull(process.env.npm_config_nd_service_url || ndConfig.service_url),
  "process.env.ND_DEV_ID": stringifyWhenNotNull(process.env.npm_config_nd_dev_id || ndConfig.dev_id),
  "process.env.ND_DEV_SECRET": stringifyWhenNotNull(process.env.npm_config_nd_dev_secret || ndConfig.dev_secret),
  "process.env.ND_TENANT_ID": stringifyWhenNotNull(process.env.npm_config_nd_tenant_id || ndConfig.tenant_id),
  "process.env.ND_API_VER": stringifyWhenNotNull(process.env.npm_config_nd_api_ver || ndConfig.api_ver)
};
