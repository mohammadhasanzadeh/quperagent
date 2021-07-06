.pragma library

.import "observable.js" as JsObservable
.import "interceptor_base.js" as INTERCEPTOR
.import "config.js" as GLOBAL

const ResponseType = {
    Default:        "",
    ArrayBuffer:    "arraybuffer",
    Blob:           "blob",
    Json:           "json",
    Text:           "text"
}
Object.freeze(ResponseType);

class Request
{
    constructor()
    {
        this.m_headers = {};
        this.m_timeout = 5000;
        this.m_response_type = ResponseType.Default;
        this.m_observables = new JsObservable.Observable();
    }

    _is_string(data)
    {
        return typeof(data) === "string" || data instanceof String;
    }

    _case_insensetive_in(key, object)
    {
       const keys = Object.keys(object).map((key) => {
                                                return key.toLowerCase();
                                            });
        return keys.indexOf(key);
    }

    _url_encode_params(params)
    {
        let query = "";

        if (!params)
            return query;

        for (let key of Object.keys(params))
        {
            query += `${key}=${params[key]}&`;
        }
        return query;
    }

    _evaluate_query()
    {
        if (this._is_string(this.m_query))
            return this.m_query;
        return this._url_encode_params(this.m_query);
    }

    _evaluate_params(xhr)
    {

        if (this._case_insensetive_in("content-type", this.m_headers) === -1)
        {
            this.m_headers["content-type"] =  "application/json";
            xhr.setRequestHeader("content-type", "application/json");
        }

        if (this._is_string(this.m_params))
            return this.m_params;

        if (this.m_headers["content-type"] === "application/json")
        {
            return JSON.stringify(this.m_params);
        }

        if (this.m_headers["content-type"] === "application/x-www-form-urlencoded")
            return this._url_encode_params(this.m_params);

        return m_params;
    }

   _generate_headers(xhr)
    {
        if (!xhr instanceof XMLHttpRequest)
            return;

        if (Object.keys(this.m_headers).length === 0)
        {
            this.m_headers = {"content-type": "application/json"};
        }

        for (let key of Object.keys(this.m_headers))
        {
            xhr.setRequestHeader(key, this.m_headers[key]);
        }
    }

    _parse_response_header(headers)
    {
        const headers_list = headers.trim().split(/[\r\n]+/);
        const header_map = {};
        // Create a map of header names to values
        for (let item of headers_list)
        {
            const parts = item.split(': ');
            const header = parts.shift();
            const value = parts.join(': ');
            header_map[header] = value;
        }
        return header_map;
    }

    post(url=null)
    {
        this.m_method = "POST";
        if (url)
            this.setUrl(url);
        return this;
    }

    get(url=null)
    {
        this.m_method = "GET";
        if (url)
            this.setUrl(url);
        return this;
    }

    put(url=null)
    {
        this.m_method = "PUT";
        if (url)
            this.setUrl(url);
        return this;
    }

    del(url=null)
    {
        this.m_method = "DELETE";
        if (url)
            this.setUrl(url);
        return this;
    }

    setUrl(url)
    {
        this.m_url = url;
        return this;
    }

    url()
    {
        return this.m_url;
    }

    set(headers)
    {
        for (let key in headers)
        {
            this.m_headers[key.toLowerCase()] = headers[key];
        }
        return this;
    }

    query(query_string)
    {
        this.m_query = query_string;
        return this;
    }

    send(params)
    {
        this.m_params = params;
        return this;
    }

    timeout(time)
    {
        this.m_timeout = time;
        return this;
    }

    responseType(response_type)
    {
        this.m_response_type = response_type;
        return this;
    }

    intercept(interceptors)
    {
        if (Array.isArray(interceptors))
        {
            for (let item of interceptors)
            {
                if (!item instanceof INTERCEPTOR.InterceptorBase)
                {
                    throw "Invalid interceptor";
                }
                this.m_observables.subscribe(item);
            }
            return this;
        }

        if (!interceptors instanceof INTERCEPTOR.InterceptorBase)
        {
            throw "Invalid interceptor";
        }
        this.m_observables.subscribe(interceptors);
        return this;
    }

    end(success, failure=null)
    {
        this.m_observables.notify("on_request", [this]);
        const xhr = new XMLHttpRequest();
        const url = (["GET", "DELETE"].indexOf(this.m_method) > -1) ? `${this.m_url}?${this._evaluate_query()}` : this.m_url;
        xhr.responseType = this.m_response_type;
        xhr.open(this.m_method, url, true);
        xhr.timeout = this.m_timeout;
        this._generate_headers(xhr);
        // FIXME: is there better solution?
        const self = this;
        xhr.onload = () => {
            const response = {
                "status": xhr.status,
                "text": xhr.responseText,
                "body": null,
                "headers": this._parse_response_header(xhr.getAllResponseHeaders())
            };

            const response_header = xhr.getResponseHeader("content-type");

            response.body = xhr.response;
            if (xhr.responseType === ResponseType.Default)
            {
                if (response_header === "application/json")
                    response.body = JSON.parse(xhr.response);
            }

            if (xhr.status >= 200 && xhr.status < 300)
            {
                self.m_observables.notify("on_success", [self, response]);
                success(response);
                self.m_observables.notify("on_end_successed", [self, response]);
            }
            else
            {
                self.m_observables.notify("on_failure", [self, response]);
                if (failure)
                    failure(response);
                self.m_observables.notify("on_end_failed", [self, response]);
            }
        }

        xhr.onerror = () => {
            let error = {
                "status": xhr.status,
                "text": xhr.responseText,
                "body": null,
                "headers": this._parse_response_header(xhr.getAllResponseHeaders())
            }
            self.m_observables.notify("on_failure", [self, error]);
            if (failure)
                failure(error);
            self.m_observables.notify("on_end_failed", [self, error]);
        };

        if (["POST", "PUT"].indexOf(this.m_method) > -1)
            xhr.send(this._evaluate_params(xhr));
        else
            xhr.send(null);
    }
}

function request(global_config={
                    interceptor: true,
                 })
{
    const i_request = new Request();
    if (global_config.interceptor)
        i_request.intercept(GLOBAL.interceptors);
    return i_request;
}
