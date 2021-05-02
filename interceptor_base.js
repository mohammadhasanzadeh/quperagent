.pragma library

class InterceptorBase
{
    constructor(context = {})
    {
        this.context = context;
    }

    on_request(request) {}

    on_success(request, response) {}

    on_failure(request, response) {}

    on_end_successed(request, response) {}

    on_end_failed(request, response) {}
}
