import QtQuick 2.15
import QtTest 1.15

import "qrc:/quperagent.js" as HTTPC
import "qrc:/config.js" as QUPERAGENT_CONFIG

import "./js/interceptors.js" as INTERCEPTORS

TestCase
{
    id: test
    name: "quperagent"
    property int timeout: 5000
    signal done()

    SignalSpy
    {
         id: async
         target: test
         signalName: "done"
     }

    function initTestCase()
    {
        QUPERAGENT_CONFIG.intercept(new INTERCEPTORS.DefaultInterceptor());
    }

    function test_simple_get()
    {
        HTTPC.request()
        .get("https://httpbin.org/get")
        .end((res) => {
                 compare(res.status, 200, "Simple get status checked");
                 done();
             });
        async.wait(timeout);
    }

    function test_global_interceptor()
    {
        compare(QUPERAGENT_CONFIG.interceptors.length, 1, "Global interceptor checked");
    }

    function test_reset_config()
    {
        QUPERAGENT_CONFIG.reset();
        compare(QUPERAGENT_CONFIG.interceptors.length, 0, "Global config reset");
    }

    function test_query_string_encode()
    {
        HTTPC.request()
        .get("https://httpbin.org/get")
        .query({
                   "d": ["a", "b", "c"],
                   "a": 1,
                   "b": "foo",
                   "c": true,
               })
        .end((res) => {
                 const params = res.body.url.split('?')[1];
                 compare(params, "d=a&d=b&d=c&a=1&b=foo&c=true&", "Query string test");
                 done();
             });
        async.wait(timeout);
    }

    function test_raw_query_string_encode()
    {
        HTTPC.request()
        .get("https://httpbin.org/get")
        .query("d=a&d=b&d=c&a=1&b=foo&c=true")
        .end((res) => {
                 const params = res.body.url.split('?')[1];
                 compare(params, "d=a&d=b&d=c&a=1&b=foo&c=true", "Raw Query string test");
                 done();
             });
        async.wait(timeout);
    }
}
