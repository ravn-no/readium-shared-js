
require(["readium_shared_js/globalsSetup"], function () {

    require(['readium_shared_js/views/reader_view'], function (ReaderView) {

        ReadiumSDK.on(ReadiumSDK.Events.PLUGINS_LOADED, function(reader) {

            // readium built-in (should have been require()'d outside this scope)
            console.log(reader.plugins.annotations);

            // external (require()'d via Dependency Injection, see examplePluginConfig function parameter passed above)
            console.log(reader.plugins.example);
        });

        $(document).ready(function () {


            ReadiumSDK.reader = new ReaderView(
            {
                needsFixedLayoutScalerWorkAround: false,
                el:"#viewport",
                annotationCSSUrl: undefined
            });

            //Globals.emit(Globals.Events.READER_INITIALIZED, ReadiumSDK.reader);
            ReadiumSDK.emit(ReadiumSDK.Events.READER_INITIALIZED, ReadiumSDK.reader);
        });
    });
});
