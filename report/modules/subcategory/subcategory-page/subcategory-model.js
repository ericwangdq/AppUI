/**
 * Created by Eric on 12/22/2014.
 */

define(['jquery','underscore', 'backbone'],

    function($, _, Backbone){

        'use strict';

        /**
         * Home Model
         * @constructor
         * @private
         */
        var SubCategoryModel = Backbone.Model.extend({

            defaults : {
                subCategoryCode: '',
                subCategoryName: '',
                totalNumber: 0,
                subCategories: []
            },

            flag: false

        });

        return SubCategoryModel;

    });