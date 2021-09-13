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

### What about the other HTTP methods:
```javascript
        HTTPC.request()
        .post(`https://example.test`)

        HTTPC.request()
        .put(`https://example.test`)

        HTTPC.request()
        .del(`https://example.test`)
```

### Add headers to request:
You can use the `set()` method for adding headers to the request like the following, note that, quperagent will add `application/json` to the `content-type` if not any header set to the request:
```javascript
        HTTPC.request()
        .post(`https://example.test`)
        .set({
                 "Content-type": "application/json",
                 "Authorization": `Basic `
             })
        .end((res) => {}, (err) => {});
```

### Add query string to the request:
You can add a query string to the some HTTP request like `GET` and `DELETE` easily with the `query()` method:
```javascript
        HTTPC.request()
        .get(`https://example.test`)
        .query({
                   "search": "foo",
                   "sort": "bar",
                   "groupby": ["foo", "bar"]
                })
        .end((res) => {}, (err) => {});
```
Also, you may need to send a raw query string in some cases, so you can pass a simple string to the `query()`:
```javascript
        HTTPC.request()
        .get(`https://example.test`)
        .query("search=foo&sort=bar&groupby=foo&groupby=bar")
        .end((res) => {}, (err) => {});
```

### Send HTTP data on body:
You can send payload on request body by passing a javascript object to the `send()` method:
```javascript
        HTTPC.request()
        .post(`https://example.test`)
        .send({
                   "search": "foo",
                   "sort": "bar"
                })
        .end((res) => {}, (err) => {});
```
ququperagent will serialized payload based on the `content-type` header automatically:
* if `content-type` set to the `application/json` then quperagent will send body as a JSON string
* if `content-type` set to the `application/x-www-form-urlencoded` then quperagent will send body as an url encoded data
* else, quperagent will send payload as a raw data
