# quperagent
Superagent like HTTP client for QML


## Add to project:
Add `quperagent.pri` to your `.pro` file:

`include(path/to/quperagent.pri)`

And then import `quperagent.js` into your `qml` file:

`import "qrc:/quperagent.js" as HTTPC`

## Usage:
### HTTP requests:
a simple quperagent request can be look like the following:
```javascript
        HTTPC.request()
        .get(`https://example.test`)
        .end((res) => {}, (err) => {});
```
`end()` function gets two callbacks to deliver success response or failure response and also quperagent will serialize response if possible.
Each success response and failure response objects will have the following properties:
* status => `HTTP response status`
* text => `HTTP raw response`
* body => `Serialized response, if content-type header of response equal to application/json`

### Add headers to request:
You can use the `set()` method for adding headers to the request like the following, note that, quperagent will add `application/json` to the `Content-type` if not any header set to the request:
```javascript
        HTTPC.request()
        .post(`https://example.test`)
        .set({
                 "Content-type": "application/json",
                 "Authorization": `Basic `
             })
        .end((res) => {}, (err) => {});
```

### GET
a simple HTTP GET request can be like the following example:
```javascript
        HTTPC.request()
        .get(`https://example.test`)
        .end((res) => {}, (err) => {});
```

#### Adding query string to the request:
You can add a query string to the request easily with the `query()` method:
```javascript
        HTTPC.request()
        .get(`https://example.test`)
        .query({
                   "search": "foo",
                   "sort": "bar"
                })
        .end((res) => {}, (err) => {});
```
also, you may need to send a raw query string in some cases, so you can pass a simple string to the `query()`:
```javascript
        HTTPC.request()
        .get(`https://example.test`)
        .query("list=1&list=2&list=3")
        .end((res) => {}, (err) => {});
```
