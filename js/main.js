(function () {
    // A object holding the module
    var skoProfile = {};
    window.skoProfile = skoProfile;
    skoProfile.curies = [];

    // The view model.
    skoProfile.viewModel = {
        currentPersonObs: ko.observable('https://my-profile.eu/people/deiu/card#me'),
        showImage: function() {
            var current = sko.current();
            var img1 = current.getProp("[foaf:depiction]");
            var img2 = current.getProp("[foaf:img]");
            if (img1) return img1
            else if (img2) return img2
            else return "images/avatar.png";
        },
        showNewMessageNumber: function() {return 0},
        showRecentInteractionNumber: function() {return 0},
        showUpdateNumber: function() {return 0},
        showLastInteractionsDate: function() {return "1/1/2014"},
        showLastMessage: function() {return "empty !"},
        userContacts: ko.observable([])
    };

    skoProfile.loadUri = function(uri, cb) {
        sko.store.load('remote', uri, function (success, loadedCount) {
            if(success) {
                //updateTripleCount(loadedCount);
                cb(true, loadedCount);
            } else {
                cb(false, null);
            }
        });
    };

    // Initial steps.
    $(document).ready(function () {
        // Define sko.
        sko.ready(function () {
            console.log('sko loaded !!!')

            // Register new prefixes.
            sko.registerPrefix("contact", "http://www.w3.org/2000/10/swap/pim/contact#");

            // For debug.
            sko.activeDebug = false;

            // Bootstrap WebID.
            //var bootUri = 'https://my-profile.eu/people/deiu/card#me';
            var bootUri = 'http://bblfish.net/people/henry/card#me';

            // Load graph in store.
            sko.store.load('remote', bootUri, function (success, result) {
                console.log("Graph loaded !!!")

                // Select all contacts.
                sko.store.execute("SELECT ?person { ?a foaf:knows ?person }", function (success, results) {
                    var curie;
                    for (var i = 0; i < results.length; i++) {
                        curie = sko.rdf.prefixes.shrink(results[i].person.value)
                        skoProfile.curies.push(curie);
                    }

                    skoProfile.viewModel.userContacts = ko.observableArray(skoProfile.curies)

                    sko.applyBindings('#contactsContainer', skoProfile.viewModel, function () {
                    });

                });
            });
        });
    });
})();
