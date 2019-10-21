/**
 * Created by Eric on 1/13/2015.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Model
         * @constructor
         * @private
         */
        var AgingCategoryModel = Backbone.Model.extend({

            defaults : {
                categoryName: '',
                categoryCode: '',
                ranges: []
            }

        });

        return AgingCategoryModel;

    });