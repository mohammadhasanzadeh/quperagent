.pragma library

class Request
{
    constructor()
    {
        this.m_timeout = 5000;
    }

    _url_encode_params(params)
    {
        let query = "";
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

        if (!("Content-Type" in this.m_headers))
        {
            this.m_headers["Content-Type"] =  "application/json";
            xhr.setRequestHeader("Content-Type", "application/json");

        }

        if (this.m_params instanceof String)
            return this.m_params;

        if (this.m_headers["Content-Type"] === "application/json")
        {
            return JSON.stringify(this.m_params);
        }

        if (this.m_headers["Content-Type"] === "application/x-www-form-urlencoded")
            return this._url_encode_params(this.m_params);

        return m_params;
    }

   _generate_headers(xhr)
    {
        if (!xhr instanceof XMLHttpRequest)
            return;

        if (!this.m_headers)
            this.m_headers = {"Content-Type": "application/json"};

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

    set(headers)
    {
        this.m_headers = headers;
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
        const url = (["GET"].indexOf(this.m_method) > -1) ? `${this.m_url}?${this._evaluate_query()}` : this.m_url;
        xhr.open(this.m_method, url, true);
        xhr.timeout = this.m_timeout;
        this._generate_headers(xhr);

        xhr.onload = () =>
        {
            let response = {}
            response.status = xhr.status;
            response.text = xhr.responseText;
            response.body = null;
            if (xhr.status >= 200 && xhr.status < 300)
            {
                const response_header = xhr.getResponseHeader("Content-Type");
                if (response_header === "application/json")
                {
                    response.body = JSON.parse(xhr.responseText);
                }
                success(response);
            }
            else
            {
                if (failure)
                    failure(response);
            }
        };

        if (["POST"].indexOf(this.m_method) > -1)
        {
            xhr.send(this._evaluate_params(xhr));
        }
        else
        {
            xhr.send(null);
        }
    }
}

function request()
{
    return new Request();
}
