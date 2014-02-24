//  Created by Yonathan Teitelbaum
//  Copyright (c) 2014 The Readium Foundation.
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

/**
 *
 * Interface for instanciating objects. Its main purpose is to decouple the 
 *
 * @class ReadiumSDK.Factory
 *
 * */
ReadiumSDK.Factory = function(options) {

    var self = this;
    
    /**
     * Determine which desired type should be created
     * 
     * @param {ReadiumSDK.Models.ViewerSettings} viewerSettings
     * @param {ReadiumSDK.Models.SpineItem} spineItem
     * @return {Class} the view type to instanciate
     */
    this.createDesiredViewType = function(viewerSettings, spineItem) {
	    var desiredViewType;
        if(viewerSettings.isScrollViewDoc || viewerSettings.isScrollViewContinuous) {
            desiredViewType = self.scrollViewType();
        }
        else if(spineItem.isFixedLayout()) {
            desiredViewType = self.fixedViewType();
        }
        //we don't support scroll continues yet we will create scroll doc instead
        else if(spineItem.isScrolledDoc() || spineItem.isScrolledContinuous()) {
            desiredViewType = self.scrollViewType();
        }
        else {
            desiredViewType = self.reflowableViewType();
        }
        return desiredViewType;
    };
    
    /**
     * Return the scroll view type
     */
    this.scrollViewType = function() {
    	return ReadiumSDK.Views.ScrollView;
    };
    
    /**
     * Return the fixed view type
     */
    this.fixedViewType = function() {
    	return ReadiumSDK.Views.FixedView;
    };
    
    /**
     * Return the reflowable view type
     */
    this.reflowableViewType = function() {
    	return ReadiumSDK.Views.ReflowableView;
    };
    
    /**
     * Create a viewer settings object
     * 
     * @return {ReadiumSDK.Models.ViewerSettings}
     */
    this.createViewerSettings = function() {
    	return new ReadiumSDK.Models.ViewerSettings({});
    }
    
    /**
     * Create a style collection object
     * 
     * @return {ReadiumSDK.Collections.StyleCollection}
     */
    this.createStyleCollection = function() {
    	return new ReadiumSDK.Collections.StyleCollection();
    };
    
    /**
     * Create an internal link support object
     * 
     * @param readerView
     * @return {ReadiumSDK.Views.InternalLinksSupport}
     */
    this.createInternalLinksSupport = function(readerView) {
    	return new ReadiumSDK.Views.InternalLinksSupport(readerView);
    };
    
    /**
     * Create an annotations manager object
     * 
     * @param readerView
     * @param options
     * @return {ReadiumSDK.Views.AnnotationsManager}
     */
    this.createAnnotationsManager = function(readerView, options) {
    	return new ReadiumSDK.Views.AnnotationsManager(self, options);
    };
    
    /**
     * Create an iframe loader object
     * 
     * @param options
     * @return {ReadiumSDK.Views.IFrameLoader}
     */
    this.createIFrameLoader = function(options) {
		if(options.iframeLoader) {
		    return options.iframeLoader;
		} else {
		    return new ReadiumSDK.Views.IFrameLoader();
		}
    };
    
    /**
     * Create an instance of CFI navigation logic
     * 
     * @param contentFrame
     * @param iframe
     * @return {ReadiumSDK.Views.CfiNavigationLogic}
     */
    this.createCfiNavigationLogic = function(contentFrame, iframe) {
	    return new ReadiumSDK.Views.CfiNavigationLogic(contentFrame, iframe);
	};

    /**
     * Create an instance of current pages info
     * 
     * @param {ReadiumSDK.Models.Spine} spine
     * @param {boolean} isFixedLayout
     * @return {ReadiumSDK.Models.CurrentPagesInfo}
     */
    this.createCurrentPagesInfo = function(spine, isFixedLayout) {
        return new ReadiumSDK.Models.CurrentPagesInfo(spine.items.length, isFixedLayout, spine.direction);
    };

    /**
     * Create an instance of bookmark data
     * 
     * @param {string} idref
     * @param {string} cfi
     * @return {ReadiumSDK.Models.BookmarkData}
     */
    this.createBookmarkData = function(idref, cfi) {
        return new ReadiumSDK.Models.BookmarkData(idref, cfi);
    };
}
