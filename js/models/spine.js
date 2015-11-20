//  Created by Boris Schneiderman.
//  Copyright (c) 2014 Readium Foundation and/or its licensees. All rights reserved.
//  
//  Redistribution and use in source and binary forms, with or without modification, 
//  are permitted provided that the following conditions are met:
//  1. Redistributions of source code must retain the above copyright notice, this 
//  list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright notice, 
//  this list of conditions and the following disclaimer in the documentation and/or 
//  other materials provided with the distribution.
//  3. Neither the name of the organization nor the names of its contributors may be 
//  used to endorse or promote products derived from this software without specific 
//  prior written permission.
//  
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
//  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
//  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
//  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
//  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
//  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
//  OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
//  OF THE POSSIBILITY OF SUCH DAMAGE.

define(["./spine_item", "../helpers", "URIjs"], function(SpineItem, Helpers, URI) {
/**
 *  Wrapper of the spine object received from hosting application
 *
 *  @class  Models.Spine
 */

var Spine = function(epubPackage, spineDTO) {

    var self = this;

    /*
     * Collection of spine items
     * @property items
     * @type {Array}
     */
    this.items = [];

    /*
     * Page progression direction ltr|rtl|default
     * @property direction
     * @type {string}
     */
    this.direction = "ltr";

    /*
     * @property package
     * @type {Models.Package}
     *
     */
    this.package = epubPackage;

    var _handleLinear = false;

    this.handleLinear = function(handleLinear) {
        _handleLinear = handleLinear;
    };

    function isValidLinearItem(item) {
        return !_handleLinear || item.linear !== "no";
    }


    this.isValidLinearItem = function(index) {
        
        if(!isValidIndex(index)) {
            return undefined;
        }

        return isValidLinearItem(this.item(index));
    };

    this.prevItem = function(item) {

        return lookForPrevValidItem(item.index - 1);
    };

    function lookForNextValidItem(ix) {

        if(!isValidIndex(ix)) {
            return undefined;
        }

        var item = self.items[ix];

        if(isValidLinearItem(item)) {
            return item;
        }

        return lookForNextValidItem(item.index + 1);
    }

    function lookForPrevValidItem(ix) {

        if(!isValidIndex(ix)) {
            return undefined;
        }

        var item = self.items[ix];

        if(isValidLinearItem(item)) {
            return item;
        }

        return lookForPrevValidItem(item.index - 1);
    }

    this.nextItem = function(item){

        return lookForNextValidItem(item.index + 1);
    };

    this.getItemUrl = function(item) {

        return self.package.resolveRelativeUrl(item.href);

    };

    function isValidIndex(index) {

        return index >= 0 && index < self.items.length;
    }

    this.first = function() {

        return lookForNextValidItem(0);
    };

    this.last = function() {

        return lookForPrevValidItem(this.items.length - 1);
    };

    this.isFirstItem = function(item) {

        return self.first() === item;
    };

    this.isLastItem = function(item) {

        return self.last() === item;
    };

    this.item = function(index) {
        
        if (isValidIndex(index))
            return self.items[index];
            
        return undefined;
    };

    this.isRightToLeft = function() {

        return self.direction == "rtl";
    };

    this.isLeftToRight = function() {

        return !self.isRightToLeft();
    };

    this.getItemById = function(idref) {

        var length = self.items.length;

        for(var i = 0; i < length; i++) {
            if(self.items[i].idref == idref) {

                return self.items[i];
            }
        }

        return undefined;
    };

    this.getItemByHref = function(href) {

        // var href1 = Helpers.ResolveContentRef(self.items[i].href, self.package.rootUrl + "/pack.opf");
        // var href1 = self.package.resolveRelativeUrl(href);
        //var href1 = new URI(href).absoluteTo(self.package.rootUrl).pathname();
        //var href1 = new URI(self.package.resolveRelativeUrl(href)).relativeTo(self.package.rootUrl).pathname();
        
        var href1 = new URI(self.package.resolveRelativeUrl(href)).normalizePathname().pathname();
        
        var length = self.items.length;

        for(var i = 0; i < length; i++) {
            
            var href2 = new URI(self.package.resolveRelativeUrl(self.items[i].href)).normalizePathname().pathname();
            
            //if(self.items[i].href == href) {
            if(href1 == href2) {
                return self.items[i];
            }
        }

        return undefined;
    };

    function updateSpineItemsSpread() {

        var len = self.items.length;

        var isFirstPageInSpread = false;
        var baseSide = self.isLeftToRight() ? SpineItem.SPREAD_LEFT : SpineItem.SPREAD_RIGHT;

        for(var i = 0; i < len; i++) {

            var spineItem = self.items[i];
            if( !spineItem.page_spread) {

                var spread = spineItem.isRenditionSpreadAllowed() ? (isFirstPageInSpread ? baseSide : SpineItem.alternateSpread(baseSide)) : SpineItem.SPREAD_CENTER;
                spineItem.setSpread(spread);
            }

            isFirstPageInSpread = !spineItem.isRenditionSpreadAllowed() || spineItem.page_spread != baseSide;
        }
    }

    if(spineDTO) {

        if(spineDTO.direction) {
            this.direction = spineDTO.direction;
        }

        var length = spineDTO.items.length;
        for(var i = 0; i < length; i++) {
            var item = new SpineItem(spineDTO.items[i], i, this);
            this.items.push(item);
        }

        updateSpineItemsSpread();
    }

};
    return Spine;
});
