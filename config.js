.pragma library

.import "interceptor_base.js" as INTERCEPTOR

let interceptors = [];

function intercept(incomming_interceptors)
{
    if (Array.isArray(incomming_interceptors))
    {
        for (let item of incomming_interceptors)
        {
            if (!item instanceof INTERCEPTOR.InterceptorBase)
            {
                throw "Invalid interceptor";
            }
            interceptors.push(item);
        }
    }

    if (!incomming_interceptors instanceof INTERCEPTOR.InterceptorBase)
    {
        throw "Invalid interceptor";
    }
    interceptors.push(incomming_interceptors);
}

function reset(config={"interceptor": true})
{
    if (config.interceptor)
        interceptors = [];
}
