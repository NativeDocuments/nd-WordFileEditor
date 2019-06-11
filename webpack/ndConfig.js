const path = require('path');
const os = require('os');
const fs = require('fs');

var ndConfig={};
{ // try to read config from config
  const ND_CONFIG_USER=process.env.npm_config_nd_user;
  const configFile=path.join(os.homedir(), ".ndapi", "config"+(ND_CONFIG_USER?"."+ND_CONFIG_USER:""));
  console.log("[ND] Loading config from "+JSON.stringify(configFile)+". Use --nd-user to override the user.");
  if (fs.existsSync(configFile)) {
    const configRaw=fs.readFileSync(configFile);
    const config=JSON.parse(configRaw);
    ndConfig=Object.assign(ndConfig, config);
  }
}

function stringifyWhenNotNull(v) {
  return v?JSON.stringify(v):undefined
}


module.exports={
  "process.env.ND_SERVICE_URL": stringifyWhenNotNull(process.env.npm_config_nd_service_url || ndConfig.service_url),
  "process.env.ND_DEV_ID": stringifyWhenNotNull(process.env.npm_config_nd_dev_id || ndConfig.dev_id),
  "process.env.ND_DEV_SECRET": stringifyWhenNotNull(process.env.npm_config_nd_dev_secret || ndConfig.dev_secret),
  "process.env.ND_API_VER": stringifyWhenNotNull(process.env.npm_config_nd_api_ver || ndConfig.api_ver)
};
