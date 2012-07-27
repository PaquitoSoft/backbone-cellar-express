// Models
/*
window.Wine = Backbone.Model.extend();

window.WineCollection = Backbone.Collection.extend({
    model:Wine,
    url:"http://localhost:3003/api/wines"
});


// Views
window.WineListView = Backbone.View.extend({

    tagName:'ul',

    initialize:function () {
        this.model.bind("reset", this.render, this);
    },

    render:function (eventName) {
        _.each(this.model.models, function (wine) {
            $(this.el).append(new WineListItemView({model:wine}).render().el);
        }, this);
        return this;
    }

});

window.WineListItemView = Backbone.View.extend({

    tagName:"li",

    template:_.template($('#tpl-wine-list-item').html()),

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});

window.WineView = Backbone.View.extend({

    template:_.template($('#tpl-wine-details').html()),

    render:function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }

});


// Router
var AppRouter = Backbone.Router.extend({

    routes:{
        "":"list",
        "wines/:id":"wineDetails"
    },

    list:function () {
        this.wineList = new WineCollection();
        this.wineListView = new WineListView({model:this.wineList});
        this.wineList.fetch();
        $('#sidebar').html(this.wineListView.render().el);
    },

    wineDetails:function (id) {
        this.wine = this.wineList.get(id);
        this.wineView = new WineView({model:this.wine});
        $('#content').html(this.wineView.render().el);
    }
});

var app = new AppRouter();
Backbone.history.start();
*/


// Configure a global events dispatcher
cellar.events = _.extend({}, Backbone.Events);

// Create the models
cellar.models.Wine = Backbone.Model.extend();

// Create the collections
cellar.collections.WineCollection = Backbone.Collection.extend({
    model: cellar.models.Wine,
    url: "http://localhost:3003/api/wines"
});

// Create the views
cellar.views.WineListItemView = Backbone.View.extend({
    tagName: 'li',
    template: $('#tpl-wine-list-item').html(),
    render: function(eventName) {
        $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
        return this;
    }
});

cellar.views.WineListView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function() {
        this.collection.bind('reset', this.render, this);
    },
    render: function(eventName) {
        _.each(this.collection.models, function(wine) {
            $(this.el).append(new cellar.views.WineListItemView({
                model: wine
            }).render().el);
        }, this);
        return this;
    }
});

cellar.views.WineView = Backbone.View.extend({
    template: $('#tpl-wine-details').html(),
    render: function(eventName) {
        $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
        return this;
    }
});

// Define the Router
cellar.AppRouter = Backbone.Router.extend({
    wineList: new cellar.collections.WineCollection(),

    initialize: function(options) {
        this.wineList = new cellar.collections.WineCollection();
        this.wineList.reset(cellar.bootstrapData.wines);
    },

    routes: {
        '': 'list',
        'wines/:id': 'wineDetails' // Sidebar links are target to this pattern (ex: '#wines/2'). When the URL is updated, the router catch that event and matches the route
    },
    list: function() {
        this.wineListView = new cellar.views.WineListView({ collection: this.wineList });
        $('#sidebar').html(this.wineListView.render().el);
    },
    wineDetails: function(id) {
        if (!this.wineListView) {
            this.list();
        }
        this.wine = this.wineList.get(id);
        this.wineView = new cellar.views.WineView({ model: this.wine });
        $('#content').html(this.wineView.render().el);
    }
});


// Kickstart!!!
(function() {
    window.cellar.app = new cellar.AppRouter();
    Backbone.history.start();
})();
