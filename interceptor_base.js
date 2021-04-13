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

    on_post_success(request, response) {}

    on_post_failure(request, response) {}
}
