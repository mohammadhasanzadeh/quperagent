.pragma library

class Request
{
    constructor()
    {
        this.m_timeout = 5000;
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
        if (this.m_query instanceof String)
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

        if (this.m_params instanceof String)
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

        if (!this.m_headers)
        {
            this.m_headers = {"content-type": "application/json"};
        }

        for (let key of Object.keys(this.m_headers))
        {
            xhr.setRequestHeader(key, this.m_headers[key]);
        }
    }

    post(url)
    {
        this.m_method = "POST";
        this.m_url = url;
        return this;
    }

    get(url)
    {
        this.m_method = "GET";
        this.m_url = url;
        return this;
    }

    put(url)
    {
        this.m_method = "PUT";
        this.m_url = url;
        return this;
    }

    del(url)
    {
        this.m_method = "DELETE";
        this.m_url = url;
        return this;
    }

    set(headers)
    {
        this.m_headers = {};
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

    end(success, failure=null)
    {
        const xhr = new XMLHttpRequest();
        const url = (["GET", "DELETE"].indexOf(this.m_method) > -1) ? `${this.m_url}?${this._evaluate_query()}` : this.m_url;
        xhr.open(this.m_method, url, true);
        xhr.timeout = this.m_timeout;
        this._generate_headers(xhr);

        xhr.onload = () => {
            const response = {
                "status": xhr.status,
                "text": xhr.responseText,
                "body": null
            };

            const response_header = xhr.getResponseHeader("content-type");
            if (response_header === "application/json")
                response.body = JSON.parse(xhr.responseText);

            if (xhr.status >= 200 && xhr.status < 300)
            {
                success(response);
            }
            else
            {
                if (failure)
                    failure(response);
            }
        };

        xhr.onerror = () => {
            if (failure)
            {
                failure({
                            "status": xhr.status,
                            "text": xhr.responseText,
                            "body": null
                        });
            }
        };

        if (["POST", "PUT"].indexOf(this.m_method) > -1)
            xhr.send(this._evaluate_params(xhr));
        else
            xhr.send(null);
    }
}

function request()
{
    return new Request();
}
