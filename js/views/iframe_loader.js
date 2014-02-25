//  LauncherOSX
//
//  Created by Boris Schneiderman.
// Modified by Daniel Weck
//  Copyright (c) 2012-2013 The Readium Foundation.
//
//  The Readium SDK is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

ReadiumSDK.Views.IFrameLoader = function() {

    this.loadIframe = function(iframe, src, callback, context) {

        //iframe.setAttribute("sandbox", "allow-scripts allow-same-origin");

        var isWaitingForFrameLoad = true;

        iframe.onload = function() {

            try
            {
                iframe.contentWindow.navigator.epubReadingSystem = navigator.epubReadingSystem;
                console.debug("epubReadingSystem name:"
                    + iframe.contentWindow.navigator.epubReadingSystem.name
                    + " version:"
                    + iframe.contentWindow.navigator.epubReadingSystem.version
                    + " is loaded to iframe");
            }
            catch(ex)
            {
                console.log("epubReadingSystem INJECTION ERROR! " + ex.message);
            }

            isWaitingForFrameLoad = false;
            callback.call(context, true);

        };

        //yucks! iframe doesn't trigger onerror event - there is no reliable way to know that iframe finished
        // attempt tot load resource (successfully or not;
        window.setTimeout(function(){

            if(isWaitingForFrameLoad) {
                isWaitingForFrameLoad = false;
                callback.call(context, false);
            }

        }, 500);

        injectScripts(src, function(dom){

            if(!dom) {

                if(isWaitingForFrameLoad) {
                    isWaitingForFrameLoad = false;
                    callback.call(context, false);
                }
            }

            iframe.srcdoc = dom.documentElement.innerHTML;

        });
    };

    function getFileText(path, callback) {

        $.ajax({
            url: path,
            dataType: 'xml',
            async: true,
            success: function (result) {
                callback(result);
            },
            error: function (xhr, status, errorThrown) {
                console.error('Error when AJAX fetching ' + path);
                console.error(status);
                console.error(errorThrown);
                callback();
            }
        });
    }

    function injectScripts(src, callback) {

        getFileText(src, function(contentFileData){

            if(!contentFileData) {
                callback();
                return;
            }

            var $head = $('head', contentFileData);
            var $base = $('base', $head);

            if($base.length === 0) {

                $base = $("<base href=\"" + src + "\">");
                $head.prepend($base);
            }

            var securityScript = "<script>(" + disableParent.toString() + ")()<\/script>";
            $('body', contentFileData).prepend(securityScript);

//            var readingSystemScript = createSetReadingSystemObjectString(navigator.epubReadingSystem);
//            $('body', contentFileData).append("<script>(" + readingSystemScript + ")()<\/script>");

            callback(contentFileData);
        });
    }

    function disableParent() {
        window.parent = undefined;
    }

//    function createSetReadingSystemObjectString(rs) {
//
//        var res = "function setReadingSystem(){ navigator.epubReadingSystem = { ";
//
//        var props = [];
//
//        for (var property in rs) {
//            if (rs.hasOwnProperty(property)) {
//
//                if(typeof rs[property] === 'function') {
//                    props.push(property + ":" + rs[property].toString());
//                }
//                else if (typeof rs[property] === 'string') {
//                    props.push(property + ":\"" + rs[property] + "\"");
//                }
//                else {
//                    props.push(property + ":" + rs[property]);
//                }
//
//            }
//        }
//
//        return res + props.join(",") + "}; }"
//
//    }

};
