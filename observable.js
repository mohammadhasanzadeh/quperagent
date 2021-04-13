.pragma library

class Observable
{
    constructor()
    {
        this.subscribers = [];
    }

    subscribe(item)
    {
        this.subscribers.push(item);
    }

    unsubscribe(item)
    {
        const index = this.subscribers.indexOf(item);
        if (index !== -1) 
        {
            this.subscribers = this.subscribers.slice(index, 1);
        }
    }

    notify(event, args)
    {
        for (let subscriber of this.subscribers)
        {
            if (subscriber[event])
                subscriber[event].apply(subscriber, args);
        }
    }
}
