var OSS = require('ali-oss')
export function client() {
  const client = new OSS({
    region : 'oss-cn-beijing',
	  accessKeyId : 'LTAIfF5turmCk2DD',
	  accessKeySecret : 'RPWbDvNBv9L5AUfF1I1fqNgqFO3CNq',
	  bucket : 'app-jx'
  })
  return client
}
