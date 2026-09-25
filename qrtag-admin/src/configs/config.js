import rawConfig from './config.json'

const Config = {
  NODE_ENV: process.env.REACT_APP_NODE_ENV || rawConfig.NODE_ENV || 'development',
  BASE_URL: process.env.REACT_APP_BASE_URL || rawConfig.BASE_URL || '',
  BASE_URL1: process.env.REACT_APP_BASE_URL1 || rawConfig.BASE_URL1 || '',
  SITE_URL: process.env.REACT_APP_SITE_URL || rawConfig.SITE_URL || '',
  SITE_URL1: process.env.REACT_APP_SITE_URL1 || rawConfig.SITE_URL1 || '',
  STORE_URL: process.env.REACT_APP_STORE_URL || rawConfig.STORE_URL || '',
  STORE_URL1: process.env.REACT_APP_STORE_URL1 || rawConfig.STORE_URL1 || '',
  MEDIA_URL: process.env.REACT_APP_MEDIA_URL || rawConfig.MEDIA_URL || ''
}

export default Config
