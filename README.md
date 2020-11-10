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
you can use the `set` method for adding headers to the request like the following:
```javascript
        HTTPC.request()
        .post(`https://example.test`)
        .set({
                 "Content-type": "application/json",
                 Authorization: `Basic `
             })
        .end((res) => {}, (err) => {});
```
