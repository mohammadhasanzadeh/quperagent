.pragma library
.import "qrc:/interceptor_base.js" as INTERCEPTOR

class DefaultInterceptor extends INTERCEPTOR.InterceptorBase
{
    on_request(request)
    {
        console.log("Request to:", request.url());
//        request.set({
//                        "Content-type": "application/json",
//                        "Authorization": `Token ${this.context.token}`
//                    });
    }
}
