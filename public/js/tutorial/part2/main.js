// Configure a global events dispatcher
cellar.events = _.extend({}, Backbone.Events);

// Create the models
cellar.models.Wine = Backbone.Model.extend({
    url: '/wines',
    defaults: {
        id: null,
        name: '',
        grapes: '',
        country: 'USA',
        region: 'California',
        year: 0,
        description: '',
        picture: ''
    }
});

// Create the collections
cellar.collections.WineCollection = Backbone.Collection.extend({
    model: cellar.models.Wine,
    url: "/api/wines"
});

// Create the views
cellar.views.WineListItemView = Backbone.View.extend({
    tagName: 'li',
    template: $('#tpl-wine-list-item').html(),
    initialize: function() {
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.close, this);
    },
    render: function(eventName) {
        $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
        return this;
    },
    close: function() {
        // TODO Use this.$el instead?
        $(this.el).unbind();
        $(this.el).remove();
    }
});

cellar.views.WineListView = Backbone.View.extend({
    tagName: 'ul',
    initialize: function() {
        this.collection.bind('reset', this.render, this);
        this.collection.bind('add', function(wine) {
            $(this.el).append(new cellar.views.WineListItemView({ model: wine }).render().el);
        }, this);
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
    events: {
        'change input': 'change',
        'click .save': 'saveWine',
        'click .delete': 'deleteWine'
    },
    initialize: function() {
        this.model.bind('change', this.render, this);
    },
    render: function(eventName) {
        $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
        return this;
    },
    change: function(event) {
        var target = event.target;
        console.log("changing " + target.id + " from: " + target.defaultValue + " to " + target.value);
        // You could change your model on the spor, like this:
        // var change = {};
        // change[target.name] = target.value;
        // this.model.set(change);

    },
    saveWine: function() {
        // TODO Is there a way to auto-populate model from a form element?
        this.model.set({
            name: $('#name').val(),
            grapes: $('#grapes').val(),
            country: $('#country').val(),
            region: $('#region').val(),
            year: $('#year').val(),
            description: $('#description').val()
        });
        if (this.model.isNew()) {
            // TODO This looks quiet bad. Use events instead?
            cellar.app.wineList.create(this.model);
        } else {
            this.model.save();
        }
        return false;
    },
    deleteWine: function() {
        this.model.destroy({
            success: function() {
                console.log('Wine deleted successfully.');
                window.history.back();
            }
        });
    },
    close: function() {
        // TODO Use this.$el instead?
        $(this.el).unbind();
        $(this.el).empty();
    }
});

cellar.views.HeaderView = Backbone.View.extend({
    template: $('#tpl-header').html(),
    events: {
        'click .new': 'newWine'
    },
    initialize: function() {
        this.render();
    },
    render: function() {
        $(this.el).html(Mustache.render(this.template));
        return this;
    },
    newWine: function(event) {
        // TODO This function looks quiet coupled to other components
        if (cellar.app.wineView) {
            cellar.app.wineView.close();
        }
        cellar.app.wineView = new cellar.views.WineView({ model: new cellar.models.Wine() });
        $('#content').html(cellar.app.wineView.render().el);
        return false;
    }
});

// Define the Router
cellar.AppRouter = Backbone.Router.extend({
    wineList: new cellar.collections.WineCollection(),

    initialize: function(options) {
        this.wineList = new cellar.collections.WineCollection();
        this.wineList.reset(cellar.bootstrapData.wines);
        $('#header').html(new cellar.views.HeaderView().render().el);
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
        if (cellar.app.wineView) {
            cellar.app.wineView.close();
        }
        this.wineView = new cellar.views.WineView({ model: this.wine });
        $('#content').html(this.wineView.render().el);
    }
});


// Kickstart!!!
(function() {
    window.cellar.app = new cellar.AppRouter();
    Backbone.history.start();
})();
