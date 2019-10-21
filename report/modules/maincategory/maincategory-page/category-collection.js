/**
 * Created by Eric on 1/14/2015.
 */

define(['jquery','underscore', 'backbone',
        'maincategory/maincategory-page/category-model'],

    function($, _, Backbone, CategoryModel){

        'use strict';

        /**
         * Collection
         * @constructor
         * @private
         */
        var CategoryCollection = Backbone.Collection.extend({

            model: CategoryModel,

            initialize: function(){

                var me = this;

            }

        });

        return CategoryCollection;

    });