/**
 * Created by Eric on 12/22/2014.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Model
         * @constructor
         * @private
         */
        var MainCategoryModel = Backbone.Model.extend({

            defaults : {
                mainCategoryCode: '',
                mainCategoryName: '',
                categories: []
            }

        });

        return MainCategoryModel;

    });